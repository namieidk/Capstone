"use client";

import { Award, ChevronRight, Eye, FileQuestion } from "lucide-react";
import { useMemo } from "react";
import type { ExtractedDataShape } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/types";
import type { Applicant } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScholarDocument } from "@/lib/api/documents";

interface ApplicantEligibilityBannerProps {
  applicant: Applicant;
  documents: ScholarDocument[] | null;
  onInspectDocument: (doc: ScholarDocument) => void;
  globalThreshold?: number;
}

export function ApplicantEligibilityBanner({
  applicant,
  documents,
  onInspectDocument,
  globalThreshold = 90,
}: ApplicantEligibilityBannerProps) {
  // Find primary academic document
  const primaryDoc = useMemo(() => {
    if (!documents || documents.length === 0) return null;
    const priorityTypes = ["TRANSCRIPT_OF_RECORDS", "FORM_138", "REPORT_CARD", "CERTIFICATE_OF_GRADES"];
    return (
      documents.find((d) => priorityTypes.includes(d.document_type)) ||
      documents.find((d) => d.status === "VERIFIED" || d.status === "STUDENT_CONFIRMED") ||
      documents[0]
    );
  }, [documents]);

  const extracted = (primaryDoc?.extracted_data ?? {}) as ExtractedDataShape;
  const confirmed = (primaryDoc?.confirmed_data ?? {}) as Record<string, unknown>;

  // Resolve raw average
  const rawAverage = useMemo(() => {
    if (confirmed?.general_average != null && confirmed.general_average !== "") {
      const n = Number(confirmed.general_average);
      if (!Number.isNaN(n) && n > 0) return n;
    }
    if (extracted?.general_average != null && extracted.general_average !== "") {
      const n = Number(extracted.general_average);
      if (!Number.isNaN(n) && n > 0) return n;
    }
    if (applicant.gwa != null && applicant.gwa > 0) {
      return applicant.gwa;
    }
    return null;
  }, [confirmed, extracted, applicant.gwa]);

  // Determine scale type
  const legend = extracted?.grading_legend;
  const scaleType = useMemo(() => {
    if (legend?.grading_scale) return legend.grading_scale;
    if (rawAverage != null) {
      if (rawAverage <= 4.0 && rawAverage >= 1.0) {
        if (rawAverage > 3.0 || legend?.highest_grade === 4) return "NUMERIC_4_POINT";
        return "NUMERIC_5_POINT";
      }
      if (rawAverage > 5.0) return "PERCENTAGE_100";
    }
    return "NUMERIC_4_POINT";
  }, [legend, rawAverage]);

  // Compute normalized percentage (0-100%)
  const normalizedPercent = useMemo(() => {
    if (rawAverage == null) return null;
    if (scaleType === "PERCENTAGE_100") {
      return Math.min(100, Math.max(0, rawAverage));
    }
    if (scaleType === "NUMERIC_5_POINT") {
      if (rawAverage <= 1.0) return 100;
      if (rawAverage <= 3.0) return 100 - ((rawAverage - 1.0) / 2.0) * 25;
      return Math.max(0, 75 - ((rawAverage - 3.0) / 2.0) * 25);
    }
    // NUMERIC_4_POINT
    if (rawAverage >= 4.0) return 100;
    if (rawAverage >= 2.0) return 75 + ((rawAverage - 2.0) / 2.0) * 25;
    return Math.max(0, 75 - ((2.0 - rawAverage) / 1.0) * 25);
  }, [rawAverage, scaleType]);

  const meetsThreshold = normalizedPercent != null && normalizedPercent >= globalThreshold;
  const isVerified = primaryDoc?.status === "VERIFIED";
  const isConfirmed = primaryDoc?.status === "STUDENT_CONFIRMED";

  const scaleLabel = useMemo(() => {
    if (scaleType === "PERCENTAGE_100") return "100% Scale";
    if (scaleType === "NUMERIC_5_POINT") return "5.00 Scale (1.00 Highest)";
    return "4.00 Scale (4.00 Highest)";
  }, [scaleType]);

  if (documents === null) {
    return (
      <div className="flex w-full flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-7 rounded-md" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-32 rounded" />
              <Skeleton className="h-2.5 w-44 rounded" />
            </div>
          </div>
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-white/70 px-3.5 py-2.5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-3.5 w-28 rounded" />
          </div>
          <Skeleton className="h-3.5 w-36 rounded" />
        </div>
      </div>
    );
  }

  if (!primaryDoc) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileQuestion className="size-4.5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Academic Eligibility & Document</p>
            <p className="text-xs text-muted-foreground">No academic documents uploaded by the applicant yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onInspectDocument(primaryDoc)}
      className="group relative flex w-full flex-col gap-3 rounded-xl border border-navy/20 bg-linear-to-br from-navy/5 via-white to-tint/30 p-4 text-left transition-all duration-150 hover:border-navy hover:shadow-md cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-navy/20"
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-navy text-white shadow-xs">
            <Award className="size-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy">Academic Eligibility</h4>
            <p className="text-[0.7rem] text-muted-foreground">
              {primaryDoc.document_type.replace(/_/g, " ")} · {scaleLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {normalizedPercent != null ? (
            <Badge
              variant={meetsThreshold ? "default" : "destructive"}
              className={
                meetsThreshold
                  ? "border border-emerald-500/30 bg-emerald-50 text-xs font-bold text-emerald-700 px-2.5 py-0.5 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "text-xs font-bold px-2.5 py-0.5"
              }
            >
              {meetsThreshold
                ? `Eligible (${normalizedPercent.toFixed(2)}% ≥ ${globalThreshold}%)`
                : `Below Threshold (${normalizedPercent.toFixed(2)}% < ${globalThreshold}%)`}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              Evaluation Pending
            </Badge>
          )}

          {isVerified && (
            <Badge variant="default" className="bg-navy text-white text-[0.7rem] px-2 py-0.5">
              Verified
            </Badge>
          )}
          {isConfirmed && (
            <Badge variant="secondary" className="text-[0.7rem] px-2 py-0.5">
              Awaiting Verification
            </Badge>
          )}
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-white/90 px-3.5 py-2.5 shadow-2xs backdrop-blur-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-xs">
          <div>
            <span className="text-muted-foreground">Reported Grade: </span>
            <span className="font-semibold text-foreground">
              {rawAverage != null ? (rawAverage > 5 ? `${rawAverage.toFixed(2)}%` : rawAverage.toFixed(2)) : "—"}
            </span>
          </div>

          {normalizedPercent != null && scaleType !== "PERCENTAGE_100" && (
            <div>
              <span className="text-muted-foreground">Normalized Score: </span>
              <span className="font-semibold text-navy">{normalizedPercent.toFixed(2)}%</span>
            </div>
          )}

          <div>
            <span className="text-muted-foreground">Retention Threshold: </span>
            <span className="font-semibold text-foreground">≥ {globalThreshold}.00%</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-navy group-hover:text-navy-light">
          <Eye className="size-3.5 transition-transform group-hover:scale-110" />
          <span>Inspect Document & Verify</span>
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
}
