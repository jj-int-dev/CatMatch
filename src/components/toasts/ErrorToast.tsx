import type { ToastProps } from './types/ToastProps';

export default function ErrorToast({ messages, onCloseToast }: ToastProps) {
  return (
    <div className="toast toast-center">
      <div className="alert alert-error">
        <ul>
          {messages.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </div>
      {!!onCloseToast && (
        <div className="flex justify-end">
          <button
            className="btn btn-xs btn-error btn-circle"
            onClick={onCloseToast}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
