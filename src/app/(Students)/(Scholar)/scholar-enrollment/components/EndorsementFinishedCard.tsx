"use client";

import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CurrentEnrollmentState } from "@/lib/api/enrollment";

interface EndorsementFinishedCardProps {
  enrollmentState: CurrentEnrollmentState;
  totalAssessment: number;
  subjectsCount?: number;
  totalUnits?: number;
}

export function EndorsementFinishedCard({
  enrollmentState,
  totalAssessment,
}: EndorsementFinishedCardProps) {
  const enrollment = enrollmentState.enrollment;
  const disbursement = enrollment?.disbursement;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const endorsedAmount =
    totalAssessment ||
    (enrollment?.disbursement ? Number(enrollment.disbursement.amount) : 0);

  const disbursementStatusLabel = disbursement
    ? disbursement.status === "SETTLED"
      ? "Tuition Fully Settled"
      : disbursement.status === "CHECK_ISSUED"
        ? `Tuition Check Issued #${disbursement.check_number || ""}`
        : disbursement.status === "AUTHORIZED"
          ? "Voucher Authorized"
          : "Voucher Queued"
    : "Disbursement Queued";

  return (
    <Card className="shadow-xs border-emerald-200/80 bg-emerald-50/30">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <FileCheck2 className="size-5 sm:size-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-navy">
                  Tuition Endorsement Approved
                </h3>
                <Badge
                  variant="outline"
                  className="bg-emerald-100/80 text-emerald-900 border-emerald-300 text-xs font-bold gap-1 py-0.5"
                >
                  <CheckCircle2 className="size-3 text-emerald-700" />
                  Coordinator Endorsed
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your enrolled courses and tuition assessment have been verified
                and endorsed to the Grantor for payment.
              </p>
            </div>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1 shrink-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border border-emerald-100 sm:border-0">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Endorsed Amount
            </span>
            <span className="text-base sm:text-lg font-bold text-emerald-800 font-mono">
              {formatCurrency(endorsedAmount)}
            </span>
          </div>
        </div>

        {/* Status Callout & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-emerald-100/80">
          <div className="flex items-center gap-2 text-xs text-emerald-900">
            <CreditCard className="size-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Disbursement Status:</strong> {disbursementStatusLabel}
            </span>
          </div>

          <Button
            asChild
            className="h-8 bg-emerald-700 hover:bg-emerald-800 text-white! text-xs font-semibold gap-1.5 self-start sm:self-auto shadow-2xs"
          >
            <Link
              href="/ScholarPayment"
              className="inline-flex items-center gap-1.5 text-white! hover:text-white! no-underline"
            >
              <span className="text-white!">View Disbursements</span>
              <ArrowRight className="size-3.5 text-white!" />
            </Link>
          </Button>
        </div>

        {/* Coordinator remarks if any */}
        {enrollment?.coordinator_notes && (
          <div className="p-3 bg-white border border-emerald-200/80 rounded-xl text-xs space-y-1">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Info className="size-3.5 text-emerald-700" /> Coordinator Note:
            </span>
            <p className="text-emerald-900 leading-relaxed">
              {enrollment.coordinator_notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
