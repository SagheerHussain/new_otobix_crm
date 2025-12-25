import React, { useEffect, useRef, useState } from "react";
import { Filter, Check } from "lucide-react";

const ROLES = [
  { label: "All", value: "ALL" },
  { label: "Dealer", value: "DEALER" },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Sales Manager", value: "SALES_MANAGER" },
  { label: "Lead", value: "LEAD" },
  { label: "Inspection", value: "INSPECTION" },
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

export default function UsersRoleFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useOutsideClick(wrapRef, () => setOpen(false));

  const activeLabel =
    ROLES.find((r) => r.value === value)?.label || "All Roles";

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-black uppercase tracking-widest"
        title="Filter by role"
      >
        <Filter className="w-4 h-4 text-slate-500" />
        <span className="hidden sm:inline">Filter</span>
        <span className="ml-1 text-[10px] font-black bg-white border border-gray-200 px-2 py-0.5 text-slate-600">
          {activeLabel}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Filter by Role
            </p>
          </div>

          <div className="py-1">
            {ROLES.map((r) => {
              const active = r.value === value;
              return (
                <button
                  key={r.value}
                  onClick={() => {
                    onChange(r.value);
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold uppercase tracking-widest hover:bg-gray-50 flex items-center justify-between"
                >
                  <span className="text-slate-700">{r.label}</span>
                  {active && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
