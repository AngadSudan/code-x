"use client";

import {
  Github,
  Linkedin,
  Globe,
  GitGraph,
  DoorOpen,
  User,
} from "lucide-react";

import { SiLeetcode, SiCodeforces } from "react-icons/si";
import { FaMediumM } from "react-icons/fa";

import { useColors } from "@/components/General/(Color Manager)/useColors";
import ThemeSwitcher from "@/components/General/(Color Manager)/ThemeSwitcher";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface fnHandler {
  data: any;
}

export default function SideSection({ data }: fnHandler) {
  const Colors = useColors();
  const router = useRouter();

  if (!data) return null;

  const graph = data?.developerGraphs?.[0];

  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      localStorage.clear();
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`${Colors.background.secondary} w-full min-h-full p-4 flex flex-col justify-between rounded-xl font-mono gap-6`}
    >
      {/* Top Section */}
      <div className="space-y-6">
        {/* Profile */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`
            w-44 h-44
            rounded-full
            overflow-hidden
            ${Colors.background.primary}
            flex items-center justify-center
          `}
          >
            {data.profileUrl ? (
              <img
                src={data.profileUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-20 h-20 text-white" />
            )}
          </div>

          <div className="text-center">
            <p className={`${Colors.text.primary} text-2xl font-semibold`}>
              {data.name}
            </p>
            <p className={`${Colors.text.secondary}`}>@{data.username}</p>
          </div>

          <p className={`${Colors.text.secondary} text-center text-sm px-4`}>
            {data.headline}
          </p>
        </div>

        {/* Platform Links */}
        <div className="grid grid-cols-3 gap-3 place-items-center">
          {data.githubUrl && (
            <Link
              href={data.githubUrl}
              target="_blank"
              className={`${Colors.border.defaultThin} ${Colors.text.primary} p-3 rounded-full`}
            >
              <Github size={18} />
            </Link>
          )}

          {data.linkedinUrl && (
            <Link
              href={data.linkedinUrl}
              target="_blank"
              className={`${Colors.border.defaultThin} ${Colors.text.primary} p-3 rounded-full`}
            >
              <Linkedin size={18} />
            </Link>
          )}

          {data.leetcodeUrl && (
            <Link
              href={data.leetcodeUrl}
              target="_blank"
              className={`${Colors.border.defaultThin} ${Colors.text.primary} p-3 rounded-full`}
            >
              <SiLeetcode size={18} />
            </Link>
          )}

          {data.codeForcesUrl && (
            <Link
              href={data.codeForcesUrl}
              target="_blank"
              className={`${Colors.border.defaultThin} ${Colors.text.primary} p-3 rounded-full`}
            >
              <SiCodeforces size={18} />
            </Link>
          )}

          {data.mediumUrl && (
            <Link
              href={data.mediumUrl}
              target="_blank"
              className={`${Colors.border.defaultThin} ${Colors.text.primary} p-3 rounded-full`}
            >
              <FaMediumM size={18} />
            </Link>
          )}

          {data.portfolioUrl && (
            <Link
              href={data.portfolioUrl}
              target="_blank"
              className={`${Colors.border.defaultThin} ${Colors.text.primary} p-3 rounded-full`}
            >
              <Globe size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="space-y-4">
        <ThemeSwitcher />

        <button
          onClick={handleLogout}
          className={`${Colors.background.special} ${Colors.text.inverted} w-full flex items-center justify-center gap-2 py-3 rounded-xl`}
        >
          <DoorOpen size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
