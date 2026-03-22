import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { useTranslation } from '@/shared/i18n/use-translation';
import { useNavigationLock } from '@/shared/navigation/use-navigation-lock';
import type { AppThemeTokens, ThemeName } from '@/shared/theme/tokens';
import { ToolbarControls } from '@/shared/ui/toolbar-controls';

import type { WeatherHomeStyles } from './weather-home.styles';

type WeatherHomeHeaderProps = {
  cityId: string;
  cityName: string;
  themeName: ThemeName;
  styles: WeatherHomeStyles;
  tokens: AppThemeTokens;
};

export function WeatherHomeHeader({ cityId, cityName, themeName, styles, tokens }: WeatherHomeHeaderProps) {
  const { t } = useTranslation();
  const runLockedNavigation = useNavigationLock();

  return (
    <Animated.View
      entering={FadeInDown.duration(360)}
      layout={LinearTransition}
      style={styles.headerRow}>
      <Animated.View key={`city-${cityId}`} entering={FadeInDown.duration(280)} style={styles.headerCopy}>
        <Text style={styles.brand}>{t('brand')}</Text>
        <View style={styles.cityRow}>
          <Text style={styles.city}>{cityName}</Text>
          {cityId.startsWith('current-') ? <View style={styles.locationDot} /> : null}
        </View>
      </Animated.View>

      <ToolbarControls
        themeName={themeName}
        tokens={tokens}
        actions={[
          {
            id: 'search',
            label: t('search'),
            systemImage: 'magnifyingglass',
            onPress: () => runLockedNavigation(() => router.navigate('/search')),
          },
          {
            id: 'settings',
            label: t('settings'),
            systemImage: 'gearshape',
            onPress: () => runLockedNavigation(() => router.navigate('/settings')),
          },
        ]}
      />
    </Animated.View>
  );
}
