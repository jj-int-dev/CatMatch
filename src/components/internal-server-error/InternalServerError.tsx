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
    <div className="from-base-200 to-base-300 flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-12">
      <div className="card bg-base-100 w-full max-w-2xl shadow-2xl">
        <div className="card-body">
          {/* Error Icon and Code */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="bg-error/10 mb-4 flex h-24 w-24 items-center justify-center rounded-full">
              <FaExclamationTriangle className="text-error h-12 w-12" />
            </div>
            <div className="badge badge-error badge-lg mb-4 px-6 py-4 text-2xl font-bold">
              500
            </div>
            <h1 className="text-base-content mb-2 text-3xl font-bold">
              {t('internal_server_error')}
            </h1>
            <p className="text-base-content/70 max-w-md text-lg">
              {t('internal_server_error_desc')}
            </p>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info mb-6 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{t('error_notification_message')}</span>
          </div>

          {/* Suggestions */}
          <div className="mb-6">
            <h3 className="text-base-content mb-3 text-lg font-semibold">
              {t('what_you_can_try')}
            </h3>
            <ul className="text-base-content/80 space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full"></div>
                <span>{t('refresh_page_suggestion')}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full"></div>
                <span>{t('check_connection_suggestion')}</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full"></div>
                <span>{t('try_again_later_suggestion')}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleRetry}
              className="btn btn-primary flex-1 gap-2"
            >
              <FaRedo />
              {t('try_again')}
            </button>
            <button onClick={handleGoHome} className="btn btn-outline flex-1">
              {t('go_to_homepage')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
