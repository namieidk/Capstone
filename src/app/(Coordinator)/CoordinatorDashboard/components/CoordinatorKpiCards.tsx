"use client";

import { CreditCard, FileSpreadsheet, GraduationCap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CoordinatorDashboardKpis } from "@/lib/api/coordinator-dashboard";

interface CoordinatorKpiCardsProps {
  kpis: CoordinatorDashboardKpis;
}

export function CoordinatorKpiCards({ kpis }: CoordinatorKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Active Scholars Monitored */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Scholars
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
              <GraduationCap className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">{kpis.totalScholars}</span>
            <span className="text-xs text-muted-foreground">Scholars Enrolled</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Badge className="h-5 rounded-full border-[#0a4f42]/30 bg-[#ddeee3] px-2 text-[10px] font-bold text-[#0a4f42]">
                {kpis.goodStandingCount} Good
              </Badge>
              {kpis.probationCount > 0 && (
                <Badge className="h-5 rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-1.5 text-[10px] font-bold text-[#8a6410]">
                  {kpis.probationCount} Probation
                </Badge>
              )}
            </div>
            {kpis.actionRequiredCount > 0 && (
              <span className="text-[11px] font-bold text-rose-700">{kpis.actionRequiredCount} Flagged</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2. Applicant Intake Pipeline */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Applicant Intake
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">{kpis.totalApplicants}</span>
            <span className="text-xs text-muted-foreground">In Pipeline</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge className="h-5 rounded-full border-blue-200 bg-blue-50 px-2 text-[10px] font-bold text-blue-800">
              {kpis.pendingReviewApplicants} In Screening
            </Badge>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {kpis.endorsedApplicantsCount} Endorsed
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Term Enrollments Queue */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Term Enrollments
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <FileSpreadsheet className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">
              {kpis.pendingEnrollmentsCount}
            </span>
            <span className="text-xs text-muted-foreground">Awaiting Review</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge
              className={`h-5 rounded-full px-2 text-[10px] font-bold ${
                kpis.pendingEnrollmentsCount > 0
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-emerald-300 bg-emerald-50 text-emerald-800"
              }`}
            >
              {kpis.pendingEnrollmentsCount > 0 ? "COR Verification Needed" : "All Processed"}
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground">Active Term</span>
          </div>
        </CardContent>
      </Card>

      {/* 4. Disbursements & OR Clearance */}
      <Card className="rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Disbursements & OR
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
              <CreditCard className="size-4" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14213a]">
              ₱{kpis.totalDisbursedSum.toLocaleString()}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Badge
              className={`h-5 rounded-full px-2 text-[10px] font-bold ${
                kpis.pendingOrCount > 0
                  ? "border-[#f1b71e]/50 bg-[#fceec4] text-[#8a6410]"
                  : "border-[#0a4f42]/30 bg-[#ddeee3] text-[#0a4f42]"
              }`}
            >
              {kpis.pendingOrCount > 0 ? `${kpis.pendingOrCount} OR Pending` : "Ledger Cleared"}
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground">Released Funds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
