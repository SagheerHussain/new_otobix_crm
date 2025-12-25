import React, { useEffect, useRef, useState } from "react";
import { MoreVertical, Check } from "lucide-react";

const STATUS = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export default function StatusDropdown({
  currentStatus,
  disabled,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useOutsideClick(wrapRef, () => setOpen(false));

  return (
    <div className="relative" ref={wrapRef}>
      <button
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={[
          "p-2 border border-gray-200 bg-white hover:bg-gray-50 transition-colors",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
        title="Change status"
      >
        <MoreVertical className="w-4 h-4 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 shadow-lg z-50">
          {STATUS.map((s) => {
            const active = String(currentStatus || "").toLowerCase() === String(s.value).toLowerCase();
            return (
              <button
                key={s.value}
                onClick={(e) => {
                  e.stopPropagation(); // ✅
                  setOpen(false);
                  onSelect?.(s.value);
                }}
                className="w-full px-3 py-2 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-slate-700">{s.label}</span>
                {active && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
