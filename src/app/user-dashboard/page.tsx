"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useAuth } from "@/context/AuthContext";


interface DashboardData {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user-dashboard`,
          { withCredentials: true }
        );
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, authLoading, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
     

      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {data?.message}
            </h1>
            <p className="text-slate-300 mb-8">
              Manage your account and view your activity
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <p className="text-slate-400 text-xs mb-1">Full Name</p>
                <p className="text-white font-medium">{data?.user.name}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <p className="text-slate-400 text-xs mb-1">Email</p>
                <p className="text-white font-medium">{data?.user.email}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <p className="text-slate-400 text-xs mb-1">Role</p>
                <p className="text-white font-medium">{data?.user.role}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                <p className="text-slate-400 text-xs mb-1">User ID</p>
                <p className="text-white font-medium">{data?.user.id}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}