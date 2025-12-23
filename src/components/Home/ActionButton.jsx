// src/components/home/ActionButton.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ActionButton({ icon: Icon, label, colorClass, bgClass, to, disabled = false }) {
  const content = (
    <>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span
        className="font-medium text-[10px] text-slate-700 text-center leading-tight"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </>
  );

  const className = `flex flex-col items-center justify-start gap-2 p-3 rounded-xl bg-white border border-gray-100 shadow-sm active:scale-95 transition-all hover:bg-gray-50 min-h-[90px] w-full ${
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none grayscale" : ""
  }`;

  if (to && !disabled) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <button className={className}>{content}</button>;
}
