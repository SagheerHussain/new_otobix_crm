import React from "react";

const TAB_META = [
  { key: "all", label: "All", countKey: "totalUsersLength" },
  { key: "pending", label: "Pending", countKey: "pendingUsersLength" },
  { key: "approved", label: "Approved", countKey: "approvedUsersLength" },
  { key: "rejected", label: "Rejected", countKey: "rejectedUsersLength" },
];

export default function UsersTabs({ active, counts, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAB_META.map((t) => {
        const isActive = active === t.key;
        const count = counts?.[t.countKey] ?? 0;

        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "px-4 py-2 border text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors",
              isActive
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
          >
            <span>{t.label}</span>
            <span
              className={[
                "px-2 py-0.5 text-[10px] font-black",
                isActive ? "bg-white/15" : "bg-gray-100 text-slate-500",
              ].join(" ")}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
