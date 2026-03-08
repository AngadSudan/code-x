"use client";

import { useTheme } from "@/components/General/(Color Manager)/ThemeController";
import { Sun, Moon } from "lucide-react";
import { useColors } from "./useColors";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const Colors = useColors();

  const isDark = theme === "Dark";

  const setLight = () => {
    if (isDark) toggleTheme();
  };

  const setDark = () => {
    if (!isDark) toggleTheme();
  };

  return (
    <div
      className={`flex items-center gap-2 p-1 rounded-full ${Colors.background.secondary}`}
    >
      {/* Light Theme */}
      <button
        onClick={setLight}
        aria-label="Light theme"
        className={`
          flex items-center justify-center
          w-9 h-9 rounded-full
          transition-all duration-300
          ${
            !isDark
              ? "bg-yellow-400 text-black shadow-md"
              : "opacity-60 hover:opacity-100"
          }
        `}
      >
        <Sun size={18} />
      </button>

      {/* Dark Theme */}
      <button
        onClick={setDark}
        aria-label="Dark theme"
        className={`
          flex items-center justify-center
          w-9 h-9 rounded-full
          transition-all duration-300
          ${
            isDark
              ? "bg-neutral-900 text-white shadow-md"
              : "opacity-60 hover:opacity-100"
          }
        `}
      >
        <Moon size={18} />
      </button>
    </div>
  );
}
