import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router';

interface RehomerDashboardErrorProps {
  errorType?: 'load' | 'delete';
  onRetry?: () => void;
}

export default function RehomerDashboardError({
  errorType = 'load',
  onRetry
}: RehomerDashboardErrorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoToDashboard = () => {
    navigate('/rehomer-dashboard');
  };

  const getErrorMessage = () => {
    if (errorType === 'load') {
      return t('get_animal_listings_error');
    } else {
      return t('delete_animal_listing_error');
    }
  };

  const getErrorTitle = () => {
    if (errorType === 'load') {
      return t('rehomer_dashboard_error_load_title');
    } else {
      return t('rehomer_dashboard_error_delete_title');
    }
  };

  return (
    <div className="mt-7 flex flex-col items-center justify-center">
      <div className="bg-base-100 rounded-box max-w-md p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <FaExclamationTriangle className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold text-gray-800">
          {getErrorTitle()}
        </h2>

        <p className="mb-6 text-gray-600">{getErrorMessage()}</p>

        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
          <h3 className="mb-2 font-semibold text-gray-700">
            {t('rehomer_dashboard_error_troubleshooting_title')}
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
              <span>{t('rehomer_dashboard_error_tip_internet')}</span>
            </li>
            <li className="flex items-start">
              <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
              <span>{t('rehomer_dashboard_error_tip_login')}</span>
            </li>
            <li className="flex items-start">
              <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
              <span>{t('rehomer_dashboard_error_tip_retry')}</span>
            </li>
            {errorType === 'load' ? (
              <>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>{t('rehomer_dashboard_error_tip_database_load')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>{t('rehomer_dashboard_error_tip_data_corrupted')}</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>
                    {t('rehomer_dashboard_error_tip_already_deleted')}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>{t('rehomer_dashboard_error_tip_storage')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1 mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-400"></span>
                  <span>{t('rehomer_dashboard_error_tip_transaction')}</span>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="btn btn-error btn-lg flex items-center justify-center gap-2"
          >
            <FaRedo />
            {t('rehomer_dashboard_error_retry_button')}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleGoToDashboard}
              className="btn btn-outline btn-lg flex-1"
            >
              {t('rehomer_dashboard_error_refresh_button')}
            </button>
            <button
              onClick={handleGoHome}
              className="btn btn-ghost btn-lg flex flex-1 items-center justify-center gap-2"
            >
              <FaHome />
              {t('rehomer_dashboard_error_home_button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
