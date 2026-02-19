"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

type OrgLoginData = {
    email: string;
    password: string;
};

export default function OrgLoginPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrgLoginData>();

    const onSubmit = async (data: OrgLoginData) => {
        try {
            setLoading(true);

            const res = await fetch(backendUrl + "/api/v1/auth/login/org", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            console.log(result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-2xl"></div>

                <div className="relative bg-[#0a0a0a] border border-emerald-500/30 p-8 rounded-2xl">
                    <h1 className="text-2xl font-bold text-white text-center mb-6">
                        Organization Login
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Email */}
                        <div>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+$/,
                                        message: "Invalid email",
                                    },
                                })}
                                placeholder="Organization Email"
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                    placeholder="Password"
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
                                href="/org/forgot-password"
                                className="text-emerald-400 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex justify-center items-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Switch Links */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        <p>
                            Are you an interviewer?{" "}
                            <Link
                                href="/interviewer/login"
                                className="text-white hover:underline"
                            >
                                Switch to Interviewer
                            </Link>
                        </p>

                        <p className="mt-2">
                            Don’t have an organization account?{" "}
                            <Link
                                href="/org/register"
                                className="text-emerald-400 hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
