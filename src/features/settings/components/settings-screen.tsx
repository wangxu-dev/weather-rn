import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useNavigationLock } from '@/shared/navigation/use-navigation-lock';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { ToolbarControls } from '@/shared/ui/toolbar-controls';
import { usePreferencesStore, type LocalePreference, type ThemePreference } from '@/store/preferences-store';

import { SettingsPreferenceControl } from './settings-preference-control';
import { createSettingsStyles } from './settings.styles';

export function SettingsScreen() {
  const { t } = useTranslation();
  const { tokens, themeName, themePreference } = useAppTheme();
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);
  const setLocalePreference = usePreferencesStore((state) => state.setLocalePreference);
  const styles = createSettingsStyles(tokens);
  const runLockedNavigation = useNavigationLock();

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
          <Animated.View entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)} style={styles.header}>
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
                  onPress: () => runLockedNavigation(() => router.replace('/')),
                },
              ]}
            />
          </Animated.View>

          <SettingsSection title={t('appearance')} note={t('themeNote')} styles={styles} delay={90}>
            <SettingsPreferenceControl
              themeName={themeName}
              styles={styles}
              value={themePreference}
              options={themeOptions}
              onChange={(value) => setThemePreference(value as ThemePreference)}
            />
          </SettingsSection>

          <SettingsSection title={t('language')} note={t('languageNote')} styles={styles} delay={150}>
            <SettingsPreferenceControl
              themeName={themeName}
              styles={styles}
              value={localePreference}
              options={languageOptions}
              onChange={(value) => setLocalePreference(value as LocalePreference)}
            />
          </SettingsSection>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function SettingsSection({
  title,
  note,
  styles,
  delay,
  children,
}: {
  title: string;
  note: string;
  styles: ReturnType<typeof createSettingsStyles>;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(motion.duration.slow).easing(motion.easing.standard)}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionNote}>{note}</Text>
        {children}
      </View>
    </Animated.View>
  );
}
