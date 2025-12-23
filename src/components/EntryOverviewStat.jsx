import React from "react";

export default function EntryOverviewStat({ icon: Icon, title, value, iconBg = "bg-emerald-50", iconColor = "text-emerald-600" }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm p-5 min-w-0">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {value ?? 0}
          </h3>
        </div>
      </div>
    </div>
  );
}
