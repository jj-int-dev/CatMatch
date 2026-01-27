import { useTranslation } from 'react-i18next';

export default function DiscoveryLoading() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#f9f9f9] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="skeleton mx-auto mb-4 h-12 w-64 rounded-lg md:h-14 md:w-80"></div>
          <div className="skeleton mx-auto h-6 w-96 rounded"></div>
        </div>

        {/* Search Bar and Controls Skeleton */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="skeleton h-12 w-48 rounded-lg"></div>
          <div className="text-center md:text-right">
            <div className="skeleton mb-2 h-6 w-32 rounded"></div>
            <div className="skeleton h-4 w-24 rounded"></div>
          </div>
        </div>

        {/* Cats Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="card card-compact rounded-box bg-base-100 overflow-hidden border shadow-lg"
            >
              <div className="skeleton h-48 w-full"></div>
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="skeleton mb-2 h-6 w-32 rounded"></div>
                    <div className="flex flex-wrap gap-2">
                      <div className="skeleton h-5 w-16 rounded-full"></div>
                      <div className="skeleton h-5 w-20 rounded-full"></div>
                      <div className="skeleton h-5 w-24 rounded-full"></div>
                    </div>
                  </div>
                  <div className="skeleton h-8 w-16 rounded"></div>
                </div>
                <div className="skeleton mt-3 h-4 w-full rounded"></div>
                <div className="skeleton mt-2 h-4 w-3/4 rounded"></div>
                <div className="skeleton mt-4 h-10 w-full rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-12 flex justify-center">
          <div className="join">
            <div className="skeleton join-item h-10 w-10 rounded"></div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="skeleton join-item h-10 w-10 rounded"
              ></div>
            ))}
            <div className="skeleton join-item h-10 w-10 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
