import React from "react";
import { Clock, Flame, Bot, Zap, Tag } from "lucide-react";
import EntryOverviewStat from "../EntryOverviewStat";

export default function BidsStatsRow({ stats }) {
  return (
    <section className="px-4 md:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <EntryOverviewStat title="Upcoming Bids" value={stats.upcomingBids} icon={<Clock />} />
        <EntryOverviewStat title="Live Bids" value={stats.liveBids} icon={<Flame />} />
        <EntryOverviewStat title="Upcoming Auto Bids" value={stats.upcomingAutoBids} icon={<Bot />} />
        <EntryOverviewStat title="Live Auto Bids" value={stats.liveAutoBids} icon={<Zap />} />
        <EntryOverviewStat title="Otobuy Offers" value={stats.otobuyOffers} icon={<Tag />} />
      </div>
    </section>
  );
}
