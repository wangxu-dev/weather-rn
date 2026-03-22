import { StyleSheet } from 'react-native';

import { useAppTheme } from '@/shared/theme/use-app-theme';

export function createSettingsStyles(tokens: ReturnType<typeof useAppTheme>['tokens']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.backgroundTop,
    },
    safeArea: {
      flex: 1,
    },
    glowLarge: {
      position: 'absolute',
      top: 84,
      right: -30,
      width: 220,
      height: 220,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbPrimary,
    },
    glowSmall: {
      position: 'absolute',
      bottom: 120,
      left: -40,
      width: 180,
      height: 180,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbSecondary,
    },
    content: {
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.md,
      paddingBottom: tokens.spacing.xxl,
      gap: tokens.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: tokens.spacing.md,
    },
    headerCopy: {
      flex: 1,
      gap: 6,
    },
    eyebrow: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 4,
    },
    title: {
      color: tokens.colors.textPrimary,
      fontSize: 34,
      fontWeight: '700',
      letterSpacing: -1.2,
    },
    subtitle: {
      color: tokens.colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      maxWidth: 300,
    },
    section: {
      gap: tokens.spacing.sm,
      paddingTop: tokens.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.divider,
    },
    sectionTitle: {
      color: tokens.colors.textPrimary,
      fontSize: 20,
      fontWeight: '600',
    },
    sectionNote: {
      color: tokens.colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      maxWidth: 320,
    },
    nativeControlWrap: {
      paddingTop: tokens.spacing.sm,
    },
    nativeControlHost: {
      alignSelf: 'stretch',
    },
    optionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: tokens.radius.full,
      borderWidth: 1,
      borderColor: tokens.colors.divider,
      backgroundColor: 'transparent',
    },
    chipActive: {
      borderColor: tokens.colors.accent,
      backgroundColor: tokens.colors.accentSoft,
    },
    chipText: {
      color: tokens.colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    chipTextActive: {
      color: tokens.colors.textPrimary,
      fontWeight: '600',
    },
  });
}

export type SettingsStyles = ReturnType<typeof createSettingsStyles>;
