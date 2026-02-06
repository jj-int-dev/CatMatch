import type { ToastProps } from './types/ToastProps';

export default function SuccessToast({ messages, onCloseToast }: ToastProps) {
  return (
    <div className="toast toast-top toast-center z-50">
      <div className="alert alert-success shadow-lg">
        <div className="flex w-full items-start gap-3">
          {/* Success Icon */}
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
