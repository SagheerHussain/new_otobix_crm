import React, { useMemo, useState } from "react";
import { MoreHorizontal, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const defaultTasks = [
  {
    id: "1",
    title: "Call John Doe regarding quote",
    time: "10:00 AM",
    tag: "Quote",
    tagClass: "bg-indigo-50 text-indigo-700",
    done: false,
  },
  {
    id: "2",
    title: "Site Inspection at 5th Ave",
    time: "2:00 PM",
    tag: "Field",
    tagClass: "bg-amber-50 text-amber-700",
    done: false,
  },
  {
    id: "3",
    title: "Weekly Team Sync",
    time: "9:00 AM",
    tag: "Internal",
    tagClass: "bg-slate-100 text-slate-600",
    done: true,
  },
];

export default function TodaysTasks({ tasks = defaultTasks, onViewAllHref = "/tasks" }) {
  const [items, setItems] = useState(tasks);

  const toggleDone = (id) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const sorted = useMemo(() => {
    // undone first, then done
    return [...items].sort((a, b) => Number(a.done) - Number(b.done));
  }, [items]);

  return (
    <div className="">
      {/* header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-slate-900">
          Today's Tasks
        </h3>

        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-50 text-slate-500"
          aria-label="More"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* list */}
      <div className="px-3 pb-3 space-y-3">
        {sorted.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-4 hover:shadow-sm transition"
          >
            {/* checkbox */}
            <button
              type="button"
              onClick={() => toggleDone(t.id)}
              className={`w-5 h-5 rounded-[4px] border flex items-center justify-center shrink-0
                ${t.done ? "bg-blue-600 border-blue-600" : "border-slate-300"}
              `}
              aria-label={t.done ? "Mark as not done" : "Mark as done"}
            >
              {t.done ? <span className="text-white text-[12px]">✓</span> : null}
            </button>

            {/* content */}
            <div className="min-w-0 flex-1">
              <div
                className={`text-[14px] font-semibold truncate ${
                  t.done ? "text-slate-400 line-through" : "text-slate-900"
                }`}
                title={t.title}
              >
                {t.title}
              </div>

              <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-500">
                <Clock className="w-4 h-4" />
                <span>{t.time}</span>

                <span
                  className={`ml-1 px-2 py-[2px] rounded-full text-[11px] font-medium ${t.tagClass}`}
                >
                  {t.tag}
                </span>
              </div>
            </div>

            {/* arrow */}
            <div className="text-slate-300">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}

        {/* footer link */}
        <div className="pt-2 pb-1 text-center">
          <Link
            to={onViewAllHref}
            className="text-[13px] font-medium text-blue-600 hover:text-blue-700"
          >
            View All Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
