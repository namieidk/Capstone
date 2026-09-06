"use client";

import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentSummaryFormProps {
  academicYear: string;
  generalAverage: string;
  isReadOnly: boolean;
  onAcademicYearChange: (val: string) => void;
  onGeneralAverageChange: (val: string) => void;
  onComputeAverage: () => void;
}

export function DocumentSummaryForm({
  academicYear,
  generalAverage,
  isReadOnly,
  onAcademicYearChange,
  onGeneralAverageChange,
  onComputeAverage,
}: DocumentSummaryFormProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5 shadow-xs sm:p-4">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-sm font-bold text-navy">Document Summary</h4>
        {!isReadOnly && (
          <span className="text-[0.7rem] text-muted-foreground sm:text-xs">
            Verify and update any OCR discrepancies before confirming.
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="academic-year" className="text-xs! font-semibold text-navy">
            Academic Year <span className="text-amber">*</span>
          </Label>
          <Input
            id="academic-year"
            value={academicYear}
            disabled={isReadOnly}
            onChange={(e) => onAcademicYearChange(e.target.value)}
            placeholder="e.g. 2025-2026"
            className="mt-1.5 h-10! bg-white! text-xs! sm:text-xs!"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="general-average" className="text-xs! font-semibold text-navy">
              General Average / GWA <span className="text-amber">*</span>
            </Label>
            {!isReadOnly && (
              <button
                type="button"
                onClick={onComputeAverage}
                className="flex items-center gap-1 text-[0.7rem] font-semibold text-navy hover:text-amber"
                title="Calculate average from subjects below"
              >
                <Calculator className="size-3" />
                Auto-calculate
              </button>
            )}
          </div>
          <Input
            id="general-average"
            type="number"
            step="0.01"
            min="50"
            max="100"
            value={generalAverage}
            disabled={isReadOnly}
            onChange={(e) => onGeneralAverageChange(e.target.value)}
            placeholder="e.g. 92.00"
            className="mt-1.5 h-10! bg-white! text-xs! sm:text-xs!"
          />
        </div>
      </div>
    </div>
  );
}
