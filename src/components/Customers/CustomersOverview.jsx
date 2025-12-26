import React from "react";
import SummaryCards from "./SummaryCards";
import ManageCard from "./ManageCard";
import { Car, Image as ImageIcon } from "lucide-react";
import BannersDropdownTile from "./BannersDropdownTile";
import CarDropdownTile from "./CarDropdownTile";

export default function CustomersOverview({
  loading,
  summary,
  onOpenCarDropdown,
  onOpenBanners,
}) {
  const total = summary?.totalCustomersLength ?? 0;
  const active = summary?.activeCustomersLength ?? 0;
  const thisMonth = summary?.thisMonthCustomersLength ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Customer Management
        </h2>
        <p className="text-slate-500 text-sm">Manage your customers</p>
      </div>

      <SummaryCards
        loading={loading}
        items={[
          { label: "Total Customers", value: total, tone: "blue" },
          { label: "Active Customers", value: active, tone: "green" },
          { label: "New This Month", value: thisMonth, tone: "red" },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4 items-start">
        <CarDropdownTile onOpen={onOpenCarDropdown} />
        <BannersDropdownTile onSelect={onOpenBanners} />
      </div>
    </div>
  );
}
