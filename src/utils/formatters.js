export const formatMoneyPKR = (n) => {
  const num = Number(n || 0);
  if (!Number.isFinite(num)) return "Rs. 0/-";
  return `Rs. ${num.toLocaleString("en-IN")}/-`;
};

export const formatDateTime = (isoOrDate) => {
  if (!isoOrDate) return "-";
  const d = new Date(isoOrDate);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export const formatDateOnly = (isoOrDate) => {
  if (!isoOrDate) return "-";
  const d = new Date(isoOrDate);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

export const formatKm = (n) => {
  const num = Number(n || 0);
  if (!Number.isFinite(num)) return "-";
  return `${num.toLocaleString("en-IN")} km`;
};

// backend: live, upcoming, otobuy, liveAuctionEnded
export const normalizeAuctionStatusLabel = (s) => {
  const v = String(s || "").trim();
  if (!v) return "Unknown";
  if (v === "liveAuctionEnded") return "Auction Ended";
  if (v === "otobuy") return "Otobuy";
  if (v === "live") return "Live";
  if (v === "upcoming") return "Upcoming";
  return v;
};
