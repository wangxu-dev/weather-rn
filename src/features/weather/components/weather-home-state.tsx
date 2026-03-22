import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { motion } from '@/shared/animation/motion';

import type { WeatherHomeStyles } from './weather-home.styles';

type WeatherStateProps = {
  title: string;
  copy: string;
  styles: WeatherHomeStyles;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function WeatherHomeState({ title, copy, styles, actionLabel, onActionPress }: WeatherStateProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
      style={styles.stateContainer}>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateCopy}>{copy}</Text>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress} style={styles.inlineButton}>
          <Text style={styles.inlineButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
