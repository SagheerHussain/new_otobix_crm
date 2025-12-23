import React from "react";

const TABS = [
  { key: "upcoming", label: "UPCOMING BIDS" },
  { key: "live", label: "LIVE BIDS" },
  { key: "upcomingAuto", label: "UPCOMING AUTO BIDS" },
  { key: "liveAuto", label: "LIVE AUTO BIDS" },
  { key: "otobuy", label: "OTOBUY OFFERS" },
];

export default function BidsTabs({ active, onChange, counts }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      {TABS.map((t) => {
        const isActive = active === t.key;
        const count = counts?.[t.key] ?? 0;

        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`h-11 shrink-0 px-5 border text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3
              ${isActive
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
          >
            {t.label}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-sm font-bold
                ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
