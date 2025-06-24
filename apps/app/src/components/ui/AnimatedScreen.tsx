import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

interface AnimatedScreenProps {
  children: React.ReactNode;
  duration?: number;
  enterY?: number;
  exitY?: number;
  style?: any;
}

export function AnimatedScreen({
  children,
  duration = 250,
  enterY = 20,
  exitY = 20,
  style,
}: AnimatedScreenProps) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(enterY);

  useEffect(() => {
    if (isFocused) {
      opacity.value = withTiming(1, { duration });
      translateY.value = withTiming(0, { duration });
    } else {
      opacity.value = withTiming(0, { duration });
      translateY.value = withTiming(exitY, { duration });
    }
  }, [isFocused, duration, enterY, exitY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
} 