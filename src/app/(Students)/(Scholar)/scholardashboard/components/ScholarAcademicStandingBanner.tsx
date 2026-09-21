"use client";

import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScholarAcademicStanding } from "@/lib/api/scholar-dashboard";

interface ScholarAcademicStandingBannerProps {
  standing: ScholarAcademicStanding;
}

export function ScholarAcademicStandingBanner({ standing }: ScholarAcademicStandingBannerProps) {
  const { standing_type, gwa, threshold, latest_report } = standing;

  if (standing_type === "PROBATION") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#f1b71e]/40 bg-[#fceec4]/40 p-4 sm:p-5 text-[#8a6410]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1b71e]/25 text-[#8a6410]">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#705009]">Academic Status: 1-Semester Probation</span>
                <Badge className="h-5 rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-2 text-[10px] font-bold text-[#8a6410]">
                  Conditional Retention
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[#8a6410]/90 leading-relaxed max-w-2xl">
                Your second chance appeal has been granted. You are currently under a 1-semester academic probation
                period. Ensure you meet the retention grade threshold of{" "}
                <strong className="font-bold">{threshold.toFixed(2)}</strong> for the upcoming term.
              </p>
              {latest_report?.appeal_decision_notes && (
                <p className="mt-1.5 text-[11px] italic text-[#8a6410]/80">
                  Grantor Remarks: &ldquo;{latest_report.appeal_decision_notes}&rdquo;
                </p>
              )}
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="h-8.5 shrink-0 rounded-full bg-[#8a6410] px-4 text-xs font-semibold text-white hover:bg-[#705009] shadow-xs"
          >
            <Link href="/ScholarGrade" className="flex items-center gap-1.5">
              <span>View Grade Records</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (standing_type === "ACTION_REQUIRED") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-rose-300 bg-rose-50/70 p-4 sm:p-5 text-rose-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-rose-900">Action Required: Academic Evaluation Flagged</span>
                <Badge className="h-5 rounded-full border-rose-300 bg-rose-100 px-2 text-[10px] font-bold text-rose-800">
                  Appeal Available
                </Badge>
              </div>
              <p className="mt-1 text-xs text-rose-800/90 leading-relaxed max-w-2xl">
                Your submitted grade evaluation ({latest_report?.academic_year || "Latest Term"}{" "}
                {latest_report?.semester || ""}) did not satisfy the minimum scholarship grade threshold (
                {threshold.toFixed(2)}). You may file a Second Chance Appeal for grantor consideration.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="h-8.5 shrink-0 rounded-full bg-rose-700 px-4 text-xs font-semibold text-white hover:bg-rose-800 shadow-xs"
          >
            <Link href="/ScholarGrade" className="flex items-center gap-1.5">
              <span>File Second Chance Appeal</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (standing_type === "PENDING_REVIEW") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-amber-300 bg-amber-50/70 p-4 sm:p-5 text-amber-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Clock className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-amber-900">Second Chance Appeal Under Review</span>
                <Badge className="h-5 rounded-full border-amber-300 bg-amber-100 px-2 text-[10px] font-bold text-amber-800">
                  Pending Grantor Decision
                </Badge>
              </div>
              <p className="mt-1 text-xs text-amber-800/90 leading-relaxed max-w-2xl">
                Your second chance appeal has been submitted and is currently being deliberated by the scholarship
                grantor committee. You will be notified immediately upon decision.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 shrink-0 rounded-full border-amber-400 bg-white px-4 text-xs font-semibold text-amber-900 hover:bg-amber-100/50 shadow-xs"
          >
            <Link href="/ScholarGrade" className="flex items-center gap-1.5">
              <span>Track Appeal Verdict</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // GOOD_STANDING
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#0a4f42]/20 bg-[#ddeee3]/40 p-4 sm:p-5 text-[#0a4f42]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0a4f42]/15 text-[#0a4f42]">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#0a4f42]">Academic Standing: Good Standing</span>
              <Badge className="h-5 rounded-full border-[#0a4f42]/30 bg-[#ddeee3] px-2 text-[10px] font-bold text-[#0a4f42]">
                Cleared
              </Badge>
            </div>
            <p className="mt-1 text-xs text-[#0a4f42]/90 leading-relaxed max-w-2xl">
              All scholarship retention requirements are fulfilled. Your cumulative grade average of{" "}
              <strong className="font-bold">{gwa.toFixed(2)}</strong> meets the required baseline (
              {threshold.toFixed(2)}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-medium text-[#0a4f42]/80">Retention Status: Active</span>
          <ShieldCheck className="size-4 text-[#0a4f42]" />
        </div>
      </div>
    </div>
  );
}
