import React, { useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";

interface Candidate {
  id: string;
  candidate: {
    name: string;
    username?: string;
    headline?: string;
    email?: string;
    profileUrl?: string;
  };
  roundStatus: string;
}

interface fnHandler {
  candidates: Candidate[]; // full candidate list
  onClose: () => void;
  onSubmit?: (candidateIds: string[]) => void;
}

function InterviewCreationForm({ candidates, onClose, onSubmit }: fnHandler) {
  const colors = useColors();

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* ================= Search Filter ================= */
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) =>
      `${c.candidate.name} ${c.candidate.username ?? ""} ${c.candidate.email ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, candidates]);

  /* ================= Selection Logic ================= */
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (!selectedIds.length) return;
    await onSubmit?.(selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div
        className={`relative w-125 max-h-[85vh] overflow-hidden p-6 rounded-xl shadow-xl ${colors.background.secondary} ${colors.text.primary} ${colors.border.defaultThin}`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${colors.properties.interactiveButton}`}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Create Interview</h2>

        {/* Search */}
        <div className="mb-4 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
          />
          <input
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 rounded-md ${colors.border.fadedThin} ${colors.background.primary}`}
          />
        </div>

        {/* Candidate List */}
        <div className="overflow-y-auto max-h-75 space-y-2 pr-1">
          {filteredCandidates.map((c) => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => toggleSelection(c.id)}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition 
                ${
                  isSelected
                    ? "bg-blue-100 border border-blue-400"
                    : `${colors.background.primary} ${colors.border.defaultThin}`
                }`}
              >
                <img
                  src={
                    c.candidate.profileUrl ||
                    "https://ui-avatars.com/api/?name=" + c.candidate.name
                  }
                  alt={c.candidate.name}
                  className="w-9 h-9 rounded-full object-cover"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium">{c.candidate.name}</p>
                  <p className="text-xs opacity-70">
                    @{c.candidate.username} • {c.candidate.email}
                  </p>
                </div>

                {isSelected && (
                  <div className="text-xs font-semibold text-blue-600">
                    Selected
                  </div>
                )}
              </div>
            );
          })}

          {!filteredCandidates.length && (
            <p className="text-sm opacity-60 text-center py-4">
              No candidates found
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            disabled={!selectedIds.length}
            className={`w-full py-2 rounded-md ${
              selectedIds.length
                ? `${colors.background.special} ${colors.text.inverted}`
                : "bg-gray-400 text-white cursor-not-allowed"
            } ${colors.properties.interactiveButton}`}
          >
            Create Interview ({selectedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewCreationForm;
