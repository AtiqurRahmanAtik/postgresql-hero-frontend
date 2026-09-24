"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import Topbar from "@/components/shopkeeper/Topbar";
import AddProductForm from "@/components/shopkeeper/AddProductForm";
import EditProductForm from "@/components/shopkeeper/EditProductForm";

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

export default function ShopkeeperProductsPage() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, refreshKey]);

  const handleView = async (id: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
      );
      setViewProduct(res.data.product);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load product");
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/products/${id}`,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Product deleted successfully");
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Topbar title="Products" subtitle="All products listed in the store" />

      <main className="flex-1 px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-72 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                  <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase">
                    Shopkeeper ID
                  </th>
                  <th className="px-6 py-3 text-slate-500 text-xs font-semibold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      No products found
                    </td>
                  </tr>
                ) : (
                  data?.products.map((p) => (
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
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {p.name}
                            </p>
                            {p.description && (
                              <p className="text-xs text-slate-400 truncate max-w-xs">
                                {p.description}
                              </p>
                            )}
                          </div>
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
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {p.shopkeeper_id}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-3">
                        <button
                          onClick={() => handleView(p.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setEditProduct(p)}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                        >
                          {deletingId === p.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {data && data.products.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={!data.hasPreviousPage}
                  className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-slate-500 text-sm">
                  Page {data.currentPage} of {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!data.hasNextPage}
                  className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
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

      {editProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
            <div className="relative">
              <button
                onClick={() => setEditProduct(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg z-10"
              >
                ✕
              </button>
              <div className="bg-slate-900 rounded-2xl">
                <EditProductForm
                  product={editProduct}
                  onProductUpdated={() => {
                    setRefreshKey((prev) => prev + 1);
                    setEditProduct(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {viewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Product Details
            </h2>

            {viewProduct.image_url && (
              <img
                src={viewProduct.image_url}
                alt={viewProduct.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Name</p>
                <p className="text-slate-900 font-medium">{viewProduct.name}</p>
              </div>
              {viewProduct.description && (
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Description</p>
                  <p className="text-slate-900 text-sm">
                    {viewProduct.description}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Price</p>
                  <p className="text-slate-900 font-medium">
                    ${Number(viewProduct.price).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Stock</p>
                  <p className="text-slate-900 font-medium">
                    {viewProduct.stock}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">Category</p>
                <p className="text-slate-900 font-medium">
                  {viewProduct.category || "—"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewProduct(null)}
              className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}