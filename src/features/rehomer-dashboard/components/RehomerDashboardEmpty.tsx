import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { IoAddCircleOutline } from 'react-icons/io5';
import { HiSparkles } from 'react-icons/hi2';

export default function RehomerDashboardEmpty() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToAddAnimalListingPage = () => navigate('/rehomer/animal/add');

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <div className="card bg-base-100 w-full max-w-md shadow-xl">
        <div className="card-body items-center text-center">
          {/* Decorative Icon */}
          <div className="bg-primary/10 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
            <div className="text-6xl">🐱</div>
          </div>

          {/* Title */}
          <h2 className="card-title text-base-content text-2xl font-bold">
            {t('no_cat_listings_title')}
          </h2>

          {/* Description */}
          <p className="text-base-content/70 mt-2 mb-6 max-w-sm">
            {t('no_cat_listings_desc')}
          </p>

          {/* Call to Action */}
          <div className="card-actions w-full">
            <button
              className="btn btn-primary btn-lg w-full gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={goToAddAnimalListingPage}
            >
              <IoAddCircleOutline className="size-6" />
              <span>{t('add_first_cat')}</span>
            </button>
          </div>

          {/* Helpful Tips */}
          <div className="bg-base-200/50 mt-6 w-full rounded-lg p-4">
            <div className="flex items-start gap-3">
              <HiSparkles className="text-primary mt-0.5 size-5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-base-content/80 text-sm">
                  {t('empty_dashboard_tip')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
