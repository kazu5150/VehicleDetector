import { useState, useEffect, useRef, useCallback } from 'react';
import { Detection } from '@/components/DetectionOverlay';
import { 
  VehicleDetectionService, 
  createVehicleDetectionService, 
  DEFAULT_DETECTION_CONFIG,
  VehicleDetectionConfig 
} from '@/services/VehicleDetectionService';
import { FrameRateLimiter, PerformanceMonitor } from '@/utils/imageProcessing';

export interface UseVehicleDetectionConfig {
  confidenceThreshold: number;
  detectionFPS: number;
  maxDetections?: number;
}

export interface UseVehicleDetectionReturn {
  detections: Detection[];
  isDetectionReady: boolean;
  isDetecting: boolean;
  currentFPS: number;
  averageProcessingTime: number;
  startDetection: () => void;
  stopDetection: () => void;
  updateConfig: (config: Partial<UseVehicleDetectionConfig>) => void;
  processFrame: (imageUri: string) => Promise<void>;
}

export const useVehicleDetection = (
  initialConfig: UseVehicleDetectionConfig
): UseVehicleDetectionReturn => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isDetectionReady, setIsDetectionReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(0);
  const [averageProcessingTime, setAverageProcessingTime] = useState(0);

  const detectionServiceRef = useRef<VehicleDetectionService | null>(null);
  const frameRateLimiterRef = useRef<FrameRateLimiter>(
    new FrameRateLimiter(initialConfig.detectionFPS)
  );
  const performanceMonitorRef = useRef<PerformanceMonitor>(new PerformanceMonitor());
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize detection service
  useEffect(() => {
    const initializeService = async () => {
      try {
        console.log('Initializing vehicle detection service...');
        
        const config: VehicleDetectionConfig = {
          ...DEFAULT_DETECTION_CONFIG,
          confidenceThreshold: initialConfig.confidenceThreshold,
          maxDetections: initialConfig.maxDetections || 10,
        };

        const service = createVehicleDetectionService(config);
        const initialized = await service.initialize();

        if (initialized) {
          detectionServiceRef.current = service;
          setIsDetectionReady(true);
          console.log('Vehicle detection service ready');
        } else {
          console.error('Failed to initialize detection service');
        }
      } catch (error) {
        console.error('Error initializing detection service:', error);
      }
    };

    initializeService();

    // Cleanup on unmount
    return () => {
      if (detectionServiceRef.current) {
        detectionServiceRef.current.dispose();
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Start detection process
  const startDetection = useCallback(() => {
    if (!detectionServiceRef.current || !isDetectionReady) {
      console.warn('Detection service not ready');
      return;
    }

    setIsDetecting(true);
    performanceMonitorRef.current.reset();
    frameRateLimiterRef.current.reset();

    // Start periodic detection simulation
    detectionIntervalRef.current = setInterval(async () => {
      if (frameRateLimiterRef.current.shouldProcessFrame()) {
        await processDetection();
      }
    }, 1000 / initialConfig.detectionFPS);

    console.log('Vehicle detection started');
  }, [isDetectionReady, initialConfig.detectionFPS]);

  // Stop detection process
  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setDetections([]);
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    console.log('Vehicle detection stopped');
  }, []);

  // Process a single frame
  const processFrame = useCallback(async (imageUri: string): Promise<void> => {
    if (!detectionServiceRef.current || !isDetecting) {
      return;
    }

    if (!frameRateLimiterRef.current.shouldProcessFrame()) {
      return;
    }

    await processDetection();
  }, [isDetecting]);

  // Internal detection processing
  const processDetection = useCallback(async () => {
    if (!detectionServiceRef.current) return;

    const startTime = performanceMonitorRef.current.startMeasurement();

    try {
      // For now, we simulate with a mock image URI
      // TODO: Replace with actual camera frame
      const mockImageUri = 'mock://camera/frame';
      const newDetections = await detectionServiceRef.current.detectVehicles(mockImageUri);
      
      setDetections(newDetections);

      const processingTime = performanceMonitorRef.current.endMeasurement(startTime);
      
      // Update performance metrics
      setAverageProcessingTime(performanceMonitorRef.current.getAverageProcessingTime());
      setCurrentFPS(performanceMonitorRef.current.getCurrentFPS());

    } catch (error) {
      console.error('Detection processing error:', error);
    }
  }, []);

  // Update configuration
  const updateConfig = useCallback((config: Partial<UseVehicleDetectionConfig>) => {
    if (detectionServiceRef.current) {
      detectionServiceRef.current.updateConfig({
        confidenceThreshold: config.confidenceThreshold,
        maxDetections: config.maxDetections,
      });
    }

    if (config.detectionFPS) {
      frameRateLimiterRef.current.updateTargetFPS(config.detectionFPS);
      
      // Restart detection interval with new FPS
      if (isDetecting && detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = setInterval(async () => {
          if (frameRateLimiterRef.current.shouldProcessFrame()) {
            await processDetection();
          }
        }, 1000 / config.detectionFPS);
      }
    }

    console.log('Detection config updated:', config);
  }, [isDetecting, processDetection]);

  return {
    detections,
    isDetectionReady,
    isDetecting,
    currentFPS,
    averageProcessingTime,
    startDetection,
    stopDetection,
    updateConfig,
    processFrame,
  };
};