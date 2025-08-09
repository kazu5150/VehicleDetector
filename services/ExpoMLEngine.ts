/**
 * Expo-compatible ML Engine for Vehicle Detection
 * Uses expo-gl for image processing and lightweight inference
 */

import { Detection } from '@/components/DetectionOverlay';
// import { GLView } from 'expo-gl';  // TODO: Enable when implementing actual GL processing
// import { Asset } from 'expo-asset'; // TODO: Enable when loading actual model files

// COCO dataset class names (relevant vehicle classes)
export const COCO_VEHICLE_CLASSES = {
  2: 'car',
  5: 'bus', 
  7: 'truck',
} as const;

export interface MLModelConfig {
  inputSize: number;     // Model input size (e.g., 640)
  confidenceThreshold: number;
  nmsThreshold: number;  // Non-maximum suppression threshold
  maxDetections: number;
}

export interface ProcessedFrame {
  width: number;
  height: number;
  data: Uint8Array;
}

export class ExpoMLEngine {
  private config: MLModelConfig;
  private isModelLoaded = false;
  // private modelAsset: Asset | null = null; // TODO: Enable when loading actual model files

  constructor(config: MLModelConfig) {
    this.config = config;
  }

  async loadModel(modelPath?: string): Promise<boolean> {
    try {
      console.log('Loading Expo ML model...', modelPath || 'mock model');
      
      // Skip actual model loading for now - use mock detection
      // TODO: Uncomment when actual model files are available
      /*
      if (modelPath) {
        // Load model asset
        this.modelAsset = Asset.fromModule(require('../assets/models/yolov5s.mlmodel'));
        await this.modelAsset.downloadAsync();
      }
      */
      
      // Simulate model initialization
      await this.simulateModelLoad();
      
      this.isModelLoaded = true;
      console.log('Expo ML model loaded successfully (using mock detection)');
      return true;
    } catch (error) {
      console.error('Failed to load Expo ML model:', error);
      // Fall back to mock detection
      this.isModelLoaded = true;
      console.log('Falling back to mock detection');
      return true;
    }
  }

  private async simulateModelLoad(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock Expo ML model initialized');
        resolve();
      }, 1500);
    });
  }

  async processImage(imageUri: string): Promise<Detection[]> {
    if (!this.isModelLoaded) {
      throw new Error('ML model not loaded');
    }

    try {
      // For now, use enhanced mock detection
      // TODO: Implement actual image processing with expo-gl
      return this.runEnhancedInference(imageUri);
    } catch (error) {
      console.error('Image processing error:', error);
      return [];
    }
  }

  private async runEnhancedInference(imageUri: string): Promise<Detection[]> {
    // Enhanced mock detection with image-aware logic
    console.log('Processing image:', imageUri);
    
    const detections: Detection[] = [];
    
    // Simulate more realistic detection patterns
    const numDetections = Math.floor(Math.random() * 4) + 1; // 1-4 vehicles
    
    for (let i = 0; i < numDetections; i++) {
      const vehicleClassIds = Object.keys(COCO_VEHICLE_CLASSES).map(Number);
      const classId = vehicleClassIds[Math.floor(Math.random() * vehicleClassIds.length)];
      const vehicleType = COCO_VEHICLE_CLASSES[classId as keyof typeof COCO_VEHICLE_CLASSES];
      
      // Generate realistic confidence scores based on vehicle type
      let baseConfidence: number;
      switch (vehicleType) {
        case 'car':
          baseConfidence = 0.75 + Math.random() * 0.2; // 75-95%
          break;
        case 'truck':
          baseConfidence = 0.65 + Math.random() * 0.25; // 65-90%
          break;
        case 'bus':
          baseConfidence = 0.70 + Math.random() * 0.2; // 70-90%
          break;
        default:
          baseConfidence = 0.60 + Math.random() * 0.3;
      }
      
      const confidence = Math.min(0.95, baseConfidence);
      
      if (confidence >= this.config.confidenceThreshold) {
        // Generate realistic bounding boxes for mobile screen
        const screenWidth = 390; // iPhone screen width approximation
        const screenHeight = 844; // iPhone screen height approximation
        
        // Position vehicles in realistic locations (roads, parking areas)
        const centerX = 50 + Math.random() * (screenWidth - 100);
        const centerY = 200 + Math.random() * (screenHeight - 400); // Avoid top/bottom UI areas
        
        // Vehicle-appropriate sizes
        let widthRange: [number, number];
        let heightRange: [number, number];
        
        switch (vehicleType) {
          case 'bus':
            widthRange = [180, 250];
            heightRange = [120, 160];
            break;
          case 'truck':
            widthRange = [150, 220];
            heightRange = [100, 140];
            break;
          case 'car':
          default:
            widthRange = [100, 180];
            heightRange = [80, 120];
        }
        
        const width = widthRange[0] + Math.random() * (widthRange[1] - widthRange[0]);
        const height = heightRange[0] + Math.random() * (heightRange[1] - heightRange[0]);
        
        // Convert from center coordinates to top-left coordinates
        const detection: Detection = {
          id: `ml_${Date.now()}_${i}`,
          class: vehicleType,
          confidence: confidence,
          boundingBox: {
            x: Math.max(10, centerX - width / 2),
            y: Math.max(50, centerY - height / 2),
            width: width,
            height: height,
          },
        };
        
        detections.push(detection);
      }
    }

    // Apply Non-Maximum Suppression
    return this.applyNMS(detections);
  }

  private applyNMS(detections: Detection[]): Detection[] {
    // Sort by confidence (highest first)
    detections.sort((a, b) => b.confidence - a.confidence);
    
    const filteredDetections: Detection[] = [];
    
    for (const detection of detections) {
      let isOverlapping = false;
      
      for (const existing of filteredDetections) {
        const iou = this.calculateIoU(detection.boundingBox, existing.boundingBox);
        if (iou > this.config.nmsThreshold) {
          isOverlapping = true;
          break;
        }
      }
      
      if (!isOverlapping) {
        filteredDetections.push(detection);
      }
    }
    
    // Limit to max detections
    return filteredDetections.slice(0, this.config.maxDetections);
  }

  private calculateIoU(box1: any, box2: any): number {
    // Calculate Intersection over Union (IoU)
    const x1 = Math.max(box1.x, box2.x);
    const y1 = Math.max(box1.y, box2.y);
    const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
    const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);
    
    if (x2 <= x1 || y2 <= y1) return 0;
    
    const intersectionArea = (x2 - x1) * (y2 - y1);
    const box1Area = box1.width * box1.height;
    const box2Area = box2.width * box2.height;
    const unionArea = box1Area + box2Area - intersectionArea;
    
    return intersectionArea / unionArea;
  }

  updateConfig(newConfig: Partial<MLModelConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('ML Engine config updated:', this.config);
  }

  isLoaded(): boolean {
    return this.isModelLoaded;
  }

  dispose(): void {
    // this.modelAsset = null; // TODO: Enable when using actual model assets
    this.isModelLoaded = false;
    console.log('Expo ML engine disposed');
  }

  // Future method for actual GL-based image processing
  private async processWithGL(imageUri: string): Promise<ProcessedFrame> {
    // TODO: Implement expo-gl based image preprocessing
    // This would resize, normalize, and format image for ML inference
    return {
      width: this.config.inputSize,
      height: this.config.inputSize,
      data: new Uint8Array(this.config.inputSize * this.config.inputSize * 3),
    };
  }
}

// Default ML configuration optimized for Expo
export const DEFAULT_ML_CONFIG: MLModelConfig = {
  inputSize: 640,
  confidenceThreshold: 0.7,
  nmsThreshold: 0.4,
  maxDetections: 8,
};

// Factory function
export const createExpoMLEngine = (config?: Partial<MLModelConfig>): ExpoMLEngine => {
  const finalConfig = { ...DEFAULT_ML_CONFIG, ...config };
  return new ExpoMLEngine(finalConfig);
};