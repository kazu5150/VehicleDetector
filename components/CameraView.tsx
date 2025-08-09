import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { CameraView as ExpoCamera, useCameraPermissions } from 'expo-camera';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

const { width, height } = Dimensions.get('window');

interface CameraViewProps {
  onDetection?: (detections: any[]) => void;
  isDetectionEnabled: boolean;
}

export default function CameraView({ onDetection, isDetectionEnabled }: CameraViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [fps] = useState(0);
  const cameraRef = useRef<ExpoCamera>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCameraReady = () => {
    console.log('Camera is ready');
  };

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          車両を検出するにはカメラへのアクセスが必要です
        </ThemedText>
        <ThemedText style={styles.subMessage}>
          デバイス設定でカメラアクセスを許可してください
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCamera
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        onCameraReady={handleCameraReady}
      >
        {/* Status overlay */}
        <View style={styles.overlay}>
          <View style={styles.statusBar}>
            <ThemedText style={styles.statusText}>
              検出: {isDetectionEnabled ? 'オン' : 'オフ'}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              FPS: {fps}
            </ThemedText>
          </View>
        </View>
      </ExpoCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  statusBar: {
    position: 'absolute',
    top: 80, // Move down slightly to avoid overlap
    left: 20,
    right: 140, // Leave more space for settings button
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
  },
  subMessage: {
    textAlign: 'center',
    paddingHorizontal: 20,
    fontSize: 14,
    opacity: 0.8,
  },
});