import React, { useEffect, useMemo, useState } from "react";
import { X, Upload } from "lucide-react";
import { addBanner } from "../../services/customers";

export default function BannerModal({ open, onClose, token, viewName, type, onAdded }) {
  const [screenName, setScreenName] = useState("");
  const [status, setStatus] = useState("Active");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setScreenName("");
    setStatus("Active");
    setFile(null);
  }, [open]);

  const canSave = useMemo(() => !!file && !!screenName.trim(), [file, screenName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="font-semibold text-slate-900">
            Add {type} Banner
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <label
            className="block rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50
                       hover:bg-slate-100 transition cursor-pointer p-8 text-center"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Upload className="w-6 h-6" />
              <div className="text-sm font-medium">
                {file ? file.name : "Click to upload banner image"}
              </div>
              <div className="text-xs">PNG / JPG recommended</div>
            </div>
          </label>

          <div>
            <label className="text-sm font-medium text-slate-700">
              {type === "Header" ? "Title" : "Screen Name"}
            </label>
            <input
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
              className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
              placeholder={type === "Header" ? "Enter title" : "Enter screen name"}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Status</div>
            <button
              type="button"
              onClick={() => setStatus((s) => (s === "Active" ? "Inactive" : "Active"))}
              className={`w-14 h-8 rounded-full relative transition ${
                status === "Active" ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                  status === "Active" ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50">
              Cancel
            </button>

            <button
              disabled={!canSave || saving}
              onClick={async () => {
                try {
                  setSaving(true);
                  await addBanner({
                    token,
                    file,
                    screenName: screenName.trim(),
                    status,
                    type,
                    view: viewName,
                  });
                  await onAdded?.();
                } finally {
                  setSaving(false);
                }
              }}
              className="flex-1 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? "Uploading..." : "Add Banner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
