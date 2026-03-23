import * as Location from 'expo-location';
import { useEffect } from 'react';

import type { City } from '@/features/weather/model/weather.types';
import { useAppStore } from '@/store/app-store';

function buildCurrentCity(
  latitude: number,
  longitude: number,
  name?: string,
  region?: string,
): City {
  const resolvedName = name || region || 'Current Location';

  return {
    id: `current-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
    name: resolvedName,
    latitude,
    longitude,
    timezone: 'auto',
  };
}

export function useBootstrapLocation() {
  const hasResolvedInitialLocation = useAppStore((state) => state.hasResolvedInitialLocation);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);
  const markInitialLocationResolved = useAppStore((state) => state.markInitialLocationResolved);

  useEffect(() => {
    if (hasResolvedInitialLocation) {
      return;
    }

    let cancelled = false;

    async function bootstrapLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        const place = reverseGeocode[0];
        const resolvedCity = buildCurrentCity(
          position.coords.latitude,
          position.coords.longitude,
          place?.city ?? place?.district ?? place?.subregion ?? undefined,
          place?.region ?? undefined,
        );

        if (!cancelled) {
          setSelectedCity(resolvedCity);
        }
      } catch {
        // Leave selectedCity empty when location is unavailable.
      } finally {
        if (!cancelled) {
          markInitialLocationResolved();
        }
      }
    }

    bootstrapLocation();

    return () => {
      cancelled = true;
    };
  }, [hasResolvedInitialLocation, markInitialLocationResolved, setSelectedCity]);
}
