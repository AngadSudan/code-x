"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

type OrgRegisterData = {
    name: string;
    email: string;
    username: string;
    password: string;
    tagline: string;
};

export default function OrgRegisterPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OrgRegisterData>();

    const onSubmit = async (data: OrgRegisterData) => {
        try {
            setLoading(true);

            const res = await fetch(backendUrl + "/api/v1/auth/register/org", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            console.log("Org registered:", result);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500 blur-2xl opacity-20"></div>

                <div className="relative bg-[#0a0a0a] border border-emerald-500/30 rounded-2xl p-10 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Register Organization
                        </h1>
                        <p className="text-gray-400 text-sm mt-2">
                            Create your organization account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Organization Name */}
                        <div>
                            <label className="text-sm text-gray-300">Organization Name</label>
                            <input
                                {...register("name", {
                                    required: "Name is required",
                                    pattern: {
                                        value: /^[A-Za-z]/,
                                        message: "Must not start with number",
                                    },
                                })}
                                className="w-full mt-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm text-gray-300">Email</label>
                            <input
                                {...register("email", {
                                    required: "Email required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+$/,
                                        message: "Invalid email",
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

                        {/* Username */}
                        <div>
                            <label className="text-sm text-gray-300">Username</label>
                            <input
                                {...register("username", {
                                    required: "Username required",
                                    pattern: {
                                        value: /^[A-Za-z][A-Za-z0-9_]*$/,
                                        message: "Must start with letter",
                                    },
                                })}
                                className="w-full mt-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Tagline */}
                        <div>
                            <label className="text-sm text-gray-300">Tagline</label>
                            <input
                                {...register("tagline", {
                                    required: "Tagline required",
                                })}
                                placeholder="We build future engineers..."
                                className="w-full mt-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.tagline && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.tagline.message}
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
                                        required: "Password required",
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
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            Register
                        </button>
                    </form>

                    {/* Switch Links */}
                    <div className="mt-6 space-y-2 text-center text-sm text-gray-400">
                        <p>
                            Already have an organization account?{" "}
                            <Link href="/org/login" className="text-white hover:underline">
                                Login
                            </Link>
                        </p>

                        <p>
                            Are you an interviewer?{" "}
                            <Link
                                href="/interviewer/login"
                                className="text-emerald-400 hover:underline"
                            >
                                Switch to Interviewer
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
