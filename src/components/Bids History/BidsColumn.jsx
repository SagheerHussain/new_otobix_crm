import React from "react";
import StatusBadge from "../StatusBadge"

export const bidsColumns = [
  { header: "Bidder", accessor: "bidder" },
  { header: "Dealership Name", accessor: "dealershipName" },
  { header: "Assigned KAM", accessor: "assignedKAM" },
  {
    header: "Car Name",
    render: (row) => (
      <div className="max-w-[340px] truncate font-medium text-slate-800">
        {row.carName}
      </div>
    ),
  },
  {
    header: "Appointment ID",
    accessor: "appointmentId",
    className: "font-mono text-slate-500 font-medium text-xs",
    width: "160px",
  },
  {
    header: "Bid Amount",
    render: (row) => (
      <span className="font-semibold text-slate-900">
        Rs. {Number(row.bidAmount || 0).toLocaleString("en-IN")}/-
      </span>
    ),
    width: "140px",
  },
  {
    header: "Time",
    render: (row) => row.timeLabel,
    width: "190px",
  },
  {
    header: "Status",
    render: (row) => <StatusBadge value={row.status} />,
    width: "120px",
  },
];
