// Login.jsx (only the changes)
import React, { useState } from "react";
import { loginAccount } from "../services/auth";
import logo from "/images/logo.webp";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastNotifications";

// ✅ add this
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ add this
  const [showPassword, setShowPassword] = useState(false);

  const setField = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userName || !form.phoneNumber || !form.password) {
      toast.warning("Missing fields", "Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userName: form.userName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
      };

      const res = await loginAccount(payload);

      localStorage.setItem("token", JSON.stringify(res?.token));
      localStorage.setItem("user", JSON.stringify(res?.user));

      toast.success("Logged in", "Welcome back!");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed";

      toast.error("Login failed", msg);
      console.error("LOGIN ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9fd] px-4">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-[22px] shadow-[0_20px_60px_rgba(17,24,39,0.08)] px-8 py-10">
          <div className="w-full flex justify-center">
            <img src={logo} alt="" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#ececf3]" />
            <span className="text-[12px] text-[#9aa0aa]">sign in</span>
            <div className="h-px flex-1 bg-[#ececf3]" />
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-[13px] font-semibold text-[#111827] mb-2">
              Username
            </label>
            <input
              value={form.userName}
              onChange={setField("userName")}
              placeholder="e.g. amitparekh007"
              className="w-full h-[46px] rounded-[12px] border border-[#e7e7ee] px-4 text-[#111827] placeholder:text-[#a3a7b0]
                         focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
            />

            <div className="mt-5 mb-2 flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#111827]">
                Password
              </label>
            </div>

            {/* ✅ replace password input with wrapper + icon */}
            <div className="relative">
              <input
                value={form.password}
                onChange={setField("password")}
                placeholder="amit123"
                type={showPassword ? "text" : "password"}
                className="w-full h-[46px] rounded-[12px] border border-[#e7e7ee] px-4 pr-12 text-[#111827] placeholder:text-[#a3a7b0]
                           focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <label className="block text-[13px] font-semibold text-[#111827] mt-5 mb-2">
              Phone Number
            </label>
            <input
              value={form.phoneNumber}
              onChange={setField("phoneNumber")}
              placeholder="e.g. 987654321"
              inputMode="tel"
              className="w-full h-[46px] rounded-[12px] border border-[#e7e7ee] px-4 text-[#111827] placeholder:text-[#a3a7b0]
                         focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full h-[52px] rounded-full font-semibold text-white
                         bg-black hover:bg-black/80 cursor-pointer
                         shadow-[0_14px_30px_rgba(2,6,23,0.28)]
                         hover:brightness-110 active:brightness-95 transition
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
