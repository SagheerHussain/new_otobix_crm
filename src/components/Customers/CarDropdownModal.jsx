import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function CarDropdownModal({ open, onClose, mode = "add", initial, onSubmit }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMake(initial?.make || "");
    setModel(initial?.model || "");
    setVariant(initial?.variant || "");
    setIsActive(initial?.isActive ?? true);
  }, [open, initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-3 bg-primary text-white flex items-center justify-between">
          <div className="font-semibold">
            {mode === "add" ? "Add New Car Dropdown" : "Edit Car Dropdown"}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Make *</label>
            <input
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Enter car make"
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Model *</label>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Enter car model"
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Variant *</label>
            <input
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              placeholder="Enter car variant"
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-sm font-medium text-slate-700">Active</div>
            <button
              type="button"
              onClick={() => setIsActive((s) => !s)}
              className={`w-14 h-8 rounded-full relative transition ${
                isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                  isActive ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              Cancel
            </button>

            <button
              disabled={saving || !make.trim() || !model.trim() || !variant.trim()}
              onClick={async () => {
                try {
                  setSaving(true);
                  await onSubmit({
                    make: make.trim(),
                    model: model.trim(),
                    variant: variant.trim(),
                    isActive,
                  });
                } finally {
                  setSaving(false);
                }
              }}
              className="flex-1 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? "Saving..." : mode === "add" ? "Add Dropdown" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
