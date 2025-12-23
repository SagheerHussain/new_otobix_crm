import React from "react";
import { ChevronDown } from "lucide-react";

export const TIME_RANGES = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
];

export default function TimeRangeSelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-500">Showing:</span>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            h-11 min-w-[170px] pl-4 pr-10
            bg-white border border-slate-200
            text-sm font-semibold text-slate-700
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            shadow-sm hover:bg-slate-50 transition
            appearance-none
          "
        >
          {TIME_RANGES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* single clean icon (no double arrows) */}
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
