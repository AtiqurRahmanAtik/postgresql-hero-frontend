"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { productSchema, ProductFormData, ProductFormInput } from "@/lib/validations/product";

interface AddProductFormProps {
  onProductAdded: () => void;
}

export default function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} = useForm<ProductFormInput, any, ProductFormData>({
  resolver: zodResolver(productSchema),
});

  const onSubmit = async (data: ProductFormData) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/products`,
        {
          name: data.name,
          description: data.description || null,
          price: data.price,
          stock: data.stock,
          category: data.category || null,
          image_url: data.image_url || null,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Product created successfully");
      reset();
      onProductAdded();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create product");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
      <h2 className="text-xl font-bold text-white mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1.5">
            Product Name
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Wireless Headphones"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1.5">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Product details..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            {errors.price && (
              <p className="text-red-400 text-xs mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1.5">
              Stock
            </label>
            <input
              type="number"
              {...register("stock")}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
            {errors.stock && (
              <p className="text-red-400 text-xs mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1.5">
            Category
          </label>
          <input
            type="text"
            {...register("category")}
            placeholder="Electronics"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          {errors.category && (
            <p className="text-red-400 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-1.5">
            Image URL
          </label>
          <input
            type="text"
            {...register("image_url")}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
          {errors.image_url && (
            <p className="text-red-400 text-xs mt-1">
              {errors.image_url.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}