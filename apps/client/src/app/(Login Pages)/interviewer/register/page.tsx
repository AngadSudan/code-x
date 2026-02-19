"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type CreateInterviewerData = {
    name: string;
    email: string;
    username: string;
};

export default function CreateInterviewerPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateInterviewerData>();

    const onSubmit = async (data: CreateInterviewerData) => {
        try {
            setLoading(true);

            // 🚀 API PLACEHOLDER
            await fetch(backendUrl + "/api/v1/auth/register/interviewer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("Interviewer created:", data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-2xl"></div>

                <div className="relative bg-[#0a0a0a] border border-emerald-500/30 rounded-2xl p-10 shadow-2xl">
                    <h1 className="text-3xl font-bold text-white text-center mb-8">
                        Create Interviewer
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Name */}
                        <div>
                            <input
                                {...register("name", {
                                    required: "Name is required",
                                    pattern: {
                                        value: /^[A-Za-z]/,
                                        message: "Must not start with number",
                                    },
                                })}
                                placeholder="Full Name"
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                {...register("email", {
                                    required: "Email required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+$/,
                                        message: "Invalid email",
                                    },
                                })}
                                placeholder="Interviewer Email"
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <input
                                {...register("username", {
                                    required: "Username required",
                                    pattern: {
                                        value: /^[A-Za-z][A-Za-z0-9_]*$/,
                                        message: "Must start with letter",
                                    },
                                })}
                                placeholder="Username"
                                className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-emerald-500"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        {/* <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password required",
                                    })}
                                    placeholder="Temporary Password"
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
                            
                        </div> */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex justify-center items-center gap-2 disabled:opacity-60"
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Creating..." : "Create Interviewer"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
