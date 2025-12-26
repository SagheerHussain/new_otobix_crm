import React from "react";

export default function ConfirmDialog({ open, title, message, onYes, onNo }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          <div className="text-sm text-slate-500 mt-1">{message}</div>
        </div>

        <div className="p-5 flex items-center justify-end gap-3">
          <button onClick={onNo} className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onYes} className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">
            Yes, Continue
          </button>
        </div>
      </div>
    </div>
  );
}
