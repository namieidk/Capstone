"use client";

import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, Clock, ExternalLink, Mail, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScholarAcademicStanding, ScholarProfileData } from "@/lib/api/scholar-dashboard";
import { buildGrantorAppealEmailLinks } from "@/lib/utils/grantor-email";

interface ScholarAcademicStandingBannerProps {
  standing: ScholarAcademicStanding;
  profile?: ScholarProfileData;
}

export function ScholarAcademicStandingBanner({ standing, profile }: ScholarAcademicStandingBannerProps) {
  const { standing_type, gwa, threshold, latest_report } = standing;

  if (standing_type === "DISCONTINUED") {
    const scholarName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Scholar" : "Scholar";
    const { grantorEmail, coordinatorEmail, gmailUrl, mailtoUrl } = buildGrantorAppealEmailLinks({
      grantorEmail: standing.grantor_email,
      coordinatorEmail: standing.coordinator_email,
      scholarName,
      studentNumber: profile?.student_number,
      courseOfStudy: profile?.course_of_study,
      academicYear: latest_report?.academic_year,
      semester: latest_report?.semester,
      gwa: latest_report?.gpa ?? gwa,
    });
    const isSecondChanceExhausted =
      standing.second_chance_exhausted || profile?.archive_reason === "FAILED_SECOND_CHANCE";

    return (
      <div className="relative overflow-hidden rounded-2xl border border-rose-300 bg-rose-50/80 p-4 sm:p-5 text-rose-950 shadow-2xs">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="size-5" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-rose-950">
                  Academic Retention Deficiency — Direct Grantor Review Required
                </span>
                <Badge className="h-5 rounded-full border-rose-300 bg-rose-100 px-2 text-[10px] font-bold text-rose-800">
                  {isSecondChanceExhausted
                    ? "Scholarship Archived • 2nd Chance Exhausted"
                    : "Scholarship Archived"}
                </Badge>
              </div>
              <p className="text-xs text-rose-900/90 leading-relaxed">
                {isSecondChanceExhausted
                  ? `You have already used your 1-time in-app Second Chance Appeal, and your ${latest_report?.academic_year || "latest term"}${latest_report?.semester ? ` (${latest_report.semester})` : ""} evaluation (GWA: ${(latest_report?.gpa ?? gwa).toFixed(2)}) fell below the retention threshold (${threshold.toFixed(2)}). Your scholarship has been moved to the Archive. You still have read-only access to browse your records, and if you wish to request special restoration, please email the Grantor directly with the Coordinator CC'd.`
                  : `Your scholarship agreement has been archived following the ${latest_report?.academic_year || "latest term"}${latest_report?.semester ? ` (${latest_report.semester})` : ""} evaluation. You retain read-only access to your academic and financial records, and may email the Grantor directly with the Coordinator CC'd if you wish to request reconsideration.`}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-rose-900/80">
                <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white/80 px-2 py-0.5 font-medium">
                  <strong className="text-rose-950">To:</strong> {grantorEmail}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white/80 px-2 py-0.5 font-medium">
                  <strong className="text-rose-950">CC:</strong> {coordinatorEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-rose-200/70">
            <Button
              asChild
              size="sm"
              className="h-9 rounded-full bg-rose-700 px-4 text-xs font-semibold text-white! hover:bg-rose-800 shadow-xs"
            >
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffffff" }}
                className="inline-flex items-center gap-1.5 text-white!"
              >
                <Mail className="size-3.5 text-white" />
                <span>Email Grantor via Gmail (CC Coordinator)</span>
                <ExternalLink className="size-3 text-white" />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-rose-300 bg-white px-3.5 text-xs font-semibold text-rose-900 hover:bg-rose-100/60"
            >
              <a href={mailtoUrl} className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                <span>Open Default Mail App</span>
              </a>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-9 rounded-full px-3 text-xs font-semibold text-rose-900 hover:bg-rose-100/60"
            >
              <Link href="/ScholarGrade" className="inline-flex items-center gap-1">
                <span>View Grade Audit</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
