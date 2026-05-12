"""
Flask API for DeepFake Detection
Provides REST endpoint for video analysis
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
import numpy as np
from werkzeug.utils import secure_filename
from inference import load_model, run_inference
import traceback
import uuid

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Flutter app

# Configuration
UPLOAD_FOLDER = 'uploads'
MODEL_FOLDER = 'models'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm', 'png', 'jpg', 'jpeg', 'webp'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODEL_FOLDER, exist_ok=True)

# Global model variable
model = None
device = None


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def initialize_model():
    """Initialize the model on startup"""
    global model, device
    
    try:
        # Check for GPU
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"\nUsing device: {device}")
        
        # Model path - UPDATE THIS with your model filename
        model_path = os.path.join(MODEL_FOLDER, 'model_87_acc_20_frames_final_data.pt')
        
        if not os.path.exists(model_path):
            print(f"\n[WARNING] Model file not found at {model_path}")
            print("Please place your model file in the 'models' folder")
            return False
        
        # Load model
        print("\nInitializing model...")
        model = load_model(model_path, device)
        print("[OK] Model initialized successfully!")
        return True
        
    except Exception as e:
        print(f"\n[ERROR] Error initializing model: {str(e)}")
        traceback.print_exc()
        return False


@app.route('/')
def home():
    """Home endpoint"""
    return jsonify({
        "message": "DeepFake Detection API",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": model is not None,
        "device": str(device) if device else "unknown"
    })


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device) if device else "unknown"
    })


@app.route('/analyze', methods=['POST'])
def analyze_video():
    """
    Analyze video for deepfake detection
    
    Expected: multipart/form-data with 'video' file
    Returns: JSON with prediction results matching Colab output format
    """
    filepath = None
    
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                "success": False,
                "error": "Model not loaded. Please ensure model file is in the models folder."
            }), 500
        
        # Check if video file is present
        if 'video' not in request.files:
            return jsonify({
                "success": False,
                "error": "No video file provided"
            }), 400
        
        file = request.files['video']
        
        # Check if filename is empty
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No video file selected"
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "error": f"Invalid file format. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400
        
        # Save uploaded file with unique name to avoid conflicts
        original_filename = secure_filename(file.filename)
        filename = f"{uuid.uuid4()}_{original_filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        print(f"\n{'='*60}")
        print(f"Processing video: {original_filename}")
        print(f"Saved as: {filename}")
        print(f"{'='*60}")
        
        # Run inference (exactly as in Colab)
        results = run_inference(
            model=model,
            video_path=filepath,
            device=device,
            sequence_length=20,  # Same as training
            extract_faces=True   # Enable face detection
        )
        
        # Return results in exact Colab format
        response = {
            "success": True,
            "prediction": results["prediction"],
            "confidence": results["confidence"],
            "probabilities": results["probabilities"],
            "prediction_code": results["prediction_code"]
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"\n[ERROR] Error during analysis: {str(e)}")
        traceback.print_exc()
        
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
    finally:
        # Clean up uploaded file
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
                print(f"[OK] Cleaned up temporary file: {filename}")
            except Exception as e:
                print(f"[WARNING] Could not delete temporary file: {e}")


@app.route('/test', methods=['GET'])
def test():
    """Simple test endpoint"""
    return jsonify({
        "message": "API is working!",
        "model_status": "loaded" if model is not None else "not loaded",
        "device": str(device) if device else "unknown"
    })


# Initialize model when imported by gunicorn or run directly
initialize_model()

if __name__ == '__main__':
    print("\n" + "="*60)
    print("DEEPFAKE DETECTION API")
    print("="*60)
    
    if not model:
        print("\n[WARNING] Starting API without model loaded.")
        print("Please place your model file in the 'models' folder and restart.")
    
    print("\n" + "="*60)
    print("Starting Flask server...")
    print("API will be available at: http://127.0.0.1:5000")
    print("API endpoints:")
    print("  - GET  /          : API info")
    print("  - GET  /health    : Health check")
    print("  - POST /analyze   : Analyze video/image")
    print("  - GET  /test      : Test endpoint")
    print("="*60 + "\n")
    
    # Run Flask app
    app.run(host='127.0.0.1', port=5000, debug=True)