"use client";

import { ArrowRight, CheckCircle2, Clock, FileSpreadsheet, FileText, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CoordinatorEnrollmentQueueItem } from "@/lib/api/coordinator-dashboard";

interface CoordinatorEnrollmentQueueCardProps {
  enrollmentQueue: CoordinatorEnrollmentQueueItem[];
}

export function CoordinatorEnrollmentQueueCard({ enrollmentQueue }: CoordinatorEnrollmentQueueCardProps) {
  const getEnrollmentBadge = (status: string, hasCor: boolean) => {
    if (status === "APPROVED") {
      return (
        <Badge className="h-5.5 w-28 justify-center rounded-full border-emerald-300 bg-emerald-50 px-2 text-[10px] font-bold text-emerald-800">
          <CheckCircle2 className="mr-1 size-3 shrink-0" /> Cleared
        </Badge>
      );
    }
    if (status === "CHANGES_REQUESTED") {
      return (
        <Badge className="h-5.5 w-28 justify-center rounded-full border-rose-300 bg-rose-50 px-2 text-[10px] font-bold text-rose-800">
          <ShieldAlert className="mr-1 size-3 shrink-0" /> Revision
        </Badge>
      );
    }
    if (status === "NO_COR_SUBMITTED" || !hasCor) {
      return (
        <Badge className="h-5.5 w-28 justify-center rounded-full border-slate-300 bg-slate-100 px-2 text-[10px] font-bold text-slate-700">
          <Clock className="mr-1 size-3 shrink-0" /> Awaiting COR
        </Badge>
      );
    }
    return (
      <Badge className="h-5.5 w-28 justify-center rounded-full border-amber-300 bg-amber-50 px-2 text-[10px] font-bold text-amber-800">
        <Clock className="mr-1 size-3 shrink-0" /> Pending Review
      </Badge>
    );
  };

  return (
    <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <FileSpreadsheet className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Term Enrollment & COR Queue</h2>
            <p className="text-xs text-muted-foreground">Course verification, COR & SOA approvals</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/CoordinatorMonitor" className="flex items-center gap-1">
            <span>Process Enrollments</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {enrollmentQueue.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No pending term enrollment submissions found.
          </div>
        ) : (
          enrollmentQueue.map((item) => (
            <div
              key={item.enrollment_id}
              className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7.5 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs">
                  <FileText className="size-3.5" />
                </div>
                <div>
                  <p className="font-bold text-[#14213a]">{item.scholar_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.term} • {item.units} Units • Assessment: ₱{item.assessment.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">{getEnrollmentBadge(item.status, item.has_cor)}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
