# Native Bridge Integration Guide

## Overview
This guide explains how to integrate Core ML (iOS) and TensorFlow Lite (Android) native modules for real-time vehicle detection.

## Current Status
- ✅ ExpoMLEngine implemented (JavaScript-based mock detection)
- 🔧 Native bridge templates prepared
- ⏳ Awaiting actual model files and native implementation

## Architecture

```
React Native App (JavaScript)
       ↓
VehicleDetectionService (JavaScript)
       ↓
ExpoMLEngine (Current) | Native Bridge (Future)
       ↓
Mock Detection | Core ML/TensorFlow Lite
       ↓
Enhanced Simulation | Real YOLO Model Inference
```

## iOS Integration (Core ML)

### Prerequisites
- Xcode 12+
- iOS 11+ (Core ML support)
- YOLOv5s.mlmodel file (< 50MB)

### Setup Steps
1. Run `expo prebuild` to generate iOS project
2. Add Core ML frameworks to Xcode project
3. Copy model file to iOS bundle
4. Implement native module from template
5. Register module in AppDelegate

### Key Files
- `ios/VehicleDetector/VehicleDetectionModule.h`
- `ios/VehicleDetector/VehicleDetectionModule.m`
- `ios/VehicleDetector/Models/yolov5s.mlmodel`

## Android Integration (TensorFlow Lite)

### Prerequisites
- Android API 21+
- TensorFlow Lite 2.13.0+
- YOLOv5s.tflite file (< 30MB)

### Setup Steps
1. Add TensorFlow Lite dependencies to build.gradle
2. Copy model file to assets folder
3. Implement native module from template
4. Register module in MainApplication.java

### Key Files
- `android/app/src/main/java/com/vehicledetector/modules/VehicleDetectionModule.java`
- `android/app/src/main/assets/yolov5s.tflite`

## Development Phases

### Phase 1: Current (Mock Detection) ✅
- ExpoMLEngine with enhanced simulation
- Realistic detection patterns
- Performance monitoring
- Frame processing pipeline

### Phase 2: Native Integration (In Progress) 🔧
- Native bridge templates prepared
- Model file structure created
- Integration documentation written

### Phase 3: Real Model Integration (Next) ⏳
- Download/convert YOLO models
- Implement native modules
- Real-time inference
- Performance optimization

## Performance Targets

### Mock Detection (Current)
- ✅ 30+ FPS simulation
- ✅ Realistic vehicle types and confidence scores
- ✅ Proper bounding box coordinates
- ✅ NMS simulation

### Native Implementation (Target)
- 🎯 30+ FPS real inference
- 🎯 < 100ms processing time per frame
- 🎯 GPU acceleration
- 🎯 Memory efficient model loading

## Testing Strategy

### Current Testing
```bash
# Test mock implementation
npm run test-ml

# Check model preparation
npm run prepare-models

# Run app with simulation
npm start
```

### Future Native Testing
```bash
# iOS testing
npx react-native run-ios
npx react-native log-ios

# Android testing
npx react-native run-android
npx react-native log-android
```

## Migration Path

### From Mock to Native
1. Keep ExpoMLEngine as fallback
2. Implement native modules alongside
3. Feature flag for switching between implementations
4. Gradual rollout and testing
5. Performance comparison and optimization

### Code Structure
```javascript
// Detection service remains the same
const detectionService = createVehicleDetectionService(config);

// Engine selection (future)
const useNative = await checkNativeSupport();
const engine = useNative 
  ? createNativeMLEngine(config)
  : createExpoMLEngine(config);
```

## Troubleshooting

### Common Issues
- Model file not found → Check bundle inclusion
- Performance issues → Enable GPU acceleration
- Memory errors → Implement proper model disposal
- Platform differences → Test on both iOS/Android

### Debug Tools
- React Native Debugger
- Xcode Instruments (iOS)
- Android Profiler
- Performance monitoring hooks

## Next Steps

1. **Download YOLO models** (`yolov5s.mlmodel`, `yolov5s.tflite`)
2. **Run expo prebuild** to access native directories
3. **Implement iOS Core ML module** using template
4. **Implement Android TensorFlow Lite module** using template
5. **Test on physical devices** for real performance
6. **Optimize and benchmark** against mock implementation

## Resources

- [Expo Native Modules](https://docs.expo.dev/modules/overview/)
- [Core ML Documentation](https://developer.apple.com/documentation/coreml)
- [TensorFlow Lite Guide](https://www.tensorflow.org/lite)
- [YOLOv5 Model Hub](https://github.com/ultralytics/yolov5)
- [React Native Performance](https://reactnative.dev/docs/performance)

## Model Download Links

### YOLOv5s Core ML
```bash
# Option 1: Convert from PyTorch
git clone https://github.com/ultralytics/yolov5
cd yolov5
python export.py --weights yolov5s.pt --include coreml --img 640

# Option 2: Download pre-converted
# wget https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.mlmodel
```

### YOLOv5s TensorFlow Lite
```bash
# Option 1: Convert from PyTorch  
python export.py --weights yolov5s.pt --include tflite --img 640

# Option 2: Download pre-converted
# wget https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.tflite
```
