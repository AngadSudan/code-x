import { useColors } from "@/components/General/(Color Manager)/useColors";
import React, { useEffect, useState } from "react";

interface RoundInfo {
  id: string;
  name: string;
  description: string;
  duration: string;
  roundType: "DSA" | "LIVE_PROJECT" | "HR" | "OTHER";
  createdAt: string;
  updatedAt: string;
  suite: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    publishStatus: "PUBLISHED" | "NOT_PUBLISHED";
  };
}

interface fnHandler {
  info: RoundInfo | undefined;
  onUpdate: (data: RoundInfo) => void;
  onDelete: () => void;
}

function RoundSidebar({ info, onUpdate, onDelete }: fnHandler) {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [editableInfo, setEditableInfo] = useState<RoundInfo | undefined>(
    undefined,
  );

  useEffect(() => {
    if (info) setEditableInfo(info);
  }, [info]);

  if (!info || !editableInfo) {
    return (
      <div
        className={`w-full h-screen p-4 rounded-md animate-pulse ${colors.background.secondary} ${colors.border.defaultThin}`}
      >
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4" />
        <div className="h-4 w-full bg-gray-300 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-300 rounded mb-6" />
        <div className="h-10 w-full bg-gray-400 rounded mt-6" />
      </div>
    );
  }

  const handleChange = (
    field: "name" | "description" | "duration" | "roundType",
    value: string,
  ) => {
    setEditableInfo({ ...editableInfo, [field]: value });
  };

  const handleSave = () => {
    onUpdate(editableInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableInfo(info);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex flex-col justify-between h-full w-full p-8 rounded-md ${colors.background.secondary} ${colors.border.defaultThin}`}
    >
      {/* ================= CONTENT ================= */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-lg font-semibold ${colors.text.primary}`}>
            Interview Round
          </h2>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              editableInfo.suite.publishStatus === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {editableInfo.suite.publishStatus === "PUBLISHED"
              ? "Suite Published"
              : "Suite Not Published"}
          </span>
        </div>

        {/* ---- NAME ---- */}
        <div className="mb-4">
          <p
            className={`text-xs font-medium uppercase mb-1 ${colors.text.primary}`}
          >
            Round Name
          </p>
          {isEditing ? (
            <input
              className={`w-full px-2 py-1.5 rounded text-sm ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
              value={editableInfo.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            <p className={`text-sm ${colors.text.primary}`}>
              {editableInfo.name}
            </p>
          )}
        </div>

        {/* ---- DESCRIPTION ---- */}
        <div className="mb-4">
          <p
            className={`text-xs font-medium uppercase mb-1 ${colors.text.primary}`}
          >
            Description
          </p>
          {isEditing ? (
            <textarea
              rows={4}
              className={`w-full px-2 py-1.5 rounded text-sm ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
              value={editableInfo.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          ) : (
            <p className={`text-sm leading-relaxed ${colors.text.primary}`}>
              {editableInfo.description}
            </p>
          )}
        </div>

        {/* ---- DURATION ---- */}
        <div className="mb-4">
          <p
            className={`text-xs font-medium uppercase mb-1 ${colors.text.primary}`}
          >
            Duration (minutes)
          </p>
          {isEditing ? (
            <input
              type="number"
              className={`w-full px-2 py-1.5 rounded text-sm ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
              value={editableInfo.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          ) : (
            <p className={`text-sm ${colors.text.primary}`}>
              {editableInfo.duration} minutes
            </p>
          )}
        </div>

        {/* ---- ROUND TYPE ---- */}
        <div className="mb-6">
          <p
            className={`text-xs font-medium uppercase mb-1 ${colors.text.primary}`}
          >
            Round Type
          </p>
          {isEditing ? (
            <select
              className={`w-full px-2 py-1.5 rounded text-sm ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary}`}
              value={editableInfo.roundType}
              onChange={(e) => handleChange("roundType", e.target.value)}
            >
              <option value="DSA">DSA</option>
              <option value="HR">HR</option>
              <option value="LIVE_PROJECT">MACHINE CODING</option>
              <option value="OTHER">Other</option>
            </select>
          ) : (
            <p className={`text-sm ${colors.text.primary}`}>
              {editableInfo.roundType}
            </p>
          )}
        </div>

        {/* ---- SUITE INFO (READ ONLY) ---- */}
        <div
          className={`p-3 rounded-md ${colors.background.primary} ${colors.border.defaultThin}`}
        >
          <p
            className={`text-xs font-medium uppercase mb-2 ${colors.text.primary}`}
          >
            Parent Suite
          </p>
          <p className={`text-sm font-medium ${colors.text.primary}`}>
            {editableInfo.suite.name}
          </p>
          <p className={`text-xs mt-1 ${colors.text.primary}`}>
            {new Date(editableInfo.suite.startDate).toLocaleString()}
          </p>
          <p className={`text-xs ${colors.text.primary}`}>
            {new Date(editableInfo.suite.endDate).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-6">
        {!isEditing ? (
          <>
            <button
              className={`w-full py-2 rounded ${colors.background.special} ${colors.text.inverted} ${colors.properties.interactiveButton}`}
              onClick={() => setIsEditing(true)}
            >
              Edit Round
            </button>

            <button
              className="w-full mt-2 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              onClick={onDelete}
            >
              Delete Round
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className={`flex-1 py-2 rounded ${colors.background.primary} ${colors.text.primary} ${colors.border.defaultThin}`}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoundSidebar;
