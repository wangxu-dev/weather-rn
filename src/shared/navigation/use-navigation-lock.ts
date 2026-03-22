import { useCallback, useEffect, useRef } from 'react';

export function useNavigationLock(durationMs = 520) {
  const lockedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (callback: () => void) => {
      if (lockedRef.current) {
        return;
      }

      lockedRef.current = true;
      callback();

      timeoutRef.current = setTimeout(() => {
        lockedRef.current = false;
      }, durationMs);
    },
    [durationMs],
  );
}
