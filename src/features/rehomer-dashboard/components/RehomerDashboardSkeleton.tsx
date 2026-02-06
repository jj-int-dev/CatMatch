export default function RehomerDashboardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg">
      {/* Header */}
      <div className="border-base-200 border-b p-4">
        <div className="skeleton h-6 w-32" />
      </div>

      {/* Loading list items */}
      <div className="divide-base-200 divide-y">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex gap-4">
              {/* Image skeleton */}
              <div className="skeleton h-24 w-24 flex-shrink-0 rounded-lg" />

              {/* Content skeleton */}
              <div className="flex-1 space-y-3">
                <div className="skeleton h-6 w-40" />
                <div className="skeleton h-4 w-full max-w-md" />
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-16 rounded-full" />
                  <div className="skeleton h-6 w-20 rounded-full" />
                  <div className="skeleton h-6 w-24 rounded-full" />
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-2">
                <div className="skeleton h-10 w-10 rounded-lg" />
                <div className="skeleton h-10 w-10 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
