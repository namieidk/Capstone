"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_BG: Record<ToastType, string> = {
  success: "#0a4f42",
  error: "#8a3a2e",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => dismiss(id), 3200);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted &&
        createPortal(
          <div style={toastContainerStyle}>
            {toasts.map((toast) => (
              <div
                key={toast.id}
                role="status"
                style={{
                  ...toastStyle,
                  background: TOAST_BG[toast.type],
                }}
              >
                <span style={toastMessageStyle}>{toast.message}</span>
                <button type="button" onClick={() => dismiss(toast.id)} style={toastCloseStyle} aria-label="Dismiss">
                  &times;
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const toastContainerStyle: React.CSSProperties = {
  position: "fixed",
  top: 20,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "center",
  width: "100%",
  maxWidth: 420,
  pointerEvents: "none",
  zIndex: 500,
};

const toastStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  pointerEvents: "auto",
  color: "#FFFFFF",
  borderRadius: 12,
  padding: "13px 16px",
  fontSize: "0.9rem",
  fontWeight: 600,
  lineHeight: 1.4,
  boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  maxWidth: "calc(100vw - 32px)",
};

const toastMessageStyle: React.CSSProperties = {
  flexGrow: 1,
};

const toastCloseStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.8)",
  fontSize: "1.3rem",
  lineHeight: 1,
  cursor: "pointer",
  padding: 0,
  flexShrink: 0,
};
