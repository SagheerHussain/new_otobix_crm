import React from "react";

export default function StatCard({
  title,
  value,
  subtext,
  icon,
  colorInfo,
  isPrimary = false,
  children,
  subtextClass,
  compact = false,
}) {
  return (
    <div
      className={`rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between
      ${
        isPrimary
          ? "bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20"
          : "bg-white shadow-sm border border-gray-100"
      }
      ${compact ? "min-h-[120px]" : "snap-center shrink-0 w-[85vw] max-w-[320px]"}
    `}
    >
      {isPrimary && !compact && (
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      )}

      <div className="relative z-10 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start">
          <div
            className={`p-2 rounded-lg ${
              isPrimary ? "bg-white/20 backdrop-blur-sm" : colorInfo?.bg || "bg-gray-100"
            }`}
          >
            {React.cloneElement(icon, {
              className: isPrimary ? "text-white w-5 h-5" : `${colorInfo?.text || "text-gray-600"} w-5 h-5`,
            })}
          </div>

          {subtext ? (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                isPrimary ? "bg-white/20 backdrop-blur-sm" : subtextClass || "text-slate-400"
              }`}
            >
              {subtext}
            </span>
          ) : null}
        </div>

        <div>
          <p className={`text-sm font-medium mb-1 ${isPrimary ? "text-blue-100" : "text-slate-500"}`}>
            {title}
          </p>
          <h3 className={`text-3xl font-bold tracking-tight ${isPrimary ? "" : "text-slate-900"}`}>
            {value}
          </h3>
        </div>

        {children}
      </div>
    </div>
  );
}
