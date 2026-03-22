import type { AppThemeTokens } from '@/shared/theme/tokens';

import { createWeatherHomeContentStyles } from './weather-home-content.styles';
import { createWeatherHomeShellStyles } from './weather-home-shell.styles';

export function createWeatherHomeStyles(tokens: AppThemeTokens) {
  return {
    ...createWeatherHomeShellStyles(tokens),
    ...createWeatherHomeContentStyles(tokens),
  };
}

export type WeatherHomeStyles = ReturnType<typeof createWeatherHomeStyles>;
