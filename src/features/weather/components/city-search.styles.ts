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
    searchInput: {
      color: tokens.colors.textPrimary,
      fontSize: 20,
      paddingVertical: 0,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
      paddingBottom: tokens.spacing.sm,
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
      fontSize: 14,
      lineHeight: 20,
      marginBottom: tokens.spacing.xs,
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
    statusText: {
      color: tokens.colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    statusTextActive: {
      color: tokens.colors.accent,
    },
    deleteAction: {
      width: 92,
      justifyContent: 'center',
      alignItems: 'flex-end',
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    deleteButton: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: '#ff5b57',
      borderRadius: 16,
      marginVertical: 8,
      marginLeft: 14,
    },
    deleteText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
    },
  });
}

export type CitySearchStyles = ReturnType<typeof createCitySearchStyles>;
