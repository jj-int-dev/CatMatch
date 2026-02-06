import { useTranslation } from 'react-i18next';
import { HiInformationCircle, HiMail } from 'react-icons/hi';

export default function UserDataDeletion() {
  const { t } = useTranslation();

  return (
    <div className="from-base-100 to-base-200 min-h-screen bg-gradient-to-br px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header Card */}
        <div className="card bg-base-100 mb-8 shadow-xl">
          <div className="card-body">
            <div className="flex items-start gap-4">
              <div className="bg-info/10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full">
                <HiInformationCircle className="text-info size-8" />
              </div>
              <div>
                <h1 className="text-base-content mb-2 text-3xl font-bold">
                  {t('user_data_deletion')}
                </h1>
                <p className="text-base-content/70 text-sm">
                  {t('last_updated_deletion')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body prose max-w-none">
            {/* Introduction */}
            <p className="text-base-content/80">
              {t('user_data_deletion_desc')}
            </p>

            {/* How to Delete Section */}
            <div className="bg-base-200/50 mt-6 rounded-lg p-6">
              <h2 className="text-base-content mt-0 mb-4 text-xl font-bold">
                {t('how_to_delete')}
              </h2>
              <p className="text-base-content/80 mb-4">
                {t('how_to_delete_desc')}
              </p>
              <ol className="text-base-content/80 space-y-3 pl-6">
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-content flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    1
                  </span>
                  <span>{t('log_in_account')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-content flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    2
                  </span>
                  <span>{t('go_to_profile')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-content flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    3
                  </span>
                  <span>
                    {t('click_delete')}{' '}
                    <strong className="text-base-content">
                      {t('delete_account')}
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-primary text-primary-content flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    4
                  </span>
                  <span>{t('confirm_deletion')}</span>
                </li>
              </ol>
            </div>

            {/* Warning Alert */}
            <div className="alert alert-warning mt-6">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.924-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{t('once_deleted')}</span>
            </div>

            {/* Help Section */}
            <div className="bg-primary/5 mt-6 rounded-lg p-6">
              <h2 className="text-base-content mt-0 mb-4 flex items-center gap-2 text-xl font-bold">
                <HiMail className="size-6" />
                {t('need_help')}
              </h2>
              <p className="text-base-content/80">
                {t('need_help_desc')}{' '}
                <a
                  className="link link-primary font-medium"
                  href="mailto:jjollpsl@gmail.com"
                >
                  jjollpsl@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
