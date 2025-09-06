export type ToastMessage = [message: string, separator?: string];

export type ToastProps = {
  messages: ToastMessage[];
  onCloseToast?: () => void | Promise<void>;
};
