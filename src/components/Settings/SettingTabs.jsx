import React from "react";
import { FileText, ShieldCheck, BookOpen } from "lucide-react";

const tabs = [
  { key: "terms", label: "Terms & Conditions", icon: FileText, hint: "Manage terms of service" },
  { key: "privacy", label: "Privacy Policy", icon: ShieldCheck, hint: "Update privacy policies" },
  { key: "guide", label: "User Guide", icon: BookOpen, hint: "Upload user documentation" },
];

export default function SettingsTabs({ active, onChange }) {
  return (
    <div className="w-full bg-white border border-gray-100 shadow-sm p-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`group flex items-center gap-3 px-3 py-3 border transition-all text-left
                ${isActive ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:bg-gray-50"}
              `}
            >
              <div
                className={`w-11 h-11 flex items-center justify-center border transition-all
                  ${isActive ? "bg-primary text-white border-primary" : "bg-gray-50 text-slate-600 border-gray-100 group-hover:bg-white"}
                `}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-slate-700"}`}>
                  {t.label}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold truncate">{t.hint}</div>
              </div>

              <div className="ml-auto">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    isActive ? "bg-primary" : "bg-gray-200 group-hover:bg-gray-300"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
