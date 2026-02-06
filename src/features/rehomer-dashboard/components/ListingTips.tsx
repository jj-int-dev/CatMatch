import { useTranslation } from 'react-i18next';

export default function ListingTips() {
  const { t } = useTranslation();

  return (
    <div className="card bg-base-100 mt-8 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-primary mb-4 flex items-center gap-2">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          {t('listing_tips')}
        </h3>

        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="badge badge-primary badge-sm mt-1 shrink-0">1</div>
            <p className="text-base-content/80">{t('tip_1')}</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="badge badge-secondary badge-sm mt-1 shrink-0">
              2
            </div>
            <p className="text-base-content/80">{t('tip_2')}</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="badge badge-accent badge-sm mt-1 shrink-0">3</div>
            <p className="text-base-content/80">{t('tip_3')}</p>
          </li>
          <li className="flex items-start gap-3">
            <div className="badge badge-info badge-sm mt-1 shrink-0">4</div>
            <p className="text-base-content/80">{t('tip_4')}</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
