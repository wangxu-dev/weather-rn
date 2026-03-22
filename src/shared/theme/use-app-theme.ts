import { useColorScheme } from 'react-native';

import { themeTokens, type ThemeName } from '@/shared/theme/tokens';
import { usePreferencesStore } from '@/store/preferences-store';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const themePreference = usePreferencesStore((state) => state.themePreference);

  const themeName: ThemeName =
    themePreference === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : themePreference;

  return {
    themeName,
    themePreference,
    tokens: themeTokens[themeName],
  };
}
