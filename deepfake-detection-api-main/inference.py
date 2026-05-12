"""
Video Processing and Inference Logic
Exactly matches the Colab inference script
"""
import torch
import torch.nn.functional as F
import cv2
import numpy as np
from PIL import Image
import face_recognition
from model import DeepFakeDetector


class VideoProcessor:
    """Handles video frame extraction and preprocessing"""

    def __init__(self, im_size=112, mean=[0.485, 0.456, 0.406],
                 std=[0.229, 0.224, 0.225]):
        self.im_size = im_size
        self.mean = np.array(mean)
        self.std = np.array(std)

    def preprocess_frame(self, frame):
        """
        Preprocess a single frame for model input
        """
        # Convert to PIL Image if numpy array
        if isinstance(frame, np.ndarray):
            frame = Image.fromarray(frame)

        # Resize to model input size
        frame = frame.resize((self.im_size, self.im_size))

        # Convert to tensor with normalization
        frame = np.array(frame).astype(np.float32) / 255.0
        frame = (frame - self.mean) / self.std
        frame = frame.transpose(2, 0, 1)  # HWC -> CHW
        frame = torch.tensor(frame, dtype=torch.float32)

        return frame

    def extract_frames(self, video_path, sequence_length=20, extract_faces=True):
        """
        Extract frames from video file

        Args:
            video_path: Path to video file
            sequence_length: Number of frames to extract (default: 20)
            extract_faces: Whether to detect and crop faces

        Returns:
            Tensor of shape (1, sequence_length, 3, im_size, im_size)
        """
        frames = []

        # Check if input is an image
        is_image = video_path.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
        
        if is_image:
            print(f"Input detected as image: {video_path}")
            image = cv2.imread(video_path)
            if image is None:
                raise ValueError(f"Could not read image file: {video_path}")
            
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Extract face if requested
            if extract_faces:
                try:
                    face_locations = face_recognition.face_locations(image)
                    if face_locations:
                        top, right, bottom, left = face_locations[0]
                        padding = 40
                        h, w = image.shape[:2]
                        top = max(0, top - padding)
                        bottom = min(h, bottom + padding)
                        left = max(0, left - padding)
                        right = min(w, right + padding)
                        image = image[top:bottom, left:right]
                        print("Image: Face detected and cropped")
                except Exception as e:
                    print(f"Image: Face detection error: {e}")

            # Preprocess and replicate frame for sequence length
            processed_frame = self.preprocess_frame(image)
            frames = [processed_frame.clone() for _ in range(sequence_length)]
            
            # Stack frames and add batch dimension
            frames_tensor = torch.stack(frames)
            frames_tensor = frames_tensor.unsqueeze(0)  # (1, seq_len, 3, H, W)
            return frames_tensor

        # Open video
        vidObj = cv2.VideoCapture(video_path)
        if not vidObj.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        # Get video properties
        total_frames = int(vidObj.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = vidObj.get(cv2.CAP_PROP_FPS)

        print(f"Video Info: {total_frames} frames, {fps:.2f} FPS")

        # Calculate frame sampling interval
        interval = max(1, total_frames // sequence_length)

        # Extract frames
        count = 0
        success = True
        frames_extracted = 0

        while success and frames_extracted < sequence_length:
            success, image = vidObj.read()

            if success and count % interval == 0:
                # Convert BGR to RGB
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

                # Extract face if requested
                if extract_faces:
                    try:
                        face_locations = face_recognition.face_locations(image)
                        if face_locations:
                            # Use first detected face
                            top, right, bottom, left = face_locations[0]

                            # Add padding around face
                            padding = 40
                            h, w = image.shape[:2]
                            top = max(0, top - padding)
                            bottom = min(h, bottom + padding)
                            left = max(0, left - padding)
                            right = min(w, right + padding)

                            # Crop face region
                            image = image[top:bottom, left:right]
                            print(f"Frame {frames_extracted + 1}: Face detected and cropped")
                        else:
                            print(f"Frame {frames_extracted + 1}: No face detected, using full frame")
                    except Exception as e:
                        print(f"Frame {frames_extracted + 1}: Face detection error, using full frame")

                # Preprocess and add frame
                processed_frame = self.preprocess_frame(image)
                frames.append(processed_frame)
                frames_extracted += 1

            count += 1

        vidObj.release()

        # Handle case where we couldn't extract enough frames
        if len(frames) < sequence_length:
            print(f"Warning: Only extracted {len(frames)} frames, padding to {sequence_length}")
            while len(frames) < sequence_length:
                # Duplicate last frame or create zeros
                if frames:
                    frames.append(frames[-1].clone())
                else:
                    frames.append(torch.zeros((3, self.im_size, self.im_size)))

        # Stack frames and add batch dimension
        frames_tensor = torch.stack(frames)
        frames_tensor = frames_tensor.unsqueeze(0)  # (1, seq_len, 3, H, W)

        print(f"Final tensor shape: {frames_tensor.shape}")
        return frames_tensor


def load_model(model_path, device='cpu'):
    """
    Load the trained model from checkpoint

    Args:
        model_path: Path to model weights (.pt file)
        device: 'cpu' or 'cuda'

    Returns:
        Loaded model in eval mode
    """
    print(f"\nLoading model from: {model_path}")

    # Initialize model
    model = DeepFakeDetector(num_classes=2)

    # Load weights
    state_dict = torch.load(model_path, map_location=device)
    model.load_state_dict(state_dict)

    # Set to evaluation mode
    model.eval()
    model.to(device)

    print("Model loaded successfully!")
    return model


def run_inference(model, video_path, device='cpu', sequence_length=20,
                  extract_faces=True):
    """
    Run deepfake detection on a video

    Args:
        model: Trained DeepFakeDetector model
        video_path: Path to video file
        device: 'cpu' or 'cuda'
        sequence_length: Number of frames to analyze
        extract_faces: Whether to detect and crop faces

    Returns:
        Dictionary with prediction results
    """
    print("\n" + "="*60)
    print("Running DeepFake Detection")
    print("="*60)

    # Initialize processor
    processor = VideoProcessor()

    # Extract and preprocess frames
    print("\nExtracting frames from video...")
    frames = processor.extract_frames(
        video_path,
        sequence_length=sequence_length,
        extract_faces=extract_faces
    )

    # Move to device
    frames = frames.to(device)
    model = model.to(device)
    model.eval()

    # Run inference
    print("\nRunning model inference...")
    with torch.no_grad():
        _, logits = model(frames)
        probs = F.softmax(logits, dim=1).cpu().numpy()[0]

    # Get prediction (0: FAKE, 1: REAL)
    prediction_idx = int(np.argmax(probs))
    confidence = float(probs[prediction_idx]) * 100

    # Prepare results
    results = {
        "prediction": "REAL" if prediction_idx == 1 else "FAKE",
        "confidence": round(confidence, 2),
        "probabilities": {
            "FAKE": round(float(probs[0]) * 100, 2),
            "REAL": round(float(probs[1]) * 100, 2)
        },
        "prediction_code": prediction_idx
    }

    # Print results (matching Colab output format)
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    print(f"Prediction: {results['prediction']}")
    print(f"Confidence: {results['confidence']:.2f}%")
    print(f"\nProbability Breakdown:")
    print(f"  FAKE: {results['probabilities']['FAKE']:.2f}%")
    print(f"  REAL: {results['probabilities']['REAL']:.2f}%")
    print(f"prediction_idx: {prediction_idx}")
    print("="*60)

    return results