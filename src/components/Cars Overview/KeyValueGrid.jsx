import React from "react";

const Row = ({ label, value }) => (
  <div className="grid grid-cols-12 gap-3 py-2 border-b border-gray-100 last:border-b-0">
    <div className="col-span-5 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
      {label}
    </div>
    <div className="col-span-7 text-sm font-semibold text-slate-800 break-words">{value ?? "-"}</div>
  </div>
);

const KeyValueGrid = ({ items = [] }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white">
      <div className="px-4 py-2.5 bg-gray-50/60 border-b border-gray-100">
        <div className="text-xs font-black uppercase tracking-widest text-slate-700">Quick Details</div>
      </div>
      <div className="px-4">
        {items.map((it, idx) => (
          <Row key={idx} label={it.label} value={it.value} />
        ))}
      </div>
    </div>
  );
};

export default KeyValueGrid;
