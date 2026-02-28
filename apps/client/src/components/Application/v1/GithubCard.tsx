import { useColors } from "@/components/General/(Color Manager)/useColors";
import React from "react";
import FailedToFetch from "./FailedToFetch";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  fork: boolean;
};

type GithubData = {
  profileInfo: {
    name: string;
    avatar: string;
    publicRepo: number;
    publicGists: number;
  };
  repo: Repo[];
};

export default function GithubProfile({
  url,
  data,
}: {
  url: string;
  data: GithubData;
}) {
  const colors = useColors();
  if (!data)
    return (
      <FailedToFetch
        message={"Failed to fetch Data"}
        onRetry={() => window.location.replace(new URL(url))}
      />
    );
  const { profileInfo, repo } = data;
  return (
    <div
      className={`
        w-full max-w-6xl mx-auto p-6 rounded-2xl
        ${colors.background.primary}
        ${colors.text.primary}
      `}
    >
      {/* ================= PROFILE HEADER ================= */}
      <div
        className={`
          flex flex-col md:flex-row items-center md:items-start gap-6
          p-6 rounded-xl
          ${colors.background.secondary}
          ${colors.border.fadedThin}
        `}
      >
        <img
          src={profileInfo.avatar}
          alt={profileInfo.name}
          className="w-24 h-24 rounded-full object-cover shadow-md"
        />

        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold">{profileInfo.name}</h2>

          <div
            className={`
              flex flex-wrap gap-4 justify-center md:justify-start
              text-sm ${colors.text.primary}
            `}
          >
            <span>
              Repositories:{" "}
              <strong className={colors.text.primary}>
                {profileInfo.publicRepo}
              </strong>
            </span>
            <span>
              Gists:{" "}
              <strong className={colors.text.primary}>
                {profileInfo.publicGists}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* ================= REPOSITORIES ================= */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6">Repositories</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {repo.map((r) => (
            <a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                block p-5 rounded-xl
                ${colors.background.secondary}
                ${colors.border.fadedThin}
                ${colors.properties.interactiveButton}
              `}
            >
              {/* Repo Header */}
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg break-words">{r.name}</h4>

                {r.fork && (
                  <span
                    className={`
                      text-xs px-2 py-1 rounded-full
                      ${colors.background.special}
                      ${colors.text.special}
                    `}
                  >
                    Fork
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className={`
                  text-sm mb-4 line-clamp-3
                  ${colors.text.primary}
                `}
              >
                {r.description || "No description provided."}
              </p>

              {/* Footer */}
              <div
                className={`
                  flex items-center justify-between text-sm
                  ${colors.text.primary}
                `}
              >
                <div className="flex items-center gap-3">
                  {r.language && (
                    <span className="font-medium">{r.language}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span>⭐ {r.stargazers_count}</span>
                  <span>🍴 {r.forks_count}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
