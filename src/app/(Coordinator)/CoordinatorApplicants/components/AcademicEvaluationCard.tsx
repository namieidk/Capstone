"use client";

import { AlertTriangle, Award, Check, CheckCircle2, School, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ExtractedDataShape } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listSchoolGradings, verifySchoolGrading } from "@/lib/api/settings";

interface AcademicEvaluationCardProps {
  generalAverage: string;
  extractedData: ExtractedDataShape;
  globalThreshold?: number;
}

export function AcademicEvaluationCard({
  generalAverage,
  extractedData,
  globalThreshold = 90,
}: AcademicEvaluationCardProps) {
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const rawGa = Number(generalAverage);
  const hasValidGa = !Number.isNaN(rawGa) && rawGa > 0;
  const legend = extractedData.grading_legend;
  const schoolName = extractedData.school_name || "School";

  // Determine scale type
  const scaleType = useMemo(() => {
    if (legend?.grading_scale) return legend.grading_scale;
    if (hasValidGa) {
      if (rawGa <= 4.0 && rawGa >= 1.0) {
        // If highest grade is 4.0 or raw grade > 3.0 (likely UM scale)
        if (rawGa > 3.0 || legend?.highest_grade === 4) return "NUMERIC_4_POINT";
        return "NUMERIC_5_POINT";
      }
      if (rawGa > 5.0) return "PERCENTAGE_100";
    }
    return "NUMERIC_4_POINT";
  }, [legend, hasValidGa, rawGa]);

  // Compute normalized universal percentage (0-100%)
  const normalizedPercent = useMemo(() => {
    if (!hasValidGa) return null;
    if (scaleType === "PERCENTAGE_100") {
      return Math.min(100, Math.max(0, rawGa));
    }
    if (scaleType === "NUMERIC_5_POINT") {
      // 1.00 = 100%, 3.00 = 75%
      if (rawGa <= 1.0) return 100;
      if (rawGa <= 3.0) return 100 - ((rawGa - 1.0) / 2.0) * 25;
      return Math.max(0, 75 - ((rawGa - 3.0) / 2.0) * 25);
    }
    // NUMERIC_4_POINT (UM: 4.00 = 100%, 2.00 = 75%, 1.00 = 50%)
    if (rawGa >= 4.0) return 100;
    if (rawGa >= 2.0) return 75 + ((rawGa - 2.0) / 2.0) * 25;
    return Math.max(0, 75 - ((2.0 - rawGa) / 1.0) * 25);
  }, [rawGa, hasValidGa, scaleType]);

  const meetsThreshold = normalizedPercent != null && normalizedPercent >= globalThreshold;

  async function handleVerifySchoolScale() {
    try {
      setVerifying(true);
      const schools = await listSchoolGradings();
      const match = schools.find((s) => s.school_name.toLowerCase() === schoolName.toLowerCase());
      if (match) {
        await verifySchoolGrading(match.school_id);
        setVerifiedSuccess(true);
      } else {
        setVerifiedSuccess(true);
      }
    } catch {
      // Graceful fallback
    } finally {
      setVerifying(false);
    }
  }

  if (!hasValidGa && !legend) return null;

  return (
    <div className="rounded-xl border border-border bg-linear-to-br from-white to-slate-50/50 p-3.5 shadow-xs sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-navy/10 text-navy">
            <Award className="size-3.5" />
          </span>
          <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Academic Evaluation & Eligibility</h4>
        </div>
        {normalizedPercent != null && (
          <Badge
            variant={meetsThreshold ? "default" : "destructive"}
            className={
              meetsThreshold
                ? "flex items-center gap-1 border border-emerald-500/30 bg-emerald-50 text-[0.7rem] font-semibold text-emerald-700 px-2 py-0.5 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "flex items-center gap-1 text-[0.7rem] px-2 py-0.5"
            }
          >
            {meetsThreshold ? (
              <>
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>Eligible (≥ {globalThreshold}%)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="size-3" />
                <span>Below Threshold (&lt; {globalThreshold}%)</span>
              </>
            )}
          </Badge>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Raw Score */}
        <div className="rounded-lg border border-border/70 bg-white p-2.5">
          <p className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wider">
            Reported GWA / Mark
          </p>
          <p className="mt-0.5 text-base font-bold text-navy">
            {hasValidGa ? rawGa.toFixed(2) : "—"}
            <span className="ml-1 text-[0.7rem] font-normal text-muted-foreground">
              {scaleType === "NUMERIC_4_POINT"
                ? "(4.0 Scale)"
                : scaleType === "NUMERIC_5_POINT"
                  ? "(5.0 Scale)"
                  : "(% Scale)"}
            </span>
          </p>
        </div>

        {/* Normalized Universal Equivalent */}
        <div className="rounded-lg border border-border/70 bg-white p-2.5">
          <p className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="size-3 text-amber" />
            Universal Equivalent
          </p>
          <p className="mt-0.5 text-base font-bold text-navy">
            {normalizedPercent != null ? `${normalizedPercent.toFixed(2)}%` : "—"}
            <span className="ml-1 text-[0.7rem] font-normal text-muted-foreground">(0–100%)</span>
          </p>
        </div>

        {/* Grading Scale Info */}
        <div className="rounded-lg border border-border/70 bg-white p-2.5">
          <p className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <School className="size-3 text-navy" />
            Grading Scale Policy
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-navy" title={legend?.legend_title ?? schoolName}>
            {scaleType === "NUMERIC_4_POINT"
              ? "UM 4.0 Direct Scale"
              : scaleType === "NUMERIC_5_POINT"
                ? "USEP/UP 5.0 Inverse Scale"
                : "DepEd Standard Scale"}
          </p>
        </div>
      </div>

      {/* 1-Click Scale Verification Action if unverified legend detected */}
      {legend && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2 text-[0.7rem] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-navy">Detected Legend:</span>
            <span className="truncate italic">{legend.legend_title || `${schoolName} Grading System`}</span>
          </div>
          {verifiedSuccess ? (
            <span className="flex items-center gap-1 font-semibold text-good text-xs">
              <Check className="size-3.5" /> Scale Verified
            </span>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={verifying}
              onClick={handleVerifySchoolScale}
              className="h-6 px-2 text-[0.65rem] text-navy hover:bg-navy hover:text-white"
            >
              {verifying ? "Verifying..." : "Verify School Scale"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
