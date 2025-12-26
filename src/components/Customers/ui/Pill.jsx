import React from "react";

const tones = {
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  red: "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
  slate: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

export default function Pill({ tone = "slate", children }) {
  return (
    <span className={`inline-flex px-2 py-1 uppercase text-xs font-medium ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}
