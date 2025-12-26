import React, { useEffect, useMemo, useState } from "react";
import SectionShell from "./ui/SectionShell";
import Pill from "./ui/Pill";
import BannerCard from "./BannerCard";
import BannerModal from "./BannersModal";

import { fetchBannersList, deleteBanner, updateBannerStatus } from "../../services/customers";

export default function BannersView({ token, viewName, onAnyMutation }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);
  const [addType, setAddType] = useState("Header"); // "Header" | "Footer"

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetchBannersList({ token, view: viewName });
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewName]);

  const headerBanners = useMemo(() => items.filter((b) => b.type === "Header"), [items]);
  const footerBanners = useMemo(() => items.filter((b) => b.type === "Footer"), [items]);

  return (
    <div className="space-y-6">
      <SectionShell title={viewName} subtitle="Manage car banners" />

      {/* Header Section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold text-slate-900">Header Banner</div>
            <Pill tone="green">{headerBanners.length} Active</Pill>
          </div>

          <button
            onClick={() => {
              setAddType("Header");
              setOpenAdd(true);
            }}
            className="cursor-pointer px-3 py-1 text-sm bg-primary text-white hover:bg-primary/90 shadow-sm"
          >
            Add Banner
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-slate-500 text-sm">Loading...</div>
          ) : headerBanners.length === 0 ? (
            <div className="text-slate-500 text-sm">No header banners added yet.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {headerBanners.map((b) => (
                <BannerCard
                  key={b._id}
                  banner={b}
                  onDelete={async () => {
                    await deleteBanner({ token, bannerId: b._id });
                    await refresh();
                    onAnyMutation?.();
                  }}
                  onToggle={async () => {
                    await updateBannerStatus({
                      token,
                      bannerId: b._id,
                      status: b.status === "Active" ? "Inactive" : "Active",
                    });
                    await refresh();
                    onAnyMutation?.();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold text-slate-900">Footer Banner</div>
            <Pill tone="green">{footerBanners.length} Active</Pill>
          </div>

          <button
            onClick={() => {
              setAddType("Footer");
              setOpenAdd(true);
            }}
            className="cursor-pointer px-3 py-1 text-sm bg-primary text-white hover:bg-primary/90 shadow-sm"
          >
            Add Banner
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-slate-500 text-sm">Loading...</div>
          ) : footerBanners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-400">
              <div className="text-sm">No footer banners added yet</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {footerBanners.map((b) => (
                <BannerCard
                  key={b._id}
                  banner={b}
                  onDelete={async () => {
                    await deleteBanner({ token, bannerId: b._id });
                    await refresh();
                    onAnyMutation?.();
                  }}
                  onToggle={async () => {
                    await updateBannerStatus({
                      token,
                      bannerId: b._id,
                      status: b.status === "Active" ? "Inactive" : "Active",
                    });
                    await refresh();
                    onAnyMutation?.();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BannerModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        token={token}
        viewName={viewName}
        type={addType}
        onAdded={async () => {
          setOpenAdd(false);
          await refresh();
          onAnyMutation?.();
        }}
      />
    </div>
  );
}
