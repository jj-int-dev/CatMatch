import { create } from 'zustand';

type NavigationStore = {
  color: string;
  setNavigationColor: (color: string) => void;
  resetNavigationColor: () => void;
};

const defaultNavigationColor = '[#7289DA]';

export const useNavigationStore = create<NavigationStore>((set) => ({
  color: defaultNavigationColor,
  setNavigationColor: (color) => set({ color }),
  resetNavigationColor: () => set({ color: defaultNavigationColor })
}));
