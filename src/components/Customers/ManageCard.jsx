import React from "react";

const toneMap = {
  blue: { panel: "bg-[#EEF4FF]", iconBg: "bg-blue-200/50", badge: "bg-blue-100 text-blue-700" },
  red: { panel: "bg-[#FFF1F2]", iconBg: "bg-rose-200/50", badge: "bg-rose-100 text-rose-700" },
};

export default function ManageCard({ title, subtitle, badge, icon, tone = "blue", onClick }) {
  const t = toneMap[tone] || toneMap.blue;

  return (
    <button
      onClick={onClick}
      className={`text-left cursor-pointer rounded-3xl p-6 shadow-sm border border-slate-200 ${t.panel}
                 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-14 h-14 rounded-2xl ${t.iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="text-slate-600 text-2xl leading-none">›</div>
      </div>

      <div className="mt-5">
        <div className="text-lg font-semibold text-slate-900">{title}</div>
        <div className="text-sm text-slate-600 mt-1">{subtitle}</div>

        {/* <div className={`inline-flex mt-5 px-3 py-1 rounded-full text-xs font-medium ${t.badge}`}>
          {badge}
        </div> */}
      </div>
    </button>
  );
}
