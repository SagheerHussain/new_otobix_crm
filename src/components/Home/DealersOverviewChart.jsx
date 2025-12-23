// src/components/home/DealersOverviewChart.jsx
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DealersOverviewChart({ dealersData }) {
  const weekData = useMemo(() => dealersData, [dealersData]);

  return (
    <section className="pb-6 lg:pb-0 min-w-0">
      <h3 className="text-lg font-bold mb-3 text-slate-900">Dealers Overview</h3>
      <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height={300} minWidth={0}>
          <BarChart data={weekData}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              cursor={{ fill: "#F3F4F6" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar dataKey="dealers" fill="#92c1ffff" radius={[4, 4, 4, 4]} activeBar={{ fill: "#3F72AF" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
