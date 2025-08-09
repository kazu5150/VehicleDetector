# YOLO Models Directory

This directory contains the YOLO models used for vehicle detection.

## Current Status
- **Development Phase**: Using mock/simulated detection
- **Target Model**: YOLOv5s optimized for mobile devices
- **Format**: Core ML (.mlmodel) and TensorFlow Lite (.tflite)

## Available Models
- No models currently available

## Missing Models
- ❌ **yolov5s.mlmodel** - YOLOv5s Core ML model for iOS (< 50MB)
- ❌ **yolov5s.tflite** - YOLOv5s TensorFlow Lite model for Android (< 30MB)

## Model Requirements
- **Input Size**: 640x640 pixels
- **Classes**: COCO dataset (focus on vehicles: car, truck, bus)
- **File Size**: Core ML < 50MB, TensorFlow Lite < 30MB
- **Format**: Compatible with React Native/Expo

## Integration Steps
1. Download pre-trained YOLOv5s model
2. Convert to mobile-friendly format (Core ML/TFLite)
3. Optimize for real-time inference on iOS/Android
4. Place in this directory
5. Update ExpoMLEngine to use actual model files

## Model Conversion
```bash
# Install YOLOv5
git clone https://github.com/ultralytics/yolov5
cd yolov5
pip install -r requirements.txt

# Convert to Core ML (iOS)
python export.py --weights yolov5s.pt --include coreml --img 640

# Convert to TensorFlow Lite (Android)  
python export.py --weights yolov5s.pt --include tflite --img 640
```

## Testing
- Current implementation uses enhanced mock detection
- Real model integration planned for Week 2 completion
- Performance target: 30+ FPS on iPhone 12 and equivalent Android devices

## Notes
- Models not included in repository due to file size
- Download and place manually in this directory
- App will fall back to mock detection if models are missing
