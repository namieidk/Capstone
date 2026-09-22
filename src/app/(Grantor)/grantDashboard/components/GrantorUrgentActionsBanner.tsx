"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, CreditCard, Scale, UserCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GrantorDashboardKpis } from "@/lib/api/grantor-dashboard";

interface GrantorUrgentActionsBannerProps {
  kpis: GrantorDashboardKpis;
}

export function GrantorUrgentActionsBanner({ kpis }: GrantorUrgentActionsBannerProps) {
  const { endorsedApplicantsCount, pendingAppealsCount, pendingDisbursementsCount } = kpis;

  const totalUrgent = endorsedApplicantsCount + pendingAppealsCount + pendingDisbursementsCount;

  if (totalUrgent === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50/90 via-white to-emerald-50/50 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#0a4f42]">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0a4f42]">Executive Approvals Up to Date</h3>
                <Badge className="h-5 rounded-full border-emerald-300 bg-emerald-100/80 px-2 text-[10px] font-bold text-[#0a4f42]">
                  Zero Pending Verdicts
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-[#0a4f42]/90 leading-relaxed max-w-2xl">
                All endorsed applicants, academic appeals, and disbursement batches have been adjudicated. No immediate
                executive action required.
              </p>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8.5 shrink-0 rounded-full border-[#0a4f42]/30 bg-white px-3.5 text-xs font-semibold text-[#0a4f42] hover:bg-[#ddeee3]/50 shadow-2xs"
          >
            <Link href="/grantMonitor" className="flex items-center gap-1.5">
              <span>Program Monitor</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#f1b71e]/40 bg-linear-to-r from-[#fff9e6] via-white to-[#fff9e6] p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fceec4] text-[#8a6410]">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#14213a]">Executive Actions Required ({totalUrgent} Pending)</h3>
              <Badge className="h-5 rounded-full border-[#f1b71e]/50 bg-[#fceec4] px-2 text-[10px] font-bold text-[#8a6410]">
                Immediate Verdict Needed
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {endorsedApplicantsCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-[#705009]">
                  <UserCheck className="size-3 text-[#8a6410]" />
                  {endorsedApplicantsCount} Endorsed Candidate{endorsedApplicantsCount > 1 ? "s" : ""}
                </span>
              )}
              {pendingAppealsCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-[#705009]">
                  <Scale className="size-3 text-[#8a6410]" />
                  {pendingAppealsCount} Grade Appeal{pendingAppealsCount > 1 ? "s" : ""}
                </span>
              )}
              {pendingDisbursementsCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-[#705009]">
                  <CreditCard className="size-3 text-[#8a6410]" />
                  {pendingDisbursementsCount} Disbursement Batch{pendingDisbursementsCount > 1 ? "es" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {endorsedApplicantsCount > 0 && (
            <Button
              asChild
              size="sm"
              className="h-8.5 shrink-0 rounded-full bg-[#0a4f42] px-3.5 text-xs font-semibold text-white! hover:bg-[#083c32] shadow-xs"
            >
              <Link href="/grantApplicants" className="flex items-center gap-1.5 text-white!">
                <span className="text-white!">Review Candidates</span>
                <ArrowRight className="size-3.5 text-white" />
              </Link>
            </Button>
          )}

          {pendingAppealsCount > 0 && (
            <Button
              asChild
              size="sm"
              className="h-8.5 shrink-0 rounded-full bg-[#8a6410] px-3.5 text-xs font-semibold text-white! hover:bg-[#705009] shadow-xs"
            >
              <Link href="/grantMonitor" className="flex items-center gap-1.5 text-white!">
                <span className="text-white!">Adjudicate Appeals</span>
                <ArrowRight className="size-3.5 text-white" />
              </Link>
            </Button>
          )}

          {pendingDisbursementsCount > 0 && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8.5 shrink-0 rounded-full border-line bg-white px-3.5 text-xs font-semibold text-[#14213a] hover:bg-tint shadow-2xs"
            >
              <Link href="/grantPayment" className="flex items-center gap-1.5">
                <span>Authorize Funds</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
