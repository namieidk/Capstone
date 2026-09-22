"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrantorMonitorBannersProps {
  endorsedEnrollmentCount: number;
  pendingAuditCount: number;
  pendingAppealCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function GrantorMonitorBanners({
  endorsedEnrollmentCount,
  pendingAuditCount,
  pendingAppealCount,
  activeTab,
  onSelectTab,
}: GrantorMonitorBannersProps) {
  return (
    <>
      {/* Callout Banner for Pending Appeals */}
      {pendingAppealCount > 0 && activeTab !== "academic-appeals" && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-100 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-900 dark:text-rose-200">
                {pendingAppealCount} {pendingAppealCount === 1 ? "scholar has" : "scholars have"} submitted a Second
                Chance Academic Appeal.
              </span>{" "}
              <span className="text-muted-foreground hidden md:inline">
                Review submitted explanations and supporting documents to decide on 1-semester probationary extension.
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSelectTab("academic-appeals")}
            className="h-7.5 px-3 rounded-lg border-rose-500/40 bg-white/90 hover:bg-white text-rose-900 font-semibold text-xs shrink-0 gap-1.5 shadow-2xs"
          >
            <span>Review Appeals ({pendingAppealCount})</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Action Callout Banner for Endorsed Enrollments */}
      {endorsedEnrollmentCount > 0 && activeTab !== "enrollment-audits" && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-950 dark:text-teal-100 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#0a4f42] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-teal-900 dark:text-teal-200">
                {endorsedEnrollmentCount} {endorsedEnrollmentCount === 1 ? "enrollment has" : "enrollments have"} been
                endorsed by the Coordinator.
              </span>{" "}
              <span className="text-muted-foreground hidden md:inline">
                Review verified course credentials and authorize tuition disbursements.
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
            <span>Review Endorsements ({endorsedEnrollmentCount})</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Action Callout Banner for Pending Prospectus Audits */}
      {pendingAuditCount > 0 && activeTab !== "baseline-audits" && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200">
                {pendingAuditCount} {pendingAuditCount === 1 ? "scholar is" : "scholars are"} awaiting prospectus audit.
              </span>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSelectTab("baseline-audits")}
            className="h-7.5 px-3 rounded-lg border-amber-500/40 bg-white/90 text-amber-950 font-semibold text-xs shrink-0 gap-1.5 shadow-2xs"
          >
            <span>Review Audits ({pendingAuditCount})</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}
    </>
  );
}
