import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

interface ApplicationFilterProps {
  filter: {
    name: string;
    currentStatus: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      name: string;
      currentStatus: string;
    }>
  >;
}

function ApplicationFilter({ filter, setFilter }: ApplicationFilterProps) {
  const colors = useColors();

  const handleChange = (field: "name" | "currentStatus", value: string) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFilter({
      name: "",
      currentStatus: "",
    });
  };

  return (
    <div
      className={`w-full p-4 rounded-lg flex flex-col md:flex-row md:items-end gap-4 ${colors.background.secondary} ${colors.border.defaultThin} ${colors.text.primary}`}
    >
      {/* Name Filter */}
      <div className="flex-1">
        <label className={`text-sm font-medium ${colors.text.primary}`}>
          Candidate Name
        </label>
        <input
          type="text"
          value={filter.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Search by name..."
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        />
      </div>

      {/* Status Filter */}
      <div className="flex-1">
        <label className={`text-sm font-medium ${colors.text.primary}`}>
          Current Status
        </label>
        <select
          value={filter.currentStatus}
          onChange={(e) => handleChange("currentStatus", e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        >
          <option value="">All</option>
          <option value="UNDER_REVIEW">UNDER REVIEW</option>
          <option value="REJECTED">REJECTED</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="IN_PROCESS">IN PROCESS</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className={`px-4 py-2 rounded-md ${colors.border.fadedThin} ${colors.text.primary} ${colors.properties.interactiveButton}`}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default ApplicationFilter;
