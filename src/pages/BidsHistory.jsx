import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useHeader } from "../context/HeaderContext";

import Table from "../components/Table";
import StatusBadge from "../components/StatusBadge";
import EntryOverviewStat from "../components/EntryOverviewStat";

import BidsTabs from "../components/Bids History/BidsTabs";
import TimeRangeSelect from "../components/Bids History/TimeRangeSelect";

import { fetchBidsSummary, fetchRecentBidsList } from "../services/bids";

// icons for stats cards
import { Clock, Flame, Bot, Zap, Tag } from "lucide-react";

const TYPE_BY_TAB = {
  upcoming: "upcomingBids",
  live: "liveBids",
  upcomingAuto: "upcomingAutoBids",
  liveAuto: "liveAutoBids",
  otobuy: "otobuyOffers",
};

const DEFAULT_LIMIT = 25;

const formatMoneyINR = (n) => {
  const num = Number(n || 0);
  return `Rs. ${num.toLocaleString("en-IN")}/-`;
};

const formatTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function BidsHistory() {
  const { setTitle, setSearchContent, setActionsContent } = useHeader();

  // UI states
  const [activeTab, setActiveTab] = useState("upcoming");
  const [range, setRange] = useState("all");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);

  // API states
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [paginationApi, setPaginationApi] = useState(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  // Header (ONLY search bar — no dropdown in header)
  useEffect(() => {
    setTitle("Bid History");

    setSearchContent(
      <div className="relative group w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search by appointment ID..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    );

    setActionsContent(null);
  }, [setTitle, setSearchContent, setActionsContent, searchQuery]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // fetch stats (cards) once
  useEffect(() => {
    const run = async () => {
      try {
        setLoadingStats(true);
        const res = await fetchBidsSummary();
        setStats(res?.data || null);
      } catch (e) {
        console.error("Bids summary fetch failed:", e);
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    run();
  }, []);

  // fetch table data whenever tab/range/page/search changes
  useEffect(() => {
    const run = async () => {
      try {
        setLoadingTable(true);
        const type = TYPE_BY_TAB[activeTab] || "liveBids";

        const res = await fetchRecentBidsList({
          type,
          range,
          page: currentPage,
          limit,
          search: debouncedSearch,
        });

        const bids = res?.data?.bids || [];
        const pag = res?.data?.pagination || null;

        setRows(bids);
        setPaginationApi(pag);
      } catch (e) {
        console.error("Recent bids list fetch failed:", e);
        setRows([]);
        setPaginationApi(null);
      } finally {
        setLoadingTable(false);
      }
    };

    run();
  }, [activeTab, range, currentPage, limit, debouncedSearch]);

  // when tab changes reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, range]);

  // tab counts from stats
  const tabCounts = useMemo(() => {
    const s = stats || {};
    return {
      upcoming: s.upcomingBids ?? 0,
      live: s.liveBids ?? 0,
      upcomingAuto: s.upcomingAutoBids ?? 0,
      liveAuto: s.liveAutoBids ?? 0,
      otobuy: s.otobuyOffers ?? 0,
    };
  }, [stats]);

  // Stats cards list (top row)
  const statCards = useMemo(() => {
    const s = stats || {};
    return [
      { title: "UPCOMING BIDS", value: s.upcomingBids ?? 0, icon: Clock, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
      { title: "LIVE BIDS", value: s.liveBids ?? 0, icon: Flame, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
      { title: "UPCOMING AUTO BIDS", value: s.upcomingAutoBids ?? 0, icon: Bot, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
      { title: "LIVE AUTO BIDS", value: s.liveAutoBids ?? 0, icon: Zap, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
      { title: "OTOBUY OFFERS", value: s.otobuyOffers ?? 0, icon: Tag, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    ];
  }, [stats]);

  // Table columns (same as your screenshot)
  const columns = useMemo(
    () => [
      { header: "BIDDER", accessor: "userName", width: "150px" },
      { header: "DEALERSHIP NAME", accessor: "dealershipName", width: "180px" },
      { header: "ASSIGNED KAM", accessor: "assignedKam", width: "150px" },
      {
        header: "CAR NAME",
        accessor: "car",
        className: "font-semibold text-slate-800",
      },
      {
        header: "APPOINTMENT ID",
        accessor: "appointmentId",
        className: "font-mono text-slate-600",
        width: "160px",
      },
      {
        header: "BID AMOUNT",
        accessor: "bidAmount",
        className: "font-black text-slate-900",
        width: "160px",
        render: (row) => formatMoneyINR(row.bidAmount),
      },
      {
        header: "TIME",
        accessor: "time",
        width: "200px",
        render: (row) => formatTime(row.time),
      },
      {
        header: "STATUS",
        accessor: "status",
        width: "120px",
        render: (row) => {
          // Your backend gives isActive (for offers it can be false)
          const isOffer = row.source === "otobuyOffers";
          const label = isOffer ? "OFFER" : row.isActive ? "LIVE" : "CLOSED";
          return <StatusBadge value={label} />;
        },
      },
    ],
    []
  );

  // Pagination adapter for Table.jsx
  const pagination = useMemo(() => {
    const totalItems = paginationApi?.total ?? rows.length;
    const totalPages = paginationApi?.totalPages ?? 1;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + rows.length;

    return {
      currentPage,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      onNext: () => setCurrentPage((p) => p + 1),
      onPrev: () => setCurrentPage((p) => Math.max(1, p - 1)),
      onSetPage: (p) => setCurrentPage(p),
      canNext: Boolean(paginationApi?.hasNext ?? currentPage < totalPages),
      canPrev: Boolean(paginationApi?.hasPrev ?? currentPage > 1),
    };
  }, [paginationApi, rows.length, currentPage, limit]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar space-y-6 pb-10">
      {/* ✅ Top stats row */}
      <section className="px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {loadingStats
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 shadow-sm p-5 animate-pulse h-[92px]" />
              ))
            : statCards.map((c) => (
                <EntryOverviewStat
                  key={c.title}
                  icon={c.icon}
                  title={c.title}
                  value={c.value}
                  iconBg={c.iconBg}
                  iconColor={c.iconColor}
                />
              ))}
        </div>
      </section>

      {/* ✅ Tabs + only one dropdown (yellow area) */}
      <section className="px-4 md:px-0">
        <div className="flex items-center justify-between gap-4">
          <BidsTabs active={activeTab} onChange={setActiveTab} counts={tabCounts} />
          <div className="shrink-0">
            <TimeRangeSelect value={range} onChange={setRange} />
          </div>
        </div>
      </section>

      {/* ✅ Table (reuse Table.jsx) */}
      <section className="px-4 md:px-0">
        <div className="h-[calc(100vh-320px)] bg-white border border-gray-200">
          <Table
            columns={columns}
            data={rows}
            isLoading={loadingTable}
            pagination={pagination}
            keyField="id"
            emptyMessage="No bids found"
          />
        </div>
      </section>
    </div>
  );
}
