"use client";

import type React from "react";
import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function showToast(message: string, type: ToastType = "success") {
  if (type === "error") {
    toast.error(message);
  } else if (type === "warning") {
    toast.warning(message);
  } else if (type === "info") {
    toast.info(message);
  } else {
    toast.success(message);
  }
}

export function useToast() {
  return {
    showToast,
    toast,
  };
}

export { toast };
