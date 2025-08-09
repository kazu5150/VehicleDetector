/**
 * Script to prepare and validate YOLO models for mobile deployment
 * Usage: node scripts/prepare-models.js
 */

const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '..', 'assets', 'models');
const REQUIRED_MODELS = [
  {
    name: 'yolov5s.mlmodel',
    description: 'YOLOv5s Core ML model for iOS',
    size: '< 50MB',
    format: 'Core ML (.mlmodel)',
  },
  {
    name: 'yolov5s.tflite',
    description: 'YOLOv5s TensorFlow Lite model for Android',
    size: '< 30MB', 
    format: 'TensorFlow Lite (.tflite)',
  }
];

function checkModelsDirectory() {
  console.log('🔍 Checking models directory...');
  
  if (!fs.existsSync(MODELS_DIR)) {
    console.log('❌ Models directory not found. Creating...');
    fs.mkdirSync(MODELS_DIR, { recursive: true });
    console.log('✅ Models directory created');
  } else {
    console.log('✅ Models directory found');
  }
}

function checkModelFiles() {
  console.log('\n📋 Checking required model files...');
  
  const missingModels = [];
  const existingModels = [];
  
  for (const model of REQUIRED_MODELS) {
    const modelPath = path.join(MODELS_DIR, model.name);
    
    if (fs.existsSync(modelPath)) {
      const stats = fs.statSync(modelPath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ ${model.name} - ${sizeInMB}MB`);
      existingModels.push({
        ...model,
        actualSize: `${sizeInMB}MB`,
        path: modelPath
      });
    } else {
      console.log(`❌ ${model.name} - Not found`);
      missingModels.push(model);
    }
  }
  
  return { existingModels, missingModels };
}

function generateDownloadInstructions(missingModels) {
  if (missingModels.length === 0) {
    console.log('\n🎉 All required models are present!');
    return;
  }
  
  console.log('\n📥 Missing Models - Download Instructions:');
  console.log('=' .repeat(60));
  
  console.log('\n1. YOLOv5s Core ML model (iOS):');
  console.log('   Source: https://github.com/ultralytics/yolov5');
  console.log('   Command: python export.py --weights yolov5s.pt --include coreml');
  console.log('   Place in: assets/models/yolov5s.mlmodel');
  
  console.log('\n2. YOLOv5s TensorFlow Lite model (Android):');
  console.log('   Source: https://github.com/ultralytics/yolov5');
  console.log('   Command: python export.py --weights yolov5s.pt --include tflite');
  console.log('   Place in: assets/models/yolov5s.tflite');
  
  console.log('\n3. Alternative - Pre-converted models:');
  console.log('   Source: https://github.com/ultralytics/yolov5/releases');
  console.log('   Download: yolov5s.mlmodel and yolov5s.tflite');
  
  console.log('\n📝 Note: Currently using mock detection until models are added.');
}

function updateReadme(existingModels, missingModels) {
  const readmePath = path.join(MODELS_DIR, 'README.md');
  
  const readmeContent = `# YOLO Models Directory

This directory contains the YOLO models used for vehicle detection.

## Current Status
- **Development Phase**: ${missingModels.length > 0 ? 'Using mock/simulated detection' : 'Using actual ML models'}
- **Target Model**: YOLOv5s optimized for mobile devices
- **Format**: Core ML (.mlmodel) and TensorFlow Lite (.tflite)

## Available Models
${existingModels.length > 0 ? existingModels.map(model => 
  `- ✅ **${model.name}** (${model.actualSize}) - ${model.description}`
).join('\n') : '- No models currently available'}

## Missing Models
${missingModels.length > 0 ? missingModels.map(model => 
  `- ❌ **${model.name}** - ${model.description} (${model.size})`
).join('\n') : '- All required models are present'}

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
\`\`\`bash
# Install YOLOv5
git clone https://github.com/ultralytics/yolov5
cd yolov5
pip install -r requirements.txt

# Convert to Core ML (iOS)
python export.py --weights yolov5s.pt --include coreml --img 640

# Convert to TensorFlow Lite (Android)  
python export.py --weights yolov5s.pt --include tflite --img 640
\`\`\`

## Testing
- Current implementation uses enhanced mock detection
- Real model integration planned for Week 2 completion
- Performance target: 30+ FPS on iPhone 12 and equivalent Android devices

## Notes
- Models not included in repository due to file size
- Download and place manually in this directory
- App will fall back to mock detection if models are missing
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log('\n📝 Updated README.md with current model status');
}

function main() {
  console.log('🚗 VehicleDetector Model Preparation Script');
  console.log('=' .repeat(50));
  
  checkModelsDirectory();
  const { existingModels, missingModels } = checkModelFiles();
  generateDownloadInstructions(missingModels);
  updateReadme(existingModels, missingModels);
  
  console.log('\n✨ Model preparation complete!');
  
  if (missingModels.length > 0) {
    console.log('\n⚠️  App will use mock detection until models are added.');
    process.exit(1);
  } else {
    console.log('\n🎯 Ready for real-time vehicle detection!');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkModelsDirectory, checkModelFiles };