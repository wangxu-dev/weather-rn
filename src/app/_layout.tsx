import { Stack } from 'expo-router';
import React from 'react';

import { AppProviders } from '@/shared/lib/app-providers';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#06131f' },
          animation: 'fade',
        }}
      />
    </AppProviders>
  );
}
