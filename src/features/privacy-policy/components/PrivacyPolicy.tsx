import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="from-base-200 to-base-300 min-h-screen bg-gradient-to-br px-4 py-12">
      <div className="card bg-base-100 mx-auto max-w-4xl shadow-2xl">
        <div className="card-body prose prose-sm sm:prose lg:prose-lg max-w-none">
          {/* Header */}
          <div className="border-base-300 mb-6 border-b pb-6">
            <h1 className="text-base-content mb-2 text-4xl font-bold">
              {t('privacy_policy')}
            </h1>
            <p className="text-base-content/60 text-sm font-medium">
              {t('last_updated_privacy_policy')}
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-6">
            <p className="text-base-content/80 leading-relaxed">
              {t('privacy_policy_intro')}
            </p>
          </div>

          {/* Information We Collect */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('information_we_collect')}
            </h2>
            <p className="text-base-content/80 mb-3">
              {t('information_we_collect_desc')}
            </p>
            <ul className="text-base-content/80 ml-6 space-y-2">
              <li>
                <strong className="text-base-content">
                  {t('personal_information')}
                </strong>{' '}
                {t('personal_information_desc')}
              </li>
              <li>
                <strong className="text-base-content">{t('usage_data')}</strong>{' '}
                {t('usage_data_desc')}
              </li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('how_we_use_information')}
            </h2>
            <p className="text-base-content/80 mb-3">
              {t('we_use_information_desc')}
            </p>
            <ul className="text-base-content/80 ml-6 space-y-2">
              <li>{t('provide_and_maintain_service')}</li>
              <li>{t('authenticate_users')}</li>
              <li>{t('improve_your_experience')}</li>
              <li>{t('respond_to_inquiries')}</li>
            </ul>
          </section>

          {/* Share Information */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('share_information')}
            </h2>
            <p className="text-base-content/80">
              {t('share_information_desc')}
            </p>
          </section>

          {/* Facebook Login */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('facebook_login')}
            </h2>
            <p className="text-base-content/80">{t('facebook_login_desc')}</p>
          </section>

          {/* Google Login */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('google_login')}
            </h2>
            <p className="text-base-content/80">{t('google_login_desc')}</p>
          </section>

          {/* Data Retention */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('data_retention')}
            </h2>
            <p className="text-base-content/80">{t('data_retention_desc')}</p>
          </section>

          {/* Your Rights */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('your_rights')}
            </h2>
            <p className="text-base-content/80">
              {t('your_rights_desc')}{' '}
              <a
                href="mailto:jjollpsl@gmail.com"
                className="link-hover link text-primary font-medium"
              >
                jjollpsl@gmail.com
              </a>{' '}
              {t('for_requests')}
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('changes_to_policy')}
            </h2>
            <p className="text-base-content/80">
              {t('changes_to_policy_desc')}
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-6">
            <h2 className="text-base-content mb-3 text-2xl font-bold">
              {t('contact_us')}
            </h2>
            <p className="text-base-content/80">
              {t('contact_us_desc')}{' '}
              <a
                href="mailto:jjollpsl@gmail.com"
                className="link-hover link text-primary font-medium"
              >
                jjollpsl@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
