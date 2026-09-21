"use client";

import { Award, BookCheck, CreditCard, FileSpreadsheet, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  ScholarAcademicStanding,
  ScholarCurriculumData,
  ScholarDisbursementsData,
  ScholarEnrollmentData,
} from "@/lib/api/scholar-dashboard";

interface ScholarKpiCardsProps {
  standing: ScholarAcademicStanding;
  curriculum: ScholarCurriculumData;
  latestEnrollment: ScholarEnrollmentData | null;
  disbursements: ScholarDisbursementsData;
}

export function ScholarKpiCards({ standing, curriculum, latestEnrollment, disbursements }: ScholarKpiCardsProps) {
  const gwa = standing.gwa || 0;
  const threshold = standing.threshold || 90;
  const isSatisfied = gwa >= threshold;

  // Enrollment formatted text
  const enrollmentStatus = latestEnrollment?.status || "NOT_SUBMITTED";
  const enrollmentUnits = latestEnrollment ? `${latestEnrollment.total_units} Units` : "No active term";

  // Disbursement formatted text
  const latestDisb = disbursements.latest;
  const disbAmount = latestDisb ? `₱${latestDisb.amount.toLocaleString()}` : "₱0.00";
  const disbStatus = latestDisb?.status || "NONE";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Current / Cumulative GWA */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Grade Average (GWA)
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
              <Award className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">
              {gwa > 0 ? gwa.toFixed(2) : "—"}
            </span>
            <span className="text-xs text-muted-foreground">/ Req: {threshold.toFixed(2)}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge
              className={`h-5.5 rounded-full px-2 text-[10px] font-bold ${
                isSatisfied
                  ? "border-[#0a4f42]/30 bg-[#ddeee3] text-[#0a4f42]"
                  : "border-[#f1b71e]/40 bg-[#fceec4] text-[#8a6410]"
              }`}
            >
              {isSatisfied ? "Target Met" : "Below Baseline"}
            </Badge>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <TrendingUp className="size-3 text-[#0a4f42]" /> Evaluated
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Curriculum Units Progress */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Prospectus Progress
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#f1b71e]/15 text-[#8a6410]">
              <BookCheck className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">
              {curriculum.passed_units}
            </span>
            <span className="text-xs text-muted-foreground">
              / {curriculum.total_units > 0 ? curriculum.total_units : "—"} Total Units
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#0a4f42] to-[#f1b71e] transition-all duration-500"
                style={{ width: `${curriculum.percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{curriculum.passed_subjects_count} Subjects Cleared</span>
              <span className="font-bold text-[#0a4f42]">{curriculum.percentage}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Current Term Enrollment */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Term Enrollment
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <FileSpreadsheet className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">{enrollmentUnits}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge
              className={`h-5.5 rounded-full px-2 text-[10px] font-bold ${
                enrollmentStatus === "APPROVED"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : enrollmentStatus === "PENDING_REVIEW"
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-muted-foreground/20 bg-muted/60 text-muted-foreground"
              }`}
            >
              {enrollmentStatus.replace(/_/g, " ")}
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground">
              {latestEnrollment ? `${latestEnrollment.academic_year} ${latestEnrollment.semester}` : "Pending Term"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Active Disbursement / Stipend */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Grant & Stipend
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
              <CreditCard className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">{disbAmount}</span>
            <span className="text-xs text-muted-foreground">Current Allocation</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge
              className={`h-5.5 rounded-full px-2 text-[10px] font-bold ${
                disbStatus === "SETTLED" || disbStatus === "CLAIMED"
                  ? "border-[#0a4f42]/30 bg-[#ddeee3] text-[#0a4f42]"
                  : disbStatus === "RELEASED" || disbStatus === "AUTHORIZED"
                    ? "border-[#f1b71e]/40 bg-[#fceec4] text-[#8a6410]"
                    : "border-muted-foreground/20 bg-muted/60 text-muted-foreground"
              }`}
            >
              {disbStatus.replace(/_/g, " ")}
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground">
              {disbursements.pending_or_count > 0 ? (
                <span className="font-semibold text-amber-700">OR Required</span>
              ) : (
                "Verified"
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
