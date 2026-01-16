import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
