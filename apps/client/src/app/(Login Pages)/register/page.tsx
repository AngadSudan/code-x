"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormData = {
    email: string;
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const backendurl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const password = watch("password");

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const res = await fetch(backendurl + "/api/v1/auth/register/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    name: data.name,
                    username: data.username,
                    password: data.password,
                }),
            });

            if (!res.ok) throw new Error("Something went wrong");

            const result = await res.json();
            console.log(result);
            router.push("/dashboard");

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="relative w-full max-w-3xl">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500 blur-2xl opacity-20"></div>

                <div className="relative bg-[#0a0a0a] border border-emerald-500/30 rounded-2xl p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Create an Account
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Register as User
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="text-sm text-gray-300">Email</label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+$/,
                                        message: "Email must contain @",
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

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300">Name</label>
                                <input
                                    {...register("name", {
                                        required: "Name is required",
                                        pattern: {
                                            value: /^[A-Za-z][A-Za-z\s]*$/,
                                            message: "Name cannot start with number",
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

                            <div>
                                <label className="text-sm text-gray-300">Username</label>
                                <input
                                    {...register("username", {
                                        required: "Username is required",
                                        pattern: {
                                            value: /^[A-Za-z][A-Za-z\s]*$/,
                                            message: "Username cannot start with number",
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

                        {/* Confirm Password */}
                        <div>
                            <label className="text-sm text-gray-300">
                                Confirm Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: "Please confirm password",
                                        validate: (value) =>
                                            value === password || "Passwords do not match",
                                    })}
                                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white pr-12 focus:border-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
