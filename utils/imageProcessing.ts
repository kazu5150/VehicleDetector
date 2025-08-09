/**
 * Image processing utilities for vehicle detection
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedFrame {
  uri: string;
  dimensions: ImageDimensions;
  timestamp: number;
}

/**
 * Resize image to model input size while maintaining aspect ratio
 */
export const resizeImageForModel = (
  originalDimensions: ImageDimensions,
  targetSize: number = 640 // YOLO standard input size
): ImageDimensions => {
  const { width, height } = originalDimensions;
  const aspectRatio = width / height;

  if (aspectRatio > 1) {
    // Landscape orientation
    return {
      width: targetSize,
      height: Math.round(targetSize / aspectRatio),
    };
  } else {
    // Portrait orientation
    return {
      width: Math.round(targetSize * aspectRatio),
      height: targetSize,
    };
  }
};

/**
 * Convert screen coordinates to model coordinates
 */
export const screenToModelCoordinates = (
  screenCoords: { x: number; y: number; width: number; height: number },
  screenDimensions: ImageDimensions,
  modelDimensions: ImageDimensions
) => {
  const scaleX = modelDimensions.width / screenDimensions.width;
  const scaleY = modelDimensions.height / screenDimensions.height;

  return {
    x: screenCoords.x * scaleX,
    y: screenCoords.y * scaleY,
    width: screenCoords.width * scaleX,
    height: screenCoords.height * scaleY,
  };
};

/**
 * Convert model coordinates back to screen coordinates
 */
export const modelToScreenCoordinates = (
  modelCoords: { x: number; y: number; width: number; height: number },
  screenDimensions: ImageDimensions,
  modelDimensions: ImageDimensions
) => {
  const scaleX = screenDimensions.width / modelDimensions.width;
  const scaleY = screenDimensions.height / modelDimensions.height;

  return {
    x: modelCoords.x * scaleX,
    y: modelCoords.y * scaleY,
    width: modelCoords.width * scaleX,
    height: modelCoords.height * scaleY,
  };
};

/**
 * Calculate frame processing rate limiter
 */
export class FrameRateLimiter {
  private lastProcessTime = 0;
  private targetInterval: number;

  constructor(targetFPS: number) {
    this.targetInterval = 1000 / targetFPS; // milliseconds per frame
  }

  shouldProcessFrame(): boolean {
    const now = Date.now();
    if (now - this.lastProcessTime >= this.targetInterval) {
      this.lastProcessTime = now;
      return true;
    }
    return false;
  }

  updateTargetFPS(fps: number): void {
    this.targetInterval = 1000 / fps;
  }

  reset(): void {
    this.lastProcessTime = 0;
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private processingTimes: number[] = [];
  private maxSamples = 30; // Keep last 30 measurements

  startMeasurement(): number {
    return Date.now();
  }

  endMeasurement(startTime: number): number {
    const processingTime = Date.now() - startTime;
    this.processingTimes.push(processingTime);
    
    // Keep only recent measurements
    if (this.processingTimes.length > this.maxSamples) {
      this.processingTimes.shift();
    }
    
    return processingTime;
  }

  getAverageProcessingTime(): number {
    if (this.processingTimes.length === 0) return 0;
    
    const sum = this.processingTimes.reduce((a, b) => a + b, 0);
    return sum / this.processingTimes.length;
  }

  getCurrentFPS(): number {
    const avgProcessingTime = this.getAverageProcessingTime();
    return avgProcessingTime > 0 ? Math.round(1000 / avgProcessingTime) : 0;
  }

  reset(): void {
    this.processingTimes = [];
  }
}