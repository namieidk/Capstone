"use client";

import { Camera, Check, CheckCircle2, Clock, CreditCard, ExternalLink, FileCheck, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DisbursementItem } from "@/lib/api/disbursements";

interface DisbursementTimelineCardProps {
  disbursement: DisbursementItem;
  onSubmitOR: (disbursement: DisbursementItem) => void;
}

export function DisbursementTimelineCard({ disbursement, onSubmitOR }: DisbursementTimelineCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const isAuthorized = disbursement.status !== "PENDING" && disbursement.status !== "CANCELLED";
  const isCheckIssued =
    disbursement.status === "CHECK_ISSUED" ||
    disbursement.status === "OR_SUBMITTED" ||
    disbursement.status === "SETTLED" ||
    disbursement.status === "CLAIMED";
  const isORSubmitted = disbursement.status === "OR_SUBMITTED" || disbursement.status === "SETTLED";
  const isSettled = disbursement.status === "SETTLED";

  // Determine current active step (1, 2, 3, or 4)
  const currentStep = isSettled ? 4 : isORSubmitted ? 3 : isCheckIssued ? 3 : isAuthorized ? 2 : 1;

  return (
    <Card className="rounded-[18px]! border-line bg-white shadow-va-sm overflow-hidden">
      <CardHeader className="p-5 pb-4 border-b border-line bg-[#fdfcfb]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-navy">
                AY {disbursement.academic_year} • {disbursement.semester}
              </h3>
              {isSettled ? (
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-xs font-semibold py-0.5">
                  <CheckCircle2 className="size-3 mr-1 text-emerald-600" />
                  Settled
                </Badge>
              ) : isORSubmitted ? (
                <Badge className="bg-[#0a4f42]/10 text-[#0a4f42] border-[#0a4f42]/20 text-xs font-semibold py-0.5">
                  <Clock className="size-3 mr-1 text-[#0a4f42]" />
                  OR Under Review
                </Badge>
              ) : isCheckIssued ? (
                <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-xs font-semibold py-0.5">
                  <CreditCard className="size-3 mr-1 text-amber-800" />
                  Check Ready for Handover
                </Badge>
              ) : isAuthorized ? (
                <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-xs font-semibold py-0.5">
                  Authorized Release
                </Badge>
              ) : (
                <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-xs font-semibold py-0.5">
                  Pending Authorization
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Direct-to-School Tuition Disbursement • Payee:{" "}
              <span className="font-semibold text-slate-700">{disbursement.check_payee || "University Cashier"}</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tuition Grant Amount
            </p>
            <p className="text-xl font-black text-[#0a4f42] font-mono tabular-nums">
              {formatCurrency(Number(disbursement.amount))}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        {/* 4-Step Visual Stepper with Consistent Card Sizing & Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Step 1: Voucher Authorization */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-24 transition-all ${
              isAuthorized
                ? "bg-emerald-50/60 border-emerald-200"
                : currentStep === 1
                  ? "bg-amber-50 border-amber-200"
                  : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isAuthorized
                      ? "bg-emerald-600 text-white"
                      : currentStep === 1
                        ? "bg-[#0a4f42] text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isAuthorized ? <Check className="size-3.5 stroke-3" /> : "1"}
                </span>
                <p className="text-xs font-bold text-navy">Grantor Voucher</p>
              </div>
              <p className="text-[11px] text-slate-600 pl-8">
                {disbursement.voucher_number ? (
                  <span className="font-mono font-bold text-[#0a4f42]">{disbursement.voucher_number}</span>
                ) : isAuthorized ? (
                  "Authorized Release"
                ) : (
                  "Batch release queue"
                )}
              </p>
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground pl-8 mt-1">
              {isAuthorized ? "Authorized by Grantor" : "Awaiting Authorization"}
            </p>
          </div>

          {/* Step 2: Check Issuance */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-24 transition-all ${
              isCheckIssued
                ? "bg-emerald-50/60 border-emerald-200"
                : currentStep === 2
                  ? "bg-teal-500/10 border-teal-500/30 shadow-2xs"
                  : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCheckIssued
                      ? "bg-emerald-600 text-white"
                      : currentStep === 2
                        ? "bg-[#0a4f42] text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isCheckIssued ? <Check className="size-3.5 stroke-3" /> : "2"}
                </span>
                <p className="text-xs font-bold text-navy">Check Prepared</p>
              </div>
              <p className="text-[11px] text-slate-600 pl-8">
                {disbursement.check_number ? (
                  <span className="font-mono font-bold text-navy">
                    #{disbursement.check_number} ({disbursement.bank_name || "Bank"})
                  </span>
                ) : isAuthorized ? (
                  "Coordinator preparing check"
                ) : (
                  "Crossed check pending"
                )}
              </p>
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground pl-8 mt-1">
              {isCheckIssued ? "Check Ready / Handed Over" : isAuthorized ? "In Preparation" : "Pending Voucher"}
            </p>
          </div>

          {/* Step 3: Cashier Remittance & OR */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-24 transition-all ${
              isORSubmitted
                ? "bg-emerald-50/60 border-emerald-200"
                : currentStep === 3
                  ? "bg-teal-500/10 border-teal-500/30 shadow-2xs"
                  : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isORSubmitted
                      ? "bg-emerald-600 text-white"
                      : currentStep === 3
                        ? "bg-[#0a4f42] text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isORSubmitted ? <Check className="size-3.5 stroke-3" /> : "3"}
                </span>
                <p className="text-xs font-bold text-navy">Official Receipt</p>
              </div>
              <p className="text-[11px] text-slate-600 pl-8">
                {disbursement.or_number ? (
                  <span className="font-mono font-bold text-navy">OR #{disbursement.or_number}</span>
                ) : isCheckIssued ? (
                  "Claim check & submit OR"
                ) : (
                  "Pending cashier payment"
                )}
              </p>
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground pl-8 mt-1">
              {isORSubmitted ? "Receipt Uploaded" : isCheckIssued ? "Action Required" : "Awaiting Check"}
            </p>
          </div>

          {/* Step 4: Transaction Settled */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between min-h-24 transition-all ${
              isSettled ? "bg-emerald-50/60 border-emerald-200" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isSettled ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isSettled ? <Check className="size-3.5 stroke-3" /> : "4"}
                </span>
                <p className="text-xs font-bold text-navy">Reconciled</p>
              </div>
              <p className="text-[11px] text-slate-600 pl-8">
                {isSettled ? "Transaction completed" : "Pending coordinator audit"}
              </p>
            </div>
            <p className="text-[10px] font-semibold text-muted-foreground pl-8 mt-1">
              {isSettled ? "Tuition Fully Settled" : "Final Verification"}
            </p>
          </div>
        </div>

        {/* Action Callout Banner based on State */}
        {disbursement.status === "CHECK_ISSUED" && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0 mt-0.5">
                <CreditCard className="size-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-amber-950 text-sm">
                  Physical crossed check #{disbursement.check_number} is ready for claiming!
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Bank: <span className="font-semibold text-slate-800">{disbursement.bank_name || "Partner Bank"}</span>{" "}
                  • Payee:{" "}
                  <span className="font-semibold text-slate-800">
                    {disbursement.check_payee || "University Cashier"}
                  </span>
                  . Claim your check at the coordinator office, hand it to the university cashier, and upload your
                  printed Official Receipt (OR).
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => onSubmitOR(disbursement)}
              className="h-10 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-2 shrink-0 shadow-xs"
            >
              <Camera className="size-4" />
              <span>Submit Official Receipt</span>
            </Button>
          </div>
        )}

        {disbursement.status === "OR_SUBMITTED" && (
          <div className="p-4 bg-[#0a4f42]/10 border border-[#0a4f42]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#0a4f42] text-white shrink-0 mt-0.5">
                <FileCheck className="size-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-navy text-sm">Official Receipt #{disbursement.or_number} Submitted</p>
                <p className="text-slate-600 mt-0.5">
                  The coordinator is reviewing your receipt against the check amount to reconcile your tuition payment.
                </p>
              </div>
            </div>
            {disbursement.or_document?.file_url && (
              <a
                href={disbursement.or_document.file_url}
                target="_blank"
                rel="noreferrer"
                className="h-9 px-3.5 rounded-xl border border-line bg-white text-xs font-bold text-navy hover:bg-tint flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <FileText className="size-3.5" />
                <span>View Uploaded Receipt</span>
                <ExternalLink className="size-3 ml-0.5" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
