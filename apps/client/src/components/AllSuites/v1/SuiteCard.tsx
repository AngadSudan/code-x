import { useColors } from "@/components/General/(Color Manager)/useColors";
import axiosInstance from "@/utils/axiosInstance";
import { Suite } from "@/utils/type";
import { useRouter } from "next/navigation";

export default function SuiteCard({ info }: { info: Suite }) {
  const colors = useColors();
  const router = useRouter();
  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatShortDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

  const isPublished = info.publishStatus === "PUBLISHED";

  const statusConfig = {
    PUBLISHED: {
      label: "Published",
      dot: "bg-[var(--hero-primary)]",
      pill: `${colors.background.special} ${colors.text.inverted}`,
      accent: `${colors.background.special}`,
    },
    NOT_PUBLISHED: {
      label: "Draft",
      dot: "bg-[var(--border-faded)]",
      pill: `${colors.background.heroSecondaryFaded} ${colors.text.secondary} ${colors.border.fadedThin}`,
      accent: "var(--border-faded)",
    },
  };

  const status =
    statusConfig[info.publishStatus as keyof typeof statusConfig] ??
    statusConfig["NOT_PUBLISHED"];

  const handleDelete = async () => {
    const id = info.id;
    const data = await axiosInstance.delete(
      "/api/v1/interview/interview-suite/delete/" + id,
    );
    console.log(data.data);
    router.refresh();
  };
  return (
    <div
      className={`
        relative w-full rounded-2xl overflow-hidden
        ${colors.background.primary}
        ${colors.border.defaultThin}
        shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12)]
        transition-all duration-300
        hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18)]
        hover:-translate-y-0.5
        group
      `}
      style={{
        fontFamily: "'DM Sans', 'Sora', sans-serif",
      }}
    >
      <div className="p-6 pt-7">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] mb-1.5 ${colors.text.primary}`}
            >
              Suite
            </p>
            <h2
              className={`text-[1.35rem] font-bold leading-tight truncate ${colors.text.primary}`}
              style={{ letterSpacing: "-0.02em" }}
            >
              {info.name}
            </h2>
          </div>

          {/* Status badge */}
          <div
            className={`
              flex items-center gap-1.5 shrink-0
              px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide
              ${status.pill}
            `}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot} ${
                isPublished ? "animate-pulse" : ""
              }`}
            />
            {status.label}
          </div>
        </div>

        {/* Date range — timeline style */}
        <div
          className={`
            relative flex items-stretch gap-0 mb-6 rounded-xl overflow-hidden
            ${colors.background.secondary}
            ${colors.border.fadedThin}
          `}
        >
          <div className="flex-1 p-4">
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 ${colors.text.primary}`}
            >
              Start
            </p>
            <p className={`text-sm font-semibold ${colors.text.primary}`}>
              {formatShortDate(info.startDate)}
            </p>
            <p className={`text-xs mt-0.5 ${colors.text.primary}`}>
              {formatTime(info.startDate)}
            </p>
          </div>

          <div className="flex-1 p-4">
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 ${colors.text.primary}`}
            >
              End
            </p>
            <p className={`text-sm font-semibold ${colors.text.primary}`}>
              {formatShortDate(info.endDate)}
            </p>
            <p className={`text-xs mt-0.5 ${colors.text.primary}`}>
              {formatTime(info.endDate)}
            </p>
          </div>
        </div>
        <div className="w-full flex gap-2">
          <button
            className={`cursor-pointer w-1/2 h-fit bg-red-500 text-white rounded-md p-0.75`}
            onClick={handleDelete}
          >
            Delete Sute{" "}
          </button>
          <button
            onClick={() => {
              router.push(`/interviewer-dashboard/interview-suite/${info.id}`);
            }}
            className={`cursor-pointer w-1/2 h-fit ${colors.background.special} ${colors.text.inverted} rounded-md p-0.75`}
          >
            Open Suite
          </button>
        </div>

        {/* Metadata footer */}
        <div
          className={`
            flex items-center justify-between pt-4
            ${colors.border.fadedThinTop}
          `}
        >
          <MetaItem
            icon={
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
            }
            label="Created"
            value={formatDate(info.createdAt)}
            colors={colors}
          />

          <div
            className={`w-px h-6 self-center ${colors.background.accent} opacity-30`}
          />

          <MetaItem
            icon={
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                  strokeLinecap="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                  strokeLinecap="round"
                />
              </svg>
            }
            label="Updated"
            value={formatDate(info.updatedAt)}
            colors={colors}
          />
        </div>
      </div>
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
  colors,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colors: ReturnType<
    typeof import("@/components/General/(Color Manager)/useColors").useColors
  >;
}) {
  return (
    <div className="flex items-start gap-2 flex-1 px-1">
      <span className={`mt-0.5 opacity-50 ${colors.text.primary}`}>{icon}</span>
      <div>
        <p
          className={`text-[10px] font-semibold uppercase tracking-widest ${colors.text.primary} opacity-70`}
        >
          {label}
        </p>
        <p className={`text-xs font-medium ${colors.text.primary}`}>{value}</p>
      </div>
    </div>
  );
}
