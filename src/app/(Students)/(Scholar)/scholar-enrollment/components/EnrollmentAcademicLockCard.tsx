"use client";

import { AlertTriangle, ArrowRight, Clock, FileText, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AcademicStandingLock } from "@/lib/api/enrollment";

interface EnrollmentAcademicLockCardProps {
  lock: AcademicStandingLock;
}

export function EnrollmentAcademicLockCard({ lock }: EnrollmentAcademicLockCardProps) {
  const isPending = lock.reason === "APPEAL_PENDING" || lock.appeal_status === "PENDING_GRANTOR";
  const isDiscontinued = lock.reason === "DISCONTINUED" || lock.appeal_status === "DENIED";

  return (
    <Card className="rounded-2xl border border-amber-200/90 bg-linear-to-br from-amber-50/60 via-white to-orange-50/30 p-6 md:p-8 shadow-sm">
      <CardContent className="p-0 space-y-6">
        {/* Header with status badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-5">
          <div className="flex items-center gap-3">
            <div
              className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
                isDiscontinued
                  ? "bg-rose-100 text-rose-700"
                  : isPending
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
              }`}
            >
              {isDiscontinued ? (
                <ShieldAlert className="size-6" />
              ) : isPending ? (
                <Clock className="size-6 animate-pulse" />
              ) : (
                <AlertTriangle className="size-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-navy">
                {isDiscontinued
                  ? "Start-of-Term Enrollment Unavailable"
                  : isPending
                    ? "Enrollment Paused • Appeal Awaiting Grantor Verdict"
                    : "Enrollment Paused • Academic Appeal Required"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isDiscontinued
                  ? "Your scholarship agreement has concluded following an appeal decision."
                  : isPending
                    ? "Start-of-term enrollment is locked while the Grantor evaluates your Second Chance Appeal."
                    : "Your previous semester's grades were flagged for academic review. An appeal is required to continue."}
              </p>
            </div>
          </div>

          <div>
            {isDiscontinued ? (
              <Badge className="bg-rose-100 text-rose-900 border-rose-300 text-xs font-semibold gap-1.5 py-1 px-3">
                <ShieldAlert className="size-3.5 text-rose-700" />
                Scholarship Discontinued
              </Badge>
            ) : isPending ? (
              <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs font-semibold gap-1.5 py-1 px-3">
                <Clock className="size-3.5 text-amber-700" />
                Appeal Under Grantor Review
              </Badge>
            ) : (
              <Badge className="bg-rose-50 text-rose-900 border-rose-300 text-xs font-semibold gap-1.5 py-1 px-3">
                <AlertTriangle className="size-3.5 text-rose-600" />
                Action Required • File Appeal
              </Badge>
            )}
          </div>
        </div>

        {/* Academic Details Box */}
        <div className="rounded-xl border border-amber-200/80 bg-white/80 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-amber-50/50 p-3 border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Flagged Semester</span>
              <span className="text-sm font-bold text-navy mt-0.5 block">
                {lock.academic_year && lock.semester ? `${lock.academic_year} • ${lock.semester}` : "Previous Term"}
              </span>
            </div>
            <div className="rounded-lg bg-amber-50/50 p-3 border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Term GWA</span>
              <span className="text-sm font-bold text-navy mt-0.5 block tabular-nums">
                {lock.gpa != null ? Number(lock.gpa).toFixed(2) : "—"}
              </span>
            </div>
            <div className="rounded-lg bg-amber-50/50 p-3 border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Review Flag</span>
              <span className="text-xs font-bold text-rose-700 mt-1 block">
                {lock.evaluation_flag || "Academic Standing Review"}
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed">
            {isPending
              ? "To ensure focus on your scholarship appeal, Certificate of Registration (COR) and Statement of Account (SOA) uploads are temporarily locked. Once the Grantor grants your appeal and lifts probation, start-of-term enrollment will automatically unlock so you can submit your matriculation credentials."
              : isDiscontinued
                ? "The Grantor has reviewed your record and concluded that scholarship enrollment cannot be renewed for upcoming semesters."
                : "Your course marks or GWA for the previous semester did not meet the baseline retention criteria. Please file a Second Chance Appeal directly to the Grantor explaining your circumstances and action plan."}
          </p>
        </div>

        {/* Action Buttons */}
        {!isDiscontinued && (
          <div className="flex justify-end pt-2">
            <Button
              asChild
              size="lg"
              className={`h-11 sm:h-12 px-6 text-sm font-bold gap-2.5 rounded-xl text-white shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] w-full sm:w-auto ${
                isPending ? "bg-amber-700 hover:bg-amber-800" : "bg-rose-700 hover:bg-rose-800"
              }`}
            >
              <Link href="/ScholarGrade">
                {isPending ? <Clock className="size-4" /> : <FileText className="size-4" />}
                <span>{isPending ? "Track Appeal Verdict in Grades" : "Go to Scholar Grades & File Appeal"}</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
