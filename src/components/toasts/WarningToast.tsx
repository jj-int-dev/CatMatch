import type { ToastProps } from './types/ToastProps';

export default function WarningToast({ messages, onCloseToast }: ToastProps) {
  return (
    <div className="toast toast-top toast-center z-50">
      <div className="alert alert-warning shadow-lg">
        <div className="flex w-full items-start gap-3">
          {/* Warning Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          {/* Messages */}
          <div className="flex-1">
            {messages.length === 1 ? (
              <span>{messages[0]}</span>
            ) : (
              <ul className="list-inside list-disc space-y-1">
                {messages.map((msg, index) => (
                  <li key={`${msg}-${index}`}>{msg}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Close Button */}
          {onCloseToast && (
            <button
              onClick={onCloseToast}
              className="btn btn-circle btn-ghost btn-sm"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
