import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

const DUMMY_WEEKLY = [
  { name: "Jan", dealers: 0 },
  { name: "Feb", dealers: 0 },
  { name: "Mar", dealers: 0 },
  { name: "Apr", dealers: 0 },
  { name: "May", dealers: 0 },
  { name: "Jun", dealers: 0 },
  { name: "Jul", dealers: 0 },
];

export default function WeeklyPerformance() {
  const chartData = useMemo(() => DUMMY_WEEKLY, []);

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-900">Weekly Performance</h3>

        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-50 text-slate-500"
          aria-label="More"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm min-w-0 overflow-hidden">
        {false ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300} minWidth={0}>
            <BarChart data={chartData}>
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

              <Bar
                dataKey="dealers"
                fill="#92c1ffff"
                radius={[4, 4, 4, 4]}
                activeBar={{ fill: "#3F72AF" }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
