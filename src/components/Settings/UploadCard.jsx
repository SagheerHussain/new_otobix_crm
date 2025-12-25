import React, { useMemo, useRef, useState } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";

export default function UploadCard({ title, subtitle, onUpload, uploading }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [docTitle, setDocTitle] = useState("");

  const fileMeta = useMemo(() => {
    if (!file) return null;
    const kb = Math.round(file.size / 1024);
    const mb = (file.size / (1024 * 1024)).toFixed(2);
    return { name: file.name, type: file.type, size: kb > 1024 ? `${mb} MB` : `${kb} KB` };
  }, [file]);

  const canUpload = !!file && !uploading;

  const accept = ".pdf,.docx";

  return (
    <div className="bg-white border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-black text-slate-900">{title}</div>
          <div className="text-xs text-slate-400 font-semibold mt-0.5">{subtitle}</div>
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-black uppercase tracking-widest"
        >
          Choose File
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8">
          <div className="bg-gray-50 border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white border border-gray-100 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-slate-700">
                  {fileMeta ? fileMeta.name : "Drop your .docx or .pdf here"}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold">
                  {fileMeta ? `${fileMeta.size}` : "Max 15MB • Backend converts to HTML automatically"}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <input
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Optional title (otherwise auto-derived from document)"
                className="w-full px-3 py-2 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <button
            disabled={!canUpload}
            onClick={async () => {
              const ok = await onUpload?.({ file, title: docTitle });
              if (ok) {
                setFile(null);
                setDocTitle("");
                if (inputRef.current) inputRef.current.value = "";
              }
            }}
            className={`w-full h-full min-h-[92px] flex items-center justify-center gap-2 border text-xs font-black uppercase tracking-widest transition-all
              ${canUpload ? "bg-primary text-white border-primary hover:opacity-90 shadow-lg shadow-primary/20" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"}
            `}
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
