import { StyleSheet } from 'react-native';

import type { AppThemeTokens } from '@/shared/theme/tokens';

export function createWeatherHomeShellStyles(tokens: AppThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.backgroundTop,
    },
    safeArea: {
      flex: 1,
    },
    skyGlowLarge: {
      position: 'absolute',
      top: 64,
      right: -18,
      width: 248,
      height: 248,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbPrimary,
    },
    skyGlowSmall: {
      position: 'absolute',
      top: 238,
      left: -42,
      width: 176,
      height: 176,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbSecondary,
    },
    sunHaze: {
      position: 'absolute',
      top: 58,
      left: 24,
      width: 240,
      height: 240,
      borderRadius: 999,
    },
    content: {
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.md,
      paddingBottom: tokens.spacing.xxl,
      gap: tokens.spacing.xl,
    },
    stateContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: tokens.spacing.xl,
      gap: tokens.spacing.sm,
    },
    stateTitle: {
      color: tokens.colors.textPrimary,
      fontSize: 32,
      fontWeight: '700',
    },
    stateCopy: {
      color: tokens.colors.textSecondary,
      fontSize: 16,
      lineHeight: 24,
      maxWidth: 280,
    },
    inlineButton: {
      alignSelf: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: tokens.radius.full,
      borderWidth: 1,
      borderColor: tokens.colors.buttonBorder,
      backgroundColor: tokens.colors.buttonBackground,
    },
    inlineButtonText: {
      color: tokens.colors.buttonText,
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: tokens.spacing.md,
    },
    headerCopy: {
      flex: 1,
      gap: 4,
    },
    brand: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    cityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    city: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.city,
      fontWeight: '700',
      letterSpacing: -1.4,
    },
    locationDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: tokens.colors.accent,
      marginTop: 4,
    },
    snapshotContent: {
      gap: tokens.spacing.xl,
    },
  });
}
