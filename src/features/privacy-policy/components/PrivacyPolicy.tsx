import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="h-screen bg-[#3e98fd] bg-cover pt-7">
      <div className="card mx-auto my-8 max-h-9/12 max-w-[800px] overflow-y-auto bg-gray-100 text-black shadow-xl shadow-[#3e98fd]">
        <div className="card-body">
          <h1 className="text-3xl font-bold">{t('privacy_policy')}</h1>
          <p className="mb-4 text-sm font-medium opacity-75">
            {t('last_updated_privacy_policy')}
          </p>

          <p className="mb-4">{t('privacy_policy_intro')}</p>

          <h2 className="text-lg font-bold">{t('information_we_collect')}</h2>
          <div className="mb-4 pl-6">
            <p>{t('information_we_collect_desc')}</p>
            <ul className="list-disc pl-12">
              <li>
                <strong>{t('personal_information')}</strong>{' '}
                {t('personal_information_desc')}
              </li>
              <li>
                <strong>{t('usage_data')}</strong> {t('usage_data_desc')}
              </li>
            </ul>
          </div>

          <h2 className="text-lg font-bold">{t('how_we_use_information')}</h2>
          <div className="mb-4 pl-6">
            <p>{t('we_use_information_desc')}</p>
            <ul className="list-disc pl-12">
              <li>{t('provide_and_maintain_service')}</li>
              <li>{t('authenticate_users')}</li>
              <li>{t('improve_your_experience')}</li>
              <li>{t('respond_to_inquiries')}</li>
            </ul>
          </div>

          <h2 className="text-lg font-bold">{t('share_information')}</h2>
          <p className="mb-4 ml-6">{t('share_information_desc')}</p>

          <h2 className="text-lg font-bold">{t('facebook_login')}</h2>
          <p className="mb-4 ml-6">{t('facebook_login_desc')}</p>

          <h2 className="text-lg font-bold">{t('google_login')}</h2>
          <p className="mb-4 ml-6">{t('google_login_desc')}</p>

          <h2 className="text-lg font-bold">{t('data_retention')}</h2>
          <p className="mb-4 ml-6">{t('data_retention_desc')}</p>

          <h2 className="text-lg font-bold">{t('your_rights')}</h2>
          <p className="mb-4 ml-6">
            {t('your_rights_desc')}{' '}
            <a href="mailto:jjollpsl@gmail.com">jjollpsl@gmail.com</a>{' '}
            {t('for_requests')}
          </p>

          <h2 className="text-lg font-bold">{t('changes_to_policy')}</h2>
          <p className="mb-4 ml-6">{t('changes_to_policy_desc')}</p>

          <h2 className="text-lg font-bold">{t('contact_us')}</h2>
          <p className="mb-4 ml-6">
            {t('contact_us_desc')}{' '}
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
