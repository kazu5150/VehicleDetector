import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

export interface Detection {
  id: string;
  class: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface DetectionOverlayProps {
  detections: Detection[];
  screenWidth: number;
  screenHeight: number;
}

const VEHICLE_COLORS = {
  car: '#00FF00',      // Green
  truck: '#FF8C00',    // Orange
  bus: '#1E90FF',      // Blue
  default: '#00FF00',  // Default green
};

export default function DetectionOverlay({ 
  detections, 
  screenWidth, 
  screenHeight 
}: DetectionOverlayProps) {
  if (!detections || detections.length === 0) {
    return null;
  }

  return (
    <View style={[styles.overlay, { width: screenWidth, height: screenHeight }]}>
      <Svg
        width={screenWidth}
        height={screenHeight}
        style={StyleSheet.absoluteFillObject}
      >
        {detections.map((detection) => {
          const color = VEHICLE_COLORS[detection.class as keyof typeof VEHICLE_COLORS] 
            || VEHICLE_COLORS.default;
          
          const { x, y, width, height } = detection.boundingBox;
          
          return (
            <React.Fragment key={detection.id}>
              {/* Detection box */}
              <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                stroke={color}
                strokeWidth={3}
                fill="transparent"
              />
              
              {/* Label background */}
              <Rect
                x={x}
                y={Math.max(0, y - 25)}
                width={Math.min(screenWidth - x, 120)}
                height={25}
                fill={color}
                opacity={0.8}
              />
              
              {/* Label text */}
              <SvgText
                x={x + 5}
                y={Math.max(15, y - 8)}
                fontSize="12"
                fill="#000000"
                fontWeight="bold"
              >
                {`${detection.class} ${Math.round(detection.confidence * 100)}%`}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      
      {/* Detection count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          検出数: {detections.length}台
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
  countContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});