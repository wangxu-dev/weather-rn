export type ThemeName = 'light' | 'dark';

type ThemeTokens = {
  colors: {
    backgroundTop: string;
    backgroundBottom: string;
    backgroundAccent: string;
    backgroundHaze: string;
    orbPrimary: string;
    orbSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    divider: string;
    surface: string;
    surfaceSoft: string;
    glassTint: string;
    glassTintStrong: string;
    glassBorder: string;
    glassHighlight: string;
    buttonBackground: string;
    buttonBorder: string;
    buttonText: string;
    accent: string;
    accentSoft: string;
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
      backgroundTop: '#09131f',
      backgroundBottom: '#29465c',
      backgroundAccent: '#7dd3ff',
      backgroundHaze: 'rgba(164, 220, 255, 0.18)',
      orbPrimary: 'rgba(138, 208, 255, 0.18)',
      orbSecondary: 'rgba(158, 231, 255, 0.14)',
      textPrimary: '#f3efe6',
      textSecondary: '#d6dde4',
      textMuted: '#98aab8',
      divider: 'rgba(255,255,255,0.10)',
      surface: 'rgba(16, 31, 49, 0.30)',
      surfaceSoft: 'rgba(227, 241, 255, 0.10)',
      glassTint: 'rgba(215, 236, 255, 0.12)',
      glassTintStrong: 'rgba(215, 236, 255, 0.18)',
      glassBorder: 'rgba(255,255,255,0.16)',
      glassHighlight: 'rgba(255,255,255,0.26)',
      buttonBackground: 'rgba(11, 24, 38, 0.36)',
      buttonBorder: 'rgba(255,255,255,0.16)',
      buttonText: '#f3efe6',
      accent: '#87dbff',
      accentSoft: 'rgba(135, 219, 255, 0.16)',
    },
    spacing: { xs: 6, sm: 10, md: 16, lg: 22, xl: 30, xxl: 38 },
    radius: { sm: 12, md: 18, lg: 24, xl: 32, full: 999 },
    typography: { eyebrow: 12, body: 15, section: 21, city: 42, temp: 104 },
  },
  light: {
    colors: {
      backgroundTop: '#8ecfff',
      backgroundBottom: '#f0f7ff',
      backgroundAccent: '#fff6cf',
      backgroundHaze: 'rgba(255, 246, 207, 0.44)',
      orbPrimary: 'rgba(255, 255, 255, 0.38)',
      orbSecondary: 'rgba(255, 241, 214, 0.48)',
      textPrimary: '#13253b',
      textSecondary: '#415b74',
      textMuted: '#678198',
      divider: 'rgba(19,37,59,0.10)',
      surface: 'rgba(255, 255, 255, 0.30)',
      surfaceSoft: 'rgba(255, 255, 255, 0.22)',
      glassTint: 'rgba(255, 255, 255, 0.16)',
      glassTintStrong: 'rgba(255, 255, 255, 0.24)',
      glassBorder: 'rgba(255,255,255,0.34)',
      glassHighlight: 'rgba(255,255,255,0.55)',
      buttonBackground: 'rgba(255,255,255,0.58)',
      buttonBorder: 'rgba(19,37,59,0.12)',
      buttonText: '#13253b',
      accent: '#3a91c8',
      accentSoft: 'rgba(58, 145, 200, 0.16)',
    },
    spacing: { xs: 6, sm: 10, md: 16, lg: 22, xl: 30, xxl: 38 },
    radius: { sm: 12, md: 18, lg: 24, xl: 32, full: 999 },
    typography: { eyebrow: 12, body: 15, section: 21, city: 42, temp: 104 },
  },
};

export type AppThemeTokens = (typeof themeTokens)[ThemeName];
