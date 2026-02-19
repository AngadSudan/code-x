"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginFormData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true);

            const res = await fetch(backendUrl + "/api/v1/auth/login/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            console.log(data);
            if (!res.ok) throw new Error("Invalid credentials");

            const result = await res.json();
            console.log("Login success:", result);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500 blur-2xl opacity-20"></div>

                <div className="relative bg-[#0a0a0a] border border-emerald-500/30 rounded-2xl p-10 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Login to your account
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="text-sm text-gray-300">Email</label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+$/,
                                        message: "Invalid email format",
                                    },
                                })}
                                className="w-full mt-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-sm text-gray-300">Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white pr-12 focus:border-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right text-sm">
                            <Link
                                href="/forgot-password"
                                className="text-emerald-400 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don’t have an account?{" "}
                        <Link href="/register" className="text-white hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
