"use client";

import { FileSpreadsheet, Layers } from "lucide-react";

interface EnrollmentModeToggleProps {
  isConsolidated: boolean;
  onChange: (consolidated: boolean) => void;
  disabled?: boolean;
}

export function EnrollmentModeToggle({ isConsolidated, onChange, disabled }: EnrollmentModeToggleProps) {
  return (
    <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 inline-flex w-full sm:w-auto">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(false)}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          !isConsolidated
            ? "bg-white text-[#0a4f42] shadow-xs border border-slate-200/60"
            : "text-slate-600 hover:text-slate-900"
        } disabled:opacity-50`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Dual Documents (COR + SOA)</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(true)}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          isConsolidated
            ? "bg-white text-[#0a4f42] shadow-xs border border-slate-200/60"
            : "text-slate-600 hover:text-slate-900"
        } disabled:opacity-50`}
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        <span>Single Consolidated Form (e.g., UM Matriculation)</span>
      </button>
    </div>
  );
}
