// src/components/home/AtAGlance.jsx
import React from "react";
import StatCard from "./StatCard";

export default function AtAGlance({ cards = [], loading = false }) {
  return (
    <section className="mt-4 md:mt-0">
      <div className="flex overflow-x-auto gap-3 px-4 md:px-0 pb-2 no-scrollbar snap-x snap-mandatory">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="snap-center shrink-0 w-[85vw] max-w-[320px] rounded-2xl p-5 bg-white border border-gray-100 shadow-sm animate-pulse"
              >
                <div className="h-8 w-8 rounded-lg bg-gray-100" />
                <div className="mt-4 h-3 w-24 bg-gray-100 rounded" />
                <div className="mt-3 h-8 w-16 bg-gray-100 rounded" />
                <div className="mt-6 h-2 w-full bg-gray-100 rounded" />
              </div>
            ))
          : cards.slice(0, 3).map((c, idx) => (
              <StatCard
                key={c.title}
                title={c.title}
                value={c.value}
                subtext={c.subtext}
                subtextClass={c.subtextClass}
                icon={c.icon}
                colorInfo={c.colorInfo}
                isPrimary={idx === 0} // first card primary like your UI
              >
                {c.children}
              </StatCard>
            ))}
      </div>
    </section>
  );
}
