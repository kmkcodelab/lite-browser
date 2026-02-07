import { useCallback, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function useOrientation() {
  const isLandscape = useRef(false);

  const lockLandscape = useCallback(async () => {
    if (isLandscape.current) return;
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
      isLandscape.current = true;
    } catch {}
  }, []);

  const lockPortrait = useCallback(async () => {
    if (!isLandscape.current) return;
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      isLandscape.current = false;
    } catch {}
  }, []);

  const toggleOrientation = useCallback(async () => {
    if (isLandscape.current) {
      await lockPortrait();
    } else {
      await lockLandscape();
    }
    return isLandscape.current;
  }, [lockLandscape, lockPortrait]);

  return { lockLandscape, lockPortrait, toggleOrientation, isLandscape };
}
