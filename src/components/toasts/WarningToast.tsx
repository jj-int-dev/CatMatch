import type { ToastProps } from './types/ToastProps';

export default function WarningToast({ messages, onCloseToast }: ToastProps) {
  return (
    <div className="toast toast-center">
      <div className="alert alert-warning">
        <ul>
          {messages.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end">
        <button
          className="btn btn-xs btn-warning btn-circle"
          onClick={onCloseToast}
        >
          X
        </button>
      </div>
    </div>
  );
}
