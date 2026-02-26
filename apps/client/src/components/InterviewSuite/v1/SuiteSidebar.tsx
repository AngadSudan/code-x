import { useColors } from "@/components/General/(Color Manager)/useColors";
import React, { useEffect, useState } from "react";

export interface Organization {
  name: string;
  email: string;
  username: string;
}

export interface JobListing {
  jobDescription: string;
  startDate: string;
  endDate: string;
}

export interface SuiteInfo {
  name: string;
  startDate: string;
  endDate: string;
  publishStatus: "PUBLISHED" | "NOT_PUBLISHED";
  organization: Organization;
  jobListing: JobListing;
}

interface SuiteSidebarProps {
  info: SuiteInfo | undefined;
  onUpdate: (data: SuiteInfo) => void;
  onPublish: () => void;
}

// Converts an ISO / datetime string to the "YYYY-MM-DDTHH:mm" format
// that <input type="datetime-local"> expects.
function toDateTimeLocal(value: string): string {
  if (!value) return "";
  try {
    return new Date(value).toISOString().slice(0, 16);
  } catch {
    return value.slice(0, 16);
  }
}

function SuiteSidebar({ info, onUpdate, onPublish }: SuiteSidebarProps) {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [editableInfo, setEditableInfo] = useState<SuiteInfo | undefined>(
    undefined,
  );

  // Sync state safely when info changes
  useEffect(() => {
    if (info) {
      setEditableInfo(info);
    }
  }, [info]);

  // ================= SKELETON =================
  if (!info || !editableInfo) {
    return (
      <div
        className={`w-full h-screen p-4 rounded-md animate-pulse ${colors.background.secondary} ${colors.border.defaultThin}`}
      >
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-4" />
        <div className="h-4 w-full bg-gray-300 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-300 rounded mb-6" />
        <div className="h-5 w-1/2 bg-gray-300 rounded mb-3" />
        <div className="h-4 w-full bg-gray-300 rounded mb-2" />
        <div className="h-4 w-full bg-gray-300 rounded mb-6" />
        <div className="h-10 w-full bg-gray-400 rounded mt-6" />
      </div>
    );
  }

  // Only name, startDate, endDate are editable
  const handleChange = (
    field: "name" | "startDate" | "endDate",
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
        {/* Header + publish badge */}
        <div className="flex items-center justify-between mb-5">
          <h2 className={`text-lg font-semibold ${colors.text.primary}`}>
            Interview Suite
          </h2>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              editableInfo.publishStatus === "PUBLISHED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {editableInfo.publishStatus === "PUBLISHED"
              ? "Published"
              : "Not Published"}
          </span>
        </div>

        {/* ---- NAME (editable) ---- */}
        <div className="mb-4">
          <p
            className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.text.primary}`}
          >
            Name
          </p>
          {isEditing ? (
            <input
              className={`w-full px-2 py-1.5 rounded text-sm ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-offset-1`}
              value={editableInfo.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          ) : (
            <p className={`text-sm ${colors.text.primary}`}>
              {editableInfo.name}
            </p>
          )}
        </div>

        {/* ---- START DATE (editable) ---- */}
        <div className="mb-4">
          <p
            className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.text.primary}`}
          >
            Start Date
          </p>
          {isEditing ? (
            <input
              type="datetime-local"
              className={`w-full px-2 py-1.5 rounded text-sm ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-offset-1`}
              value={toDateTimeLocal(editableInfo.startDate)}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          ) : (
            <p className={`text-sm ${colors.text.primary}`}>
              {new Date(editableInfo.startDate).toLocaleString()}
            </p>
          )}
        </div>

        {/* ---- END DATE (editable) ---- */}
        <div className="mb-4">
          <p
            className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.text.primary}`}
          >
            End Date
          </p>
          {isEditing ? (
            <input
              type="datetime-local"
              className={`w-full px-2 py-1.5 rounded text-sm ${colors.border.fadedThin} ${colors.background.primary} ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-offset-1`}
              value={toDateTimeLocal(editableInfo.endDate)}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          ) : (
            <p className={`text-sm ${colors.text.primary}`}>
              {new Date(editableInfo.endDate).toLocaleString()}
            </p>
          )}
        </div>

        {/* ---- ORGANIZATION (read-only) ---- */}
        <div
          className={`mt-6 mb-4 p-3 rounded-md ${colors.background.primary} ${colors.border.defaultThin}`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.text.primary}`}
          >
            Organization
          </p>
          <p className={`text-sm font-medium ${colors.text.primary}`}>
            {editableInfo.organization.name}
          </p>
          <p className={`text-xs mt-0.5 ${colors.text.primary}`}>
            {editableInfo.organization.email}
          </p>
          <p className={`text-xs mt-0.5 ${colors.text.primary}`}>
            @{editableInfo.organization.username}
          </p>
        </div>

        {/* ---- JOB DESCRIPTION (read-only) ---- */}
        <div
          className={`p-3 rounded-md ${colors.background.primary} ${colors.border.defaultThin}`}
        >
          <p
            className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.text.primary}`}
          >
            Job Description
          </p>
          <p className={`text-sm leading-relaxed ${colors.text.primary}`}>
            {editableInfo.jobListing.jobDescription}
          </p>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-6">
        {!isEditing ? (
          <>
            <button
              className={`w-full py-2 rounded ${colors.background.primary} ${colors.text.primary} ${colors.properties.interactiveButton} ${colors.border.defaultThin}`}
              onClick={onPublish}
            >
              {editableInfo.publishStatus === "PUBLISHED"
                ? "Un-Publish Suite"
                : "Publish Suite"}
            </button>
            <button
              className={`w-full mt-2 py-2 rounded ${colors.background.special} ${colors.text.inverted} ${colors.properties.interactiveButton}`}
              onClick={() => setIsEditing(true)}
            >
              Edit Suite
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
              className={`flex-1 py-2 rounded ${colors.background.secondary} ${colors.text.primary} ${colors.border.defaultThin} hover:opacity-80 transition-opacity`}
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

export default SuiteSidebar;
