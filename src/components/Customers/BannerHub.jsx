import React from "react";
import ManageCard from "./ManageCard";
import { Home, Tag } from "lucide-react";

export default function BannersHub({ onOpen, summary }) {
  const banners = summary?.bannersLength ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Car Banners</h2>
        <p className="text-slate-500 text-sm">Manage car banners</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ManageCard
          title="Homepage Banners"
          subtitle="Manage homepage banners"
          // badge={`${banners} total`}
          icon={<Home className="w-6 h-6" />}
          tone="blue"
          onClick={() => onOpen("Home")}
        />

        <ManageCard
          title="Sell My Car Banners"
          subtitle="Manage sell my car banners"
          // badge={`${banners} total`}
          icon={<Tag className="w-6 h-6" />}
          tone="red"
          onClick={() => onOpen("Sell My Car")}
        />
      </div>
    </div>
  );
}
