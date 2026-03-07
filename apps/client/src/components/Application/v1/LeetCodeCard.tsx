import React from "react";
import FailedToFetch from "./FailedToFetch";

function LeetCodeCard({ url, data }: { url: string; data: any }) {
  if (!data)
    return (
      <FailedToFetch
        message={"Failed to fetch Data"}
        onRetry={() => window.location.replace(new URL(url))}
      />
    );

  const {
    user,
    languagesSolved,
    contestStats,
    badges,
    contestHistory,
    activity,
  } = data;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.realName}</h2>
          <p className="text-gray-500">@{user.username}</p>
          <p className="text-sm text-gray-600">Global Rank: {user.ranking}</p>
        </div>
      </div>

      {/* Contest Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <Stat label="Rating" value={contestStats.rating} />
        <Stat label="Contests" value={contestStats.attendedContests} />
        <Stat label="Global Rank" value={contestStats.globalRanking} />
        <Stat label="Top %" value={contestStats.topPercentage} />
      </div>

      {/* Languages */}
      <Section title="Languages Solved">
        <div className="flex flex-wrap gap-2">
          {Object.entries(languagesSolved).map(([lang, count]) => (
            <span
              key={lang}
              className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
            >
              {lang}: {languagesSolved[lang] || 0}
            </span>
          ))}
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          {badges.map((b: any, i: number) => (
            <div key={i} className="px-4 py-2 bg-yellow-100 rounded-lg text-sm">
              🏅 {b.name}
            </div>
          ))}
        </div>
      </Section>

      {/* Activity */}
      <Section title="Activity">
        <div className="flex gap-6 text-sm">
          <div>🔥 Streak: {activity.streak}</div>
          <div>📅 Active Days: {activity.totalActiveDays}</div>
          <div>🗓 Years: {activity.activeYears.join(", ")}</div>
        </div>
      </Section>

      {/* Contest History */}
      <Section title="Recent Contests">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Contest</th>
                <th className="p-2">Solved</th>
                <th className="p-2">Rank</th>
                <th className="p-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {contestHistory.slice(-5).map((c: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{c.contestName}</td>
                  <td className="text-center">
                    {c.problemsSolved}/{c.totalProblems}
                  </td>
                  <td className="text-center">{c.ranking}</td>
                  <td
                    className={`text-center ${
                      c.trend === "UP" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {c.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-gray-100 rounded-lg p-3">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

export default LeetCodeCard;
