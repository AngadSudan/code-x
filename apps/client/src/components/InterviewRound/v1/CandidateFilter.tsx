import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

interface fnHandler {
  filter: {
    name: string;
    status: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      name: string;
      status: string;
    }>
  >;
}

function CandidateFilter({ filter, setFilter }: fnHandler) {
  const colors = useColors();

  const handleChange = (field: "name" | "status", value: string) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFilter({
      name: "",
      status: "ALL",
    });
  };

  return (
    <div
      className={`w-[95%] mx-auto p-4 rounded-lg flex flex-col md:flex-row md:items-end gap-4 ${colors.background.secondary} ${colors.border.defaultThin} ${colors.text.primary}`}
    >
      {/* Candidate Name */}
      <div className="flex-1 min-w-55">
        <label className="text-sm font-medium">Candidate</label>
        <input
          type="text"
          value={filter.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Search by name,email,username..."
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        />
      </div>

      {/* Selection Status */}
      <div className="flex-1 min-w-55">
        <label className="text-sm font-medium">Selection Status</label>
        <select
          value={filter.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        >
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="SELECTED_FOR_NEXT">SELECTED FOR NEXT</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Reset */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded-md ${colors.border.fadedThin} ${colors.properties.interactiveButton}`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default CandidateFilter;
