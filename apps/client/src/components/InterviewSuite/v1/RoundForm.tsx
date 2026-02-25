import React, { useState } from "react";
import { X } from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

export interface Round {
  name: string;
  description: string;
  roundType: "DSA" | "LIVE_PROJECT" | "HR" | "OTHER";
  duration: string;
}

interface RoundFormProps {
  onClose: () => void;
  onSubmit?: (data: Round) => void;
}

function RoundForm({ onClose, onSubmit }: RoundFormProps) {
  const colors = useColors();

  const [formData, setFormData] = useState<Round>({
    name: "",
    description: "",
    roundType: "DSA",
    duration: "",
  });

  const handleChange = (field: keyof Round, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    await onSubmit?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div
        className={`relative w-125 p-6 rounded-xl shadow-xl ${colors.background.secondary} ${colors.text.primary} ${colors.border.defaultThin}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${colors.text.primary} ${colors.hover.textSpecial} ${colors.properties.interactiveButton}`}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className={`text-xl font-semibold mb-6 ${colors.text.primary}`}>
          Create Interview Round
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm font-medium">Round Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
            placeholder="e.g. DSA Round 1"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
            rows={3}
            placeholder="Describe this round..."
          />
        </div>

        {/* Round Type */}
        <div className="mb-4">
          <label className="text-sm font-medium">Round Type</label>
          <select
            value={formData.roundType}
            onChange={(e) =>
              handleChange("roundType", e.target.value as Round["roundType"])
            }
            className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
          >
            <option value="DSA">DSA</option>
            <option value="LIVE_PROJECT">Live Project</option>
            <option value="HR">HR</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="text-sm font-medium">Duration (in minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className={`w-full mt-1 px-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
            placeholder="e.g. 60"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-2 rounded-md ${colors.background.special} ${colors.text.inverted} ${colors.properties.interactiveButton}`}
        >
          Add Round
        </button>
      </div>
    </div>
  );
}

export default RoundForm;
