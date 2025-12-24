import React from "react";

const SectionCard = ({ title, right, children, className = "" }) => {
  return (
    <div className={`bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/40">
          <div className="text-sm font-extrabold tracking-wide text-slate-900">{title}</div>
          <div>{right}</div>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default SectionCard;
