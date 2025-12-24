// src/pages/inspectionRequests/inspectionRequestsColumns.js
import React from "react";
import { Calendar, MapPin, Car, Hash } from "lucide-react";

function formatDateTime(iso) {
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
}

export const inspectionRequestsColumns = [
  {
    header: "Reg. No",
    accessor: "carRegistrationNumber",
    width: "140px",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Hash className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-mono text-xs text-slate-700">
          {row.carRegistrationNumber || "-"}
        </span>
      </div>
    ),
  },
  {
    header: "Owner Name",
    accessor: "ownerName",
    width: "220px",
    render: (row) => (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-800">
          {row.ownerName || "-"}
        </span>
      </div>
    ),
  },
  {
    header: "Car",
    accessor: "carMakeModelVariant",
    render: (row) => (
      <div className="flex items-center gap-2 min-w-[240px]">
        <Car className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-800">
          {row.carMakeModelVariant || "-"}
        </span>
      </div>
    ),
  },
  {
    header: "Year",
    accessor: "yearOfRegistration",
    width: "90px",
    render: (row) => (
      <span className="text-xs text-slate-700 font-medium">
        {row.yearOfRegistration || "-"}
      </span>
    ),
  },
  {
    header: "Owner Serial",
    accessor: "ownershipSerialNumber",
    width: "130px",
    render: (row) => (
      <span className="text-xs text-slate-700 font-medium">
        {row.ownershipSerialNumber || "-"}
      </span>
    ),
  },
  {
    header: "Inspection Date",
    accessor: "inspectionDateTime",
    width: "190px",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-700 font-medium">
          {formatDateTime(row.inspectionDateTime)}
        </span>
      </div>
    ),
  },
  {
    header: "Address",
    accessor: "inspectionAddress",
    render: (row) => (
      <div className="flex items-center gap-2 min-w-[220px]">
        <MapPin className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs text-slate-700 font-medium">
          {row.inspectionAddress || "-"}
        </span>
      </div>
    ),
  },
];
