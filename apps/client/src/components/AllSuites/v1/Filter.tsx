import React from "react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { SuiteFilters } from "@/utils/type";
import { Search, Calendar, ArrowUpDown, SlidersHorizontal } from "lucide-react";

interface Props {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<SuiteFilters>>;
}

function Filter({ filters, setFilters }: Props) {
  const themes = useColors();

  const update = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const inputBase = `w-full px-3 py-2 data-white rounded-lg text-sm outline-none transition-all duration-150
    ${themes.background.secondary} ${themes.text.primary} ${themes.border.fadedThin}
    focus:${themes.border.defaultThin}`;

  const selectBase = `w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-150 cursor-pointer
    ${themes.background.secondary} ${themes.text.primary} ${themes.border.fadedThin}`;

  return (
    <div
      className={`w-full rounded-2xl overflow-hidden ${themes.border.fadedThin} ${themes.background.primary}`}
    >
      <div
        className={`px-4 py-3 flex items-center gap-2 ${themes.border.fadedThinBottom}`}
      >
        <SlidersHorizontal size={14} className={`${themes.text.primary}`} />
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${themes.text.primary}`}
        >
          Filters
        </span>
      </div>

      <div className="p-4 w-full space-y-3">
        <div className="w-full flex gap-2 items-center my-4">
          <div className="relative w-1/2">
            <Search
              size={14}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${themes.text.primary} pointer-events-none`}
            />
            <input
              type="text"
              placeholder="Search suite name..."
              value={filters.search}
              onChange={(e) => update("search", e.target.value)}
              className={`${inputBase} pl-9`}
            />
          </div>

          <div className="w-full">
            <label
              className={`flex text-xs font-medium mb-1.5 ${themes.text.primary}`}
            >
              Status
            </label>
            <div className="flex gap-2">
              {["ALL", "PUBLISHED", "NOT_PUBLISHED"].map((status) => (
                <button
                  key={status}
                  onClick={() => update("publishStatus", status)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95
                  ${
                    filters.publishStatus === status
                      ? `${themes.background.special} ${themes.text.inverted}`
                      : `${themes.background.secondary} ${themes.text.primary} ${themes.border.fadedThin} hover:opacity-80`
                  }`}
                >
                  {status === "ALL"
                    ? "All"
                    : status === "PUBLISHED"
                      ? "Published"
                      : "Unpublished"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div>
            <label
              className={`block text-xs font-medium mb-1.5 ${themes.text.primary}`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                Date Range
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                onChange={(e) => update("startDateFrom", e.target.value)}
                className={inputBase}
              />
              <div
                className={`flex items-center text-xs ${themes.text.primary}`}
              >
                →
              </div>
              <input
                type="date"
                onChange={(e) => update("startDateTo", e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-xs font-medium mb-1.5 ${themes.text.primary}`}
            >
              <span className="flex items-center gap-1.5">
                <ArrowUpDown size={12} />
                Sort
              </span>
            </label>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => update("sortBy", e.target.value)}
                className={selectBase}
              >
                <option value="createdAt">Created</option>
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
                <option value="name">Name</option>
              </select>

              <select
                value={filters.sortOrder}
                onChange={(e) => update("sortOrder", e.target.value)}
                className={`${selectBase} w-28`}
              >
                <option value="asc">ASC</option>
                <option value="desc">DESC</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
