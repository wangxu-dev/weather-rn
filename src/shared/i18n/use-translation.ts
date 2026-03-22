import { getLocales } from 'expo-localization';

import {
  interpolate,
  translations,
  type SupportedLocale,
  type TranslationKey,
} from '@/shared/i18n/translations';
import { usePreferencesStore } from '@/store/preferences-store';

function normalizeLocale(tag?: string): SupportedLocale {
  if (!tag) return 'en';
  return tag.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

export function useTranslation() {
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const locale: SupportedLocale =
    localePreference === 'system' ? normalizeLocale(getLocales()[0]?.languageTag) : localePreference;

  function t(key: TranslationKey, values?: Record<string, string | number>) {
    const template = translations[locale][key];
    return values ? interpolate(template, values) : template;
  }

  return {
    locale,
    localePreference,
    t,
  };
}
