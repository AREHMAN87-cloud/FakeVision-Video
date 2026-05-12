"""
Test script to verify inference matches Colab
"""
import torch
from inference import load_model, run_inference

# Configuration
MODEL_PATH = 'models/model_87_acc_20_frames_final_data.pt'
VIDEO_PATH = 'test_videos/02_13__talking_angry_couch__AROBAY8R.mp4'  # UPDATE THIS
DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'

print("="*60)
print("TESTING INFERENCE")
print("="*60)
print(f"Device: {DEVICE}")
print(f"Model: {MODEL_PATH}")
print(f"Video: {VIDEO_PATH}")
print("="*60)

# Load model
model = load_model(MODEL_PATH, DEVICE)

# Run inference
results = run_inference(
    model=model,
    video_path=VIDEO_PATH,
    device=DEVICE,
    sequence_length=20,
    extract_faces=True
)

print("\n" + "="*60)
print("FINAL RESULTS")
print("="*60)
print(f"Prediction: {results['prediction']}")
print(f"Confidence: {results['confidence']:.2f}%")
print(f"FAKE probability: {results['probabilities']['FAKE']:.2f}%")
print(f"REAL probability: {results['probabilities']['REAL']:.2f}%")
print(f"Prediction code: {results['prediction_code']}")
print("="*60)