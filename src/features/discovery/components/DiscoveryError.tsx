import { useTranslation } from 'react-i18next';
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

type DiscoveryErrorProps = {
  error?: { message?: string };
  onRetry?: () => void;
  onModifySearch?: () => void;
};

export default function DiscoveryError({
  error,
  onRetry = () => window.location.reload(),
  onModifySearch
}: DiscoveryErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="from-base-100 to-base-200 min-h-screen bg-gradient-to-br p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-base-content text-4xl font-bold md:text-5xl">
            {t('discovery_title')}
          </h1>
          <p className="text-base-content/70 mt-4 text-lg">
            {t('discovery_current_location')}
          </p>
        </div>

        {/* Error Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            {/* Error Icon */}
            <div className="bg-error/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
              <HiExclamationCircle className="text-error h-12 w-12" />
            </div>

            {/* Error Title */}
            <h2 className="text-base-content mb-3 text-3xl font-bold">
              {t('error_loading_cats')}
            </h2>

            {/* Error Message */}
            <p className="text-base-content/70 mb-8 max-w-md">
              {error?.message || t('error_loading_cats_desc')}
            </p>

            {/* Troubleshooting Section */}
            <div className="alert mb-8 w-full max-w-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="w-full">
                <h3 className="text-base-content mb-3 text-left font-semibold">
                  {t('error_troubleshooting_title')}
                </h3>
                <ul className="text-base-content/80 space-y-2 text-left text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                    <span>{t('error_tip_internet')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                    <span>{t('error_tip_filters')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                    <span>{t('error_tip_retry')}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <button
                onClick={onRetry}
                className="btn btn-primary flex-1 gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <HiRefresh className="size-5" />
                {t('try_again')}
              </button>
              {onModifySearch && (
                <button
                  onClick={onModifySearch}
                  className="btn btn-outline flex-1 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t('modify_search_filters')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
