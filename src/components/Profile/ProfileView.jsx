import React, { useMemo } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ProfileView({ user }) {
  const initials = useMemo(() => {
    const n = user?.userName || user?.name || "U";
    return n.trim().slice(0, 1).toUpperCase();
  }, [user]);

  const roleRaw = user?.userRole || user?.userType || "";
  const roleLabel = String(roleRaw).replaceAll("_", " ").toUpperCase();
  const imageUrl = user?.image || user?.imageUrl || "";

  return (
    <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-white to-emerald-50 border border-slate-200 shadow-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-slate-600">{initials}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.userName || user?.name || "User"}
                </h2>

                {user?.approvalStatus && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {String(user.approvalStatus).toUpperCase()}
                  </span>
                )}

                {roleLabel && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                    {roleLabel}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user?.email || "-"}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {user?.phoneNumber || "-"}
                </span>

                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {user?.location || "-"}
                </span>
              </div>
            </div>
          </div>

          {user?.entityType ? (
            <div className="min-w-[140px] text-right">
              <div className="inline-block bg-white border border-slate-200 rounded-xl px-4 py-3">
                <div className="text-[11px] font-bold text-slate-400 tracking-widest">
                  ENTITY TYPE
                </div>
                <div className="text-sm font-extrabold text-slate-900 mt-1">
                  {user.entityType}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
