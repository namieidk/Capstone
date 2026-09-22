"use client";

import { ArrowRight, CheckCircle2, Clock, FileSpreadsheet, FileUp, Receipt, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ScholarEnrollmentData } from "@/lib/api/scholar-dashboard";

interface ScholarEnrollmentQuickHubProps {
  latestEnrollment: ScholarEnrollmentData | null;
  pendingOrCount: number;
}

export function ScholarEnrollmentQuickHub({ latestEnrollment, pendingOrCount }: ScholarEnrollmentQuickHubProps) {
  const status = latestEnrollment?.status || "NOT_SUBMITTED";

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "APPROVED":
        return (
          <Badge className="h-5.5 rounded-full border-emerald-300 bg-emerald-50 px-2.5 text-[11px] font-semibold text-emerald-800">
            <CheckCircle2 className="mr-1 size-3" /> Enrolled & Cleared
          </Badge>
        );
      case "PENDING_REVIEW":
        return (
          <Badge className="h-5.5 rounded-full border-amber-300 bg-amber-50 px-2.5 text-[11px] font-semibold text-amber-800">
            <Clock className="mr-1 size-3" /> Under Coordinator Review
          </Badge>
        );
      case "CHANGES_REQUESTED":
        return (
          <Badge className="h-5.5 rounded-full border-rose-300 bg-rose-50 px-2.5 text-[11px] font-semibold text-rose-800">
            <ShieldAlert className="mr-1 size-3" /> Revision Required
          </Badge>
        );
      default:
        return (
          <Badge className="h-5.5 rounded-full border-line bg-muted/60 px-2.5 text-[11px] font-semibold text-muted-foreground">
            Not Submitted
          </Badge>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-between rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <FileSpreadsheet className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Active Term Operations</h2>
            <p className="text-xs text-muted-foreground">Registration, COR & submission center</p>
          </div>
        </div>

        {getStatusBadge(status)}
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Term summary block */}
        <div className="rounded-xl border border-line/60 bg-[#FAF8F5] p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[#14213a]">
                {latestEnrollment
                  ? `${latestEnrollment.academic_year} • ${latestEnrollment.semester}`
                  : "No Term Enrollment on Record"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {latestEnrollment
                  ? `${latestEnrollment.total_units} Units Enrolled • Assessment: ₱${latestEnrollment.total_assessment.toLocaleString()}`
                  : "Submit your Certificate of Registration (COR) to register for the active semester."}
              </p>
            </div>

            <Button
              asChild
              size="sm"
              className="h-8 rounded-full bg-[#0a4f42] px-3.5 text-xs font-semibold text-white! hover:bg-[#0a4f42]/90 shadow-2xs"
            >
              <Link href="/scholar-enrollment" className="flex items-center gap-1.5 text-white!">
                <span className="text-white!">Enrollment Hub</span>
                <ArrowRight className="size-3 text-white" />
              </Link>
            </Button>
          </div>

          {latestEnrollment?.coordinator_notes && (
            <div className="mt-2.5 rounded-lg bg-amber-50 border border-amber-200/80 p-2 text-[11px] text-amber-900">
              <strong className="font-semibold">Coordinator Note:</strong> {latestEnrollment.coordinator_notes}
            </div>
          )}
        </div>

        {/* Quick action grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link
            href="/ScholarGrade"
            className="group flex items-center justify-between rounded-xl border border-line/70 bg-white p-3 hover:border-[#0a4f42]/40 hover:bg-tint/40 transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#0a4f42]/10 text-[#0a4f42] group-hover:bg-[#0a4f42] group-hover:text-white transition-colors">
                <FileUp className="size-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#14213a] group-hover:text-[#0a4f42] transition-colors">
                  Submit Grades
                </p>
                <p className="text-[10px] text-muted-foreground">Upload COG for evaluation</p>
              </div>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-[#0a4f42] group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/ScholarPayment"
            className="group flex items-center justify-between rounded-xl border border-line/70 bg-white p-3 hover:border-[#f1b71e]/50 hover:bg-[#fceec4]/20 transition-all shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#f1b71e]/15 text-[#8a6410] group-hover:bg-[#8a6410] group-hover:text-white transition-colors">
                <Receipt className="size-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-[#14213a] group-hover:text-[#8a6410] transition-colors">
                    Official Receipts
                  </p>
                  {pendingOrCount > 0 && <span className="flex size-2 rounded-full bg-amber-600 animate-ping" />}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {pendingOrCount > 0 ? `${pendingOrCount} OR Upload Required` : "View payment history"}
                </p>
              </div>
            </div>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-[#8a6410] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
