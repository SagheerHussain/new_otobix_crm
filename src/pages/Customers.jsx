import React, { useEffect, useMemo, useState } from "react";
import { useHeader } from "../context/HeaderContext";

import CustomersOverview from "../components/Customers/CustomersOverview";
import CarDropdown from "../components/Customers/CarDropdown";
import BannersHub from "../components/Customers/BannerHub";
import BannersView from "../components/Customers/BannersView";

import { getCustomersSummary } from "../services/customers";
import { ArrowLeft, Search } from "lucide-react";

export default function Customers() {
  const { setTitle, setSearchContent, setActionsContent } = useHeader();
  const token = JSON.parse(localStorage.getItem("token"));

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summary, setSummary] = useState(null);

  // Views:
  // "overview" | "car-dropdown" | "banners-hub" | "banners-view"
  const [view, setView] = useState("overview");

  // banner view selection
  const [bannerViewName, setBannerViewName] = useState(null); // "Home" | "Sell My Car"

  // header-search for car dropdown table
  const [carSearch, setCarSearch] = useState("");

  const refreshSummary = async () => {
    setLoadingSummary(true);
    try {
      const data = await getCustomersSummary(token);
      setSummary(data);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    setTitle("Customer Management");
    refreshSummary();

    return () => {
      setTitle("");
      setSearchContent(null);
      setActionsContent(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Header UI mapping based on current view
  useEffect(() => {
    // TITLE: Back + Text together (same line)
    if (view !== "overview") {
      setTitle(
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (view === "banners-view") {
                setView("overview");
                return;
              }
              setView("overview");
            }}
            className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <span className="text-3xl font-semibold text-slate-800">
            Customer Management
          </span>
        </div>
      );

      // ab actions right side wali jagah empty kar do
      setActionsContent(null);
    } else {
      setTitle("Customer Management");
      setActionsContent(null);
    }

    // SEARCH BAR: same as your logic
    if (view === "car-dropdown") {
      setSearchContent(
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={carSearch}
            onChange={(e) => setCarSearch(e.target.value)}
            placeholder="Search make / model / variant / full name..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
          />
        </div>
      );
    } else {
      setSearchContent(null);
      setCarSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, carSearch]);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F5F6FA]">
      {/* Body */}
      <div className="p-5">
        {view === "overview" && (
          <CustomersOverview
            loading={loadingSummary}
            summary={summary}
            onOpenCarDropdown={() => setView("car-dropdown")}
            onOpenBanners={(which) => {
              setBannerViewName(which);
              setView("banners-view");
            }}
          />
        )}

        {view === "car-dropdown" && (
          <CarDropdown
            token={token}
            search={carSearch}
            onAnyMutation={refreshSummary}
          />
        )}

        {view === "banners-hub" && (
          <BannersHub
            summary={summary}
            onOpen={(which) => {
              setBannerViewName(which);
              setView("banners-view");
            }}
          />
        )}

        {view === "banners-view" && (
          <BannersView
            token={token}
            viewName={bannerViewName} // "Home" | "Sell My Car"
            onAnyMutation={refreshSummary}
          />
        )}
      </div>
    </div>
  );
}
