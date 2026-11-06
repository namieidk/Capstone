"use client";

import type React from "react";
import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  description?: string;
  duration?: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function showToast(message: string, type: ToastType = "success", options?: ToastOptions) {
  // If a drawer/sheet is open, automatically place toast on bottom-left to prevent covering drawer buttons
  const isDrawerActive =
    typeof document !== "undefined" &&
    Boolean(document.querySelector('[data-slot="sheet-content"]:not([data-sidebar="sidebar"])'));

  const finalOptions = {
    ...(isDrawerActive && !options?.position ? { position: "bottom-left" as const } : {}),
    ...options,
  };

  if (type === "error") {
    toast.error(message, finalOptions);
  } else if (type === "warning") {
    toast.warning(message, finalOptions);
  } else if (type === "info") {
    toast.info(message, finalOptions);
  } else {
    toast.success(message, finalOptions);
  }
}

export function useToast() {
  return {
    showToast,
    toast,
  };
}

export { toast };
