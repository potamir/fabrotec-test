import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { fetchProducts, fetchCategories } from "@/lib/api";
import { SortOrder } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 300;

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    order?: SortOrder;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const category = params.category || "all";
  const order = params.order || "asc";

  const [productsData, categories] = await Promise.all([
    fetchProducts(category, "price", order),
    fetchCategories(),
  ]);

  console.log(productsData);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Products Store</h1>
          <p className="text-gray-600 mt-1">
            Browse our collection of products
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <Suspense
              fallback={
                <div className="bg-white rounded-lg shadow-md p-6">
                  Loading filters...
                </div>
              }
            >
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {productsData?.products?.length} products of{" "}
                {productsData?.total}
                {category !== "all" && ` in ${category}`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <button
              className={`w-full mt-4 py-3 px-6 rounded-lg font-semibold text-white transition-colors 
              ${
                productsData?.products?.length === productsData?.total
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }}`}
              disabled={productsData?.products?.length === productsData?.total}
            >
              Show More
            </button>
            {productsData.products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
