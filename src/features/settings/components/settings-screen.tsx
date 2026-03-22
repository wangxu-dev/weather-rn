import { Host, Picker, Text as SwiftText, VStack } from '@expo/ui/swift-ui';
import { controlSize, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { ToolbarControls } from '@/shared/ui/toolbar-controls';
import { usePreferencesStore, type LocalePreference, type ThemePreference } from '@/store/preferences-store';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { tokens, themeName, themePreference } = useAppTheme();
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setLocalePreference = usePreferencesStore((state) => state.setLocalePreference);
  const styles = createStyles(tokens);

  const themeOptions: Array<{ key: ThemePreference; label: string }> = [
    { key: 'system', label: t('system') },
    { key: 'light', label: t('light') },
    { key: 'dark', label: t('dark') },
  ];
  const languageOptions: Array<{ key: LocalePreference; label: string }> = [
    { key: 'system', label: t('system') },
    { key: 'zh-CN', label: t('chinese') },
    { key: 'en', label: t('english') },
  ];

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
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{t('settings')}</Text>
              <Text style={styles.title}>{t('preferences')}</Text>
              <Text style={styles.subtitle}>{t('settingsNote')}</Text>
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
              <PreferenceControl
                themeName={themeName}
                styles={styles}
                value={themePreference}
                options={themeOptions}
                onChange={(value) => setThemePreference(value as ThemePreference)}
              />
            </PreferenceSection>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(motion.duration.slow).easing(motion.easing.standard)}>
            <PreferenceSection title={t('language')} note={t('languageNote')} styles={styles}>
              <PreferenceControl
                themeName={themeName}
                styles={styles}
                value={localePreference}
                options={languageOptions}
                onChange={(value) => setLocalePreference(value as LocalePreference)}
              />
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
      {children}
    </View>
  );
}

function PreferenceControl({
  themeName,
  styles,
  value,
  options,
  onChange,
}: {
  themeName: 'light' | 'dark';
  styles: ReturnType<typeof createStyles>;
  value: string;
  options: Array<{ key: string; label: string }>;
  onChange: (value: string) => void;
}) {
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.nativeControlWrap}>
        <Host matchContents colorScheme={themeName} style={styles.nativeControlHost}>
          <VStack spacing={0}>
            <Picker
              selection={value}
              onSelectionChange={onChange}
              modifiers={[pickerStyle('segmented'), controlSize('large')]}>
              {options.map((option) => (
                <SwiftText key={option.key} modifiers={[tag(option.key)]}>
                  {option.label}
                </SwiftText>
              ))}
            </Picker>
          </VStack>
        </Host>
      </View>
    );
  }

  return (
    <View style={styles.optionRow}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable key={option.key} onPress={() => onChange(option.key)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
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
