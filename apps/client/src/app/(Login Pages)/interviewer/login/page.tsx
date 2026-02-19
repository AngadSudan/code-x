"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type InterviewerLoginData = {
    email: string;
    password: string;
};

export default function InterviewerLoginPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InterviewerLoginData>();

    const onSubmit = async (data: InterviewerLoginData) => {
        try {
            setLoading(true);

            // 🚀 API PLACEHOLDER
            await fetch(backendUrl + "/api/v1/auth/login/interviewer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("Interviewer login:", data);

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

                <div className="relative bg-[#0a0a0a] border border-emerald-500/30 rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-2xl font-bold text-white text-center mb-6">
                        Interviewer Login
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        <div>
                            <input
                                {...register("email", {
                                    required: "Email required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+$/,
                                        message: "Invalid email",
                                    },
                                })}
                                placeholder="Email"
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password required",
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex justify-center items-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
