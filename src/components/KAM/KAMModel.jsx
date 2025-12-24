// src/pages/KAMManagement/components/KAMModal.jsx
import React, { useEffect, useState } from "react";
import { X, User, Mail, Phone, MapPin } from "lucide-react";

export default function KAMModal({
  open,
  mode = "create", // create | edit
  initialData,
  busy,
  onClose,
  onSubmit,
}) {
  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [region, setRegion] = useState(initialData?.region || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setMounted(true);
    setError("");

    setName(initialData?.name || "");
    setEmail(initialData?.email || "");
    setPhoneNumber(initialData?.phoneNumber || "");
    setRegion(initialData?.region || "");

    const raf = requestAnimationFrame(() => setAnimIn(true));
    return () => cancelAnimationFrame(raf);
  }, [open, initialData]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open && !mounted) return null;

  const title = mode === "edit" ? "Edit Key Account Manager" : "Add New Key Account Manager";
  const submitText = mode === "edit" ? "Update KAM" : "Add KAM";

  const close = () => {
    setAnimIn(false);
    setTimeout(() => {
      setMounted(false);
      onClose?.();
    }, 180);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      region: region.trim(),
    };

    if (!payload.name || !payload.email || !payload.phoneNumber || !payload.region) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      await onSubmit?.(payload);
      close();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    }
  };

  const inputWrap =
    "relative w-full border border-gray-200 bg-white rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all";
  const iconBox =
    "absolute left-3 top-1/2 -translate-y-1/2 text-sky-700 w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center border border-sky-100";
  const inputBase =
    "w-full pl-14 pr-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity duration-200 ${
          animIn ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transition-all duration-200 ${
          animIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-[0.98]"
        }`}
      >
        <div className="bg-sky-700 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={close} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-600">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <div className={inputWrap}>
                <div className={iconBox}>
                  <User className="w-4 h-4" />
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputBase}
                  placeholder="Enter full name"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <div className={inputWrap}>
                <div className={iconBox}>
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{`${(phoneNumber || "").length}/10`}</span>
            </div>

            <div className="mt-2">
              <div className={inputWrap}>
                <div className={iconBox}>
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  value={phoneNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
                    setPhoneNumber(v);
                  }}
                  inputMode="numeric"
                  className={inputBase}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">
              Region/Area <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <div className={inputWrap}>
                <div className={iconBox}>
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className={inputBase}
                  placeholder="Enter region"
                />
              </div>
            </div>
          </div>

          {error ? (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              {error}
            </div>
          ) : null}

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={close}
              className="flex-1 py-3 rounded-full border-2 border-red-400 text-red-500 font-semibold hover:bg-red-50 transition-colors"
              disabled={busy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-sky-700 text-white font-semibold hover:bg-sky-800 transition-colors disabled:opacity-60"
              disabled={busy}
            >
              {busy ? "Saving..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
