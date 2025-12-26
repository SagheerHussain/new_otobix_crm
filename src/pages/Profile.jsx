import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";

import { useHeader } from "../context/HeaderContext";
import ProfileView from "../components/Profile/ProfileView";
import ProfileForm from "../components/Profile/ProfileForm";
import { updateProfile } from "../services/users";

export default function Profile() {
  const navigate = useNavigate();
  const { setTitle, setSearchContent, setActionsContent } = useHeader();

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSignal, setSubmitSignal] = useState(0);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [liveUser, setLiveUser] = useState(user);

  // ✅ Your required header useEffect style
  useEffect(() => {
    setTitle(
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-3xl font-semibold text-slate-800">Profile</span>
      </div>
    );

    // ✅ remove header right-side buttons (red mark)
    setActionsContent(null);

    // ✅ no search on profile
    setSearchContent(null);

    return () => {
      setTitle("");
      setSearchContent(null);
      setActionsContent(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeForStorage = (apiUser, prev) => {
    const merged = { ...(prev || {}), ...(apiUser || {}) };

    // keep your frontend keys stable
    if (!merged.userType && merged.userRole) merged.userType = merged.userRole;
    if (!merged.userRole && merged.userType) merged.userRole = merged.userType;

    if (merged.image && !merged.imageUrl) merged.imageUrl = merged.image;
    if (merged.imageUrl && !merged.image) merged.image = merged.imageUrl;

    return merged;
  };

  const handleCancel = () => {
    try {
      const fresh = JSON.parse(localStorage.getItem("user") || "null");
      setLiveUser(fresh);
    } catch {}
    setIsEditing(false);
  };

  const handleSave = () => {
    setSubmitSignal((s) => s + 1);
  };

  const token = JSON.parse(localStorage.getItem("token"));

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await updateProfile(token, formData);

      if (res?.user) {
        const updated = normalizeForStorage(res.user, liveUser);
        localStorage.setItem("user", JSON.stringify(updated));
        setLiveUser(updated);
      }

      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#F5F6FA]">
      <div className="p-6">
        {/* Top user card (NO Back/Edit inside) */}
        <ProfileView user={liveUser} />

        {/* Form */}
        <ProfileForm
          user={liveUser}
          isEditing={isEditing}
          submitting={submitting}
          submitSignal={submitSignal}
          onSubmit={handleSubmit}
        />

        {/* ✅ Green area buttons (bottom-left) */}
        <div className="mt-4 flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 shadow-sm"
            >
              <Pencil className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
          ) : (
            <>
              <button
                disabled={submitting}
                onClick={handleSave}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-white
                  ${submitting ? "bg-primary/60 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}
                `}
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {submitting ? "Saving..." : "Save"}
                </span>
              </button>

              <button
                disabled={submitting}
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}