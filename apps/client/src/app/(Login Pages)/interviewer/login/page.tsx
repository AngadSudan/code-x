"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useInterviewer } from "@/store/interviewer-store";
import Link from "next/link";
import Image from "next/image";
import interviewerLogin from "../../../../../public/images/interviewerLogin.jpg";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type InterviewerLoginData = {
  email: string;
  password: string;
};

export default function InterviewerLoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewerLoginData>();
  const router = useRouter();
  const { setData } = useInterviewer();
  const onSubmit = async (data: InterviewerLoginData) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/api/v1/auth/login/interviewer",
        data,
      );
      toast.success("Logged in successfully!");
      setData(res.data.data.data);
      router.push("/profile");
    } catch (err) {
      toast.error("Failed to login. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-black overflow-hidden px-4 py-4 md:px-6 md:py-6 font-mono">
      <div className="mx-auto grid h-full w-full max-w-7xl items-center gap-6 lg:grid-cols-2">
        <div className="relative hidden h-full min-h-80 overflow-hidden rounded-2xl lg:block">
          <Image
            src={interviewerLogin}
            alt="Interviewer Login"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500 blur-2xl opacity-20"></div>

          <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-emerald-500/30 bg-[#0a0a0a] p-6 shadow-2xl md:p-8">
            <div className="mb-6 text-center md:mb-8">
              <h1 className="text-3xl font-bold text-white">Interviewer Login</h1>
              <p className="mt-2 text-sm text-gray-400">Login to your interviewer account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  placeholder="Email"
                  className="mt-1 w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white focus:border-emerald-500"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password required",
                    })}
                    placeholder="Password"
                    className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 pr-12 text-white focus:border-emerald-500"
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
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="text-right text-sm">
                <Link href="/forgot-password" className="text-emerald-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
