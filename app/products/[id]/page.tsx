import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProductById } from "@/lib/api";
import ImageCarousel from "@/components/ImageCarousel";

export const dynamic = "force-dynamic";
export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { id } = await params;
    const product = await fetchProductById(parseInt(id));

    return {
      title: product.title,
      description: product.description,
    };
  } catch {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product;
  try {
    product = await fetchProductById(parseInt(id));
  } catch {
    notFound();
  }

  const availabilityBadge = () => {
    if (product.stock === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Out of Stock
        </span>
      );
    } else if (product.stock < 10) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          Low Stock ({product.stock} left)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          In Stock
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Products
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <ImageCarousel images={product.images} alt={product.title} />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.title}
                </h1>
                {availabilityBadge()}
              </div>

              <div className="border-t border-b py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discountPercentage && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        $
                        {(
                          product.price *
                          (1 + product.discountPercentage / 100)
                        ).toFixed(2)}
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        Save {product.discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.rating && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Rating
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating!)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating.toFixed(1)} out of 5
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {product.brand && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Brand</p>
                    <p className="font-semibold text-gray-900">
                      {product.brand}
                    </p>
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {product.category}
                  </p>
                </div>
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  product.stock > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
