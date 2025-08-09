import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CameraView from '@/components/CameraView';
import DetectionOverlay, { Detection } from '@/components/DetectionOverlay';
import ControlPanel from '@/components/ControlPanel';
import SettingsModal, { DetectionSettings } from '@/components/SettingsModal';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [isDetectionEnabled, setIsDetectionEnabled] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DetectionSettings>({
    confidenceThreshold: 0.8,
    detectionFPS: 5,
    showFPS: true,
    showConfidence: true,
  });

  // Mock detection data for testing (will be replaced with actual ML detection)
  const [mockDetectionIndex, setMockDetectionIndex] = useState(0);
  
  const mockDetections: Detection[][] = React.useMemo(() => [
    [],
    [
      {
        id: '1',
        class: 'car',
        confidence: 0.85,
        boundingBox: { x: 50, y: 200, width: 150, height: 100 },
      },
    ],
    [
      {
        id: '1',
        class: 'car',
        confidence: 0.92,
        boundingBox: { x: 60, y: 180, width: 160, height: 110 },
      },
      {
        id: '2',
        class: 'truck',
        confidence: 0.78,
        boundingBox: { x: 250, y: 300, width: 200, height: 150 },
      },
    ],
    [
      {
        id: '1',
        class: 'bus',
        confidence: 0.89,
        boundingBox: { x: 100, y: 250, width: 220, height: 140 },
      },
    ],
  ], []);

  // Simulate detection updates when detection is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isDetectionEnabled) {
      interval = setInterval(() => {
        setMockDetectionIndex((prev) => (prev + 1) % mockDetections.length);
      }, 1000 / settings.detectionFPS);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDetectionEnabled, settings.detectionFPS, mockDetections.length]);

  // Update detections based on mock data and settings
  useEffect(() => {
    if (isDetectionEnabled) {
      const currentDetections = mockDetections[mockDetectionIndex];
      const filteredDetections = currentDetections.filter(
        detection => detection.confidence >= settings.confidenceThreshold
      );
      setDetections(filteredDetections);
    } else {
      setDetections([]);
    }
  }, [mockDetectionIndex, isDetectionEnabled, settings.confidenceThreshold, mockDetections]);

  const handleToggleDetection = () => {
    setIsDetectionEnabled(prev => !prev);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };


  const handleSettingsChange = (newSettings: DetectionSettings) => {
    setSettings(newSettings);
  };

  const handleDetection = (newDetections: Detection[]) => {
    setDetections(newDetections);
  };

  // Hide status bar for fullscreen camera view
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setHidden(true);
      return () => StatusBar.setHidden(false);
    }, [])
  );

  return (
    <View style={styles.container}>
      <CameraView
        onDetection={handleDetection}
        isDetectionEnabled={isDetectionEnabled}
      />
      
      {isDetectionEnabled && (
        <DetectionOverlay
          detections={detections}
          screenWidth={width}
          screenHeight={height}
        />
      )}
      
      <ControlPanel
        isDetectionEnabled={isDetectionEnabled}
        onToggleDetection={handleToggleDetection}
        onSettings={handleSettings}
      />

      <SettingsModal
        visible={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={handleSettingsChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
