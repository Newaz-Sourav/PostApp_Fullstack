const LoadingSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 shadow rounded-xl p-5 animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-11/12"></div>
      <div className="h-4 bg-gray-300 rounded w-9/12"></div>
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
