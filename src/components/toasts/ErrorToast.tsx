import type { ToastProps } from './types/ToastTypes';
import flattenMessages from './utils/flattenMessages';

export default function ErrorToast({ messages, onCloseToast }: ToastProps) {
  if (messages.length === 0) return <></>;

  const bannerMessages = flattenMessages(messages);

  return (
    <div className="toast toast-center">
      <div className="alert alert-error">
        <ul>
          {bannerMessages.map((msg) => (
            <li>{msg}</li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          className="btn btn-xs btn-error btn-circle"
          onClick={onCloseToast}
        >
          X
        </button>
      </div>
    </div>
  );
}
