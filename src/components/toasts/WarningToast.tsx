import type { ToastProps } from './types/ToastProps';

export default function WarningToast({ messages, onCloseToast }: ToastProps) {
  return (
    <div className="toast toast-top toast-center z-50 w-full max-w-xs px-4 sm:max-w-sm md:max-w-md lg:max-w-lg">
      <div className="alert alert-warning border-warning/20 rounded-xl border-2 shadow-2xl backdrop-blur-sm">
        <div className="flex w-full items-center gap-3 py-1">
          {/* Warning Icon */}
          <div className="flex flex-shrink-0 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-current"
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
          </div>

          {/* Messages */}
          <div className="min-w-0 flex-1 py-1">
            {messages.length === 1 ? (
              <span className="text-sm leading-relaxed font-medium break-words sm:text-base">
                {messages[0]}
              </span>
            ) : (
              <ul className="list-inside list-disc space-y-1.5 text-sm sm:text-base">
                {messages.map((msg, index) => (
                  <li
                    key={`${msg}-${index}`}
                    className="leading-relaxed font-medium break-words"
                  >
                    {msg}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Close Button */}
          {onCloseToast && (
            <div className="flex flex-shrink-0 items-center justify-center">
              <button
                onClick={onCloseToast}
                className="btn btn-circle btn-ghost btn-sm hover:bg-warning/20 transition-colors duration-200"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
