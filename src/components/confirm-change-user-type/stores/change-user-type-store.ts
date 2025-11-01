import { create } from 'zustand';

type ChangeUserTypeStore = {
  newUserType: string | null;
  showChangeUserTypeDialog: boolean;
  setNewUserType: (newUserType: string | null) => void;
  setShowChangeUserTypeDialog: (shouldShow: boolean) => void;
};

export const useChangeUserTypeStore = create<ChangeUserTypeStore>((set) => ({
  newUserType: null,
  showChangeUserTypeDialog: false,
  setNewUserType: (newUserType) => set({ newUserType }),
  setShowChangeUserTypeDialog: (showChangeUserTypeDialog) =>
    set({ showChangeUserTypeDialog })
}));
