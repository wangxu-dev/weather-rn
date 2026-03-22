import { Stack } from 'expo-router';
import React from 'react';

import { AppProviders } from '@/shared/lib/app-providers';
import { useAppTheme } from '@/shared/theme/use-app-theme';

export default function RootLayout() {
  const { tokens } = useAppTheme();

  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.colors.backgroundTop },
          animation: 'fade',
        }}
      />
    </AppProviders>
  );
}
