import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { HiLightBulb } from 'react-icons/hi';

type RehomerDashboardErrorProps = {
  errorType?: 'load' | 'delete';
  onRetry?: () => void;
};

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
    navigate('/rehomer/dashboard');
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
    <div className="flex min-h-[500px] items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-2xl shadow-xl">
        <div className="card-body">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-error/10 flex h-20 w-20 items-center justify-center rounded-full">
              <FaExclamationTriangle className="text-error h-10 w-10" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-base-content mb-3 text-center text-2xl font-bold">
            {getErrorTitle()}
          </h2>

          {/* Error Message */}
          <p className="text-base-content/70 mb-6 text-center">
            {getErrorMessage()}
          </p>

          {/* Troubleshooting Tips */}
          <div className="alert mb-6">
            <HiLightBulb className="text-warning size-6 flex-shrink-0" />
            <div className="w-full">
              <h3 className="text-base-content mb-3 font-semibold">
                {t('rehomer_dashboard_error_troubleshooting_title')}
              </h3>
              <ul className="text-base-content/80 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                  <span>{t('rehomer_dashboard_error_tip_internet')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                  <span>{t('rehomer_dashboard_error_tip_login')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                  <span>{t('rehomer_dashboard_error_tip_retry')}</span>
                </li>
                {errorType === 'load' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                      <span>
                        {t('rehomer_dashboard_error_tip_database_load')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                      <span>
                        {t('rehomer_dashboard_error_tip_data_corrupted')}
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                      <span>
                        {t('rehomer_dashboard_error_tip_already_deleted')}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                      <span>{t('rehomer_dashboard_error_tip_storage')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-error/50 mt-1.5 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"></span>
                      <span>
                        {t('rehomer_dashboard_error_tip_transaction')}
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="btn btn-error gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaRedo />
              {t('rehomer_dashboard_error_retry_button')}
            </button>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={handleGoToDashboard}
                className="btn btn-outline btn-neutral transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('rehomer_dashboard_error_refresh_button')}
              </button>
              <button
                onClick={handleGoHome}
                className="btn btn-ghost gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaHome />
                {t('rehomer_dashboard_error_home_button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
