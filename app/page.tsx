import { Suspense } from "react";
import ProductList from "@/components/ProductList";
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
          <aside className="w-64 shrink-0">
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
            <ProductList
              key={`${category}-${order}`}
              initialProducts={productsData.products}
              total={productsData.total}
              skip={productsData.skip}
              limit={productsData.limit}
              category={category}
              order={order}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
