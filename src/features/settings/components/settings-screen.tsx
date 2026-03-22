import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import type { AppThemeTokens } from '@/shared/theme/tokens';
import { usePreferencesStore } from '@/store/preferences-store';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { tokens, themePreference } = useAppTheme();
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setLocalePreference = usePreferencesStore((state) => state.setLocalePreference);
  const styles = createStyles(tokens);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
          style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>{t('settings')}</Text>
            <Text style={styles.title}>{t('preferences')}</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>{t('close')}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(90).duration(motion.duration.slow).easing(motion.easing.standard)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
          <Text style={styles.sectionNote}>{t('themeNote')}</Text>
          <View style={styles.optionRow}>
            {[
              { key: 'system', label: t('system') },
              { key: 'light', label: t('light') },
              { key: 'dark', label: t('dark') },
            ].map((option) => {
              const active = option.key === themePreference;
              return (
                <Pressable
                  key={option.key}
                  onPress={() => setThemePreference(option.key as 'system' | 'light' | 'dark')}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(160).duration(motion.duration.slow).easing(motion.easing.standard)}
          style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <Text style={styles.sectionNote}>{t('languageNote')}</Text>
          <View style={styles.optionRow}>
            {[
              { key: 'system', label: t('system') },
              { key: 'zh-CN', label: t('chinese') },
              { key: 'en', label: t('english') },
            ].map((option) => {
              const active = option.key === localePreference;
              return (
                <Pressable
                  key={option.key}
                  onPress={() => setLocalePreference(option.key as 'system' | 'zh-CN' | 'en')}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(tokens: AppThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.backgroundTop,
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
    },
    eyebrow: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 8,
    },
    title: {
      color: tokens.colors.textPrimary,
      fontSize: 34,
      fontWeight: '700',
      letterSpacing: -1,
    },
    closeButton: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: tokens.radius.full,
      borderWidth: 1,
      borderColor: tokens.colors.buttonBorder,
      backgroundColor: tokens.colors.buttonBackground,
    },
    closeText: {
      color: tokens.colors.buttonText,
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    section: {
      gap: tokens.spacing.sm,
      paddingTop: tokens.spacing.md,
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
      backgroundColor: tokens.colors.surfaceSoft,
    },
    chipActive: {
      borderColor: tokens.colors.accent,
      backgroundColor: tokens.colors.buttonBackground,
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
