import React from "react";
import EntryOverviewStat from "../EntryOverviewStat"; // or wherever you placed it
import { Car, Clock, Activity, Flame, Tag } from "lucide-react";

export default function CarsStats({ summary, loading }) {
  const d = summary?.data || {};

  const cards = [
    { title: "Total Cars", value: d.totalCars ?? d.totalcars ?? 0, icon: Car },
    { title: "Upcoming Cars", value: d.upcomingCars ?? 0, icon: Clock },
    { title: "Live Cars", value: d.liveCars ?? 0, icon: Activity },
    { title: "Auction Ended Cars", value: d.auctionEndedCars ?? d.endedCars ?? 0, icon: Flame },
    { title: "Otobuy Cars", value: d.otobuyCars ?? 0, icon: Tag },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c) => (
        <EntryOverviewStat
          key={c.title}
          icon={c.icon}
          title={c.title}
          value={loading ? "—" : c.value}
        />
      ))}
    </div>
  );
}
