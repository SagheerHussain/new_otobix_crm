import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldX,
  MapPin,
  Phone,
  Mail,
  BadgeCheck,
  User2,
  Building2,
  KeyRound,
  Layers,
  Briefcase,
  User,
  Users,
  Target,
  ClipboardCheck,
  Clock3,
  X,
  Loader2,
  RefreshCcw,
} from "lucide-react";

/* ---------------- Token helper ---------------- */
const getAuthToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    return parsed?.token || parsed?.accessToken || "";
  } catch {
    return raw;
  }
};

/* ---------------- Base URL safe ---------------- */
const RAW_BASE = import.meta.env.VITE_BASE_URL; // might be ".../api"
const safeBase = RAW_BASE?.endsWith("/api") ? RAW_BASE.slice(0, -4) : RAW_BASE;

/* ---------------- Badge helper ---------------- */
const statusBadge = (s) => {
  const key = String(s ?? "").trim().toLowerCase();

  if (key === "approved")
    return { cls: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: BadgeCheck, label: "Approved" };

  if (key === "rejected")
    return { cls: "bg-red-50 text-red-700 border border-red-100", icon: ShieldX, label: "Rejected" };

  if (key === "dealer")
    return { cls: "bg-sky-50 text-sky-700 border border-sky-100", icon: Briefcase, label: "Dealer" };

  if (key === "sales manager" || key === "sales_manager" || key === "sales-manager")
    return { cls: "bg-pink-50 text-pink-700 border border-pink-100", icon: Users, label: "Sales Manager" };

  if (key === "customer")
    return { cls: "bg-purple-50 text-purple-700 border border-purple-100", icon: User, label: "Customer" };

  if (key === "lead")
    return { cls: "bg-orange-50 text-orange-700 border border-orange-100", icon: Target, label: "Lead" };

  if (key === "inspection")
    return { cls: "bg-lime-50 text-lime-700 border border-lime-100", icon: ClipboardCheck, label: "Inspection" };

  return { cls: "bg-slate-50 text-slate-700 border border-slate-200", icon: Clock3, label: String(s ?? "Unknown") };
};

const chip = (text) => (
  <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-white/70 border border-white/60 text-slate-700">
    {text}
  </span>
);

function DetailRow({ label, value }) {
  const isNode = React.isValidElement(value);

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </div>

      <div className="text-sm font-semibold text-slate-900 break-words">
        {label === "Image" ? (
          value ? <img src={value} alt="" className="w-full max-w-[260px] border border-gray-100" /> : "—"
        ) : isNode ? (
          value
        ) : (
          value ?? "—"
        )}
      </div>
    </div>
  );
}

/* ---------------- Modal ---------------- */
function AssignKamModal({
  open,
  onClose,
  dealerId,
  currentKamId,
  onAssigned,
}) {
  const [kams, setKams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [selectedKamId, setSelectedKamId] = useState(currentKamId || "");

  const token = useMemo(() => getAuthToken(), []);

  const getKamId = (kam) => String(kam?._id || kam?.id || "").trim();
  const sameId = (a, b) => String(a || "").trim() === String(b || "").trim();

  const selectedKam = useMemo(() => {
    return kams.find((k) => sameId(getKamId(k), selectedKamId)) || null;
  }, [kams, selectedKamId]);

  const fetchKams = async () => {
    setError("");
    setLoading(true);
    try {
      // adjust if your route is different:
      // your previous codebase had fetchKams service; use that if exists
      const res = await axios.get(`${safeBase}/api/admin/kams/get-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // common shapes:
      // { ok:true, data:[...] } OR { items:[...] } OR direct array
      const list = res.data?.data || res.data?.items || res.data || [];
      const arr = Array.isArray(list) ? list : [];
      setKams(arr);

      // ✅ If currentKamId invalid OR empty and list has items, keep selection stable
      const cur = String(currentKamId || "").trim();
      if (cur) {
        // keep current selection
        setSelectedKamId(cur);
      } else if (arr.length) {
        // default to first kam id (optional)
        // setSelectedKamId(getKamId(arr[0]));
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load KAM list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setSelectedKamId(currentKamId || "");
    fetchKams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleAssign = async () => {
    setError("");
    setAssigning(true);
    try {
      // ✅ IMPORTANT: send kamId as ObjectId OR "" for unassign
      const payload = { dealerId, kamId: selectedKamId || "" };

      const res = await axios.post(
        `${safeBase}/api/admin/kams/assign-to-dealer`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.ok === false) {
        throw new Error(res.data?.message || "Failed to assign KAM");
      }

      onAssigned?.(payload.kamId); // update UI in parent
      onClose?.();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to assign KAM");
    } finally {
      setAssigning(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-black tracking-wide text-slate-900">Assign KAM to Dealer</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a KAM and assign. You can also unassign by choosing “None”.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 border border-gray-100"
            title="Close"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Select KAM
            </div>

            <button
              onClick={fetchKams}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-50"
              disabled={loading}
              title="Refresh"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
              Refresh
            </button>
          </div>

          <div className="mt-2">
            <select
              className="w-full h-11 px-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold text-slate-800 bg-white"
              value={selectedKamId}
              onChange={(e) => setSelectedKamId(String(e.target.value || "").trim())}
              disabled={loading}
            >
              {/* ✅ Unassign */}
              <option value="">None (Unassign)</option>

              {/* ✅ MUST BE value={kam._id} */}
              {kams.map((kam) => {
                const kamId = getKamId(kam);
                return (
                  <option key={kamId || `${kam.name}-${kam.email}`} value={kamId}>
                    {kam.name} — {kam.region}
                  </option>
                );
              })
              }
            </select>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-slate-50 border border-slate-100">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Selected KAM Preview
            </div>

            <div className="mt-2 text-sm font-semibold text-slate-800">
              {selectedKamId === "" ? (
                <span>Will be unassigned.</span>
              ) : selectedKam ? (
                <div className="space-y-1">
                  <div className="font-black text-slate-900">{selectedKam.name}</div>
                  <div className="text-xs text-slate-600">{selectedKam.email}</div>
                  <div className="text-xs text-slate-600">{selectedKam.phoneNumber}</div>
                  <div className="text-xs text-slate-600">Region: {selectedKam.region}</div>
                </div>
              ) : (
                <span className="text-red-600">Selected KAM not found in list.</span>
              )}
            </div>
          </div>

          {error ? (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">
              {error}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-black uppercase tracking-widest"
            disabled={assigning}
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={assigning || loading || (!token || !dealerId) || (selectedKamId !== "" && !selectedKam)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Assign KAM"
          >
            {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            Assign KAM
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // user object comes from state
  const userFromState = location?.state?.user || null;

  console.log(userFromState)

  // ✅ make it state so we can update assignedKam after assign
  const [userData, setUserData] = useState(userFromState);
  const [assignOpen, setAssignOpen] = useState(false);
  const [kams, setKams] = useState([]);
  const [kamsLoading, setKamsLoading] = useState(false);

  const safeUser = userData || null;

  const getKamId = (k) => String(k?._id || k?.id || "").trim();
  const assignedKamId = String(safeUser?.assignedKam || "").trim();

  const assignedKam = useMemo(() => {
    if (!assignedKamId) return null;
    return kams.find((k) => getKamId(k) === assignedKamId) || null;
  }, [kams, assignedKamId]);

  useEffect(() => {
    const loadKams = async () => {
      try {
        setKamsLoading(true);
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await axios.get(`${safeBase}/api/admin/kams/get-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = res.data?.data || res.data?.items || res.data || [];
        setKams(Array.isArray(list) ? list : []);
      } catch (e) {
        // ignore or show toast
      } finally {
        setKamsLoading(false);
      }
    };

    loadKams();
  }, []);

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

  const roleBadge = statusBadge(safeUser?.userRole);
  const RoleBadgeIcon = roleBadge.icon;

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
          <p className="text-slate-700 font-semibold">User details not available (page refreshed).</p>
          <p className="text-sm text-slate-500 mt-1">Please go back to the Users list and open the user again.</p>
        </div>
      </div>
    );
  }

  const isDealer = String(safeUser.userRole || "").toUpperCase() === "DEALER";

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
              {/* ✅ open modal */}
              <button
                onClick={() => setAssignOpen(true)}
                disabled={!isDealer}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white hover:opacity-90 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                title={!isDealer ? "Assign KAM is only for Dealer role" : "Assign KAM"}
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
                    <h1 className="text-xl md:text-2xl font-black text-slate-900">{safeUser.userName}</h1>

                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${badge.cls}`}>
                      <BadgeIcon className="w-4 h-4" />
                      {badge.label}
                    </span>

                    <span className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${roleBadge.cls}`}>
                      <RoleBadgeIcon className="w-4 h-4" />
                      {roleBadge.label}
                    </span>

                    {assignedKamId ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-white/70 border border-white/60 text-slate-700">
                        {assignedKam
                          ? `KAM: ${assignedKam.name} — ${assignedKam.region}`
                          : kamsLoading
                            ? "KAM: Loading..."
                            : "KAM: Unknown"}
                      </span>
                    ) : (
                      chip("No KAM Assigned")
                    )}

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

              <div className="md:ml-auto grid grid-cols-1 gap-3 w-full md:w-auto">
                <div className="bg-white border border-gray-100 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">ENTITY TYPE</div>
                  <div className="text-sm font-black text-slate-900">{safeUser.entityType || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* quick tiles */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2">
                <User2 className="w-4 h-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Contact</p>
              </div>
              <p className="mt-2 text-sm font-black text-slate-900">{safeUser.primaryContactPerson || "—"}</p>
              <p className="text-sm text-slate-600 font-semibold">{safeUser.primaryContactNumber || "—"}</p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secondary Contact</p>
              </div>
              <p className="mt-2 text-sm font-black text-slate-900">{safeUser.secondaryContactPerson || "—"}</p>
              <p className="text-sm text-slate-600 font-semibold">{safeUser.secondaryContactNumber || "—"}</p>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dealership</p>
              </div>
              <p className="mt-2 text-sm font-black text-slate-900">{safeUser.dealershipName || "—"}</p>
              <p className="text-xs text-slate-500 font-semibold">{isDealer ? "Dealer Account" : "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="pb-10">
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
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
                <DetailRow
                  label="Assigned KAM"
                  value={
                    !assignedKamId ? (
                      <span className="text-slate-400">No KAM Assigned</span>
                    ) : assignedKam ? (
                      <div className="inline-flex items-center gap-2">
                        <span className="px-2.5 py-1 text-[11px] font-black bg-slate-50 border border-slate-100 text-slate-700">
                          {assignedKam.name}
                        </span>
                        <span className="px-2.5 py-1 text-[11px] font-black bg-sky-50 border border-sky-100 text-sky-700">
                          {assignedKam.region}
                        </span>
                      </div>
                    ) : (
                      <span className="text-orange-600">KAM not found</span>
                    )
                  }
                />

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
                <DetailRow label="Image" value={safeUser.image || ""} />
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Address List</h3>

              <div className="mt-3">
                {Array.isArray(safeUser.addressList) && safeUser.addressList.length ? (
                  <ul className="space-y-2">
                    {safeUser.addressList.map((a, idx) => (
                      <li key={idx} className="p-3 bg-gray-50 border border-gray-100 text-sm font-semibold text-slate-700">
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

          <div className="space-y-4">
            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Permissions</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {Array.isArray(safeUser.permissions) && safeUser.permissions.length ? (
                  safeUser.permissions.map((p, i) => (
                    <span key={i} className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-100">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">No permissions</span>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Wishlist / My Bids</h3>

              <div className="mt-3 space-y-3">
                <div className="bg-gray-50 border border-gray-100 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wishlist</div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">
                    {Array.isArray(safeUser.wishlist) ? safeUser.wishlist.length : 0} items
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">My Bids</div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">
                    {Array.isArray(safeUser.myBids) ? safeUser.myBids.length : 0} items
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Meta</h3>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <DetailRow label="Created At" value={safeUser.createdAt || "—"} />
                <DetailRow label="Updated At" value={safeUser.updatedAt || "—"} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Assign Modal */}
      <AssignKamModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        dealerId={safeUser?._id || id}
        currentKamId={safeUser?.assignedKam || ""}
        onAssigned={(newKamId) => {
          setUserData((prev) => ({ ...(prev || {}), assignedKam: newKamId }));
        }}
      />
    </div>
  );
}
