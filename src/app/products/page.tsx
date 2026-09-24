// app/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const LIMIT = 10;

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  image_url?: string;
  description?: string;
}

interface ProductsResponse {
  products?: Product[];
  data?: Product[];
  totalPages?: number;
  total_pages?: number;
}

function formatPrice(value: number | string): string {
  const n = Number(value);
  return Number.isNaN(n)
    ? String(value)
    : n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

type StockState = "out" | "low" | "in";

const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
  const state: StockState = stock <= 0 ? "out" : stock <= 5 ? "low" : "in";
  const styles: Record<StockState, string> = {
    out: "bg-red-100 text-red-700",
    low: "bg-amber-100 text-amber-700",
    in: "bg-emerald-100 text-emerald-700",
  };
  const label =
    state === "out" ? "Out of stock" : state === "low" ? `Only ${stock} left` : "In stock";
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[state]}`}>
      {label}
    </span>
  );
};

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products?page=${page}&limit=${LIMIT}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
        const data: ProductsResponse = await res.json();

        if (!cancelled) {
          setProducts(data.products ?? data.data ?? []);
          setTotalPages(data.totalPages ?? data.total_pages ?? 1);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const goToPage = (p: number): void => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-1">
          Page {page} of {totalPages}
        </p>
      </header>

      {loading && <p className="text-center text-gray-500 py-16">Loading products…</p>}
      {error && <p className="text-center text-red-600 py-16">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 py-16">No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-600 hover:-translate-y-0.5 transition block"
              >
                <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-gray-300 font-semibold">
                      {product.name?.[0] ?? "?"}
                    </span>
                  )}
                  {product.category && (
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                    <StockBadge stock={product.stock} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  p === page
                    ? "bg-emerald-700 text-white"
                    : "border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;