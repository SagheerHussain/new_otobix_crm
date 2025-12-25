import React, { useEffect, useMemo, useState } from "react";
import { useHeader } from "../context/HeaderContext";

import UsersStatsCards from "../components/Users/UserStatsCards";
import UsersTabs from "../components/Users/UsersTabs";
import UsersTable from "../components/Users/UsersTable";
import UsersRoleFilter from "../components/Users/UsersRoleFIlter";

import { useUsersManagement } from "../hooks/useUsersmanagement";
import { useNavigate } from "react-router-dom";

export default function Users() {
    const { setTitle, setSearchContent, setActionsContent } = useHeader();
    const navigate = useNavigate();

    const token = JSON.parse(localStorage.getItem("token"))

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    const { loading, error, counts, lists, refresh, updateStatus, updatingId } =
        useUsersManagement(token);

    const activeList = lists[activeTab] || [];

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return activeList.filter((u) => {
            // Role filter
            const role = String(u.userRole || "").toUpperCase();
            const roleOk = roleFilter === "ALL" ? true : role === roleFilter;

            if (!roleOk) return false;

            // Search filter
            if (!q) return true;

            const name = (u.userName || "").toLowerCase();
            const email = (u.email || "").toLowerCase();
            const phone = (u.phoneNumber || "").toLowerCase();
            const loc = (u.location || "").toLowerCase();
            const kam = (u.assignedKam || "").toLowerCase();

            return (
                name.includes(q) ||
                email.includes(q) ||
                phone.includes(q) ||
                role.toLowerCase().includes(q) ||
                loc.includes(q) ||
                kam.includes(q)
            );
        });
    }, [activeList, search, roleFilter]);


    const [pageByTab, setPageByTab] = useState({
        all: 1,
        pending: 1,
        approved: 1,
        rejected: 1,
    });

    const itemsPerPage = 10;
    const currentPage = pageByTab[activeTab] || 1;

    const totalItems = filtered.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const pageRows = filtered.slice(startIndex, endIndex);

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    const onSetPage = (p) => setPageByTab((prev) => ({ ...prev, [activeTab]: p }));
    const onPrev = () => canPrev && onSetPage(currentPage - 1);
    const onNext = () => canNext && onSetPage(currentPage + 1);

    useEffect(() => {
        setTitle("User Management");
        setSearchContent(null);
        setActionsContent(null);
    }, [setTitle, setSearchContent, setActionsContent]);

    const onTabChange = (tab) => {
        setActiveTab(tab);
        setPageByTab((prev) => ({ ...prev, [tab]: 1 }));
    };

    const onRoleChange = (val) => {
        setRoleFilter(val);
        onSetPage(1);
    };

    const handleRowClick = (user) => {
        if (!user?._id) return;
        navigate(`/users/${user._id}`, { state: { user } });
    };

    return (
        <div className="h-full w-full bg-[#f7f9fc]">
            <div className="p-4 md:p-6 space-y-4">
                <UsersStatsCards counts={counts} loading={loading} />

                <div className="bg-white border border-gray-100 shadow-sm">
                    <div className="p-3 md:p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <UsersTabs active={activeTab} counts={counts} onChange={onTabChange} />

                        <div className="flex items-center gap-2 w-full md:w-[520px]">
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    onSetPage(1);
                                }}
                                placeholder="Search by name, role, email, phone, location..."
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold uppercase tracking-widest placeholder:text-slate-300"
                            />

                            <UsersRoleFilter value={roleFilter} onChange={onRoleChange} />

                            <button
                                onClick={refresh}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-black uppercase tracking-widest"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <div className="p-6 text-sm text-red-600">{error}</div>
                    ) : (
                        <UsersTable
                            tabKey={activeTab}
                            isLoading={loading}
                            rows={pageRows}
                            totalItems={totalItems}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onSetPage={onSetPage}
                            onPrev={onPrev}
                            onNext={onNext}
                            canPrev={canPrev}
                            canNext={canNext}
                            onStatusChange={updateStatus}
                            updatingId={updatingId}
                            onRowClick={handleRowClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
