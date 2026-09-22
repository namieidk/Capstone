"use client";

import { Award, CheckCircle2, Info, School, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatRetentionThreshold } from "@/lib/formatters";

interface GradeGradingSystemLegendProps {
  schoolName?: string | null;
  gradeThreshold?: number;
  schoolGrading?: {
    school_name?: string;
    grading_scale?: string;
    passing_grade?: number;
    highest_grade?: number;
    failing_grade?: number;
  } | null;
}

export function GradeGradingSystemLegend({
  schoolName,
  schoolGrading,
  gradeThreshold = 90,
}: GradeGradingSystemLegendProps) {
  const passing = schoolGrading?.passing_grade != null ? Number(schoolGrading.passing_grade) : 3.0;
  const highest = schoolGrading?.highest_grade != null ? Number(schoolGrading.highest_grade) : 1.0;
  const failing = schoolGrading?.failing_grade != null ? Number(schoolGrading.failing_grade) : 5.0;

  const isPercentage = schoolGrading?.grading_scale === "PERCENTAGE_100" || (highest > 10 && highest >= 100);
  const isFourPoint = schoolGrading?.grading_scale === "NUMERIC_4_POINT" || (highest === 4.0 && passing === 2.0);

  const scaleTitle = isPercentage
    ? "Percentage Scale (100% Max)"
    : isFourPoint
      ? "4.0-Point Scale (4.00 Max)"
      : "5.0-Point Decimal Scale (1.00 Max)";

  const institution = schoolGrading?.school_name || schoolName || "Standard Academic Scale";
  const retentionLabel = formatRetentionThreshold(gradeThreshold, schoolGrading);
  const isAscending = isPercentage || isFourPoint || highest > failing;

  return (
    <div className="rounded-xl border border-teal-200/80 bg-linear-to-r from-teal-50/70 via-emerald-50/40 to-slate-50/70 p-3 text-xs space-y-2 shrink-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-bold text-[#0a4f42]">
          <School className="size-3.5 text-[#0a4f42] shrink-0" />
          <span className="truncate max-w-65 sm:max-w-md">{institution}</span>
        </div>
        <Badge
          variant="outline"
          className="bg-white/90 text-[#0a4f42] border-[#0a4f42]/20 text-[10px] font-semibold shrink-0"
        >
          {scaleTitle}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 bg-white/80 rounded-lg p-1.5 border border-slate-200/60 shadow-2xs">
          <Award className="size-3.5 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-500 block leading-tight">Highest</span>
            <span className="text-xs font-black text-slate-800 tabular-nums">
              {highest.toFixed(isPercentage ? 0 : 2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/80 rounded-lg p-1.5 border border-slate-200/60 shadow-2xs">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-500 block leading-tight">Passing Cutoff</span>
            <span className="text-xs font-black text-emerald-700 tabular-nums">
              {isPercentage
                ? `≥ ${passing.toFixed(0)}%`
                : isFourPoint
                  ? `≥ ${passing.toFixed(2)}`
                  : `≤ ${passing.toFixed(2)}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/80 rounded-lg p-1.5 border border-slate-200/60 shadow-2xs">
          <XCircle className="size-3.5 text-rose-500 shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-500 block leading-tight">Failing Mark</span>
            <span className="text-xs font-black text-rose-700 tabular-nums">
              {failing.toFixed(isPercentage ? 0 : 2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/80 rounded-lg p-1.5 border border-slate-200/60 shadow-2xs">
          <Info className="size-3.5 text-teal-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[9px] uppercase font-bold text-slate-500 block leading-tight">
              Retention Standard
            </span>
            <span className="text-xs font-black text-teal-800 tabular-nums">
              {isAscending ? `GWA ≥ ${retentionLabel}` : `GWA ≤ ${retentionLabel}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
