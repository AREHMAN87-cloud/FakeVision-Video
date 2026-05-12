# FakeVision - Deepfake Detection System

FakeVision is a comprehensive deepfake detection application consisting of a React-based frontend and a Python (Flask) API for video and image analysis.

## Project Structure

- **Frontend**: Built with Vite and React, located in the root directory.
- **Backend API**: Located in the `deepfake-detection-api-main` directory.

## Features

- **Image Detection**: Analyze uploaded images for deepfake manipulation.
- **Video Detection**: Analyze videos for temporal and spatial deepfake artifacts.
- **Real-time Results**: Get confidence scores and clear visual indicators.
- **Modern UI**: A high-tech dashboard with dark mode support.

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for API)

### Installation

1. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```

2. **Backend**:
   ```bash
   cd deepfake-detection-api-main
   pip install -r requirements.txt
   python app.py
   ```

## License

MIT
