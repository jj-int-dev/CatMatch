import { create } from 'zustand';

type DiscoveryPreferencesStore = {
  showDiscoveryPreferencesDialog: boolean;
  setShowDiscoveryPreferencesDialog: (shouldShow: boolean) => void;
};

export const useDiscoveryPreferencesStore = create<DiscoveryPreferencesStore>(
  (set) => ({
    showDiscoveryPreferencesDialog: false,
    setShowDiscoveryPreferencesDialog: (showDiscoveryPreferencesDialog) =>
      set({ showDiscoveryPreferencesDialog })
  })
);
