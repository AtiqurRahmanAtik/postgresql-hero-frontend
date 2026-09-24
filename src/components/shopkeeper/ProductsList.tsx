"use client";

import { useEffect, useState } from "react";
import axios from "axios";


interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  image_url: string | null;
  shopkeeper_id: number;
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  totalProducts: number;
  currentPage: number;
  productsPerPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  search: string;
  products: Product[];
}

interface ProductsListProps {
  refreshKey: number;
}

export default function ProductsList({ refreshKey }: ProductsListProps) {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            params: { page, search },
          }
        );
        setData(res.data);
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, refreshKey]);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Products</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !data || data.products.length === 0 ? (
        <p className="text-slate-400 text-center py-10">No products found</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.products.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 border border-white/10 rounded-lg p-5"
              >
                {/* {p.image_url && (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )} */}
                <p className="text-white font-semibold">{p.name}</p>
                {p.category && (
                  <p className="text-slate-400 text-xs mb-2">{p.category}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-purple-300 font-medium">
                    ${Number(p.price).toFixed(2)}
                  </span>
                  <span className="text-slate-400 text-xs">
                    Stock: {p.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={!data.hasPreviousPage}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-slate-300 text-sm">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!data.hasNextPage}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}