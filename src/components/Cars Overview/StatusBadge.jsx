import React from "react";

const normalizeStatus = (raw) => {
  const s = String(raw || "").trim();

  // make it robust for different casing
  const lower = s.toLowerCase();

  if (lower === "live") return "live";
  if (lower === "upcoming") return "upcoming";
  if (lower === "otobuy") return "otobuy";

  // backend sends this camelCase
  if (lower === "liveauctionended") return "liveAuctionEnded";

  return "unknown";
};

const STYLES = {
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
  upcoming: "border-rose-200 bg-rose-50 text-rose-700",
  otobuy: "border-purple-200 bg-purple-50 text-purple-700",
  liveAuctionEnded: "border-sky-200 bg-sky-50 text-sky-700",
  unknown: "border-gray-200 bg-gray-50 text-gray-700",
};

const LABELS = {
  live: "Live",
  upcoming: "Upcoming",
  otobuy: "Otobuy",
  liveAuctionEnded: "Auction Ended", // ✅ UI label
  unknown: "—",
};

export default function StatusBadge({ status }) {
  const key = normalizeStatus(status);

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[120px] px-3 py-1 text-[11px] font-black uppercase tracking-widest border ${STYLES[key]}`}
    >
      {LABELS[key]}
    </span>
  );
}
