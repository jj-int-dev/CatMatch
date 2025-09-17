export type ToastProps = {
  messages: string[];
  onCloseToast?: () => void | Promise<void>;
};
