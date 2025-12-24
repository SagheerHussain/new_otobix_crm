import React, { useEffect, useMemo, useState } from "react";
import { Search, Car as CarIcon } from "lucide-react";
import { useHeader } from "../context/HeaderContext";
import Table from "../components/Table";

import CarsStats from "../components/Cars Overview/CarsStats";
import CarsTabs from "../components/Cars Overview/CarsTabs";
import StatusBadge from "../components/Cars Overview/StatusBadge";

import { fetchCarsSummaryCounts, fetchCarsList } from "../services/cars";
import { useNavigate } from "react-router-dom";

const LIMIT = 10;

const formatMoney = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}/-`;

const formatSoldAt = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
};

export default function CarsOverview() {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [activeTab, setActiveTab] = useState("all"); // all | upcoming | live | ended | otobuy
    const [page, setPage] = useState(1);

    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const [rows, setRows] = useState([]);
    const [loadingRows, setLoadingRows] = useState(true);

    const [serverPagination, setServerPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const navigate = useNavigate();

    // debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // header
    useEffect(() => {
        setTitle("Cars Overview");

        setSearchContent(
            <div className="relative group w-full max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name, appointment ID, city..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        );

        setActionsContent(null);
    }, [setTitle, setSearchContent, setActionsContent, searchQuery]);

    // summary
    useEffect(() => {
        const run = async () => {
            try {
                setLoadingSummary(true);
                const res = await fetchCarsSummaryCounts();
                console.log("res cars stats ==== >", res)
                setSummary(res);
            } catch (e) {
                console.error("Cars summary error:", e);
                setSummary(null);
            } finally {
                setLoadingSummary(false);
            }
        };
        run();
    }, []);

    // fetch list
    useEffect(() => {
        const run = async () => {
            try {
                setLoadingRows(true);

                // map our tabs -> backend status (adjust if your backend expects different values)
                const statusMap = {
                    all: "all",
                    upcoming: "upcoming",
                    live: "live",
                    ended: "liveAuctionEnded",
                    otobuy: "otobuy",
                    sold: "sold",
                    removed: "removed",
                };

                const res = await fetchCarsList({
                    status: statusMap[activeTab],
                    page,
                    limit: LIMIT,
                    search: "", // ✅ keep backend search off if not supported / or add debouncedSearch if backend supports
                });

                // expected shape:
                // res.data.cars, res.data.pagination
                const cars = res?.data?.cars || res?.data?.list || [];
                const p = res?.data?.pagination || {};

                // normalize to UI rows
                const mapped = cars.map((c) => ({
                    id: c.id,
                    image: c.thumbnailUrl || "",
                    name: c.title || "Unknown",
                    appointmentId: c.appointmentId || "-",
                    city: c.city || "-",
                    odometer: (c.odometerKm || c.odometerKm === 0) ? `${Number(c.odometerKm).toLocaleString("en-IN")} km` : "-",
                    highestBid: c.highestBid ?? 0,
                    status: c.auctionStatus || "—",
                    soldAt: c.soldAt ?? null,
                    soldTo: c.soldToName || "-",
                }));

                setRows(mapped);

                setServerPagination({
                    total: p.total ?? 0,
                    totalPages: p.totalPages ?? 1,
                });
            } catch (e) {
                console.error("Cars list error:", e);
                setRows([]);
                setServerPagination({ total: 0, totalPages: 1 });
            } finally {
                setLoadingRows(false);
            }
        };

        run();
    }, [activeTab, page]);

    // reset page on tab change
    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    // ✅ frontend search filtering
    const filteredRows = useMemo(() => {
        const q = debouncedSearch.toLowerCase();
        if (!q) return rows;

        return rows.filter((r) => {
            const bag = [r.name, r.appointmentId, r.city].filter(Boolean).join(" ").toLowerCase();
            return bag.includes(q);
        });
    }, [rows, debouncedSearch]);

    // tabs counts from summary
    const tabs = useMemo(() => {
        const d = summary || {};
        return [
            { label: "All Cars", value: "all", count: d.totalCars ?? d.totalcars ?? 0 },
            { label: "Upcoming", value: "upcoming", count: d.upcomingCars ?? 0 },
            { label: "Live", value: "live", count: d.liveCars ?? 0 },
            { label: "Auction Ended", value: "ended", count: d.auctionEndedCars ?? d.endedCars ?? 0 },
            { label: "Otobuy", value: "otobuy", count: d.otobuyCars ?? 0 },
            { label: "Sold", value: "sold", count: d.soldCars ?? 0 },
            { label: "Removed", value: "removed", count: d.removedCars ?? 0 },
        ];
    }, [summary]);

    // ✅ Sold columns show ONLY for All + Otobuy
    const showSoldColumns = activeTab === "all" || activeTab === "otobuy";

    const columns = useMemo(() => {
        const base = [
            {
                header: "Image",
                width: "90px",
                render: (row) => (
                    <div className="w-12 h-12 bg-gray-100 overflow-hidden border border-gray-200">
                        {row.image ? (
                            <img src={row.image} alt="car" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <CarIcon className="w-4 h-4 text-slate-300" />
                            </div>
                        )}
                    </div>
                ),
            },
            {
                header: "Name",
                accessor: "name",
                className: "font-semibold text-slate-900",
            },
            { header: "Appointment ID", accessor: "appointmentId" },
            { header: "City", accessor: "city" },
            { header: "Odometer", accessor: "odometer" },
            {
                header: "Highest Bid",
                render: (row) => <span className="font-black text-slate-900">{formatMoney(row.highestBid)}</span>,
            },
            {
                header: "Status",
                render: (row) => <StatusBadge status={row.status} />,
            },
        ];

        // ✅ add Sold columns only if needed
        if (showSoldColumns) {
            base.push(
                {
                    header: "Sold At",
                    render: (row) => <span className="text-slate-600 font-medium">{formatSoldAt(row.soldAt)}</span>,
                },
                {
                    header: "Sold To",
                    accessor: "soldTo",
                }
            );
        }

        return base;
    }, [activeTab, showSoldColumns]);

    const pagination = useMemo(() => {
        const totalItems = serverPagination.total ?? 0;
        const totalPages = serverPagination.totalPages ?? 1;

        const startIndex = (page - 1) * LIMIT;
        const endIndex = startIndex + filteredRows.length;

        return {
            currentPage: page,
            totalItems,
            totalPages,
            startIndex,
            endIndex,
            onNext: () => setPage((p) => Math.min(totalPages, p + 1)),
            onPrev: () => setPage((p) => Math.max(1, p - 1)),
            onSetPage: (p) => setPage(p),
            canNext: page < totalPages,
            canPrev: page > 1,
        };
    }, [serverPagination, page, filteredRows.length]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar space-y-6 pb-10">
            {/* stats */}
            <div className="px-4 md:px-0">
                <CarsStats summary={summary} loading={loadingSummary} />
            </div>

            {/* tabs */}
            <div className="px-4 md:px-0">
                <CarsTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
            </div>

            {/* table */}
            <div className="px-4 md:px-0">
                <div className="bg-white border border-gray-200 shadow-sm">
                    <Table
                        columns={columns}
                        data={filteredRows}
                        keyField="id"
                        isLoading={loadingRows}
                        pagination={pagination}
                        emptyMessage="No cars found"
                        onRowClick={(row) => navigate(`/carsOverview/${row.id}`)}
                    />
                </div>
            </div>
        </div>
    );
}
