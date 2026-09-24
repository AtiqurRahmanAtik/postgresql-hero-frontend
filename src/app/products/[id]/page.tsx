// app/products/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
  description?: string;
}

interface ProductResponse {
  product?: Product;
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

const ProductDetailsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
        const data: ProductResponse | Product = await res.json();
        if (!cancelled) setProduct((data as ProductResponse).product ?? (data as Product));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddToCart = (): void => {
    if (!product || product.stock <= 0) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-24">Loading product…</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-24">{error}</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500 py-24">Product not found.</p>;
  }

  const maxQty = Math.max(product.stock, 0);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 md:px-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-emerald-700 font-semibold text-sm mb-5"
        >
          ← Back to products
        </button>

        <div className="grid md:grid-cols-2 gap-10 bg-white border border-gray-200 rounded-xl p-8">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-7xl text-gray-300 font-semibold">
                {product.name?.[0] ?? "?"}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {product.category && (
              <span className="text-sm text-gray-500">{product.category}</span>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xl font-semibold text-emerald-700">{formatPrice(product.price)}</p>
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            )}
            <StockBadge stock={product.stock} />

            {maxQty > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <label htmlFor="qty" className="text-sm font-semibold">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 bg-gray-100 hover:bg-gray-200"
                  >
                    −
                  </button>
                  <input
                    id="qty"
                    type="number"
                    value={qty}
                    min={1}
                    max={maxQty}
                    onChange={(e) =>
                      setQty(Math.min(Math.max(1, Number(e.target.value) || 1), maxQty))
                    }
                    className="w-12 h-9 text-center border-x border-gray-300"
                  />
                  <button
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    className="w-9 h-9 bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={maxQty <= 0}
              className="mt-3 w-full py-3 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {maxQty <= 0 ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;