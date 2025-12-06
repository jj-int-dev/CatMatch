export default function RehomerDashboardSkeleton() {
  return (
    <div className="bg-base-100 rounded-box shadow-md">
      <div className="p-4 pb-2">
        <div className="skeleton h-[1rem] w-[6rem]" />
      </div>

      {/* Loading list items */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="list-row border-base-200 border-b last:border-b-0"
        >
          <div className="flex items-start gap-4 p-4">
            <div className="skeleton rounded-box h-24 w-24" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-4 w-48" />
              <div className="space-y-1">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-3/4" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-10 w-10 rounded" />
              <div className="skeleton h-10 w-10 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
