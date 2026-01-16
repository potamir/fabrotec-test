import { ProductsResponse, Product, CategoryProps } from "@/types/product";

const API_BASE_URL = "https://dummyjson.com";
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

function getCacheKey(endpoint: string): string {
  return endpoint;
}

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function fetchProducts(
  category?: string,
  sortBy?: string,
  order?: "asc" | "desc"
): Promise<ProductsResponse> {
  let url = `${API_BASE_URL}/products?limit=5`;

  if (category && category !== "all") {
    url = `${API_BASE_URL}/products/category/${category}`;
    if (sortBy) {
      url += `?sortBy=${sortBy}&order=${order || "asc"}`;
    }
  } else if (sortBy) {
    url += `&sortBy=${sortBy}&order=${order || "asc"}`;
  }

  const cacheKey = getCacheKey(url);
  const cached = getCachedData<ProductsResponse>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchProductById(id: number): Promise<Product> {
  const cacheKey = getCacheKey(`/products/${id}`);
  const cached = getCachedData<Product>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Product = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

export async function fetchCategories(): Promise<
  Array<{ name: string; slug: string }>
> {
  const cacheKey = getCacheKey("/products/categories");
  const cached = getCachedData<CategoryProps[]>(cacheKey);

  if (cached) {
    return cached.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    }));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoryProps[] = await response.json();
    const categories = data.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
    }));
    setCachedData(cacheKey, data);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
