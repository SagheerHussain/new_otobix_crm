import React from "react";
import { FileImage } from "lucide-react";

const Thumb = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="group block w-28 h-20 rounded-xl overflow-hidden border border-gray-200 bg-slate-100 hover:border-primary transition"
    title="Open"
  >
    <img src={url} alt="doc" className="w-full h-full object-cover group-hover:scale-[1.03] transition" />
  </a>
);

const DocGallery = ({ title, urls = [] }) => {
  if (!urls?.length) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
          <FileImage className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500 font-medium">Click any to open</div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {urls.slice(0, 20).map((u) => (
          <Thumb key={u} url={u} />
        ))}
      </div>
    </div>
  );
};

export default DocGallery;
