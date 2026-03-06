"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; userInfo: string; headline: string }) => void;
};

export default function EditProfileModal({ isOpen, onClose, onSave }: Props) {
  const Colors = useColors();

  const [name, setName] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [headline, setHeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const updateData = async () => {
    setError(null);

    // trim values
    const trimmedName = name.trim();
    const trimmedHeadline = headline.trim();
    const trimmedUserInfo = userInfo.trim();

    // validation
    // if (!trimmedName || !trimmedHeadline || !trimmedUserInfo) {
    //   setError("All fields are required");
    //   return;
    // }

    try {
      const res = await fetch(`${backendUrl}/api/v1/users/update-user-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: trimmedName,
          headline: trimmedHeadline,
          userInfo: trimmedUserInfo,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      const result = await res.json();
      console.log("Update success:", result.data);

      onClose();
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Update error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl p-6
        ${Colors.background.primary}
        ${Colors.border.defaultThin}
        shadow-2xl`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${Colors.text.primary} text-xl font-mono`}>
            Edit Profile
          </h2>
          <X
            className={`${Colors.text.secondary} cursor-pointer hover:text-red-500 ${Colors.properties.interactiveButton}`}
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Your name"
          />

          <Input
            label="Headline"
            value={headline}
            onChange={setHeadline}
            placeholder="Short professional headline"
          />

          <Textarea
            label="User Info"
            value={userInfo}
            onChange={setUserInfo}
            placeholder="Tell something about yourself..."
          />
        </div>

        {error && (
  <p className="text-red-500 text-sm font-mono mt-2">
    {error}
  </p>
)}
        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-mono text-sm
              ${Colors.text.secondary}
              ${Colors.properties.interactiveButton}
              hover:opacity-80`}
          >
            Cancel
          </button>

          <button
  onClick={updateData}
  // disabled={!name || !headline || !userInfo}
  className={`
    px-5 py-2 rounded-lg font-mono text-sm
    ${Colors.background.special}
    ${Colors.text.inverted}
    ${Colors.properties.interactiveButton}
    hover:opacity-90
    disabled:opacity-50 disabled:cursor-not-allowed
  `}
>
  Save
</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Inputs ---------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.secondary} text-sm font-mono`}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-lg px-3 py-2 text-sm
          ${Colors.background.secondary}
          ${Colors.text.primary}
          ${Colors.border.defaultThin}
          outline-none`}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.secondary} text-sm font-mono`}>
        {label}
      </label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-lg px-3 py-2 text-sm resize-none
          ${Colors.background.secondary}
          ${Colors.text.primary}
          ${Colors.border.defaultThin}
          outline-none`}
      />
    </div>
  );
}
