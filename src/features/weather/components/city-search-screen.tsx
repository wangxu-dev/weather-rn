import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { ToolbarControls } from '@/shared/ui/toolbar-controls';
import { presetCities, useAppStore } from '@/store/app-store';

export function CitySearchScreen() {
  const { t } = useTranslation();
  const { tokens, themeName } = useAppTheme();
  const styles = createStyles(tokens);
  const [query, setQuery] = useState('');
  const selectedCity = useAppStore((state) => state.selectedCity);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);

  const filteredCities = presetCities.filter((city) =>
    city.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <LinearGradient
      colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}>
      <View pointerEvents="none" style={styles.glowLarge} />
      <View pointerEvents="none" style={styles.glowSmall} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>{t('search')}</Text>
              <Text style={styles.title}>{t('searchCity')}</Text>
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
            entering={FadeInDown.delay(70).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.searchField}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('citySearchPlaceholder')}
              placeholderTextColor={tokens.colors.textMuted}
              style={styles.searchInput}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.list}>
            {filteredCities.map((city) => {
              const active = city.id === selectedCity.id;
              return (
                <Pressable
                  key={city.id}
                  onPress={() => {
                    setSelectedCity(city);
                    router.back();
                  }}
                  style={styles.row}>
                  <View>
                    <Text style={styles.cityName}>{city.name}</Text>
                    <Text style={styles.cityMeta}>{city.timezone}</Text>
                  </View>
                  <Text style={[styles.statusText, active && styles.statusTextActive]}>
                    {active ? t('current') : t('select')}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
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
    searchField: {
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
      paddingBottom: tokens.spacing.sm,
    },
    searchInput: {
      color: tokens.colors.textPrimary,
      fontSize: 24,
      paddingVertical: 0,
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
    },
    cityName: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    cityMeta: {
      color: tokens.colors.textMuted,
      fontSize: 13,
      marginTop: 4,
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
  });
}
