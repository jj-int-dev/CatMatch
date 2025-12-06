import { useTranslation } from 'react-i18next';
import { IoAddCircleOutline } from 'react-icons/io5';

export default function RehomerDashboardEmpty() {
  const { t } = useTranslation();

  return (
    <div className="mt-7 flex flex-col items-center justify-center">
      <div className="bg-base-100 rounded-box max-w-md p-12 text-center shadow-md">
        <div className="mb-4 text-6xl opacity-40">🐱</div>
        <h2 className="mb-4 text-2xl font-bold">
          {t('no_cat_listings_title')}
        </h2>
        <p className="mb-6 text-gray-600">{t('no_cat_listings_desc')}</p>
        <button className="btn btn-success">
          <IoAddCircleOutline className="size-5" />
          {t('add_first_cat')}
        </button>
      </div>
    </div>
  );
}
