"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";


interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AdminDashboardData {
  message: string;
  admin: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  totalUsers: number;
  users: UserRow[];
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  

 useEffect(() => {
  if (authLoading) return;

  if (!user) {
    router.push("/login");
    return;
  }

  if (user.role !== "Admin") {
    router.push("/user-dashboard");
    return;
  }

  const loadDashboard = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
        {
          withCredentials: true,
        }
      );

      setData(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, [user, authLoading, router]);



  const handleViewUser = async (id: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        { withCredentials: true }
      );
      setSelectedUser(res.data.user);
      setShowModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to load user");
    }
  };

  const handleRoleChange = async (id: number, role: string) => {
    setUpdatingId(id);
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/role/${id}`,
        { role },
        { withCredentials: true }
      );

      setData((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.map((u) =>
                u.id === id ? res.data.user : u
              ),
            }
          : prev
      );

      toast.success(res.data.message || "Role updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
        { withCredentials: true }
      );

      setData((prev) =>
        prev
          ? {
              ...prev,
              totalUsers: prev.totalUsers - 1,
              users: prev.users.filter((u) => u.id !== id),
            }
          : prev
      );

      toast.success(res.data.message || "User deleted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
     

      <div className="max-w-6xl mx-auto px-4 py-12">
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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {data?.message}
              </h1>
              <p className="text-slate-300">
                Logged in as {data?.admin.name} ({data?.admin.email})
              </p>
              <div className="mt-4 inline-block bg-purple-600/20 border border-purple-500/30 rounded-lg px-4 py-2">
                <span className="text-purple-300 text-sm font-medium">
                  Total Users: {data?.totalUsers}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-slate-300 text-sm font-semibold">
                      ID
                    </th>
                    <th className="px-6 py-3 text-slate-300 text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-3 text-slate-300 text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-3 text-slate-300 text-sm font-semibold">
                      Role
                    </th>
                    <th className="px-6 py-3 text-slate-300 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-3 text-slate-300 text-sm">
                        {u.id}
                      </td>
                      <td className="px-6 py-3 text-white text-sm">
                        {u.name}
                      </td>
                      <td className="px-6 py-3 text-slate-300 text-sm">
                        {u.email}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        {u.role === "Admin" ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300">
                            {u.role}
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            disabled={updatingId === u.id}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value)
                            }
                            className="bg-white/10 border border-white/20 text-slate-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                          >
                            <option value="User" className="bg-slate-800">
                              User
                            </option>
                            <option
                              value="Shopkeeper"
                              className="bg-slate-800"
                            >
                              Shopkeeper
                            </option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm space-x-3">
                        <button
                          onClick={() => handleViewUser(u.id)}
                          className="text-purple-400 hover:text-purple-300 font-medium"
                        >
                          View
                        </button>
                        {u.role !== "Admin" && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={deletingId === u.id}
                            className="text-red-400 hover:text-red-300 font-medium disabled:opacity-50"
                          >
                            {deletingId === u.id ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">
              User Details
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">ID</p>
                <p className="text-white font-medium">{selectedUser.id}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Name</p>
                <p className="text-white font-medium">{selectedUser.name}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Email</p>
                <p className="text-white font-medium">{selectedUser.email}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-slate-400 text-xs mb-1">Role</p>
                <p className="text-white font-medium">{selectedUser.role}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}