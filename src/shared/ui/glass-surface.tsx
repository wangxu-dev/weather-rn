import { BlurView } from 'expo-blur';
import {
  GlassContainer,
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from 'expo-glass-effect';
import React from 'react';
import { Platform, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

type GlassSurfaceProps = ViewProps & {
  tintColor?: string;
  borderColor?: string;
  fallbackColor?: string;
  colorScheme?: 'auto' | 'light' | 'dark';
  glassEffectStyle?: 'regular' | 'clear' | 'none';
};

type GlassGroupProps = ViewProps & {
  spacing?: number;
};

const nativeGlassAvailable =
  Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();

export function GlassGroup({ spacing = 20, children, ...props }: GlassGroupProps) {
  if (nativeGlassAvailable) {
    return (
      <GlassContainer spacing={spacing} {...props}>
        {children}
      </GlassContainer>
    );
  }

  return <View {...props}>{children}</View>;
}

export function GlassSurface({
  style,
  children,
  tintColor,
  borderColor,
  fallbackColor,
  colorScheme = 'auto',
  glassEffectStyle = 'regular',
  ...props
}: GlassSurfaceProps) {
  const baseStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
  const overlayStyle = [
    styles.overlay,
    {
      borderRadius: baseStyle?.borderRadius ?? 0,
      borderColor: borderColor ?? 'transparent',
      backgroundColor: fallbackColor ?? 'transparent',
    },
  ];

  if (nativeGlassAvailable) {
    return (
      <GlassView
        {...props}
        glassEffectStyle={glassEffectStyle}
        tintColor={tintColor}
        colorScheme={colorScheme}
        style={[styles.base, style]}>
        <View pointerEvents="none" style={overlayStyle} />
        {children}
      </GlassView>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        {...props}
        intensity={55}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={[styles.base, style]}>
        <View pointerEvents="none" style={overlayStyle} />
        {children}
      </BlurView>
    );
  }

  return (
    <View {...props} style={[styles.base, style]}>
      <View pointerEvents="none" style={overlayStyle} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
});
