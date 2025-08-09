import { Detection } from '@/components/DetectionOverlay';
import { ExpoMLEngine, createExpoMLEngine, DEFAULT_ML_CONFIG } from './ExpoMLEngine';

// Vehicle detection service using YOLO model
export interface VehicleDetectionConfig {
  confidenceThreshold: number;
  maxDetections: number;
  modelPath?: string;
}

export class VehicleDetectionService {
  private config: VehicleDetectionConfig;
  private isInitialized = false;
  private mlEngine: ExpoMLEngine;

  constructor(config: VehicleDetectionConfig) {
    this.config = config;
    
    // Initialize ML engine with matching configuration
    this.mlEngine = createExpoMLEngine({
      confidenceThreshold: config.confidenceThreshold,
      maxDetections: config.maxDetections,
    });
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing vehicle detection service...');
      
      // Load ML model
      const modelLoaded = await this.mlEngine.loadModel(this.config.modelPath);
      
      if (modelLoaded) {
        this.isInitialized = true;
        console.log('Vehicle detection service initialized successfully');
        return true;
      } else {
        console.error('Failed to load ML model');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize vehicle detection service:', error);
      return false;
    }
  }

  async detectVehicles(imageUri: string): Promise<Detection[]> {
    if (!this.isInitialized) {
      throw new Error('Detection service not initialized');
    }

    try {
      // Use ML engine for detection
      const detections = await this.mlEngine.processImage(imageUri);
      return detections;
    } catch (error) {
      console.error('Vehicle detection failed:', error);
      return [];
    }
  }


  updateConfig(config: Partial<VehicleDetectionConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Update ML engine configuration
    this.mlEngine.updateConfig({
      confidenceThreshold: this.config.confidenceThreshold,
      maxDetections: this.config.maxDetections,
    });
    
    console.log('Detection config updated:', this.config);
  }

  dispose(): void {
    // Cleanup detection service resources
    this.mlEngine.dispose();
    this.isInitialized = false;
    console.log('Vehicle detection service disposed');
  }

  getConfig(): VehicleDetectionConfig {
    return { ...this.config };
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Factory function for creating detection service
export const createVehicleDetectionService = (config: VehicleDetectionConfig): VehicleDetectionService => {
  return new VehicleDetectionService(config);
};

// Default configuration
export const DEFAULT_DETECTION_CONFIG: VehicleDetectionConfig = {
  confidenceThreshold: 0.7,
  maxDetections: 8,
  modelPath: 'assets/models/yolov5s.mlmodel', // TODO: Add actual model file
};