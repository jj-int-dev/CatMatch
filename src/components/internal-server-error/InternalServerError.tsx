import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export default function InternalServerError() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="md:flex">
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-600 p-8 md:w-2/5">
            <div className="text-center text-white">
              <FaExclamationTriangle className="mx-auto mb-6 h-24 w-24" />
              <h1 className="text-8xl font-bold">500</h1>
              <p className="mt-4 text-xl font-semibold">
                {t('internal_server_error')}
              </p>
            </div>
          </div>
          <div className="p-8 md:w-3/5 md:p-12">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              {t('internal_server_error')}
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              {t('internal_server_error_desc')}
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-red-500 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Our team has been notified and is working to fix the
                      issue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">
                  What you can try:
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mt-2 mr-3 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                    <span>Refresh the page to see if the issue resolves</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mt-2 mr-3 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                    <span>Check your internet connection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mt-2 mr-3 inline-block h-2 w-2 rounded-full bg-red-500"></span>
                    <span>Try again in a few minutes</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <button
                  onClick={handleRetry}
                  className="btn btn-error btn-lg flex flex-1 items-center justify-center gap-2"
                >
                  <FaRedo />
                  Try Again
                </button>
                <button
                  onClick={handleGoHome}
                  className="btn btn-outline btn-lg flex-1"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
