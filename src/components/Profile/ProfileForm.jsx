import React, { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

/** ✅ Move Field OUTSIDE so it doesn't remount on every keypress */
const Field = ({ label, value, onChange, disabled, type = "text" }) => (
  <div>
    <label className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">
      {label}
    </label>
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`mt-2 w-full rounded-xl border px-3 py-2.5 text-sm shadow-sm outline-none
        ${
          disabled
            ? "bg-slate-50 text-slate-500 border-slate-200"
            : "bg-white border-slate-200"
        }
      `}
    />
  </div>
);

export default function ProfileForm({
  user,
  isEditing,
  onSubmit, // async (payload) => void
  submitting,
  submitSignal, // number (increment to trigger submit from parent)
}) {
  const fileRef = useRef(null);

  const role = useMemo(() => {
    const r = user?.userRole || user?.userType || "";
    return String(r).toLowerCase().replaceAll("_", " ").trim();
  }, [user]);

  const [form, setForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    location: "",
    dealershipName: "",
    entityType: "",
    primaryContactPerson: "",
    primaryContactNumber: "",
    secondaryContactPerson: "",
    secondaryContactNumber: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  /**
   * ✅ Sync from user only when:
   * - user changes AND
   * - you're NOT editing (so typing doesn't get reset)
   */
  useEffect(() => {
    if (isEditing) return;

    setForm({
      userName: user?.userName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      dealershipName: user?.dealershipName || "",
      entityType: user?.entityType || "",
      primaryContactPerson: user?.primaryContactPerson || "",
      primaryContactNumber: user?.primaryContactNumber || "",
      secondaryContactPerson: user?.secondaryContactPerson || "",
      secondaryContactNumber: user?.secondaryContactNumber || "",
    });

    setImageFile(null);
    setImagePreview(user?.image || user?.imageUrl || "");
  }, [user, isEditing]);

  // parent-triggered submit (Save button in header)
  useEffect(() => {
    if (!submitSignal) return;
    if (!isEditing) return;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitSignal]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handlePickImage = () => {
    if (!isEditing) return;
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setImageFile(f);

    if (f) {
      const url = URL.createObjectURL(f);
      setImagePreview(url);
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    payload.append("userName", form.userName);
    payload.append("email", form.email);
    payload.append("phoneNumber", form.phoneNumber);
    payload.append("location", form.location);

    // dealer-only fields (backend switch-case)
    if (role === "dealer") {
      payload.append("dealershipName", form.dealershipName);
      payload.append("entityType", form.entityType);
      payload.append("primaryContactPerson", form.primaryContactPerson);
      payload.append("primaryContactNumber", form.primaryContactNumber);
      payload.append("secondaryContactPerson", form.secondaryContactPerson);
      payload.append("secondaryContactNumber", form.secondaryContactNumber);
    }

    if (imageFile) payload.append("image", imageFile);

    await onSubmit(payload);
  };

  return (
    <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Profile Details</h3>
        {submitting && (
          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </span>
        )}
      </div>

      {/* image uploader */}
      <div className="mt-4 flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>

        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handlePickImage}
            disabled={!isEditing}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border shadow-sm text-sm
              ${
                isEditing
                  ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  : "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            <Camera className="w-4 h-4" />
            Change Photo
          </button>
          <div className="text-xs text-slate-400 mt-1">PNG / JPG supported</div>
        </div>
      </div>

      {/* Note */}
      {!isEditing ? (
        <div className="mt-5 text-xs text-slate-400">
          Click <span className="font-semibold text-slate-600">Edit</span> to
          update your profile.
        </div>
      ) : (
        <div className="mt-5 text-xs text-slate-400">
          Use <span className="font-semibold text-slate-600">Save</span> on top
          to submit changes.
        </div>
      )}
    </div>
  );
}
