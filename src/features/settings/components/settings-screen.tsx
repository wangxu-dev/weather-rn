import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { ToolbarControls } from '@/shared/ui/toolbar-controls';
import { usePreferencesStore } from '@/store/preferences-store';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { tokens, themeName, themePreference } = useAppTheme();
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setLocalePreference = usePreferencesStore((state) => state.setLocalePreference);
  const styles = createStyles(tokens);

  return (
    <LinearGradient
      colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}>
      <View pointerEvents="none" style={styles.glowLarge} />
      <View pointerEvents="none" style={styles.glowSmall} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>{t('settings')}</Text>
              <Text style={styles.title}>{t('preferences')}</Text>
            </View>
            <ToolbarControls
              themeName={themeName}
              tokens={tokens}
              actions={[
                {
                  id: 'close',
                  label: t('close'),
                  systemImage: 'xmark',
                  onPress: () => router.back(),
                },
              ]}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(90).duration(motion.duration.slow).easing(motion.easing.standard)}>
            <PreferenceSection title={t('appearance')} note={t('themeNote')} styles={styles}>
              {[
                { key: 'system', label: t('system') },
                { key: 'light', label: t('light') },
                { key: 'dark', label: t('dark') },
              ].map((option) => {
                const active = option.key === themePreference;
                return (
                  <PreferenceChip
                    key={option.key}
                    label={option.label}
                    active={active}
                    styles={styles}
                    onPress={() => setThemePreference(option.key as 'system' | 'light' | 'dark')}
                  />
                );
              })}
            </PreferenceSection>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(motion.duration.slow).easing(motion.easing.standard)}>
            <PreferenceSection title={t('language')} note={t('languageNote')} styles={styles}>
              {[
                { key: 'system', label: t('system') },
                { key: 'zh-CN', label: t('chinese') },
                { key: 'en', label: t('english') },
              ].map((option) => {
                const active = option.key === localePreference;
                return (
                  <PreferenceChip
                    key={option.key}
                    label={option.label}
                    active={active}
                    styles={styles}
                    onPress={() => setLocalePreference(option.key as 'system' | 'zh-CN' | 'en')}
                  />
                );
              })}
            </PreferenceSection>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function PreferenceSection({
  title,
  note,
  children,
  styles,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionNote}>{note}</Text>
      <View style={styles.optionRow}>{children}</View>
    </View>
  );
}

function PreferenceChip({
  label,
  active,
  styles,
  onPress,
}: {
  label: string;
  active: boolean;
  styles: ReturnType<typeof createStyles>;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(tokens: ReturnType<typeof useAppTheme>['tokens']) {
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
      alignItems: 'center',
      gap: tokens.spacing.md,
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
      letterSpacing: -1.2,
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
