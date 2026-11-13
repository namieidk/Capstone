"use client";

import { AlertTriangle, Award, CheckCircle2, Clock, ExternalLink, FileText, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import type { GradeReport } from "@/lib/api/documents";
import { formatRetentionThreshold } from "@/lib/formatters";
import { buildGrantorAppealEmailLinks } from "@/lib/utils/grantor-email";

interface AcademicStandingCardProps {
  latestReport: GradeReport | null;
  reportsCount: number;
  hasPriorResolvedAppeal?: boolean;
  onOpenAppeal: () => void;
  loading?: boolean;
  gradeThreshold?: number;
}

export function AcademicStandingCard({
  latestReport,
  reportsCount,
  hasPriorResolvedAppeal = false,
  onOpenAppeal,
  loading = false,
  gradeThreshold = 90,
}: AcademicStandingCardProps) {
  const { user } = useAuth();
  if (loading) {
    return (
      <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
        <CardContent className="p-5 md:p-6 space-y-5 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
            <div className="space-y-2">
              <Skeleton className="h-4.5 w-64 rounded-md" />
              <Skeleton className="h-3 w-80 rounded-md" />
            </div>
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-line bg-[#fdfcfb] p-4 text-center space-y-2">
                <Skeleton className="h-3 w-24 mx-auto rounded-md" />
                <Skeleton className="h-7 w-16 mx-auto rounded-md" />
                <Skeleton className="h-3 w-32 mx-auto rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  const isFlagged = latestReport && (!latestReport.is_eligible || latestReport.status === "FLAGGED");
  const hasPendingAppeal = latestReport?.appeal_status === "PENDING_GRANTOR";
  const appealApproved = latestReport?.appeal_status === "APPROVED";
  const isProfileDiscontinued =
    latestReport?.scholar_profile?.academic_baseline_status === "DISCONTINUED" ||
    Boolean(latestReport?.scholar_profile?.archived_at);
  const appealDenied =
    latestReport?.appeal_status === "DENIED" ||
    isProfileDiscontinued ||
    Boolean(isFlagged && !appealApproved && !hasPendingAppeal && hasPriorResolvedAppeal);
  const isSecondChanceExhausted =
    latestReport?.scholar_profile?.archive_reason === "FAILED_SECOND_CHANCE" ||
    (appealDenied && hasPriorResolvedAppeal);

  const gwaValue = latestReport ? Number(latestReport.gpa).toFixed(2) : "—";
  const scholarProfile = user?.scholar_profile;
  const scholarName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Scholar";
  const studentNum = user?.scholar_profile?.student_number || latestReport?.scholar_profile?.student_number || "N/A";
  const schoolGrading =
    latestReport?.scholar_profile?.school_grading_system ??
    scholarProfile?.school_grading_system ??
    (scholarProfile?.school_name ? { school_name: scholarProfile.school_name } : null);
  const thresholdLabel = formatRetentionThreshold(gradeThreshold, schoolGrading);

  const { grantorEmail, coordinatorEmail, gmailUrl, mailtoUrl } = buildGrantorAppealEmailLinks({
    grantorEmail: latestReport?.grantor_email,
    coordinatorEmail: latestReport?.coordinator_email,
    scholarName,
    studentNumber: studentNum,
    courseOfStudy: latestReport?.scholar_profile?.course_of_study || scholarProfile?.course_of_study,
    academicYear: latestReport?.academic_year,
    semester: latestReport?.semester,
    gwa: latestReport?.gpa ?? gwaValue,
  });

  return (
    <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
      <CardContent className="p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h3 className="text-sm font-bold text-navy flex items-center gap-2">
              <Award className="size-4 text-[#0a4f42]" />
              Scholarship Academic Standing & Retention
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated end-of-term retention evaluation based on your university grading scale.
            </p>
          </div>

          <div>
            {appealDenied ? (
              <Badge className="bg-rose-100 text-rose-900 border-rose-300 text-xs font-semibold gap-1.5 py-1">
                <AlertTriangle className="size-3.5 text-rose-600" />
                {isSecondChanceExhausted ? "Scholarship Archived (2nd Chance Exhausted)" : "Scholarship Discontinued"}
              </Badge>
            ) : appealApproved ? (
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-semibold gap-1.5 py-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Probationary Clearance (Appeal Approved)
              </Badge>
            ) : hasPendingAppeal ? (
              <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-xs font-semibold gap-1.5 py-1">
                <Clock className="size-3.5 text-amber-600" />
                Second Chance Appeal Under Review
              </Badge>
            ) : isFlagged ? (
              <Badge className="bg-rose-50 text-rose-800 border-rose-300 text-xs font-semibold gap-1.5 py-1">
                <AlertTriangle className="size-3.5 text-rose-600" />
                Academic Standing Under Review
              </Badge>
            ) : (
              <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-semibold gap-1.5 py-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                Active • Good Academic Standing
              </Badge>
            )}
          </div>
        </div>

        {/* 3 Metric Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-line bg-[#fdfcfb] p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-[#8a8a84] block">Latest Term GWA</span>
            <span className="text-2xl font-black text-navy mt-1 block tabular-nums">{gwaValue}</span>
            <span className="text-[11px] text-muted-foreground block mt-0.5">
              {latestReport ? `${latestReport.academic_year} • ${latestReport.semester}` : "No grades submitted"}
            </span>
          </div>

          <div className="rounded-xl border border-line bg-[#fdfcfb] p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-[#8a8a84] block">Retention Threshold</span>
            <span className="text-2xl font-black text-[#0a4f42] mt-1 block tabular-nums">{thresholdLabel}</span>
            <span className="text-[11px] text-muted-foreground block mt-0.5">Minimum required term average</span>
          </div>

          <div className="rounded-xl border border-line bg-[#fdfcfb] p-4 text-center">
            <span className="text-[10px] uppercase font-bold text-[#8a8a84] block">Verified Terms</span>
            <span className="text-2xl font-black text-navy mt-1 block tabular-nums">
              {reportsCount} {reportsCount === 1 ? "Term" : "Terms"}
            </span>
            <span className="text-[11px] text-muted-foreground block mt-0.5">Recorded on your official transcript</span>
          </div>
        </div>

        {/* Appeal Denied / 2nd-Chance Exhausted Archived Banner */}
        {appealDenied ? (
          <div className="rounded-xl border border-rose-300 bg-rose-50/80 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-rose-950">
                  {isSecondChanceExhausted
                    ? "Scholarship Archived: Second Chance Probation Exhausted"
                    : "Second Chance Appeal Concluded: Scholarship Discontinued"}
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {isSecondChanceExhausted
                    ? `You have already used your 1-time in-app Second Chance Appeal, and your grades for ${latestReport?.academic_year || "this term"} (${latestReport?.semester || ""}) did not meet the retention threshold. Your scholar record has been moved to the Archive. You may still browse your records in read-only mode, or email the Grantor directly (CC Coordinator) to request special restoration.`
                    : `The Grantor has reviewed your second chance appeal for ${latestReport?.academic_year} ${latestReport?.semester} and concluded that the scholarship agreement cannot be renewed. If the Grantor restores your record from the Archive, your scholarship and next-term enrollment will automatically unlock.`}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-rose-900/80">
                  <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white/80 px-2 py-0.5 font-medium">
                    <strong className="text-rose-950">To:</strong> {grantorEmail}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white/80 px-2 py-0.5 font-medium">
                    <strong className="text-rose-950">CC:</strong> {coordinatorEmail}
                  </span>
                </div>
                {latestReport?.appeal_decision_notes && (
                  <div className="mt-2 rounded-lg border border-rose-200 bg-white/70 p-2.5 text-xs text-rose-900">
                    <span className="font-semibold text-rose-950">Review Notes: </span>
                    <em>&ldquo;{latestReport.appeal_decision_notes}&rdquo;</em>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2.5 border-t border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-[11px] text-muted-foreground">
                Your past term transcripts and records remain accessible in read-only mode.
              </span>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition-colors"
                >
                  <Mail className="size-3.5" />
                  <span>Email Grantor via Gmail (CC Coordinator)</span>
                  <ExternalLink className="size-3" />
                </a>
                <a
                  href={mailtoUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 bg-white text-rose-900 text-xs font-semibold hover:bg-rose-100/60 transition-colors"
                >
                  <Mail className="size-3.5" />
                  <span>Open Default Mail App</span>
                </a>
              </div>
            </div>
          </div>
        ) : isFlagged && !appealApproved ? (
          /* Non-compliance Alert & Appeal Trigger */
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                Academic Retention Discrepancy Detected
              </h4>
              <p className="text-xs text-rose-800">
                Your latest computed term GWA ({gwaValue}) is below the required threshold or contains an incomplete
                mark. You may submit a Second Chance Request directly to the Grantor for consideration.
              </p>
            </div>

            {!hasPendingAppeal ? (
              <Button
                type="button"
                onClick={onOpenAppeal}
                className="h-9 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 shrink-0 shadow-xs gap-1.5 self-start sm:self-auto"
              >
                <FileText className="size-3.5" />
                <span>Request Second Chance</span>
              </Button>
            ) : (
              <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-300 shrink-0">
                Appeal Submitted & Awaiting Grantor Verdict
              </span>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
