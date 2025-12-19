export default function () {
  return (
    <div className="modal-box mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-0 shadow-2xl">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton mb-1 h-7 w-48 rounded-lg"></div>
            <div className="skeleton h-4 w-64 rounded"></div>
          </div>
          <div className="skeleton h-8 w-8 rounded-full"></div>
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
        <div className="space-y-6">
          {/* Age Section Skeleton */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="skeleton mb-3 h-5 w-40 rounded"></div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1">
                <div className="skeleton mb-1 h-3 w-16 rounded"></div>
                <div className="skeleton h-10 w-full rounded-lg"></div>
              </div>
              <div className="skeleton h-4 w-4 rounded"></div>
              <div className="flex-1">
                <div className="skeleton mb-1 h-3 w-16 rounded"></div>
                <div className="skeleton h-10 w-full rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Gender Section Skeleton */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="skeleton mb-3 h-5 w-24 rounded"></div>
            <div className="skeleton h-10 w-full rounded-lg"></div>
          </div>

          {/* Location Section Skeleton */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="skeleton mb-3 h-5 w-28 rounded"></div>
            <div className="skeleton mb-3 h-10 w-full rounded-lg"></div>
            <div className="flex items-center">
              <div className="skeleton h-5 w-5 rounded"></div>
              <div className="skeleton ml-2 h-4 w-40 rounded"></div>
            </div>
          </div>

          {/* Max Distance Section Skeleton */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="skeleton h-5 w-32 rounded"></div>
              <div className="skeleton h-6 w-16 rounded"></div>
            </div>
            <div className="skeleton mb-2 h-6 w-full rounded-full"></div>
            <div className="flex justify-between">
              <div className="skeleton h-3 w-12 rounded"></div>
              <div className="skeleton h-3 w-16 rounded"></div>
            </div>
          </div>

          {/* Neutered Section Skeleton */}
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="skeleton mb-1 h-5 w-40 rounded"></div>
                <div className="skeleton h-3 w-56 rounded"></div>
              </div>
              <div className="skeleton h-6 w-12 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons Skeleton */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="skeleton flex-1 rounded-xl py-3"></div>
          <div className="skeleton flex-1 rounded-xl py-3"></div>
        </div>
      </div>
    </div>
  );
}
