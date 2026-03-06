"use client";

import { useEffect, useState } from "react";
import { X, Github, Linkedin, Code2, PenTool, Globe } from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

export interface updateUserLinks {
  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeUrl?: string;
  codeForcesUrl?: string;
  mediumUrl?: string;
  portfolioUrl?: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialValues: updateUserLinks;
  onSave: (data: updateUserLinks) => void;
};

export default function EditLinksModal({
  isOpen,
  onClose,
  initialValues,
  onSave,
}: Props) {
  const Colors = useColors();

  const [form, setForm] = useState<updateUserLinks>({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialValues);
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleChange = (key: keyof updateUserLinks, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`${Colors.background.primary} w-full max-w-lg rounded-xl p-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${Colors.text.primary} font-mono text-xl`}>
            Edit Platform Links
          </h2>
          <X
            className="cursor-pointer opacity-70 hover:opacity-100"
            onClick={onClose}
          />
        </div>

        {/* Info */}
        <p className={`${Colors.text.secondary} text-sm font-mono mb-4`}>
          Please paste the <b>full URL</b> (example:
          <br />
          <span className="italic">
            https://leetcode.com/u/Demo_Username/
          </span>
        </p>

        {/* Inputs */}
        <div className="space-y-3">
          <Input
            icon={<Github size={18} />}
            label="GitHub"
            placeholder="https://github.com/username"
            value={form.githubUrl ?? ""}
            onChange={(v) => handleChange("githubUrl", v)}
          />

          <Input
            icon={<Linkedin size={18} />}
            label="LinkedIn"
            placeholder="https://linkedin.com/in/username"
            value={form.linkedinUrl ?? ""}
            onChange={(v) => handleChange("linkedinUrl", v)}
          />

          <Input
            icon={<Code2 size={18} />}
            label="LeetCode"
            placeholder="https://leetcode.com/u/username"
            value={form.leetcodeUrl ?? ""}
            onChange={(v) => handleChange("leetcodeUrl", v)}
          />

          <Input
            icon={<Code2 size={18} />}
            label="Codeforces"
            placeholder="https://codeforces.com/profile/username"
            value={form.codeForcesUrl ?? ""}
            onChange={(v) => handleChange("codeForcesUrl", v)}
          />

          <Input
            icon={<PenTool size={18} />}
            label="Medium"
            placeholder="https://medium.com/@username"
            value={form.mediumUrl ?? ""}
            onChange={(v) => handleChange("mediumUrl", v)}
          />

          <Input
            icon={<Globe size={18} />}
            label="Portfolio"
            placeholder="https://yourwebsite.com"
            value={form.portfolioUrl ?? ""}
            onChange={(v) => handleChange("portfolioUrl", v)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border font-mono"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-2 rounded-lg font-mono`}
          >
            Save Links
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Input Component ---------- */

function Input({
  icon,
  label,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const Colors = useColors();

  return (
    <div>
      <label
        className={`${Colors.text.primary} text-sm font-mono mb-1 flex items-center gap-2`}
      >
        {icon}
        {label}
      </label>
      <input
        type="url"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg ${Colors.background.secondary} ${Colors.text.primary} font-mono outline-none`}
      />
    </div>
  );
}