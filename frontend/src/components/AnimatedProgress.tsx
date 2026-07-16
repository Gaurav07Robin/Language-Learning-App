import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface AnimatedProgressProps {
  progress: number; // 0 to 1
  height?: number;
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({ progress, height = 12 }) => {
  const { colors, roundness, borderWidth, mode } = useTheme();
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(progress * 100, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [progress]);

  const stylez = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value}%`,
    };
  });

  const isBrutal = mode === 'coding';

  return (
    <View style={[
      styles.track,
      { 
        height, 
        backgroundColor: isBrutal ? colors.card : '#E2E8F0',
        borderRadius: roundness,
        borderWidth: isBrutal ? borderWidth : 0,
        borderColor: colors.border
      }
    ]}>
      <Animated.View style={[
        styles.fill,
        { 
          backgroundColor: colors.primary,
          borderRadius: roundness,
        },
        stylez
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  }
});

export default AnimatedProgress;
