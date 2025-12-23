// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Users, XCircle, CheckCircle, UserCheck, Car, Activity } from "lucide-react";

import { useHeader } from "../context/HeaderContext";

import AtAGlance from "../components/Home/AtAGlance";
import QuickActions from "../components/Home/QuickActions";
import DealersOverviewChart from "../components/Home/DealersOverviewChart";

import { fetchAdminSummary, fetchSalesManagerUsersLength, fetchDealersByMonths } from "../services/homeStats";

const CACHE_KEY_DASHBOARD = "otobix_dashboard_cache";

const getRole = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    const raw = u?.userType || u?.userRole || "";
    return String(raw).toLowerCase().replaceAll("_", " ").trim(); // "admin" / "sales manager"
  } catch {
    return "";
  }
};

const Home = () => {
  const { setTitle, setSearchContent, setActionsContent } = useHeader();
  const role = useMemo(() => getRole(), []);
  const isSalesManager = role === "sales manager";

  // ✅ chart data (only relevant for Sales Manager)
  const [dealersData, setDealersData] = useState(() => {
    if (!isSalesManager) return []; // Admin ke liye empty
    const cached = localStorage.getItem(CACHE_KEY_DASHBOARD);
    return cached ? JSON.parse(cached) : [];
  });

  // ✅ loadingChart only for Sales Manager
  const [loadingChart, setLoadingChart] = useState(() => {
    if (!isSalesManager) return false;
    return !(localStorage.getItem(CACHE_KEY_DASHBOARD));
  });

  // ✅ cards
  const [glanceCards, setGlanceCards] = useState([]);
  const [loadingGlance, setLoadingGlance] = useState(true);

  useEffect(() => {
    setTitle("Dashboard");
    setSearchContent(null);
    setActionsContent(
      <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-primary transition-colors">
        <Bell className="w-6 h-6" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
      </Link>
    );
  }, [setTitle, setSearchContent, setActionsContent]);

  // ✅ Dealers by month request ONLY when Sales Manager
  useEffect(() => {
    if (!isSalesManager) return; // ✅ Admin par request hi nahi jayegi

    const fetchChart = async () => {
      let formattedData = [];
      try {
        const year = new Date().getFullYear();

        const res = await fetchDealersByMonths(year);
        const payload = res?.data;

        if (res?.ok && payload?.series && payload?.categories) {
          formattedData = payload.categories.map((cat, index) => ({
            name: cat,
            dealers: payload.series[index] ?? 0,
          }));
        } else {
          throw new Error("Invalid dealers-by-months response");
        }
      } catch (err) {
        console.error("Dealers Chart Fetch Error:", err);
        formattedData = Array(12)
          .fill(0)
          .map((_, i) => ({
            name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
            dealers: 0,
          }));
      } finally {
        setDealersData(formattedData);
        localStorage.setItem(CACHE_KEY_DASHBOARD, JSON.stringify(formattedData));
        setLoadingChart(false);
      }
    };

    fetchChart();
  }, [isSalesManager]);

  // ✅ fetch + build 3 cards (same as your code)
  useEffect(() => {
    const run = async () => {
      try {
        setLoadingGlance(true);

        if (role === "admin") {
          const res = await fetchSalesManagerUsersLength();
          const pending = res?.pendingUsersLength ?? 0;
          const rejected = res?.rejectedUsersLength ?? 0;
          const approved = res?.approvedUsersLength ?? 0;

          setGlanceCards([
            {
              title: "Pending Users",
              value: pending,
              subtext: "Needs action",
              subtextClass: "text-yellow-700 bg-yellow-50",
              icon: <Users />,
              colorInfo: { bg: "bg-yellow-100", text: "text-yellow-700" },
              children: (
                <div className="w-full bg-black/10 rounded-full h-1.5 mt-auto">
                  <div className="bg-white/70 h-1.5 rounded-full" style={{ width: `${Math.min(100, pending * 5)}%` }} />
                </div>
              ),
            },
            {
              title: "Rejected Users",
              value: rejected,
              subtext: "Check reasons",
              subtextClass: "text-rose-700 bg-rose-50",
              icon: <XCircle />,
              colorInfo: { bg: "bg-rose-100", text: "text-rose-700" },
            },
            {
              title: "Approved Users",
              value: approved,
              subtext: "Active",
              subtextClass: "text-emerald-700 bg-emerald-50",
              icon: <CheckCircle />,
              colorInfo: { bg: "bg-emerald-100", text: "text-emerald-700" },
            },
          ]);
        } else if (role === "sales manager") {
          const res = await fetchAdminSummary();
          const d = res?.data || {};

          const totalDealers = d?.totalDealers ?? 0;
          const totalCars = d?.totalcars ?? d?.totalCars ?? 0;
          const liveCars = d?.liveCars ?? 0;

          setGlanceCards([
            {
              title: "Total Dealers",
              value: totalDealers,
              subtext: "All time",
              subtextClass: "text-indigo-700 bg-indigo-50",
              icon: <UserCheck />,
              colorInfo: { bg: "bg-indigo-100", text: "text-indigo-700" },
              children: (
                <div className="w-full bg-black/10 rounded-full h-1.5 mt-auto">
                  <div className="bg-white/70 h-1.5 rounded-full" style={{ width: `${Math.min(100, totalDealers)}%` }} />
                </div>
              ),
            },
            {
              title: "Total Cars",
              value: totalCars,
              subtext: "In system",
              subtextClass: "text-slate-700 bg-slate-50",
              icon: <Car />,
              colorInfo: { bg: "bg-slate-100", text: "text-slate-700" },
            },
            {
              title: "Live Cars",
              value: liveCars,
              subtext: "Live now",
              subtextClass: "text-emerald-700 bg-emerald-50",
              icon: <Activity />,
              colorInfo: { bg: "bg-emerald-100", text: "text-emerald-700" },
            },
          ]);
        } else {
          setGlanceCards([]);
        }
      } catch (e) {
        console.error("At a glance fetch failed:", e);
        setGlanceCards([]);
      } finally {
        setLoadingGlance(false);
      }
    };

    run();
  }, [role]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar space-y-6 pb-10">
      <AtAGlance cards={glanceCards} loading={loadingGlance} />

      <QuickActions />

      {/* ✅ Chart ONLY for Sales Manager */}
      {isSalesManager ? (
        <div className="grid grid-cols-1 gap-6 px-4 md:px-0">
          {loadingChart ? (
            <div className="text-slate-400">Loading chart...</div>
          ) : (
            <DealersOverviewChart dealersData={dealersData} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Home;
