import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

interface InterviewFilterState {
  name: string;
  status: string;
}

interface fnHandler {
  filter: InterviewFilterState;
  setFilter: React.Dispatch<React.SetStateAction<InterviewFilterState>>;
  showInterviewForm: React.Dispatch<React.SetStateAction<any>>;
}

function InterviewFilter({ filter, setFilter, showInterviewForm }: fnHandler) {
  const colors = useColors();

  const handleChange = (field: keyof InterviewFilterState, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFilter({
      name: "",
      status: "",
    });
  };

  return (
    <div
      className={`w-[95%] mx-auto p-4 rounded-lg flex flex-col md:flex-row md:items-end gap-4 ${colors.background.secondary} ${colors.border.defaultThin} ${colors.text.primary}`}
    >
      {/* Candidate Name */}
      <div className="flex-1 min-w-55">
        <label className="text-sm font-medium">Interview</label>
        <input
          type="text"
          value={filter.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Search by candidate name..."
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        />
      </div>

      {/* Interview Status */}
      <div className="flex-1 min-w-55">
        <label className="text-sm font-medium">Interview Status</label>
        <select
          value={filter.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        >
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="UNDER_PROGRESS">UNDER PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>

      {/* Reset */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded-md ${colors.border.defaultThin} ${colors.properties.interactiveButton}`}
        >
          Reset
        </button>
        <button
          onClick={() => showInterviewForm(true)}
          className={`px-4 py-2 rounded-md ${colors.border.defaultThin} ${colors.properties.interactiveButton}`}
        >
          Create Interview
        </button>
      </div>
    </div>
  );
}

export default InterviewFilter;
