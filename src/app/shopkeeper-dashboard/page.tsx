"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useAuth } from "@/context/AuthContext";
import AddProductForm from "@/components/shopkeeper/AddProductForm";
import ProductsList from "@/components/shopkeeper/ProductsList";

interface DashboardData {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export default function ShopkeeperDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "Shopkeeper") {
      router.push("/dashboard");
      return;
    }

    const loadDashboard = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/shopkeeper-dashboard`,
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, authLoading, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {data?.message}
              </h1>
              <p className="text-slate-300">
                Manage your shop and view your activity
              </p>
            </div>

            <AddProductForm
              onProductAdded={() => setRefreshKey((prev) => prev + 1)}
            />

            <ProductsList refreshKey={refreshKey} />
          </>
        )}
      </div>
    </main>
  );
}