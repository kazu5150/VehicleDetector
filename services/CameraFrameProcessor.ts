/**
 * Camera Frame Processing Service
 * Handles real-time frame capture and preparation for ML inference
 */

import { Detection } from '@/components/DetectionOverlay';
import { VehicleDetectionService } from './VehicleDetectionService';

export interface FrameProcessingConfig {
  targetFPS: number;
  skipFrames: number;      // Skip N frames between detections
  maxConcurrent: number;   // Max concurrent processing operations
  imageQuality: number;    // 0.1 to 1.0
}

export interface CameraFrame {
  uri: string;
  width: number;
  height: number;
  timestamp: number;
}

export interface ProcessingStats {
  framesProcessed: number;
  averageProcessingTime: number;
  currentFPS: number;
  droppedFrames: number;
}

export class CameraFrameProcessor {
  private config: FrameProcessingConfig;
  private detectionService: VehicleDetectionService;
  private isProcessing = false;
  private frameCount = 0;
  private skippedFrames = 0;
  private processingQueue: CameraFrame[] = [];
  private stats: ProcessingStats = {
    framesProcessed: 0,
    averageProcessingTime: 0,
    currentFPS: 0,
    droppedFrames: 0,
  };
  private performanceMetrics: number[] = [];

  constructor(
    detectionService: VehicleDetectionService,
    config: FrameProcessingConfig
  ) {
    this.detectionService = detectionService;
    this.config = config;
  }

  async processFrame(frame: CameraFrame): Promise<Detection[]> {
    if (!this.detectionService.isReady()) {
      console.warn('Detection service not ready, skipping frame');
      return [];
    }

    // Frame rate limiting
    this.frameCount++;
    if (this.frameCount <= this.config.skipFrames) {
      this.skippedFrames++;
      return [];
    }
    this.frameCount = 0;

    // Prevent queue overflow
    if (this.processingQueue.length >= this.config.maxConcurrent) {
      this.stats.droppedFrames++;
      console.log('Processing queue full, dropping frame');
      return [];
    }

    const startTime = Date.now();

    try {
      this.isProcessing = true;
      this.processingQueue.push(frame);

      // Process the frame
      const detections = await this.detectionService.detectVehicles(frame.uri);

      // Update performance metrics
      const processingTime = Date.now() - startTime;
      this.updatePerformanceStats(processingTime);

      // Remove from queue
      const queueIndex = this.processingQueue.findIndex(f => f.uri === frame.uri);
      if (queueIndex >= 0) {
        this.processingQueue.splice(queueIndex, 1);
      }

      return detections;
    } catch (error) {
      console.error('Frame processing error:', error);
      return [];
    } finally {
      this.isProcessing = false;
    }
  }

  private updatePerformanceStats(processingTime: number): void {
    this.stats.framesProcessed++;
    
    // Keep last 30 processing times for average calculation
    this.performanceMetrics.push(processingTime);
    if (this.performanceMetrics.length > 30) {
      this.performanceMetrics.shift();
    }

    // Calculate average processing time
    const sum = this.performanceMetrics.reduce((a, b) => a + b, 0);
    this.stats.averageProcessingTime = sum / this.performanceMetrics.length;

    // Estimate current FPS
    if (this.stats.averageProcessingTime > 0) {
      this.stats.currentFPS = Math.min(
        this.config.targetFPS,
        1000 / this.stats.averageProcessingTime
      );
    }
  }

  // Method to capture frame from camera (placeholder for actual implementation)
  async captureFrameFromCamera(): Promise<CameraFrame | null> {
    try {
      // TODO: Implement actual camera frame capture using expo-camera
      // This would involve:
      // 1. Taking a picture or capturing video frame
      // 2. Converting to appropriate format
      // 3. Resizing/preprocessing for ML model

      // For now, return mock frame data
      return {
        uri: `mock://frame_${Date.now()}`,
        width: 640,
        height: 640,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Camera capture error:', error);
      return null;
    }
  }

  // Optimize frame for ML processing
  private async optimizeFrame(frame: CameraFrame): Promise<CameraFrame> {
    // TODO: Implement frame optimization
    // - Resize to model input size (640x640)
    // - Adjust brightness/contrast if needed
    // - Convert color space if required
    // - Compress to reduce processing time
    
    return {
      ...frame,
      // Apply optimizations here
    };
  }

  // Batch processing for multiple frames
  async processBatch(frames: CameraFrame[]): Promise<Detection[][]> {
    const results: Detection[][] = [];
    
    for (const frame of frames) {
      const detections = await this.processFrame(frame);
      results.push(detections);
    }
    
    return results;
  }

  getStats(): ProcessingStats {
    return { ...this.stats };
  }

  updateConfig(newConfig: Partial<FrameProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('Frame processor config updated:', this.config);
  }

  reset(): void {
    this.frameCount = 0;
    this.skippedFrames = 0;
    this.processingQueue = [];
    this.stats = {
      framesProcessed: 0,
      averageProcessingTime: 0,
      currentFPS: 0,
      droppedFrames: 0,
    };
    this.performanceMetrics = [];
    console.log('Frame processor reset');
  }

  isIdle(): boolean {
    return !this.isProcessing && this.processingQueue.length === 0;
  }

  getQueueSize(): number {
    return this.processingQueue.length;
  }

  dispose(): void {
    this.reset();
    console.log('Camera frame processor disposed');
  }
}

// Default configuration optimized for mobile performance
export const DEFAULT_FRAME_CONFIG: FrameProcessingConfig = {
  targetFPS: 10,        // Target 10 FPS for real-time feel
  skipFrames: 2,        // Process every 3rd frame
  maxConcurrent: 2,     // Max 2 concurrent operations
  imageQuality: 0.7,    // 70% quality for balance of speed/accuracy
};

// Factory function
export const createCameraFrameProcessor = (
  detectionService: VehicleDetectionService,
  config?: Partial<FrameProcessingConfig>
): CameraFrameProcessor => {
  const finalConfig = { ...DEFAULT_FRAME_CONFIG, ...config };
  return new CameraFrameProcessor(detectionService, finalConfig);
};