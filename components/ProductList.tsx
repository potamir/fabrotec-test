"use client";

import { useState, useTransition, useEffect } from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { Product } from "@/types/product";

interface ProductListProps {
  initialProducts: Product[];
  total: number;
  skip: number;
  limit: number;
  category: string;
  order: string;
}

export default function ProductList({
  initialProducts,
  total,
  skip: initialSkip,
  limit,
  category,
  order,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [skip, setSkip] = useState(initialSkip);
  const [isLoading, startTransition] = useTransition();
  const hasMore = products.length < total;

  const prefetchNextPage = async () => {
    const newSkip = skip + limit;
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: newSkip.toString(),
    });

    if (category && category !== "all") {
      params.set("category", category);
    }
    params.set("order", order);

    fetch(`/api/products?${params.toString()}`);
  };

  useEffect(() => {
    if (hasMore) {
      prefetchNextPage();
    }
  }, [category, order]);

  const loadMore = async () => {
    const newSkip = skip + limit;
    startTransition(async () => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          skip: newSkip.toString(),
        });

        if (category && category !== "all") {
          params.set("category", category);
        }
        params.set("order", order);

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to load more products");

        const data = await response.json();
        setProducts((prev) => [...prev, ...data.products]);
        setSkip(newSkip);

        if (products.length + data.products.length < total) {
          const nextParams = new URLSearchParams({
            limit: limit.toString(),
            skip: (newSkip + limit).toString(),
          });
          if (category && category !== "all") {
            nextParams.set("category", category);
          }
          nextParams.set("order", order);
          fetch(`/api/products?${nextParams.toString()}`);
        }
      } catch (error) {
        console.error("Error loading more products:", error);
      }
    });
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          Showing {products.length} products of {total}
          {category !== "all" && ` in ${category}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ProductSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className={`w-full mt-4 py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Loading..." : "Show More"}
        </button>
      )}

      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </>
  );
}
