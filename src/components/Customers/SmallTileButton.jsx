import React from "react";

export default function SmallTileButton({
  title,
  icon,
  iconBg = "bg-slate-100",
  iconColor = "text-slate-700",
  rightIcon = null,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        bg-white
        border border-slate-200
        rounded-xl
        shadow-sm
        hover:shadow-md
        transition
        px-3 py-2.5
        flex items-center justify-between cursor-pointer
      "
    >
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </span>

        <span className="text-sm font-semibold text-slate-800">{title}</span>
      </div>

      {rightIcon && <span className="text-slate-400">{rightIcon}</span>}
    </button>
  );
}
