import React from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import Pill from "./ui/Pill";
import IconButton from "./ui/IconButton";

export default function BannerCard({ banner, onDelete, onToggle }) {
  const active = banner.status === "Active";

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition">
      <div className="relative">
        <img
          src={banner.imageUrl}
          alt={banner.screenName}
          className="w-full bg-slate-100"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          {active ? <Pill tone="green">Active</Pill> : <Pill tone="red">Inactive</Pill>}
        </div>
      </div>

      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">{banner.screenName}</div>
          <div className="text-xs text-slate-500">
            {banner.view} • {banner.type}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton title={active ? "Deactivate" : "Activate"} onClick={onToggle}>
            {active ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
          </IconButton>

          <IconButton title="Delete" danger onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
