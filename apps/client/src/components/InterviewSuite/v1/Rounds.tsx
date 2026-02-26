import { useColors } from "@/components/General/(Color Manager)/useColors";
import { useRouter } from "next/navigation";
import React from "react";

export interface Round {
  id: string;
  suiteId: string;
  name: string;
  description: string;
  duration: string;
  roundType: "DSA" | "LIVE_PROJECT" | "HR" | "OTHER";
  createdAt: string;
  updatedAt: string;
}

interface RoundsProps {
  filtered: Round[];
}

function Rounds({ filtered }: RoundsProps) {
  const colors = useColors();
  const router = useRouter();
  if (filtered.length === 0) {
    return (
      <div
        className={` p-6 text-center rounded-lg ${colors.background.secondary} ${colors.border.defaultThin} ${colors.text.primary}`}
      >
        No Rounds Found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 mt-4 gap-4">
      {filtered.map((round) => (
        <div
          onClick={() =>
            router.push(
              `/interviewer-dashboard/interview-suite/round/` + round.id,
            )
          }
          key={round.id}
          className={`p-5 cursor-pointer rounded-xl ${colors.background.secondary} ${colors.border.defaultThin} ${colors.text.primary}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{round.name}</h3>

            <span
              className={`px-3 py-1 text-xs rounded-full ${colors.background.heroPrimaryFaded} ${colors.text.primary}`}
            >
              {round.roundType}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm mb-4">{round.description}</p>

          {/* Footer Info */}
          <div className="flex justify-between text-xs opacity-80">
            <span>Duration: {round.duration} mins</span>
            <span>
              Created: {new Date(round.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Rounds;
