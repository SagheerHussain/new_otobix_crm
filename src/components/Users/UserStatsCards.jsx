import React from "react";
import { Users, Clock3, BadgeCheck, BadgeX } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, loading }) => {
  return (
    <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-600" />
      </div>

      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 leading-tight">
          {loading ? "—" : value}
        </p>
      </div>
    </div>
  );
};

export default function UsersStatsCards({ counts, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="All Users"
        value={counts?.totalUsersLength ?? 0}
        loading={loading}
      />
      <StatCard
        icon={Clock3}
        label="Pending Users"
        value={counts?.pendingUsersLength ?? 0}
        loading={loading}
      />
      <StatCard
        icon={BadgeCheck}
        label="Approved Users"
        value={counts?.approvedUsersLength ?? 0}
        loading={loading}
      />
      <StatCard
        icon={BadgeX}
        label="Rejected Users"
        value={counts?.rejectedUsersLength ?? 0}
        loading={loading}
      />
    </div>
  );
}
