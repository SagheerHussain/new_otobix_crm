import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldX,
  Clock3,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  User2,
  Building2,
  KeyRound,
  Layers,
} from "lucide-react";

const statusBadge = (s) => {
  const v = String(s || "").toLowerCase();
  if (v === "approved") return { cls: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: BadgeCheck, label: "Approved" };
  if (v === "rejected") return { cls: "bg-red-50 text-red-700 border-red-100", icon: ShieldX, label: "Rejected" };
  return { cls: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock3, label: "Pending" };
};

const chip = (text) => (
  <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-white/70 border border-white/60 text-slate-700">
    {text}
  </span>
);

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900 break-words">
        {
            label === "Image" ? <img src={value} alt="" /> : value ?? "—"
        }
      </div>
    </div>
  );
}

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // ✅ user object comes from state (from table row click)
  const user = location?.state?.user;

  const safeUser = user || null;

  const initials = useMemo(() => {
    const name = safeUser?.userName || "User";
    return name
      .split(" ")
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase();
  }, [safeUser]);

  const badge = statusBadge(safeUser?.approvalStatus);
  const BadgeIcon = badge.icon;

  // If user not found (e.g. refresh on detail page), show friendly message
  if (!safeUser) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mt-6 bg-white border border-gray-100 shadow-sm p-6">
          <p className="text-slate-700 font-semibold">
            User details not available (page refreshed).
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Please go back to the Users list and open the user again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-sky-100/40 to-emerald-100/40" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative px-4 md:px-6 pt-6 pb-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur border border-white/60 hover:bg-white text-xs font-black uppercase tracking-widest shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-2">
              {/* no event for now */}
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                title="Assign KAM"
              >
                <KeyRound className="w-4 h-4" />
                ASSIGN KAM
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white/70 backdrop-blur border border-white/60 shadow-sm">
            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-white/70 shadow-sm flex items-center justify-center text-primary font-black text-xl">
                  {initials}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-black text-slate-900">
                      {safeUser.userName}
                    </h1>

                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${badge.cls}`}>
                      <BadgeIcon className="w-4 h-4" />
                      {badge.label}
                    </span>

                    {chip(safeUser.userRole)}
                    {chip(safeUser.assignedKam || "No KAM Assigned")}
                    {safeUser.isStaff ? chip("STAFF") : null}
                  </div>

                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-600">
                    <div className="inline-flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{safeUser.email}</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{safeUser.phoneNumber}</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold">{safeUser.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right summary */}
              <div className="md:ml-auto grid grid-cols-2 gap-3 w-full md:w-auto">
                <div className="bg-white border border-gray-100 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    ID
                  </div>
                  <div className="text-xs font-bold text-slate-700 break-all">
                    {safeUser._id || id}
                  </div>
                </div>
                <div className="bg-white border border-gray-100 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    ENTITY TYPE
                  </div>
                  <div className="text-sm font-black text-slate-900">
                    {safeUser.entityType || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* quick tiles */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Primary Contact
                </p>
              </div>
              <p className="mt-2 text-sm font-black text-slate-900">
                {safeUser.primaryContactPerson || "—"}
              </p>
              <p className="text-sm text-slate-600 font-semibold">
                {safeUser.primaryContactNumber || "—"}
              </p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Secondary Contact
                </p>
              </div>
              <p className="mt-2 text-sm font-black text-slate-900">
                {safeUser.secondaryContactPerson || "—"}
              </p>
              <p className="text-sm text-slate-600 font-semibold">
                {safeUser.secondaryContactNumber || "—"}
              </p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Dealership
                </p>
              </div>
              <p className="mt-2 text-sm font-black text-slate-900">
                {safeUser.dealershipName || "—"}
              </p>
              <p className="text-xs text-slate-500 font-semibold">
                {safeUser.userRole === "DEALER" ? "Dealer Account" : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="pb-10">
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left big */}
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Full Profile Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="User Role" value={safeUser.userRole} />
                <DetailRow label="Approval Status" value={safeUser.approvalStatus} />
                <DetailRow label="Assigned KAM" value={safeUser.assignedKam || "No KAM Assigned"} />
                <DetailRow label="Is Staff" value={safeUser.isStaff ? "Yes" : "No"} />

                <DetailRow label="Username" value={safeUser.userName} />
                <DetailRow label="Email" value={safeUser.email} />
                <DetailRow label="Phone Number" value={safeUser.phoneNumber} />
                <DetailRow label="Location" value={safeUser.location} />

                <DetailRow label="Dealership Name" value={safeUser.dealershipName} />
                <DetailRow label="Entity Type" value={safeUser.entityType} />

                <DetailRow label="Primary Contact Person" value={safeUser.primaryContactPerson} />
                <DetailRow label="Primary Contact Number" value={safeUser.primaryContactNumber} />

                <DetailRow label="Secondary Contact Person" value={safeUser.secondaryContactPerson} />
                <DetailRow label="Secondary Contact Number" value={safeUser.secondaryContactNumber} />

                <DetailRow label="Rejection Comment" value={safeUser.rejectionComment || "—"} />
                <DetailRow label="Image" value={safeUser.image || "—"} />
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                Address List
              </h3>

              <div className="mt-3">
                {Array.isArray(safeUser.addressList) && safeUser.addressList.length ? (
                  <ul className="space-y-2">
                    {safeUser.addressList.map((a, idx) => (
                      <li
                        key={idx}
                        className="p-3 bg-gray-50 border border-gray-100 text-sm font-semibold text-slate-700"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-400">No addresses.</div>
                )}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                Permissions
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {Array.isArray(safeUser.permissions) && safeUser.permissions.length ? (
                  safeUser.permissions.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-100"
                    >
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No permissions</span>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                Wishlist / My Bids
              </h3>

              <div className="mt-3 space-y-3">
                <div className="bg-gray-50 border border-gray-100 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Wishlist
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">
                    {Array.isArray(safeUser.wishlist) ? safeUser.wishlist.length : 0} items
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    My Bids
                  </div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">
                    {Array.isArray(safeUser.myBids) ? safeUser.myBids.length : 0} items
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                Meta
              </h3>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <DetailRow label="Created At" value={safeUser.createdAt || "—"} />
                <DetailRow label="Updated At" value={safeUser.updatedAt || "—"} />
              </div>

              <div className="mt-4 text-[11px] text-slate-400">
                Note: “ASSIGN KAM” button is UI-only right now (no event attached).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
