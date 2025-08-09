import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CameraView from '@/components/CameraView';
import DetectionOverlay, { Detection } from '@/components/DetectionOverlay';
import ControlPanel from '@/components/ControlPanel';
import SettingsModal, { DetectionSettings } from '@/components/SettingsModal';
import { useVehicleDetection } from '@/hooks/useVehicleDetection';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DetectionSettings>({
    confidenceThreshold: 0.8,
    detectionFPS: 5,
    showFPS: true,
    showConfidence: true,
  });

  // Use the vehicle detection service
  const {
    detections,
    isDetectionReady, // TODO: Use for loading state indication
    isDetecting: isDetectionEnabled,
    currentFPS,
    startDetection,
    stopDetection,
    updateConfig,
  } = useVehicleDetection({
    confidenceThreshold: settings.confidenceThreshold,
    detectionFPS: settings.detectionFPS,
    maxDetections: 10,
  });

  // Suppress unused variable warning - will be used for loading state
  console.log('Detection service ready:', isDetectionReady);

  const handleToggleDetection = () => {
    if (isDetectionEnabled) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleSettingsChange = (newSettings: DetectionSettings) => {
    setSettings(newSettings);
    
    // Update detection service configuration
    updateConfig({
      confidenceThreshold: newSettings.confidenceThreshold,
      detectionFPS: newSettings.detectionFPS,
    });
  };

  const handleDetection = (newDetections: Detection[]) => {
    // This method is now handled by the detection service
    console.log('Detection results:', newDetections);
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
        currentFPS={currentFPS}
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
