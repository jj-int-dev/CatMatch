import { useEffect } from 'react';
import { useNavigationStore } from '../stores/navigation-store';

export function useSetNavigationColor(color: string) {
  const setNavigationColor = useNavigationStore(
    (state) => state.setNavigationColor
  );
  const resetNavigationColor = useNavigationStore(
    (state) => state.resetNavigationColor
  );

  useEffect(() => {
    setNavigationColor(color);
    return () => resetNavigationColor();
  }, []);
}
