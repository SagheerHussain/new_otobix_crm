// src/pages/KAMManagement/utils/columns.js
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

function formatDate(dt) {
  if (!dt) return "-";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export function buildKamColumns({ onEdit, onDelete }) {
  return [
    {
      header: "Name",
      render: (row) => <div className="font-semibold text-slate-900">{row?.name || "-"}</div>,
      width: "220px",
    },
    {
      header: "Email",
      render: (row) => <div className="text-slate-700">{row?.email || "-"}</div>,
      width: "260px",
    },
    {
      header: "Phone",
      render: (row) => <div className="font-mono text-slate-600">{row?.phoneNumber || "-"}</div>,
      width: "160px",
    },
    {
      header: "Region",
      render: (row) => <div className="text-slate-700">{row?.region || "-"}</div>,
      width: "160px",
    },
    {
      header: "Created",
      render: (row) => <div className="text-slate-600">{formatDate(row?.createdAt)}</div>,
      width: "220px",
    },
    {
      header: "Actions",
      align: "right",
      width: "120px",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
            aria-label="Edit"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row);
            }}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
}
