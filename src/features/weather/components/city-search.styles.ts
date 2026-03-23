import { StyleSheet } from 'react-native';

import { useAppTheme } from '@/shared/theme/use-app-theme';

export function createCitySearchStyles(tokens: ReturnType<typeof useAppTheme>['tokens']) {
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
      maxWidth: 280,
    },
    searchFieldWrap: {
      minHeight: 48,
      justifyContent: 'center',
    },
    searchHost: {
      alignSelf: 'stretch',
    },
    searchInputShell: {
      borderRadius: 24,
      minHeight: 52,
      justifyContent: 'center',
    },
    searchInput: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      paddingHorizontal: 18,
      paddingVertical: 14,
    },
    section: {
      gap: tokens.spacing.sm,
    },
    sectionTitle: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    sectionHint: {
      color: tokens.colors.textSecondary,
      fontSize: 12,
      lineHeight: 16,
      marginBottom: 2,
    },
    list: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.divider,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.md,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
      backgroundColor: 'transparent',
    },
    rowCopy: {
      flex: 1,
      gap: 4,
    },
    cityName: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    cityMeta: {
      color: tokens.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
  });
}

export type CitySearchStyles = ReturnType<typeof createCitySearchStyles>;
