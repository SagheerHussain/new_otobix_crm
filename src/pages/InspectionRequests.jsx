// src/pages/InspectionRequests.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useHeader } from "../context/HeaderContext";
import Table from "../components/Table";
import { fetchInspectionRequests } from "../services/inspection";
import { inspectionRequestsColumns } from "../components/Inspection Requests/inspectionRequestsColumns";

const PAGE_SIZE = 10;

const InspectionRequests = () => {
  const { setTitle, setSearchContent, setActionsContent } = useHeader();

  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [paginationApi, setPaginationApi] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(searchQuery.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Header (no buttons)
  useEffect(() => {
    setTitle("Inspection Requests");

    setSearchContent(
      <div className="relative group w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search by reg no, owner, car, city..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    );

    setActionsContent(null);
  }, [setTitle, setSearchContent, setActionsContent, searchQuery]);

  // Fetch
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Use your real auth token source here
        const token = JSON.parse(localStorage.getItem("token")); // adjust if different

        const json = await fetchInspectionRequests({
          token,
          page: currentPage,
          limit: PAGE_SIZE,
          search: debounced,
        });

        if (cancelled) return;

        // API shape you showed:
        // { success:true, data:[...], pagination:{ currentPage,totalPages,total } }
        setRows(Array.isArray(json?.data) ? json.data : []);
        setPaginationApi(json?.pagination || { currentPage: 1, totalPages: 1, total: 0 });
      } catch (e) {
        if (!cancelled) setError(e.message || "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [currentPage, debounced]);

  // Adapt to Table.jsx pagination interface
  const tablePagination = useMemo(() => {
    const totalItems = paginationApi.total ?? 0;
    const totalPages = paginationApi.totalPages ?? 1;

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + rows.length;

    return {
      currentPage,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      onNext: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
      onPrev: () => setCurrentPage((p) => Math.max(p - 1, 1)),
      onSetPage: (p) => setCurrentPage(p),
      canNext: currentPage < totalPages,
      canPrev: currentPage > 1,
    };
  }, [currentPage, paginationApi, rows.length]);

  return (
    <div className="flex flex-col h-full bg-background-light font-display">
      <div className="flex-1 overflow-auto bg-background-light">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-white border border-red-100 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          </div>
        ) : (
          <div className="px-4 md:px-0">
            <div className="bg-white border border-gray-200 shadow-sm">
              <Table
                columns={inspectionRequestsColumns}
                data={rows}
                pagination={tablePagination}
                keyField="id"
                emptyMessage="No inspection requests found."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionRequests;
