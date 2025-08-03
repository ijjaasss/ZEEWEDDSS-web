export const SkeletonLoader = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    <div className="relative aspect-square overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
    </div>
    <div className="p-3 space-y-2">
      <div className="h-4 rounded bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
      </div>
      <div className="h-3 rounded bg-gray-100 relative overflow-hidden w-1/2">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
      </div>
    </div>
  </div>
);