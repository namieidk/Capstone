"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoordinatorMonitorBannersProps {
  pendingAuditCount: number;
  pendingEnrollmentCount: number;
  pendingGradeDocCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function CoordinatorMonitorBanners({
  pendingAuditCount,
  pendingEnrollmentCount,
  pendingGradeDocCount,
  activeTab,
  onSelectTab,
}: CoordinatorMonitorBannersProps) {
  return (
    <>
      {/* Action Callout Banner for Pending Prospectus Audits */}
      {pendingAuditCount > 0 && activeTab !== "baseline-audits" && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200">
                {pendingAuditCount} {pendingAuditCount === 1 ? "scholar is" : "scholars are"} awaiting prospectus audit.
              </span>{" "}
              <span className="text-muted-foreground hidden md:inline">
                Review submitted degree checklists and historical credits to freeze curriculum baselines.
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSelectTab("baseline-audits")}
            className="h-7.5 px-3 rounded-lg border-amber-500/40 bg-white/90 dark:bg-amber-950/40 hover:bg-white text-amber-950 font-semibold text-xs shrink-0 gap-1.5 shadow-2xs"
          >
            <span>Review Audits ({pendingAuditCount})</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Action Callout Banner for Pending Enrollment Audits */}
      {pendingEnrollmentCount > 0 && activeTab !== "enrollment-audits" && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-950 dark:text-teal-100 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#0a4f42] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-teal-900 dark:text-teal-200">
                {pendingEnrollmentCount} {pendingEnrollmentCount === 1 ? "enrollment is" : "enrollments are"} awaiting
                start-of-term audit & endorsement.
              </span>{" "}
              <span className="text-muted-foreground hidden md:inline">
                Validate enrolled courses & tuition ledger to auto-create Grantor disbursements.
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSelectTab("enrollment-audits")}
            className="h-7.5 px-3 rounded-lg border-teal-500/40 bg-white/90 dark:bg-teal-950/40 hover:bg-white text-[#0a4f42] font-semibold text-xs shrink-0 gap-1.5 shadow-2xs"
          >
            <span>Review Enrollments ({pendingEnrollmentCount})</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Action Callout Banner for Pending Grade Audits */}
      {pendingGradeDocCount > 0 && activeTab !== "grade-audits" && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                {pendingGradeDocCount} {pendingGradeDocCount === 1 ? "grade report is" : "grade reports are"} awaiting
                end-of-term audit.
              </span>{" "}
              <span className="text-muted-foreground hidden md:inline">
                Verify extracted CCG grades, credit prospectus units, and assess retention eligibility.
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSelectTab("grade-audits")}
            className="h-7.5 px-3 rounded-lg border-emerald-500/40 bg-white/90 dark:bg-emerald-950/40 hover:bg-white text-emerald-900 font-semibold text-xs shrink-0 gap-1.5 shadow-2xs"
          >
            <span>Review Grades ({pendingGradeDocCount})</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}
    </>
  );
}
