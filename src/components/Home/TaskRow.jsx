// src/components/home/TaskRow.jsx
import React from "react";
import { ChevronRight, Clock } from "lucide-react";

export default function TaskRow({ title, time, tag, tagColor, checked = false }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm ${
        checked ? "opacity-60" : ""
      }`}
    >
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          defaultChecked={checked}
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary bg-gray-50"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold text-slate-900 truncate ${
            checked ? "line-through decoration-slate-400" : ""
          }`}
        >
          {title}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center text-xs text-slate-500">
            <Clock className="w-3 h-3 mr-1" />
            {time}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tagColor}`}>{tag}</span>
        </div>
      </div>

      {!checked && (
        <button className="text-slate-400 hover:text-primary transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
