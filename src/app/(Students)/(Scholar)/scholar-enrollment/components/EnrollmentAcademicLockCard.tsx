"use client";

import { AlertTriangle, ArrowRight, Clock, ExternalLink, FileText, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AcademicStandingLock } from "@/lib/api/enrollment";
import { buildGrantorAppealEmailLinks } from "@/lib/utils/grantor-email";

interface EnrollmentAcademicLockCardProps {
  lock: AcademicStandingLock;
}

export function EnrollmentAcademicLockCard({ lock }: EnrollmentAcademicLockCardProps) {
  const isPending = lock.reason === "APPEAL_PENDING" || lock.appeal_status === "PENDING_GRANTOR";
  const isDiscontinued = lock.reason === "DISCONTINUED" || lock.appeal_status === "DENIED";
  const isSecondChanceExhausted = lock.archive_reason === "FAILED_SECOND_CHANCE";

  const { grantorEmail, coordinatorEmail, gmailUrl, mailtoUrl } = buildGrantorAppealEmailLinks({
    grantorEmail: lock.grantor_email,
    coordinatorEmail: lock.coordinator_email,
    scholarName: lock.scholar_name,
    studentNumber: lock.student_number,
    courseOfStudy: lock.course_of_study,
    academicYear: lock.academic_year,
    semester: lock.semester,
    gwa: lock.gpa,
  });

  return (
    <Card
      className={`shadow-xs ${
        isDiscontinued
          ? "border-rose-200/80 bg-rose-50/20"
          : isPending
            ? "border-amber-200/80 bg-amber-50/20"
            : "border-rose-200/80 bg-rose-50/20"
      }`}
    >
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Header with status badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl ${
                isDiscontinued
                  ? "bg-rose-100 text-rose-700"
                  : isPending
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-700"
              }`}
            >
              {isDiscontinued ? (
                <ShieldAlert className="size-5 sm:size-6" />
              ) : isPending ? (
                <Clock className="size-5 sm:size-6 text-amber-700" />
              ) : (
                <AlertTriangle className="size-5 sm:size-6 text-rose-700" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-navy">
                  {isDiscontinued
                    ? isSecondChanceExhausted
                      ? "Enrollment Locked • Scholarship Archived (2nd Chance Exhausted)"
                      : "Start-of-Term Enrollment Unavailable"
                    : isPending
                      ? "Enrollment Paused • Appeal Awaiting Grantor Verdict"
                      : "Enrollment Paused • Academic Appeal Required"}
                </h3>
                <Badge
                  variant="outline"
                  className={
                    isDiscontinued
                      ? "bg-rose-100/80 text-rose-900 border-rose-300 text-xs font-bold gap-1 py-0.5"
                      : isPending
                        ? "bg-amber-100/80 text-amber-900 border-amber-300 text-xs font-bold gap-1 py-0.5"
                        : "bg-rose-100/80 text-rose-900 border-rose-300 text-xs font-bold gap-1 py-0.5"
                  }
                >
                  {isDiscontinued ? (
                    <>
                      <ShieldAlert className="size-3 text-rose-700" />
                      {isSecondChanceExhausted ? "Archived • 2nd Chance Failed" : "Scholarship Concluded"}
                    </>
                  ) : isPending ? (
                    <>
                      <Clock className="size-3 text-amber-700" />
                      Appeal Under Review
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="size-3 text-rose-700" />
                      Action Required
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isDiscontinued
                  ? "Your scholarship agreement has concluded following an appeal decision."
                  : isPending
                    ? "Start-of-term enrollment is locked while the Grantor evaluates your Second Chance Appeal."
                    : "Your previous semester's grades were flagged for academic review. An appeal is required to continue."}
              </p>
            </div>
          </div>
        </div>

        {/* Academic Details Box */}
        <div className="rounded-xl border border-border/70 bg-white/80 p-3.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">Flagged Semester</span>
              <span className="font-bold text-navy mt-0.5 block">
                {lock.academic_year && lock.semester ? `${lock.academic_year} • ${lock.semester}` : "Previous Term"}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">Term GWA</span>
              <span className="font-bold text-navy mt-0.5 block tabular-nums">
                {lock.gpa != null ? Number(lock.gpa).toFixed(2) : "—"}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">Academic Status</span>
              <span className="font-bold text-rose-700 mt-0.5 block">
                {lock.evaluation_flag || "Academic Standing Review"}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed border-t border-border/50 pt-2.5">
            {isPending
              ? "To ensure focus on your scholarship appeal, Certificate of Registration (COR) and Statement of Account (SOA) uploads are temporarily locked. Once the Grantor grants your appeal and lifts probation, start-of-term enrollment will automatically unlock so you can submit your matriculation credentials."
              : isDiscontinued
                ? "Your scholar record is currently archived. You retain read-only access to browse your academic and financial records. You may email the Grantor directly (CC Coordinator) to request special reconsideration — if the Grantor restores your record from the Archive, start-of-term enrollment will unlock automatically."
                : "Your course marks or GWA for the previous semester did not meet the baseline retention criteria. Please file a Second Chance Appeal directly to the Grantor explaining your circumstances and action plan."}
          </p>

          {isDiscontinued && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-rose-900/80">
              <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50/60 px-2 py-0.5 font-medium">
                <strong className="text-rose-950">To:</strong> {grantorEmail}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50/60 px-2 py-0.5 font-medium">
                <strong className="text-rose-950">CC:</strong> {coordinatorEmail}
              </span>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        {isDiscontinued ? (
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              If the Grantor restores your record from the Archive, enrollment will unlock automatically.
            </span>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <Button
                asChild
                size="sm"
                className="h-9 px-3.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-xs font-semibold text-white! shadow-xs"
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
                className="h-9 px-3.5 rounded-lg border-rose-300 bg-white text-xs font-semibold text-rose-900 hover:bg-rose-50"
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
                className="h-9 px-3 rounded-lg text-xs font-semibold text-navy hover:bg-slate-100"
              >
                <Link href="/ScholarGrade" className="inline-flex items-center gap-1.5">
                  <FileText className="size-3.5" />
                  <span>View Grade Records</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/50">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {isPending
                ? "Track the decision status on your grades dashboard."
                : "Submit your appeal statement and supporting documents in Scholar Grades."}
            </span>
            <Button
              asChild
              className={`h-9 px-4 text-xs font-semibold gap-2 rounded-lg cursor-pointer ml-auto text-white! !text-white ${
                isPending
                  ? "bg-amber-700 hover:bg-amber-800 text-white! !text-white"
                  : "bg-[#0a4f42] hover:bg-[#0a4f42]/90 text-white! !text-white"
              }`}
            >
              <Link
                href="/ScholarGrade"
                style={{ color: "#ffffff" }}
                className="text-white! !text-white inline-flex items-center gap-2"
              >
                {isPending ? (
                  <Clock className="size-3.5 text-white" />
                ) : (
                  <FileText className="size-3.5 text-white" />
                )}
                <span style={{ color: "#ffffff" }} className="text-white! !text-white">
                  {isPending ? "View Appeal Status" : "File Academic Appeal"}
                </span>
                <ArrowRight className="size-3.5 text-white" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
