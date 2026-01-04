import { create } from 'zustand';

type SendResetPasswordLinkStore = {
  showSendResetPasswordLinkDialog: boolean;
  setShowSendResetPasswordLinkDialog: (shouldShow: boolean) => void;
};

export const useSendResetPasswordLinkStore = create<SendResetPasswordLinkStore>(
  (set) => ({
    showSendResetPasswordLinkDialog: false,
    setShowSendResetPasswordLinkDialog: (showSendResetPasswordLinkDialog) =>
      set({ showSendResetPasswordLinkDialog })
  })
);
