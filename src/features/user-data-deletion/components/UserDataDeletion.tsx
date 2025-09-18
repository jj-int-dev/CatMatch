import { useTranslation } from 'react-i18next';
import { useSetNavigationColor } from '../../../hooks/useSetNavigationColor';

export default function UserDataDeletion() {
  const { t } = useTranslation();
  useSetNavigationColor('[#3e98fd]');

  return (
    <div className="h-screen bg-[#3e98fd] bg-cover pt-7">
      <div className="card mx-auto my-10 max-h-9/12 max-w-[800px] overflow-y-auto bg-gray-100 text-black shadow-xl shadow-[#3e98fd]">
        <div className="card-body">
          <h1 className="text-3xl font-bold">{t('user_data_deletion')}</h1>
          <p className="mb-4 text-sm font-medium opacity-75">
            {t('last_updated_deletion')}
          </p>

          <p className="mb-3">{t('user_data_deletion_desc')}</p>
          <h2 className="text-lg font-bold">{t('how_to_delete')}</h2>
          <div>
            <p>{t('how_to_delete_desc')}</p>
            <ol className="mb-4 list-decimal pl-8">
              <li>{t('log_in_account')}</li>
              <li>{t('go_to_profile')}</li>
              <li>
                {t('click_delete')} <strong>{t('delete_account')}</strong>.
              </li>
              <li>{t('confirm_deletion')}</li>
            </ol>
          </div>
          <p className="mb-4">{t('once_deleted')}</p>
          <h2 className="text-lg font-bold">{t('need_help')}</h2>
          <p>
            {t('need_help_desc')}{' '}
            <a
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
              href="mailto:jjollpsl@gmail.com"
            >
              jjollpsl@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
