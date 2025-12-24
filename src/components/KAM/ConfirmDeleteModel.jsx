// src/components/KAM/ConfirmDeleteModel.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  title = "Delete",
  message = "Are you sure you want to delete?",
  busy = false,
  onYes,
  onCancel,
}) {
  const [visible, setVisible] = useState(false);

  // when open becomes true -> show with animation
  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }

    // when open becomes false -> animate out, then unmount
    const t = setTimeout(() => setVisible(false), 160);
    return () => clearTimeout(t);
  }, [open]);

  // ✅ IMPORTANT: unmount when not open + not visible
  if (!open && !visible) return null;

  const close = () => onCancel?.();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={busy ? undefined : close}
        className={`absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 ${
          open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]"
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="font-bold text-slate-900">{title}</div>

          <button
            onClick={busy ? undefined : close}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={busy}
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm text-slate-600">{message}</p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={busy ? undefined : close}
              disabled={busy}
              className="flex-1 py-2.5 border border-gray-300 text-slate-700 font-semibold hover:bg-gray-50 transition-colors rounded-xl disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              onClick={onYes}
              disabled={busy}
              className="flex-1 py-2.5 bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors rounded-xl disabled:opacity-60"
            >
              {busy ? "Deleting..." : "Yes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
