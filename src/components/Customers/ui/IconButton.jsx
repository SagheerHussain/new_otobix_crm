import React from "react";

export default function IconButton({ children, onClick, title, danger = false }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-2 rounded-xl border transition
        ${danger ? "border-rose-200 hover:bg-rose-50 text-rose-600" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
    >
      {children}
    </button>
  );
}
