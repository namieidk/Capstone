"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, Clock, FileSpreadsheet, Lock, Receipt } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CoordinatorDashboardKpis } from "@/lib/api/coordinator-dashboard";

interface CoordinatorUrgentActionsBannerProps {
  kpis: CoordinatorDashboardKpis;
}

export function CoordinatorUrgentActionsBanner({ kpis }: CoordinatorUrgentActionsBannerProps) {
  const { pendingBaselineFreezeCount, pendingEnrollmentsCount, pendingOrCount, pendingReviewApplicants } = kpis;

  const totalUrgent = pendingBaselineFreezeCount + pendingEnrollmentsCount + pendingOrCount + pendingReviewApplicants;

  if (totalUrgent === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[#0a4f42]/20 bg-[#ddeee3]/40 p-4 sm:p-5 text-[#0a4f42]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0a4f42]/15 text-[#0a4f42]">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#0a4f42]">Pipeline Operations Cleared</span>
                <Badge className="h-5 rounded-full border-[#0a4f42]/30 bg-[#ddeee3] px-2 text-[10px] font-bold text-[#0a4f42]">
                  All Up to Date
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-[#0a4f42]/90 leading-relaxed max-w-2xl">
                There are no pending baseline freezes, unreviewed term enrollments, or unverified official receipts
                requiring immediate coordinator action.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 shrink-0 rounded-full border-[#0a4f42]/30 bg-white px-3.5 text-xs font-semibold text-[#0a4f42] hover:bg-[#ddeee3]/50 shadow-2xs"
          >
            <Link href="/CoordinatorMonitor" className="flex items-center gap-1.5">
              <span>Scholar Monitor</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#f1b71e]/50 bg-[#fceec4]/40 p-4 sm:p-5 text-[#8a6410]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1b71e]/25 text-[#8a6410]">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#705009]">
                Action Required ({totalUrgent} Operations Pending)
              </span>
              <Badge className="h-5 rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-2 text-[10px] font-bold text-[#8a6410]">
                Coordinator Queue
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8a6410]/90">
              {pendingBaselineFreezeCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-[#705009]">
                  <Lock className="size-3 text-[#8a6410]" />
                  {pendingBaselineFreezeCount} Baseline
                  {pendingBaselineFreezeCount > 1 ? "s" : ""} to Freeze
                </span>
              )}
              {pendingEnrollmentsCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-[#705009]">
                  <FileSpreadsheet className="size-3 text-[#8a6410]" />
                  {pendingEnrollmentsCount} Enrollment
                  {pendingEnrollmentsCount > 1 ? "s" : ""} to Review
                </span>
              )}
              {pendingOrCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-[#705009]">
                  <Receipt className="size-3 text-[#8a6410]" />
                  {pendingOrCount} OR{pendingOrCount > 1 ? "s" : ""} to Settle
                </span>
              )}
              {pendingReviewApplicants > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-[#8a6410]" />
                  {pendingReviewApplicants} Applicant
                  {pendingReviewApplicants > 1 ? "s" : ""} in Screening
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            asChild
            size="sm"
            className="h-8.5 shrink-0 rounded-full bg-[#8a6410] px-4 text-xs font-semibold text-white! hover:bg-[#705009] shadow-xs"
          >
            <Link href="/CoordinatorMonitor" className="flex items-center gap-1.5 text-white!">
              <span className="text-white!">Process Queue</span>
              <ArrowRight className="size-3.5 text-white" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
