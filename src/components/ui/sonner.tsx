"use client";

import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  Loader2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps, toast } from "sonner";

const Toaster = ({
  position = "bottom-right",
  richColors = false,
  closeButton = true,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      icons={{
        success: <CheckCircle2Icon className="size-4.5 text-emerald-600 dark:text-emerald-400" />,
        info: <InfoIcon className="size-4.5 text-sky-600 dark:text-sky-400" />,
        warning: <AlertTriangleIcon className="size-4.5 text-amber-600 dark:text-amber-400" />,
        error: <AlertCircleIcon className="size-4.5 text-rose-600 dark:text-rose-400" />,
        loading: <Loader2Icon className="size-4.5 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--card, #ffffff)",
          "--normal-text": "var(--card-foreground, #1f2937)",
          "--normal-border": "var(--border, #e5e7eb)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans !bg-white dark:!bg-[#172422] !text-[#1f2937] dark:!text-[#f3f4f6] !border !border-[#e5e7eb] dark:!border-[#273d39] !shadow-lg !rounded-xl !py-3.5 !px-4",
          title: "!text-sm !font-semibold !text-[#111827] dark:!text-white",
          description: "!text-xs !text-[#4b5563] dark:!text-[#9ca3af] !mt-0.5",
          actionButton:
            "!bg-[#0a4f42] !text-white !font-medium !text-xs !rounded-lg !px-3 !py-1.5",
          cancelButton:
            "!bg-[#eef1f5] !text-[#0a4f42] !font-medium !text-xs !rounded-lg !px-3 !py-1.5",
          closeButton:
            "!bg-white dark:!bg-[#172422] !border-[#e5e7eb] dark:!border-[#273d39] !text-[#6b7280] hover:!text-[#111827] dark:hover:!text-white !transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

