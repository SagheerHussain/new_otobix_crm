import React from "react";
import { Clock } from "lucide-react";

const toneMap = {
  green: {
    iconBg: "bg-emerald-50",
    iconRing: "ring-emerald-100",
    iconColor: "text-emerald-600",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconRing: "ring-blue-100",
    iconColor: "text-blue-600",
  },
  red: {
    iconBg: "bg-rose-50",
    iconRing: "ring-rose-100",
    iconColor: "text-rose-600",
  },
  slate: {
    iconBg: "bg-slate-50",
    iconRing: "ring-slate-200",
    iconColor: "text-slate-600",
  },
};

export default function SummaryCards({ loading, items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
      {items.map((it, idx) => {
        const tone = toneMap[it.tone] || toneMap.green;
        const Icon = it.icon || Clock;

        return (
          <div
            key={idx}
            className="
              bg-white rounded-2xl border border-slate-200 shadow-sm
              px-6 py-5
              flex items-center gap-5
              hover:shadow-md transition-shadow
            "
          >
            {/* Icon box */}
            <div
              className={`
                w-12 h-12 rounded-xl ${tone.iconBg}
                ring-1 ${tone.iconRing}
                flex items-center justify-center
              `}
            >
              <Icon className={`w-5 h-5 ${tone.iconColor}`} />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400">
                {it.label}
              </div>

              <div className="text-3xl font-bold tracking-tight text-slate-900 leading-snug">
                {loading ? "—" : it.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
