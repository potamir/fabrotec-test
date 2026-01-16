import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "5");
  const skip = parseInt(searchParams.get("skip") || "0");
  const category = searchParams.get("category") || "all";
  const order = searchParams.get("order") || "asc";

  let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  if (category && category !== "all") {
    url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
    if (order) {
      url += `&sortBy=price&order=${order}`;
    }
  } else {
    url += `&sortBy=price&order=${order}`;
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
