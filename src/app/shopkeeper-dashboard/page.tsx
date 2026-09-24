"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Topbar from "@/components/shopkeeper/Topbar";
import AddProductForm from "@/components/shopkeeper/AddProductForm";

interface DashboardData {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

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

export default function ShopkeeperDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardRes, productsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper-dashboard`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            params: { page: 1 },
          }),
        ]);
        setData(dashboardRes.data);
        setProductsData(productsRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [refreshKey]);

  const totalStock = productsData?.products.reduce((sum, p) => sum + p.stock, 0) || 0;
  const avgPrice =
    productsData && productsData.products.length > 0
      ? productsData.products.reduce((sum, p) => sum + Number(p.price), 0) /
        productsData.products.length
      : 0;
  const categories = new Set(
    productsData?.products.map((p) => p.category).filter(Boolean)
  ).size;

  if (loading) {
    return (
      <>
        <Topbar title="Dashboard" subtitle="Manage your shop and track your inventory" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Dashboard" subtitle={data?.message} />

      <main className="flex-1 px-8 py-8">
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition"
          >
            + Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-slate-500 text-sm mb-1">Total Products</p>
            <p className="text-2xl font-bold text-slate-900">
              {productsData?.totalProducts ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-slate-500 text-sm mb-1">Total Stock</p>
            <p className="text-2xl font-bold text-slate-900">{totalStock}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-slate-500 text-sm mb-1">Avg. Price</p>
            <p className="text-2xl font-bold text-slate-900">
              ${avgPrice.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-slate-500 text-sm mb-1">Categories</p>
            <p className="text-2xl font-bold text-slate-900">{categories}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Products
              </h2>
              <p className="text-slate-500 text-sm">Inventory overview</p>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {productsData?.products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    No products yet
                  </td>
                </tr>
              ) : (
                productsData?.products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-sm font-medium text-slate-900">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {p.category || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {p.stock}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
            <div className="relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg z-10"
              >
                ✕
              </button>
              <div className="bg-slate-900 rounded-2xl">
                <AddProductForm
                  onProductAdded={() => {
                    setRefreshKey((prev) => prev + 1);
                    setShowAddModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}