import React from "react";
import { Clock3 } from "lucide-react";

export default function VersionList({ versions, selectedVersion, onPick, loading }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-black text-slate-900">Versions</div>
        <div className="text-[11px] text-slate-400 font-semibold">
          {loading ? "Loading..." : `${versions?.length || 0} items`}
        </div>
      </div>

      <div className="mt-3 max-h-[360px] overflow-auto pr-1 space-y-2">
        {(versions || []).map((v) => {
          const active = selectedVersion === v.version;
          return (
            <button
              key={v._id || v.version}
              onClick={() => onPick?.(v.version)}
              className={`w-full text-left p-3 border transition-all
                ${active ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:bg-gray-50"}
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className={`text-xs font-black uppercase tracking-widest ${active ? "text-primary" : "text-slate-700"}`}>
                    v{v.version} • {v.title || v.fileName || "Untitled"}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold truncate">
                    {v.fileName || "—"}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock3 className="w-3.5 h-3.5" />
                  {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ""}
                </div>
              </div>
            </button>
          );
        })}

        {!loading && (!versions || versions.length === 0) && (
          <div className="text-sm text-slate-400 py-6 text-center">No versions found.</div>
        )}
      </div>
    </div>
  );
}
