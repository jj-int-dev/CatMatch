import { useTranslation } from 'react-i18next';

export default function ListingTips() {
  const { t } = useTranslation();

  return (
    <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">{t('listing_tips')}</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t('tip_1')}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t('tip_2')}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t('tip_3')}</span>
        </li>
        <li className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span>{t('tip_4')}</span>
        </li>
      </ul>
    </div>
  );
}
