"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users",
        data
      );

      console.log("Registration successful:", response.data);

      alert("User registered successfully!");

      reset();
    } catch (error) {
      console.error("Registration error:", error);

      alert("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Register
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">
              Name
            </label>

            <input
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              className="w-full border rounded-md px-3 py-2"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full border rounded-md px-3 py-2"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full border rounded-md px-3 py-2"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>

        </form>
      </div>
    </div>
  );
}