import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import ApplicationCard from "./ApplicationCard";

export interface Application {
  id: string;
  resume: string;
  currentStatus: "UNDER_REVIEW" | "REJECTED" | "ACCEPTED" | "IN_PROCESS";
  createdAt: string;
}

interface ApplicationsProps {
  filtered: Application[];
  hasNext: boolean;
  hasPrev: boolean;
  moveNext: () => void;
  movePrev: () => void;
}

function Applications({
  filtered,
  hasNext,
  hasPrev,
  moveNext,
  movePrev,
}: ApplicationsProps) {
  const colors = useColors();

  if (filtered.length === 0) {
    return (
      <div
        className={`w-full h-[70svh] mt-3 flex items-center justify-center p-6 text-center rounded-lg ${colors.background.secondary} ${colors.border.defaultThin} ${colors.text.primary}`}
      >
        No Applications Found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70svh] mt-3 gap-4">
      {/* Application Cards */}
      <table className={"w-full " + `${colors.text.primary}`}>
        <thead className="w-full justify-evenly">
          <th>name</th>
          <th>email</th>
          <th>resume</th>
          <th>currentStatus</th>
          <th>View Details</th>
        </thead>
        <tbody>
          {filtered.map((app, index) => (
            <ApplicationCard key={index} data={app} />
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={movePrev}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded-md ${
            hasPrev
              ? `${colors.background.special} ${colors.text.primary}`
              : "opacity-50 cursor-not-allowed"
          } ${colors.properties.interactiveButton}`}
        >
          Previous
        </button>

        <button
          onClick={moveNext}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-md ${
            hasNext
              ? `${colors.background.special} ${colors.text.primary}`
              : "opacity-50 cursor-not-allowed"
          } ${colors.properties.interactiveButton}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Applications;
