import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './ThemedText';

interface ControlPanelProps {
  isDetectionEnabled: boolean;
  onToggleDetection: () => void;
  onSettings: () => void;
  onAbout?: () => void;
}

export default function ControlPanel({
  isDetectionEnabled,
  onToggleDetection,
  onSettings,
  onAbout,
}: ControlPanelProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { 
      paddingTop: insets.top + 10,
      paddingBottom: Math.max(insets.bottom + 80, 160), // Ensure buttons are well above home indicator and tab bar
    }]}>
      {/* Top controls */}
      <View style={styles.topControls}>
        {onAbout && (
          <TouchableOpacity style={styles.topButton} onPress={onAbout}>
            <Ionicons name="information-circle" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.topButton} onPress={onSettings}>
          <Ionicons name="settings" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            { backgroundColor: isDetectionEnabled ? '#FF4444' : '#00FF00' } // Bright green background
          ]}
          onPress={onToggleDetection}
        >
          <Ionicons 
            name={isDetectionEnabled ? "stop" : "play"} 
            size={24} 
            color={isDetectionEnabled ? "#FFFFFF" : "#003366"} // Dark blue for bright green background
          />
          <ThemedText style={[
            styles.buttonText,
            { color: isDetectionEnabled ? '#FFFFFF' : '#003366' } // Dark blue text for bright green
          ]}>
            {isDetectionEnabled ? '検出停止' : '検出開始'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start', // Align to top to avoid overlap with status bar
    marginTop: 10, // Add some margin from the safe area
  },
  topButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    minWidth: 180,
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});