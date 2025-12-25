import React, { useMemo } from "react";
import Table from "../Table"; // ✅ adjust path if needed
import StatusDropdown from "./StatusDropdown";

const pillClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "approved") return "bg-emerald-50 text-emerald-700 border border-emerald-100";
  if (s === "rejected") return "bg-red-50 text-red-700 border border-red-100";
  return "bg-amber-50 text-amber-700 border border-amber-100";
};

export default function UsersTable({
  tabKey,
  isLoading,
  rows,
  totalItems,
  startIndex,
  endIndex,
  currentPage,
  itemsPerPage,
  onSetPage,
  onNext,
  onPrev,
  canNext,
  canPrev,
  onStatusChange,
  updatingId,
  onRowClick
}) {
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const columns = useMemo(() => {
    return [
      {
        header: "Name",
        width: "280px",
        render: (u) => {
          const initials = (u.userName || "U")
            .split(" ")
            .slice(0, 2)
            .map((x) => x[0])
            .join("")
            .toUpperCase();

          return (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 text-sm truncate">
                  {u.userName || "—"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {u.dealershipName ? `Dealer: ${u.dealershipName}` : "—"}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        header: "Role",
        width: "130px",
        render: (u) => (
          <span className="inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-100">
            {u.userRole || "—"}
          </span>
        ),
      },
      {
        header: "Phone",
        width: "160px",
        accessor: "phoneNumber",
      },
      {
        header: "Email",
        width: "280px",
        render: (u) => <span className="text-xs text-slate-600">{u.email || "—"}</span>,
      },
      {
        header: "Location",
        width: "150px",
        accessor: "location",
      },
      {
        header: "Assigned KAM",
        width: "200px",
        render: (u) => <span className="text-xs text-slate-600">{u.assignedKam || "No KAM Assigned"}</span>,
      },
      {
        header: "Status",
        width: "140px",
        render: (u) => (
          <span className={`inline-flex items-center px-2 py-1 text-[10px] font-black uppercase tracking-widest ${pillClass(u.approvalStatus)}`}>
            {u.approvalStatus || "Pending"}
          </span>
        ),
      },
      {
        header: "Actions",
        align: "right",
        width: "90px",
        render: (u) => (
          <div className="flex items-center justify-end">
            <StatusDropdown
              currentStatus={u.approvalStatus}
              disabled={updatingId === u._id}
              onSelect={(next) => onStatusChange(u._id, next)}
            />
          </div>
        ),
      },
    ];
  }, [onStatusChange, updatingId]);

  const pagination = {
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    canNext,
    canPrev,
    onNext,
    onPrev,
    onSetPage,
  };

  return (
    <section className="px-4 md:px-0">
      <div className="h-[calc(100vh-320px)] bg-white border border-gray-200">
        <Table
          columns={columns}
          data={rows}
          keyField="_id"
          isLoading={isLoading}
          pagination={pagination}
          emptyMessage={`No users found in ${tabKey.toUpperCase()} tab`}
           onRowClick={onRowClick}
        />
      </div>
    </section>
  );
}
