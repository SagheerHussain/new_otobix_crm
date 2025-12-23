import React from "react";
import { Users, XCircle, CheckCircle, Car, UserCheck, Activity, CalendarClock, BadgeCheck } from "lucide-react";
import StatCard from "./StatCard";

// Admin: Pending, Rejected, Approved
export function AdminCards({ stats }) {
  const pending = stats?.pendingUsersLength ?? 0;
  const rejected = stats?.rejectedUsersLength ?? 0;
  const approved = stats?.approvedUsersLength ?? 0;

  return (
    <section className="px-4 md:px-0">
      <h3 className="text-lg font-bold mb-4 text-slate-900">Users Overview</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          compact
          title="Pending Users"
          value={pending}
          icon={<Users />}
          colorInfo={{ bg: "bg-yellow-100", text: "text-yellow-700" }}
          subtext="Needs action"
          subtextClass="bg-yellow-50 text-yellow-700"
        />

        <StatCard
          compact
          title="Rejected Users"
          value={rejected}
          icon={<XCircle />}
          colorInfo={{ bg: "bg-rose-100", text: "text-rose-700" }}
          subtext="Check reasons"
          subtextClass="bg-rose-50 text-rose-700"
        />

        <StatCard
          compact
          title="Approved Users"
          value={approved}
          icon={<CheckCircle />}
          colorInfo={{ bg: "bg-emerald-100", text: "text-emerald-700" }}
          subtext="Active"
          subtextClass="bg-emerald-50 text-emerald-700"
        />
      </div>
    </section>
  );
}

// Sales Manager: TotalDealers, TotalCars, UpcomingCars, LiveCars, OtobuyCars
export function SalesManagerCards({ stats }) {
  const totalDealers = stats?.totalDealers ?? 0;
  const totalCars = stats?.totalcars ?? stats?.totalCars ?? 0; // API screenshot shows totalcars
  const upcomingCars = stats?.upcomingCars ?? 0;
  const liveCars = stats?.liveCars ?? 0;
  const otobuyCars = stats?.otobuyCars ?? 0;

  return (
    <section className="px-4 md:px-0">
      <h3 className="text-lg font-bold mb-4 text-slate-900">Reports Summary</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          compact
          title="Total Dealers"
          value={totalDealers}
          icon={<UserCheck />}
          colorInfo={{ bg: "bg-indigo-100", text: "text-indigo-700" }}
        />

        <StatCard
          compact
          title="Total Cars"
          value={totalCars}
          icon={<Car />}
          colorInfo={{ bg: "bg-slate-100", text: "text-slate-700" }}
        />

        <StatCard
          compact
          title="Upcoming Cars"
          value={upcomingCars}
          icon={<CalendarClock />}
          colorInfo={{ bg: "bg-amber-100", text: "text-amber-700" }}
        />

        <StatCard
          compact
          title="Live Cars"
          value={liveCars}
          icon={<Activity />}
          colorInfo={{ bg: "bg-emerald-100", text: "text-emerald-700" }}
        />

        <StatCard
          compact
          title="Otobuy Cars"
          value={otobuyCars}
          icon={<BadgeCheck />}
          colorInfo={{ bg: "bg-purple-100", text: "text-purple-700" }}
        />
      </div>
    </section>
  );
}
