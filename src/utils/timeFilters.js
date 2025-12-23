export const inTimeRange = (date, range) => {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();

  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sun start
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  if (range === "today") return d >= startOfDay;
  if (range === "week") return d >= startOfWeek;
  if (range === "month") return d >= startOfMonth;
  if (range === "year") return d >= startOfYear;
  return true; // all
};

export const formatTimeLabel = (date) => {
  const d = new Date(date);
  const day = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${day} • ${time}`;
};
