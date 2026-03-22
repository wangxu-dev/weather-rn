export type ThemeName = 'light' | 'dark';

type ThemeTokens = {
  colors: {
    backgroundTop: string;
    backgroundBottom: string;
    orbPrimary: string;
    orbSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    divider: string;
    surface: string;
    surfaceSoft: string;
    buttonBackground: string;
    buttonBorder: string;
    buttonText: string;
    accent: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    eyebrow: number;
    body: number;
    section: number;
    city: number;
    temp: number;
  };
};

export const themeTokens: Record<ThemeName, ThemeTokens> = {
  dark: {
    colors: {
      backgroundTop: '#0d1619',
      backgroundBottom: '#2a433f',
      orbPrimary: 'rgba(130, 154, 141, 0.16)',
      orbSecondary: 'rgba(168, 182, 158, 0.10)',
      textPrimary: '#f3efe6',
      textSecondary: '#d4d9d1',
      textMuted: '#93a39a',
      divider: 'rgba(255,255,255,0.08)',
      surface: 'rgba(23, 38, 37, 0.26)',
      surfaceSoft: 'rgba(244, 241, 231, 0.07)',
      buttonBackground: 'rgba(244, 241, 231, 0.10)',
      buttonBorder: 'rgba(255,255,255,0.08)',
      buttonText: '#f0ede2',
      accent: '#b5c59b',
    },
    spacing: { xs: 6, sm: 10, md: 16, lg: 22, xl: 30, xxl: 38 },
    radius: { sm: 12, md: 18, lg: 24, xl: 32, full: 999 },
    typography: { eyebrow: 12, body: 15, section: 21, city: 42, temp: 104 },
  },
  light: {
    colors: {
      backgroundTop: '#f3efe4',
      backgroundBottom: '#d8e3dc',
      orbPrimary: 'rgba(116, 145, 129, 0.14)',
      orbSecondary: 'rgba(167, 180, 146, 0.12)',
      textPrimary: '#23312f',
      textSecondary: '#4d615b',
      textMuted: '#70817a',
      divider: 'rgba(35,49,47,0.10)',
      surface: 'rgba(255, 255, 255, 0.38)',
      surfaceSoft: 'rgba(255, 255, 255, 0.24)',
      buttonBackground: 'rgba(255,255,255,0.42)',
      buttonBorder: 'rgba(35,49,47,0.10)',
      buttonText: '#23312f',
      accent: '#6f8e77',
    },
    spacing: { xs: 6, sm: 10, md: 16, lg: 22, xl: 30, xxl: 38 },
    radius: { sm: 12, md: 18, lg: 24, xl: 32, full: 999 },
    typography: { eyebrow: 12, body: 15, section: 21, city: 42, temp: 104 },
  },
};

export type AppThemeTokens = (typeof themeTokens)[ThemeName];
