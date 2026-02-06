import { useTranslation } from 'react-i18next';

export default function DiscoveryLoading() {
  const { t } = useTranslation();

  return (
    <div className="from-base-100 to-base-200 min-h-screen bg-gradient-to-br p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8 text-center">
          <div className="skeleton mx-auto mb-4 h-12 w-64 rounded-lg md:h-14 md:w-80" />
          <div className="skeleton mx-auto h-6 w-96 rounded" />
        </div>

        {/* Search Bar and Controls Skeleton */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="skeleton h-14 w-full rounded-lg md:w-64" />
          <div className="space-y-2 text-center md:text-right">
            <div className="skeleton mx-auto h-6 w-40 rounded md:ml-auto" />
            <div className="skeleton mx-auto h-4 w-32 rounded md:ml-auto" />
          </div>
        </div>

        {/* Cats Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="card bg-base-100 overflow-hidden shadow-lg"
            >
              {/* Image Skeleton */}
              <div className="skeleton h-48 w-full rounded-none" />

              <div className="card-body">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="skeleton h-6 w-32 rounded" />
                    <div className="flex flex-wrap gap-2">
                      <div className="skeleton h-6 w-16 rounded-full" />
                      <div className="skeleton h-6 w-20 rounded-full" />
                      <div className="skeleton h-6 w-24 rounded-full" />
                    </div>
                  </div>
                  <div className="skeleton h-8 w-16 rounded" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                </div>

                {/* Button */}
                <div className="mt-4">
                  <div className="skeleton h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-12 flex justify-center">
          <div className="join gap-2">
            <div className="skeleton h-12 w-12 rounded-lg" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-12 rounded-lg" />
            ))}
            <div className="skeleton h-12 w-12 rounded-lg" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3">
            <span className="loading loading-spinner loading-md text-primary" />
            <p className="text-base-content/70">
              {t('loading_cats', 'Loading cats...')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
