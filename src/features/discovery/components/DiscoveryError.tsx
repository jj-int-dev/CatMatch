import { useTranslation } from 'react-i18next';

interface DiscoveryErrorProps {
  error?: { message?: string };
  onRetry?: () => void;
  onModifySearch?: () => void;
}

export default function DiscoveryError({
  error,
  onRetry = () => window.location.reload(),
  onModifySearch
}: DiscoveryErrorProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-gray-800 md:text-5xl">
            {t('discovery_title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {t('discovery_current_location')}
          </p>
        </div>

        {/* Error Card */}
        <div className="rounded-box overflow-hidden bg-white shadow-2xl">
          <div className="md:flex">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-600 p-8 md:w-2/5">
              <div className="text-center text-white">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-12 w-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h1 className="text-6xl font-bold">Error</h1>
                <p className="mt-4 text-xl font-semibold">
                  {t('error_loading_cats')}
                </p>
              </div>
            </div>
            <div className="p-8 md:w-3/5 md:p-12">
              <h2 className="mb-4 text-3xl font-bold text-gray-800">
                {t('error_loading_cats')}
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                {error?.message || t('error_loading_cats_desc')}
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-red-500 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {t('error_loading_cats_desc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">
                    {t('error_troubleshooting_title')}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                      <span>{t('error_tip_internet')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                      <span>{t('error_tip_filters')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                      <span>{t('error_tip_retry')}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button
                    onClick={onRetry}
                    className="btn btn-error btn-lg flex flex-1 items-center justify-center gap-2"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
                    </svg>
                    {t('try_again')}
                  </button>
                  {onModifySearch && (
                    <button
                      onClick={onModifySearch}
                      className="btn btn-outline btn-lg flex-1"
                    >
                      {t('modify_search_filters')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
