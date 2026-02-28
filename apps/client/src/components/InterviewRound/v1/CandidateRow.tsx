import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { Candidate, CandidateStatus } from "./Candidates";

function CandidateRow({
  id,
  data,
  onStatusChange,
}: {
  id: string;
  data: { candidate: Candidate; id: string; roundStatus: CandidateStatus };
  onStatusChange: (username: string, status: CandidateStatus) => void;
}) {
  const colors = useColors();

  const candidate = data.candidate;
  const getStatusStyle = () => {
    switch (data.roundStatus) {
      case "SELECTED_FOR_NEXT":
        return `${colors.background.special} ${colors.text.inverted}`;
      case "REJECTED":
        return `${colors.border.greenThin} ${colors.text.primary}`;
      case "ACCEPTED":
        return `bg-green-400 text-white`;
      default:
        return `${colors.background.secondary} ${colors.text.primary}`;
    }
  };

  return (
    <tr
      className={`${colors.border.fadedThinBottom} hover:${colors.background.special} transition`}
    >
      <td className={`p-4 ${colors.text.primary}`}>{candidate.name}</td>

      <td className={`p-4 ${colors.text.primary}`}>@{candidate.username}</td>

      <td className={`p-4 ${colors.text.primary}`}>{candidate.email}</td>

      <td className="p-4">
        <a
          href={candidate.resume}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-3 py-1 rounded-lg text-xs ${colors.background.secondary} ${colors.border.fadedThin} ${colors.properties.interactiveButton}`}
        >
          View Resume
        </a>
      </td>

      <td className="p-4">
        {data.roundStatus === "ACCEPTED" ? (
          <select
            value={data.roundStatus}
            onChange={(e) =>
              onStatusChange(id, e.target.value as CandidateStatus)
            }
            className={`px-3 py-1 rounded-lg text-xs ${getStatusStyle()} cursor-pointer`}
          >
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        ) : (
          <select
            value={data.roundStatus}
            onChange={(e) =>
              onStatusChange(id, e.target.value as CandidateStatus)
            }
            className={`px-3 py-1 rounded-lg text-xs ${getStatusStyle()} cursor-pointer`}
          >
            <option value="PENDING">PENDING</option>
            <option value="SELECTED_FOR_NEXT">SELECTED_FOR_NEXT</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        )}
      </td>
    </tr>
  );
}

export default CandidateRow;
