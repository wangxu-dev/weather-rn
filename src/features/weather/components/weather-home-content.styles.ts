import { StyleSheet } from 'react-native';

import type { AppThemeTokens } from '@/shared/theme/tokens';

export function createWeatherHomeContentStyles(tokens: AppThemeTokens) {
  return StyleSheet.create({
    hero: {
      gap: tokens.spacing.md,
    },
    heroMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.md,
    },
    heroEyebrow: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
    },
    heroMetaText: {
      color: tokens.colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    heroMain: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: tokens.spacing.md,
    },
    heroPrimary: {
      flex: 1,
    },
    heroSecondary: {
      alignItems: 'flex-end',
      paddingBottom: 12,
      gap: 6,
    },
    temperature: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.temp,
      fontWeight: '200',
      lineHeight: 108,
      letterSpacing: -4.6,
    },
    condition: {
      color: tokens.colors.textPrimary,
      fontSize: 28,
      fontWeight: '600',
      marginTop: 4,
    },
    rangeLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    rangeValue: {
      color: tokens.colors.textPrimary,
      fontSize: 20,
      fontWeight: '600',
    },
    metricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: tokens.spacing.md,
      columnGap: tokens.spacing.lg,
    },
    metric: {
      minWidth: '45%',
      gap: 4,
    },
    metricLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    metricValue: {
      color: tokens.colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    section: {
      gap: tokens.spacing.md,
      paddingTop: tokens.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.divider,
    },
    sectionHeadingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.section,
      fontWeight: '600',
      letterSpacing: -0.3,
    },
    advisoryText: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      lineHeight: 27,
      maxWidth: 380,
    },
    detailGrid: {
      gap: tokens.spacing.sm,
    },
    infoLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.md,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    infoLabel: {
      color: tokens.colors.textSecondary,
      fontSize: 15,
    },
    infoValue: {
      color: tokens.colors.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    hourlyRow: {
      gap: tokens.spacing.sm,
      paddingRight: tokens.spacing.xl,
    },
    hourlyItem: {
      width: 96,
      paddingVertical: 10,
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    hourlyTime: {
      color: tokens.colors.textSecondary,
      fontSize: 14,
    },
    hourlyTemp: {
      color: tokens.colors.textPrimary,
      fontSize: 24,
      fontWeight: '500',
    },
    hourlyRain: {
      color: tokens.colors.textSecondary,
      fontSize: 14,
    },
    hourlyCode: {
      color: tokens.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.md,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    weekRowLast: {
      borderBottomWidth: 0,
    },
    weekLeading: {
      gap: 4,
    },
    weekDay: {
      color: tokens.colors.textPrimary,
      fontSize: 17,
      fontWeight: '600',
    },
    weekCode: {
      color: tokens.colors.textSecondary,
      fontSize: 14,
    },
    weekRange: {
      color: tokens.colors.textPrimary,
      fontSize: 17,
      fontWeight: '600',
    },
  });
}
