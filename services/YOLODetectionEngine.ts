/**
 * YOLO Detection Engine for Vehicle Detection
 * Lightweight implementation for React Native/Expo
 */

import { Detection } from '@/components/DetectionOverlay';

// COCO dataset class names (relevant vehicle classes)
export const COCO_VEHICLE_CLASSES = {
  2: 'car',
  5: 'bus',
  7: 'truck',
} as const;

export interface YOLOBoundingBox {
  x: number;      // Center X coordinate
  y: number;      // Center Y coordinate
  width: number;  // Width
  height: number; // Height
  confidence: number;
  classId: number;
}

export interface YOLOModelConfig {
  inputSize: number;     // Model input size (e.g., 640)
  confidenceThreshold: number;
  nmsThreshold: number;  // Non-maximum suppression threshold
  maxDetections: number;
}

export class YOLODetectionEngine {
  private config: YOLOModelConfig;
  private isModelLoaded = false;

  constructor(config: YOLOModelConfig) {
    this.config = config;
  }

  async loadModel(modelPath?: string): Promise<boolean> {
    try {
      console.log('Loading YOLO model...', modelPath || 'mock model');
      
      // TODO: Load actual YOLO model here
      // For now, simulate model loading
      await this.simulateModelLoad();
      
      this.isModelLoaded = true;
      console.log('YOLO model loaded successfully');
      return true;
    } catch (error) {
      console.error('Failed to load YOLO model:', error);
      return false;
    }
  }

  private async simulateModelLoad(): Promise<void> {
    // Simulate model loading time
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Mock YOLO model initialized');
        resolve();
      }, 2000);
    });
  }

  async detectObjects(imageData: any): Promise<Detection[]> {
    if (!this.isModelLoaded) {
      throw new Error('YOLO model not loaded');
    }

    try {
      // TODO: Replace with actual YOLO inference
      return this.simulateYOLOInference();
    } catch (error) {
      console.error('YOLO detection error:', error);
      return [];
    }
  }

  private simulateYOLOInference(): Detection[] {
    // Enhanced mock detection with more realistic behavior
    const detections: Detection[] = [];
    
    // Simulate YOLO detection pattern (0-5 vehicles)
    const numDetections = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numDetections; i++) {
      const vehicleClassIds = Object.keys(COCO_VEHICLE_CLASSES).map(Number);
      const classId = vehicleClassIds[Math.floor(Math.random() * vehicleClassIds.length)];
      const vehicleType = COCO_VEHICLE_CLASSES[classId as keyof typeof COCO_VEHICLE_CLASSES];
      
      // Generate more realistic confidence scores
      const baseConfidence = vehicleType === 'car' ? 0.8 : 0.65; // Cars are typically easier to detect
      const confidence = Math.min(0.95, baseConfidence + Math.random() * 0.2);
      
      if (confidence >= this.config.confidenceThreshold) {
        // Generate realistic bounding boxes
        const centerX = 50 + Math.random() * 200; // Center X
        const centerY = 150 + Math.random() * 250; // Center Y
        
        // Vehicle-appropriate sizes
        const widthRange = vehicleType === 'bus' ? [180, 250] : 
                          vehicleType === 'truck' ? [150, 220] : [100, 180];
        const heightRange = vehicleType === 'bus' ? [120, 160] : 
                           vehicleType === 'truck' ? [100, 140] : [80, 120];
        
        const width = widthRange[0] + Math.random() * (widthRange[1] - widthRange[0]);
        const height = heightRange[0] + Math.random() * (heightRange[1] - heightRange[0]);
        
        // Convert from center coordinates to top-left coordinates
        const detection: Detection = {
          id: `yolo_${Date.now()}_${i}`,
          class: vehicleType,
          confidence: confidence,
          boundingBox: {
            x: Math.max(0, centerX - width / 2),
            y: Math.max(0, centerY - height / 2),
            width: width,
            height: height,
          },
        };
        
        detections.push(detection);
      }
    }

    // Apply Non-Maximum Suppression (NMS) simulation
    return this.applyMockNMS(detections);
  }

  private applyMockNMS(detections: Detection[]): Detection[] {
    // Simple mock NMS - remove overlapping detections
    const filteredDetections: Detection[] = [];
    
    for (const detection of detections) {
      let isOverlapping = false;
      
      for (const existing of filteredDetections) {
        if (this.calculateIoU(detection.boundingBox, existing.boundingBox) > this.config.nmsThreshold) {
          // Keep the one with higher confidence
          if (detection.confidence > existing.confidence) {
            const index = filteredDetections.indexOf(existing);
            filteredDetections.splice(index, 1);
          } else {
            isOverlapping = true;
            break;
          }
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
    // Simplified IoU calculation for mock NMS
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

  updateConfig(newConfig: Partial<YOLOModelConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('YOLO config updated:', this.config);
  }

  isLoaded(): boolean {
    return this.isModelLoaded;
  }

  dispose(): void {
    // TODO: Cleanup model resources
    this.isModelLoaded = false;
    console.log('YOLO detection engine disposed');
  }
}

// Default YOLO configuration
export const DEFAULT_YOLO_CONFIG: YOLOModelConfig = {
  inputSize: 640,
  confidenceThreshold: 0.5,
  nmsThreshold: 0.4,
  maxDetections: 10,
};

// Factory function
export const createYOLOEngine = (config?: Partial<YOLOModelConfig>): YOLODetectionEngine => {
  const finalConfig = { ...DEFAULT_YOLO_CONFIG, ...config };
  return new YOLODetectionEngine(finalConfig);
};