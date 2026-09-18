"use client";

import { ArrowRight, CheckCircle2, CreditCard, FileCheck2, School, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CurrentEnrollmentState } from "@/lib/api/enrollment";

interface EndorsementFinishedCardProps {
  enrollmentState: CurrentEnrollmentState;
  totalAssessment: number;
  subjectsCount: number;
  totalUnits: number;
}

export function EndorsementFinishedCard({
  enrollmentState,
  totalAssessment,
  subjectsCount,
  totalUnits,
}: EndorsementFinishedCardProps) {
  const enrollment = enrollmentState.enrollment;
  const disbursement = enrollment?.disbursement;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  return (
    <Card className="rounded-2xl border-emerald-200 bg-linear-to-b from-emerald-50/70 via-white to-white shadow-xs overflow-hidden">
      <CardHeader className="p-5 sm:p-6 pb-4 border-b border-emerald-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <FileCheck2 className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-navy">Tuition Endorsement Finished & Approved</h3>
                <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-xs font-bold gap-1 py-0.5">
                  <CheckCircle2 className="size-3.5 text-emerald-700" />
                  Coordinator Endorsed
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your academic credentials and university billing have been audited and endorsed to the Grantor.
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Endorsed Tuition Amount
            </span>
            <p className="text-2xl font-black text-emerald-800 font-mono tabular-nums">
              {formatCurrency(
                totalAssessment || (enrollment?.disbursement ? Number(enrollment.disbursement.amount) : 0),
              )}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Metric Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <School className="size-3.5 text-emerald-600" /> Academic Term
            </span>
            <p className="text-sm font-bold text-navy">
              AY {enrollment?.academic_year || "2026-2027"} • {enrollment?.semester || "1st Semester"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Year {enrollment?.year_level || enrollmentState.scholar.current_year_level || 1} Scholar
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-100 bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600" /> Curriculum Load
            </span>
            <p className="text-sm font-bold text-navy">
              {subjectsCount} Subjects ({totalUnits} Units)
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Baseline compliance verified
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-100 bg-white shadow-2xs space-y-1">
            <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <CreditCard className="size-3.5 text-emerald-600" /> Disbursement Stage
            </span>
            <p className="text-sm font-bold text-navy">
              {disbursement
                ? disbursement.status === "SETTLED"
                  ? "Fully Settled"
                  : disbursement.status === "CHECK_ISSUED"
                    ? `Check Issued #${disbursement.check_number || ""}`
                    : disbursement.status === "AUTHORIZED"
                      ? "Voucher Authorized"
                      : "Pending Voucher"
                : "Voucher Queued"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {disbursement?.bank_name || "Direct institutional payment"}
            </p>
          </div>
        </div>

        {/* Coordinator remarks if any */}
        {enrollment?.coordinator_notes && (
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-xs space-y-1">
            <span className="font-bold text-emerald-950">Coordinator Endorsement Remarks:</span>
            <p className="text-emerald-900 leading-relaxed">{enrollment.coordinator_notes}</p>
          </div>
        )}

        {/* Call to action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-emerald-100">
          <p className="text-xs text-muted-foreground">
            Once your tuition check is issued, you can track it and submit your Official Receipt in the Disbursements
            module.
          </p>
          <Button
            asChild
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold gap-2 px-5 h-9 shrink-0"
          >
            <Link href="/ScholarPayment">
              <span>View Disbursements</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
