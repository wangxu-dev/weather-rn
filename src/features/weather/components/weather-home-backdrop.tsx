import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

import type { AppThemeTokens } from '@/shared/theme/tokens';

import type { WeatherHomeStyles } from './weather-home.styles';

type WeatherBackdropProps = {
  children: React.ReactNode;
  styles: WeatherHomeStyles;
  tokens: AppThemeTokens;
};

export function WeatherBackdrop({ children, styles, tokens }: WeatherBackdropProps) {
  return (
    <LinearGradient
      colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}>
      <View pointerEvents="none" style={styles.skyGlowLarge} />
      <View pointerEvents="none" style={styles.skyGlowSmall} />
      <LinearGradient
        colors={[tokens.colors.backgroundHaze, 'transparent']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 0.7 }}
        pointerEvents="none"
        style={styles.sunHaze}
      />
      {children}
    </LinearGradient>
  );
}
