import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
// import LottieView from 'lottie-react-native'; // TODO: Implement Lottie in future

interface BentoCardProps {
  title: string;
  subtitle?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  // lottieSource?: any; // e.g. require('../assets/animations/rocket.json')
  onPress?: () => void;
  size?: 'small' | 'large';
  colorOverride?: string;
  style?: StyleProp<ViewStyle>;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  title, subtitle, iconName, onPress, size = 'small', colorOverride, style 
}) => {
  const { colors, roundness, borderWidth, shadows, mode } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const isBrutal = mode === 'coding';
  const cardColor = colorOverride || colors.card;
  const borderCol = isBrutal ? colors.border : 'transparent';

  return (
    <Animated.View style={[
      styles.base,
      {
        backgroundColor: cardColor,
        borderRadius: roundness,
        borderWidth: borderWidth,
        borderColor: borderCol,
        ...shadows.md,
      },
      size === 'large' ? styles.large : styles.small,
      animatedStyle,
      style
    ]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <View style={styles.headerRow}>
          {iconName && (
            <View style={[styles.iconBox, { backgroundColor: isBrutal ? colors.background : `${colors.primary}20` }]}>
              <Ionicons name={iconName} size={28} color={isBrutal ? colors.primary : colors.primary} />
            </View>
          )}

          {/* FUTURE LOTTIE IMPLEMENTATION
          {lottieSource && (
            <LottieView 
              source={lottieSource} 
              autoPlay 
              loop 
              style={{ width: 50, height: 50 }} 
            />
          )}
          */}
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text, fontFamily: isBrutal ? 'monospace' : undefined }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: isBrutal ? colors.accent : '#718096' }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    margin: 8,
  },
  small: {
    flex: 1, // Will share space in a row
    aspectRatio: 1, // Makes it a square
  },
  large: {
    width: '100%', // Spans full row
    height: 160,
  },
  pressable: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconBox: {
    padding: 12,
    borderRadius: 16,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  }
});

export default BentoCard;
