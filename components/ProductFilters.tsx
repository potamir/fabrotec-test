"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CategoryProps } from "@/types/product";

interface ProductFiltersProps {
  categories: CategoryProps[];
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("category") || "all";
  const currentOrder = searchParams.get("order") || "asc";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-black mb-4">Filters</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={currentCategory}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category?.slug} value={category?.slug}>
              {category?.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort by Price
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => updateFilter("order", "asc")}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              currentOrder === "asc"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Low to High
          </button>
          <button
            onClick={() => updateFilter("order", "desc")}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              currentOrder === "desc"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            High to Low
          </button>
        </div>
      </div>
    </div>
  );
}
