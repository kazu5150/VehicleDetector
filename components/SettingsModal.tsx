import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export interface DetectionSettings {
  confidenceThreshold: number;
  detectionFPS: number;
  showFPS: boolean;
  showConfidence: boolean;
}

interface SettingsModalProps {
  visible: boolean;
  settings: DetectionSettings;
  onClose: () => void;
  onSettingsChange: (settings: DetectionSettings) => void;
}

export default function SettingsModal({
  visible,
  settings,
  onClose,
  onSettingsChange,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<DetectionSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  const updateSetting = <K extends keyof DetectionSettings>(
    key: K,
    value: DetectionSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <ThemedText style={styles.cancelText}>キャンセル</ThemedText>
          </TouchableOpacity>
          
          <ThemedText style={[styles.title, { color: '#000000' }]}>検出設定</ThemedText>
          
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={styles.saveText}>保存</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Settings Content */}
        <View style={styles.content}>
          {/* Confidence Threshold */}
          <View style={styles.settingItem}>
            <ThemedText style={[styles.settingLabel, { color: '#000000' }]}>
              信頼度の閾値: {Math.round(localSettings.confidenceThreshold * 100)}%
            </ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={0.9}
              value={localSettings.confidenceThreshold}
              onValueChange={(value: number) => updateSetting('confidenceThreshold', value)}
              minimumTrackTintColor="#00FF00"
              maximumTrackTintColor="#CCCCCC"
              thumbStyle={styles.sliderThumb}
            />
            <ThemedText style={[styles.settingDescription, { color: '#666666' }]}>
              高い値に設定すると、より確信度の高い検出のみを表示します
            </ThemedText>
          </View>

          {/* Detection FPS */}
          <View style={styles.settingItem}>
            <ThemedText style={[styles.settingLabel, { color: '#000000' }]}>
              検出FPS: {localSettings.detectionFPS}
            </ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={localSettings.detectionFPS}
              onValueChange={(value: number) => updateSetting('detectionFPS', value)}
              minimumTrackTintColor="#00FF00"
              maximumTrackTintColor="#CCCCCC"
              thumbStyle={styles.sliderThumb}
            />
            <ThemedText style={[styles.settingDescription, { color: '#666666' }]}>
              高いFPSはより多くのバッテリーと処理能力を使用します
            </ThemedText>
          </View>

          {/* Show FPS Toggle */}
          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <ThemedText style={[styles.settingLabel, { color: '#000000' }]}>FPS表示</ThemedText>
              <ThemedText style={[styles.settingDescription, { color: '#666666' }]}>
                ステータスバーにフレームレートを表示
              </ThemedText>
            </View>
            <Switch
              value={localSettings.showFPS}
              onValueChange={(value) => updateSetting('showFPS', value)}
              trackColor={{ false: '#767577', true: '#00FF00' }}
              thumbColor={localSettings.showFPS ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>

          {/* Show Confidence Toggle */}
          <View style={styles.toggleItem}>
            <View style={styles.toggleContent}>
              <ThemedText style={[styles.settingLabel, { color: '#000000' }]}>信頼度表示</ThemedText>
              <ThemedText style={[styles.settingDescription, { color: '#666666' }]}>
                検出ラベルに信頼度の割合を表示
              </ThemedText>
            </View>
            <Switch
              value={localSettings.showConfidence}
              onValueChange={(value) => updateSetting('showConfidence', value)}
              trackColor={{ false: '#767577', true: '#00FF00' }}
              thumbColor={localSettings.showConfidence ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: '#000000' }]}>
            VehicleDetector v1.0.0
          </ThemedText>
          <ThemedText style={[styles.footerSubText, { color: '#666666' }]}>
            YOLOを使用したリアルタイム車両検出
          </ThemedText>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  cancelButton: {
    paddingVertical: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  saveButton: {
    paddingVertical: 5,
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 8,
    color: '#666666',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#00FF00',
  },
  toggleItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContent: {
    flex: 1,
    marginRight: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  footerSubText: {
    fontSize: 14,
    color: '#666666',
  },
});