"use client";

import { ArrowRight, CreditCard, GraduationCap, Scale, UserCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { GrantorDashboardKpis } from "@/lib/api/grantor-dashboard";

interface GrantorKpiCardsProps {
  kpis: GrantorDashboardKpis;
}

export function GrantorKpiCards({ kpis }: GrantorKpiCardsProps) {
  const {
    endorsedApplicantsCount,
    totalApplicants,
    pendingAppealsCount,
    pendingDisbursementsCount,
    pendingDisbursementsSum,
    totalScholars,
    goodStandingCount,
    probationCount,
    totalDisbursedSum,
  } = kpis;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Endorsed Candidates Awaiting Verdict */}
      <Card className="rounded-2xl border-line/80 bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <CardContent className="p-0 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Candidate Verdicts</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-[#14213a]">{endorsedApplicantsCount}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Endorsed by Coordinators</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-line/60">
            <span className="text-[11px] text-muted-foreground">{totalApplicants} total in intake</span>
            <Link
              href="/grantApplicants"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a4f42] hover:underline"
            >
              <span>Decide</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 2. Academic Appeals Awaiting Grantor Ruling */}
      <Card className="rounded-2xl border-line/80 bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <CardContent className="p-0 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Academic Appeals</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-50 text-[#8a6410]">
              <Scale className="size-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-[#14213a]">{pendingAppealsCount}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Grade Retention Rulings</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-line/60">
            <span className="text-[11px] text-muted-foreground">{probationCount} currently on probation</span>
            <Link
              href="/grantMonitor"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8a6410] hover:underline"
            >
              <span>Review</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 3. Disbursement Authorization */}
      <Card className="rounded-2xl border-line/80 bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <CardContent className="p-0 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Fund Approvals</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-[#0a4f42]">
              <CreditCard className="size-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-[#14213a]">{pendingDisbursementsCount}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ₱{pendingDisbursementsSum.toLocaleString()} Pending Auth
            </p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-line/60">
            <span className="text-[11px] text-muted-foreground">₱{totalDisbursedSum.toLocaleString()} released</span>
            <Link
              href="/grantPayment"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a4f42] hover:underline"
            >
              <span>Authorize</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 4. Active Scholars & Retention */}
      <Card className="rounded-2xl border-line/80 bg-white p-4.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
        <CardContent className="p-0 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">Scholar Retention</p>
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
              <GraduationCap className="size-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-[#14213a]">{totalScholars}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Active Enrolled Scholars</p>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-line/60">
            <span className="text-[11px] text-emerald-800 font-medium">{goodStandingCount} Good Standing</span>
            <Link
              href="/grantMonitor"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a4f42] hover:underline"
            >
              <span>Monitor</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
