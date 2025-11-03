import type { ToastProps } from './types/ToastProps';

export default function SuccessToast({ messages, onCloseToast }: ToastProps) {
  return (
    <div className="toast toast-center">
      <div className="alert alert-success">
        <ul>
          {messages.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      </div>
      {!!onCloseToast && (
        <div className="flex justify-end">
          <button
            className="btn btn-xs btn-success btn-circle"
            onClick={onCloseToast}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
