import ProductSkeleton from "./ProductSkeleton";

export default function ProductGridSkeleton() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </>
  );
}
