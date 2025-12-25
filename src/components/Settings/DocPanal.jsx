import React from "react";
import { FileText, RefreshCcw } from "lucide-react";
import UploadCard from "./UploadCard";
import VersionList from "./VersionList";

export default function DocPanel({
  title,
  subtitle,
  manager,
}) {
  const { loading, uploading, error, selected, versions, selectedVersion, refresh, pickVersion, upload } = manager;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* LEFT: Upload + Preview */}
      <div className="xl:col-span-8 space-y-4">
        <UploadCard
          title={`Upload ${title}`}
          subtitle="Upload .docx or .pdf — system will convert & store versioned content"
          uploading={uploading}
          onUpload={upload}
        />

        <div className="bg-white border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">
                    {title}
                    {selected?.version ? <span className="text-slate-400 font-bold text-xs ml-2">v{selected.version}</span> : null}
                  </div>
                  <div className="text-xs text-slate-400 font-semibold">{subtitle}</div>
                </div>
              </div>
            </div>

            <button
              onClick={refresh}
              className="px-3 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-xs font-black uppercase tracking-widest inline-flex items-center gap-2"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {error ? (
            <div className="p-4 text-sm text-red-600">{error}</div>
          ) : (
            <div className="p-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-2/3 bg-gray-100" />
                  <div className="h-4 w-1/2 bg-gray-100" />
                  <div className="h-4 w-3/4 bg-gray-100" />
                  <div className="h-64 w-full bg-gray-50 border border-gray-100" />
                </div>
              ) : selected?.content ? (
                <div className="border border-gray-100 bg-white p-4 max-h-[520px] overflow-auto">
                  {/* Backend already sanitizes HTML; render it */}
                  <div
                    className="doc-prose text-sm text-slate-700 leading-6"
                    dangerouslySetInnerHTML={{ __html: selected.content }}
                  />
                </div>
              ) : (
                <div className="text-sm text-slate-400 py-10 text-center">
                  No document uploaded yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Version list */}
      <div className="xl:col-span-4">
        <VersionList
          versions={versions}
          selectedVersion={selectedVersion}
          onPick={pickVersion}
          loading={loading}
        />
      </div>

      {/* small styling for rendered HTML */}
      <style>{`
        .doc-prose h1 { font-size: 18px; font-weight: 900; margin: 12px 0; color: #0f172a; }
        .doc-prose h2 { font-size: 16px; font-weight: 900; margin: 10px 0; color: #0f172a; }
        .doc-prose h3 { font-size: 14px; font-weight: 800; margin: 8px 0; color: #0f172a; }
        .doc-prose p { margin: 10px 0; }
        .doc-prose a { color: var(--color-primary, #2563eb); font-weight: 700; text-decoration: underline; }
        .doc-prose ul { padding-left: 18px; margin: 10px 0; list-style: disc; }
        .doc-prose ol { padding-left: 18px; margin: 10px 0; list-style: decimal; }
      `}</style>
    </div>
  );
}
