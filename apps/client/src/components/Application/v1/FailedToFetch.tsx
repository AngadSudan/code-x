import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

type FailedToFetchProps = {
  message?: string;
  onRetry?: () => void;
};

export default function FailedToFetch({
  message = "We couldn’t fetch the data. Please try again.",
  onRetry,
}: FailedToFetchProps) {
  const colors = useColors();

  return (
    <div
      className={`
        w-full h-full
        flex items-center justify-center
        p-6 rounded-2xl
        ${colors.background.primary}
        ${colors.text.primary}
      `}
    >
      <div
        className={`
          max-w-md w-full text-center p-8 rounded-2xl
          backdrop-blur-sm
          ${colors.background.secondary}
          ${colors.border.fadedThin}
        `}
      >
        {/* Icon */}
        <div
          className={`
            mx-auto mb-6 w-16 h-16 rounded-full
            flex items-center justify-center
            ${colors.background.special}
            ${colors.text.primary}
          `}
        >
          <AlertTriangle size={28} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-3">Failed to Fetch</h2>

        {/* Message */}
        <p
          className={`
            text-sm mb-6 leading-relaxed
            ${colors.text.secondary}
          `}
        >
          {message}
        </p>

        {/* Retry Button (Optional) */}
        {onRetry && (
          <button
            onClick={onRetry}
            className={`
              inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium
              ${colors.background.accent}
              ${colors.text.inverted}
              ${colors.properties.interactiveButton}
            `}
          >
            <RefreshCw size={16} />
            Open in Platform
          </button>
        )}
      </div>
    </div>
  );
}
