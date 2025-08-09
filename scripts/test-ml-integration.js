/**
 * ML Integration Test Script
 * Tests the complete vehicle detection pipeline
 * Usage: node scripts/test-ml-integration.js
 */

const path = require('path');

// Mock React Native environment for Node.js testing
global.__DEV__ = true;
global.console = console;

// Test configuration
const TEST_CONFIG = {
  confidenceThreshold: 0.7,
  maxDetections: 5,
  testIterations: 10,
};

async function testExpoMLEngine() {
  console.log('🧪 Testing ExpoMLEngine...');
  
  try {
    // Dynamic import for ES modules compatibility
    const { createExpoMLEngine } = await import('../services/ExpoMLEngine.ts');
    
    const mlEngine = createExpoMLEngine({
      confidenceThreshold: TEST_CONFIG.confidenceThreshold,
      maxDetections: TEST_CONFIG.maxDetections,
    });

    // Test model loading
    console.log('📥 Testing model loading...');
    const modelLoaded = await mlEngine.loadModel();
    
    if (modelLoaded) {
      console.log('✅ Model loaded successfully');
    } else {
      console.log('❌ Model loading failed');
      return false;
    }

    // Test detection processing
    console.log('🔍 Testing detection processing...');
    const testImageUri = 'test://mock-image-123';
    
    for (let i = 0; i < TEST_CONFIG.testIterations; i++) {
      const startTime = Date.now();
      const detections = await mlEngine.processImage(testImageUri);
      const processingTime = Date.now() - startTime;
      
      console.log(`   Iteration ${i + 1}: ${detections.length} detections in ${processingTime}ms`);
      
      // Validate detection structure
      for (const detection of detections) {
        if (!detection.id || !detection.class || !detection.confidence || !detection.boundingBox) {
          console.log('❌ Invalid detection structure:', detection);
          return false;
        }
        
        if (detection.confidence < TEST_CONFIG.confidenceThreshold) {
          console.log('❌ Detection below confidence threshold:', detection.confidence);
          return false;
        }
      }
    }

    console.log('✅ ExpoMLEngine tests passed');
    mlEngine.dispose();
    return true;

  } catch (error) {
    console.log('❌ ExpoMLEngine test failed:', error.message);
    return false;
  }
}

async function testVehicleDetectionService() {
  console.log('\n🚗 Testing VehicleDetectionService...');
  
  try {
    const { createVehicleDetectionService } = await import('../services/VehicleDetectionService.ts');
    
    const detectionService = createVehicleDetectionService({
      confidenceThreshold: TEST_CONFIG.confidenceThreshold,
      maxDetections: TEST_CONFIG.maxDetections,
    });

    // Test service initialization
    console.log('🔧 Testing service initialization...');
    const initialized = await detectionService.initialize();
    
    if (initialized) {
      console.log('✅ Service initialized successfully');
    } else {
      console.log('❌ Service initialization failed');
      return false;
    }

    // Test vehicle detection
    console.log('🔍 Testing vehicle detection...');
    const testImageUri = 'test://mock-vehicle-image-456';
    
    const detections = await detectionService.detectVehicles(testImageUri);
    console.log(`   Found ${detections.length} vehicles`);
    
    // Validate vehicle types
    const validVehicleTypes = ['car', 'truck', 'bus'];
    for (const detection of detections) {
      if (!validVehicleTypes.includes(detection.class)) {
        console.log('❌ Invalid vehicle type:', detection.class);
        return false;
      }
    }

    // Test configuration updates
    console.log('⚙️  Testing configuration updates...');
    detectionService.updateConfig({
      confidenceThreshold: 0.9,
      maxDetections: 3,
    });
    
    const updatedConfig = detectionService.getConfig();
    if (updatedConfig.confidenceThreshold !== 0.9 || updatedConfig.maxDetections !== 3) {
      console.log('❌ Configuration update failed');
      return false;
    }

    console.log('✅ VehicleDetectionService tests passed');
    detectionService.dispose();
    return true;

  } catch (error) {
    console.log('❌ VehicleDetectionService test failed:', error.message);
    return false;
  }
}

async function testCameraFrameProcessor() {
  console.log('\n📷 Testing CameraFrameProcessor...');
  
  try {
    const { createVehicleDetectionService } = await import('../services/VehicleDetectionService.ts');
    const { createCameraFrameProcessor } = await import('../services/CameraFrameProcessor.ts');
    
    // Create detection service
    const detectionService = createVehicleDetectionService({
      confidenceThreshold: TEST_CONFIG.confidenceThreshold,
      maxDetections: TEST_CONFIG.maxDetections,
    });
    
    await detectionService.initialize();
    
    // Create frame processor
    const frameProcessor = createCameraFrameProcessor(detectionService, {
      targetFPS: 5,
      skipFrames: 1,
      maxConcurrent: 1,
    });

    // Test frame processing
    console.log('🎬 Testing frame processing...');
    const testFrame = {
      uri: 'test://camera-frame-789',
      width: 640,
      height: 640,
      timestamp: Date.now(),
    };
    
    const detections = await frameProcessor.processFrame(testFrame);
    console.log(`   Processed frame with ${detections.length} detections`);
    
    // Test performance stats
    const stats = frameProcessor.getStats();
    console.log('📊 Performance stats:', stats);
    
    if (stats.framesProcessed === 0) {
      console.log('❌ No frames processed');
      return false;
    }

    console.log('✅ CameraFrameProcessor tests passed');
    frameProcessor.dispose();
    detectionService.dispose();
    return true;

  } catch (error) {
    console.log('❌ CameraFrameProcessor test failed:', error.message);
    return false;
  }
}

async function testPerformanceBenchmark() {
  console.log('\n⚡ Running performance benchmark...');
  
  try {
    const { createVehicleDetectionService } = await import('../services/VehicleDetectionService.ts');
    
    const detectionService = createVehicleDetectionService({
      confidenceThreshold: 0.5,
      maxDetections: 10,
    });
    
    await detectionService.initialize();
    
    const iterations = 50;
    const processingTimes = [];
    
    console.log(`🏃 Running ${iterations} detection iterations...`);
    
    for (let i = 0; i < iterations; i++) {
      const startTime = process.hrtime.bigint();
      await detectionService.detectVehicles(`test://benchmark-${i}`);
      const endTime = process.hrtime.bigint();
      
      const processingTimeMs = Number(endTime - startTime) / 1e6;
      processingTimes.push(processingTimeMs);
    }
    
    // Calculate statistics
    const avgTime = processingTimes.reduce((a, b) => a + b) / processingTimes.length;
    const minTime = Math.min(...processingTimes);
    const maxTime = Math.max(...processingTimes);
    const estimatedFPS = 1000 / avgTime;
    
    console.log('📊 Benchmark Results:');
    console.log(`   Average: ${avgTime.toFixed(2)}ms`);
    console.log(`   Min: ${minTime.toFixed(2)}ms`);
    console.log(`   Max: ${maxTime.toFixed(2)}ms`);
    console.log(`   Estimated FPS: ${estimatedFPS.toFixed(1)}`);
    
    // Performance targets
    const targetFPS = 10;
    const targetAvgTime = 100; // 100ms
    
    if (estimatedFPS < targetFPS) {
      console.log(`⚠️  Performance below target (${targetFPS} FPS)`);
    } else {
      console.log(`✅ Performance meets target (${targetFPS}+ FPS)`);
    }
    
    detectionService.dispose();
    return true;

  } catch (error) {
    console.log('❌ Performance benchmark failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚗 VehicleDetector ML Integration Test Suite');
  console.log('=' .repeat(60));
  
  const results = {
    mlEngine: false,
    detectionService: false,
    frameProcessor: false,
    performance: false,
  };
  
  try {
    results.mlEngine = await testExpoMLEngine();
    results.detectionService = await testVehicleDetectionService();
    results.frameProcessor = await testCameraFrameProcessor();
    results.performance = await testPerformanceBenchmark();
    
  } catch (error) {
    console.log('\n💥 Test suite crashed:', error.message);
    process.exit(1);
  }
  
  // Summary
  console.log('\n📋 Test Results Summary:');
  console.log('=' .repeat(40));
  console.log(`ExpoMLEngine: ${results.mlEngine ? '✅' : '❌'}`);
  console.log(`VehicleDetectionService: ${results.detectionService ? '✅' : '❌'}`);
  console.log(`CameraFrameProcessor: ${results.frameProcessor ? '✅' : '❌'}`);
  console.log(`Performance Benchmark: ${results.performance ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! ML integration is ready.');
    console.log('👉 Next: Add real model files to assets/models/');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Review the output above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testExpoMLEngine, testVehicleDetectionService };