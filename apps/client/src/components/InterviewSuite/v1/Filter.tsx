import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { Plus } from "lucide-react";

interface FilterProps {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  filter: {
    name: string;
    roundType: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      name: string;
      roundType: string;
    }>
  >;
}

function Filter({ setShowForm, filter, setFilter }: FilterProps) {
  const colors = useColors();

  const handleChange = (field: "name" | "roundType", value: string) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFilter({
      name: "",
      roundType: "",
    });
  };

  return (
    <div
      className={`w-full p-4 rounded-lg flex flex-col md:flex-row md:items-end gap-4 ${colors.background.secondary} ${colors.border.defaultThin} ${colors.text.primary}`}
    >
      {/* Name Filter */}
      <div className="flex-1">
        <label className={`text-sm font-medium ${colors.text.primary}`}>
          Round Name
        </label>
        <input
          type="text"
          value={filter.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Search by name..."
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        />
      </div>

      {/* Round Type Filter */}
      <div className="flex-1">
        <label className={`text-sm font-medium ${colors.text.primary}`}>
          Round Type
        </label>
        <select
          value={filter.roundType}
          onChange={(e) => handleChange("roundType", e.target.value)}
          className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
        >
          <option value="">All</option>
          <option value="DSA">DSA</option>
          <option value="LIVE_PROJECT">Live Project</option>
          <option value="HR">HR</option>
          <option value="OTHER">Other</option>
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

        <button
          onClick={() => setShowForm(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${colors.background.special} ${colors.text.primary} ${colors.properties.interactiveButton}`}
        >
          <Plus size={16} className={colors.text.primary} />
          Add Round
        </button>
      </div>
    </div>
  );
}

export default Filter;
