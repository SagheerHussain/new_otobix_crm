import React from "react";

export default function CarsTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      {tabs.map((t) => {
        const isActive = active === t.value;

        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`flex cursor-pointer h-10 shrink-0 items-center justify-center px-4 text-[11px] font-black uppercase tracking-widest transition-all gap-3 border
              ${isActive
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
          >
            {t.label}
            <span
              className={`text-[10px] px-1.5 py-0.5 font-bold
                ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}
            >
              {t.count ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
