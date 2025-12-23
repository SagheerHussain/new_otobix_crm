import React from "react";

const styles = {
  inspected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",

  closed: "bg-rose-50 text-rose-700 border-rose-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",

  pending: "bg-amber-50 text-amber-700 border-amber-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  running: "bg-purple-50 text-purple-700 border-purple-200",

  default: "bg-slate-50 text-slate-700 border-slate-200",
  
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  offer: "bg-sky-50 text-sky-700 border-sky-200",
};

const normalize = (v) => String(v || "").trim().toLowerCase().replace(/\s+/g, "_");

export default function StatusBadge({ value }) {
  const key = normalize(value);

  // map common values to style keys
  const map = {
    inspection_approved: "inspected",
    inspected: "inspected",
    active: "active",
    approved: "approved",
    closed: "closed",
    rejected: "rejected",
    pending: "pending",
    scheduled: "scheduled",
    running: "running",
    live: "live",
    offer: "offer",
  };

  const cls = styles[map[key]] || styles.default;

  return (
    <span
      className={`inline-flex items-center justify-center uppercase tracking-widest font-black text-[9px]
        px-2 py-[3px] border ${cls}`}
      style={{ lineHeight: 1 }}
    >
      {String(value || "").toUpperCase()}
    </span>
  );
}
