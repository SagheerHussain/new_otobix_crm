// src/components/Toast.jsx
import React, { createContext, useContext, useCallback, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, title, message, opts = {}) => {
      const id = crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
      const duration = opts.duration ?? 3500;

      const toast = { id, type, title, message, duration };
      setToasts((prev) => [toast, ...prev]);

      if (duration !== Infinity) {
        window.setTimeout(() => remove(id), duration);
      }
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      success: (title, message, opts) => push("success", title, message, opts),
      warning: (title, message, opts) => push("warning", title, message, opts), // ✅ yellow (instead of blue)
      error: (title, message, opts) => push("error", title, message, opts),
      info: (title, message, opts) => push("info", title, message, opts),
      remove,
    }),
    [push, remove]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider />");
  return ctx;
}

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onClose={() => onClose(t.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onClose }) {
  const styles = getToastStyles(toast.type);

  return (
    <div
      className={[
        "w-[380px] max-w-[92vw]",
        "rounded-[12px] border shadow-[0_10px_30px_rgba(2,6,23,0.08)]",
        "px-4 py-3",
        "flex items-start gap-3",
        "backdrop-blur bg-white",
        styles.bg,
        styles.border,
      ].join(" ")}
    >
      <div
        className={[
          "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full",
          styles.iconBg,
        ].join(" ")}
      >
        {styles.icon}
      </div>

      <div className="flex-1">
        <p className="text-[13px] font-semibold text-[#0f172a] leading-5">
          {toast.title}
        </p>
        {toast.message ? (
          <p className="text-[12px] text-[#6b7280] leading-5 mt-0.5">
            {toast.message}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="ml-2 mt-0.5 text-[#94a3b8] hover:text-[#0f172a] transition"
        aria-label="Close toast"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

function getToastStyles(type) {
  // Design like your screenshot:
  // ✅ success = green
  // ✅ warning = yellow (instead of blue)
  // ✅ error = red
  // info kept if you ever need it
  switch (type) {
    case "success":
      return {
        bg: "bg-emerald-50/70",
        border: "border-emerald-100",
        iconBg: "bg-emerald-100",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      };
    case "warning":
      return {
        bg: "bg-yellow-50/70",
        border: "border-yellow-100",
        iconBg: "bg-yellow-100",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.3 4.3l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-2.7l-8-14a2 2 0 0 0-3.4 0z"
              stroke="#f59e0b"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      };
    case "error":
      return {
        bg: "bg-rose-50/70",
        border: "border-rose-100",
        iconBg: "bg-rose-100",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v5m0 3h.01M10.3 4.3l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-2.7l-8-14a2 2 0 0 0-3.4 0z"
              stroke="#ef4444"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      };
    default: // info
      return {
        bg: "bg-sky-50/70",
        border: "border-sky-100",
        iconBg: "bg-sky-100",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 17v-6m0-3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              stroke="#0284c7"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      };
  }
}
