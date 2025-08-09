/**
 * Native Bridge Preparation Script
 * Prepares the foundation for Core ML and TensorFlow Lite integration
 * Usage: node scripts/prepare-native-bridge.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const IOS_DIR = path.join(PROJECT_ROOT, 'ios');
const ANDROID_DIR = path.join(PROJECT_ROOT, 'android');

function checkExpoSetup() {
  console.log('🔍 Checking Expo setup for native modules...');
  
  const appJson = path.join(PROJECT_ROOT, 'app.json');
  
  if (!fs.existsSync(appJson)) {
    console.log('❌ app.json not found');
    return false;
  }
  
  const appConfig = JSON.parse(fs.readFileSync(appJson, 'utf8'));
  
  // Check if we're using Expo managed workflow
  const isManaged = !fs.existsSync(IOS_DIR) || !fs.existsSync(ANDROID_DIR);
  
  if (isManaged) {
    console.log('📱 Detected Expo Managed Workflow');
    console.log('💡 For Core ML/TFLite integration, consider:');
    console.log('   1. expo prebuild - Generate native directories');
    console.log('   2. expo eject - Switch to bare workflow');
    console.log('   3. expo-dev-client - Custom development client');
    console.log('   4. Expo Modules API - Create custom native module');
    
    return { isManaged: true, canUseNative: false };
  } else {
    console.log('📱 Detected Expo Bare Workflow');
    console.log('✅ Native module integration possible');
    
    return { isManaged: false, canUseNative: true };
  }
}

function createNativeBridgeFiles() {
  console.log('📁 Creating native bridge templates...');
  
  const bridgeDir = path.join(PROJECT_ROOT, 'native-bridge');
  
  if (!fs.existsSync(bridgeDir)) {
    fs.mkdirSync(bridgeDir, { recursive: true });
  }
  
  // Create iOS templates directory
  const iosDir = path.join(bridgeDir, 'ios');
  if (!fs.existsSync(iosDir)) {
    fs.mkdirSync(iosDir);
  }
  
  // Create Android templates directory
  const androidDir = path.join(bridgeDir, 'android');
  if (!fs.existsSync(androidDir)) {
    fs.mkdirSync(androidDir);
  }
  
  // Create iOS header template
  const iosHeader = `//
//  VehicleDetectionModule.h
//  VehicleDetector
//
//  Core ML Vehicle Detection Native Module
//

#import <React/RCTBridgeModule.h>
#import <CoreML/CoreML.h>
#import <Vision/Vision.h>

@interface VehicleDetectionModule : NSObject <RCTBridgeModule>

@property (nonatomic, strong) MLModel *yoloModel;
@property (nonatomic, strong) VNCoreMLModel *visionModel;

@end`;
  
  fs.writeFileSync(path.join(iosDir, 'VehicleDetectionModule.h.template'), iosHeader);
  
  // Create iOS implementation template
  const iosImpl = `//
//  VehicleDetectionModule.m
//  VehicleDetector
//
//  Core ML Vehicle Detection Implementation
//

#import "VehicleDetectionModule.h"
#import <React/RCTLog.h>

@implementation VehicleDetectionModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(loadModel:(NSString *)modelPath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Implementation for loading Core ML model
    // TODO: Add actual Core ML model loading logic
    resolve(@"Core ML model loaded successfully");
}

RCT_EXPORT_METHOD(detectVehicles:(NSString *)imageUri
                  confidence:(double)confidenceThreshold
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Implementation for Core ML vehicle detection
    // TODO: Add actual detection logic with Vision framework
    NSArray *mockDetections = @[@{
        @"id": [[NSUUID UUID] UUIDString],
        @"class": @"car",
        @"confidence": @(0.85),
        @"boundingBox": @{
            @"x": @(100),
            @"y": @(200),
            @"width": @(150),
            @"height": @(100)
        }
    }];
    
    resolve(mockDetections);
}

@end`;
  
  fs.writeFileSync(path.join(iosDir, 'VehicleDetectionModule.m.template'), iosImpl);
  
  // Create Android template
  const androidTemplate = `// VehicleDetectionModule.java
// TensorFlow Lite Vehicle Detection Native Module
// Place in: android/app/src/main/java/com/vehicledetector/modules/

// Key imports:
// import org.tensorflow.lite.Interpreter;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Promise;

// Key methods to implement:
// @ReactMethod loadModel(String modelPath, Promise promise)
// @ReactMethod detectVehicles(String imageUri, double confidence, Promise promise)

// TODO: Implement full TensorFlow Lite integration
// See INTEGRATION_GUIDE.md for complete implementation details`;
  
  fs.writeFileSync(path.join(androidDir, 'VehicleDetectionModule.java.template'), androidTemplate);
  
  // Create comprehensive documentation
  const integrationGuide = `# Native Bridge Integration Guide

## Overview
This guide explains how to integrate Core ML (iOS) and TensorFlow Lite (Android) native modules for real-time vehicle detection.

## Current Status
- ✅ ExpoMLEngine implemented (JavaScript-based mock detection)
- 🔧 Native bridge templates prepared
- ⏳ Awaiting actual model files and native implementation

## Architecture

\`\`\`
React Native App (JavaScript)
       ↓
VehicleDetectionService (JavaScript)
       ↓
ExpoMLEngine (Current) | Native Bridge (Future)
       ↓
Mock Detection | Core ML/TensorFlow Lite
       ↓
Enhanced Simulation | Real YOLO Model Inference
\`\`\`

## iOS Integration (Core ML)

### Prerequisites
- Xcode 12+
- iOS 11+ (Core ML support)
- YOLOv5s.mlmodel file (< 50MB)

### Setup Steps
1. Run \`expo prebuild\` to generate iOS project
2. Add Core ML frameworks to Xcode project
3. Copy model file to iOS bundle
4. Implement native module from template
5. Register module in AppDelegate

### Key Files
- \`ios/VehicleDetector/VehicleDetectionModule.h\`
- \`ios/VehicleDetector/VehicleDetectionModule.m\`
- \`ios/VehicleDetector/Models/yolov5s.mlmodel\`

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
- \`android/app/src/main/java/com/vehicledetector/modules/VehicleDetectionModule.java\`
- \`android/app/src/main/assets/yolov5s.tflite\`

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
\`\`\`bash
# Test mock implementation
npm run test-ml

# Check model preparation
npm run prepare-models

# Run app with simulation
npm start
\`\`\`

### Future Native Testing
\`\`\`bash
# iOS testing
npx react-native run-ios
npx react-native log-ios

# Android testing
npx react-native run-android
npx react-native log-android
\`\`\`

## Migration Path

### From Mock to Native
1. Keep ExpoMLEngine as fallback
2. Implement native modules alongside
3. Feature flag for switching between implementations
4. Gradual rollout and testing
5. Performance comparison and optimization

### Code Structure
\`\`\`javascript
// Detection service remains the same
const detectionService = createVehicleDetectionService(config);

// Engine selection (future)
const useNative = await checkNativeSupport();
const engine = useNative 
  ? createNativeMLEngine(config)
  : createExpoMLEngine(config);
\`\`\`

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

1. **Download YOLO models** (\`yolov5s.mlmodel\`, \`yolov5s.tflite\`)
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
\`\`\`bash
# Option 1: Convert from PyTorch
git clone https://github.com/ultralytics/yolov5
cd yolov5
python export.py --weights yolov5s.pt --include coreml --img 640

# Option 2: Download pre-converted
# wget https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.mlmodel
\`\`\`

### YOLOv5s TensorFlow Lite
\`\`\`bash
# Option 1: Convert from PyTorch  
python export.py --weights yolov5s.pt --include tflite --img 640

# Option 2: Download pre-converted
# wget https://github.com/ultralytics/yolov5/releases/download/v7.0/yolov5s.tflite
\`\`\`
`;
  
  fs.writeFileSync(path.join(bridgeDir, 'INTEGRATION_GUIDE.md'), integrationGuide);
  
  console.log('✅ Native bridge templates created in native-bridge/');
  
  return {
    ios: { header: iosDir, implementation: iosDir },
    android: { module: androidDir },
    docs: bridgeDir
  };
}

function main() {
  console.log('🔗 VehicleDetector Native Bridge Preparation');
  console.log('=' .repeat(55));
  
  const setup = checkExpoSetup();
  const bridgeFiles = createNativeBridgeFiles();
  
  console.log('\n📋 Integration Options:');
  if (setup.canUseNative) {
    console.log('✅ Native module integration ready');
    console.log('👉 Next steps:');
    console.log('   1. expo prebuild (generate native directories)');
    console.log('   2. Add model files to native bundles');
    console.log('   3. Implement native modules from templates');
    console.log('   4. Test on physical devices');
  } else {
    console.log('📱 Continue with Expo managed workflow');
    console.log('👉 Options:');
    console.log('   1. Keep using ExpoMLEngine (current approach)');
    console.log('   2. expo prebuild for native access');
    console.log('   3. expo eject for full native control');
  }
  
  console.log('\n📁 Files created:');
  console.log('   native-bridge/ios/ - iOS Core ML templates');
  console.log('   native-bridge/android/ - Android TensorFlow Lite templates');
  console.log('   native-bridge/INTEGRATION_GUIDE.md - Complete guide');
  
  console.log('\n🎯 Current Status: Week 2 Day 6-7 Complete');
  console.log('✅ Enhanced ML engine with Expo compatibility');
  console.log('✅ Native bridge foundation prepared');
  console.log('📚 See native-bridge/INTEGRATION_GUIDE.md for details');
}

if (require.main === module) {
  main();
}