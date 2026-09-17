"use client";

import { Banknote, Calendar, Receipt } from "lucide-react";
import type { BillingBreakdown } from "@/lib/api/enrollment";

interface BillingAssessmentSummaryProps {
  totalAssessment: number;
  assessmentDate?: string;
  billingBreakdown?: BillingBreakdown;
  onChangeTotalAssessment?: (val: number) => void;
  onChangeAssessmentDate?: (val: string) => void;
  onChangeBreakdown?: (breakdown: BillingBreakdown) => void;
  isReadOnly?: boolean;
}

export function BillingAssessmentSummary({
  totalAssessment,
  assessmentDate,
  billingBreakdown = {},
  onChangeTotalAssessment,
  onChangeAssessmentDate,
  onChangeBreakdown,
  isReadOnly,
}: BillingAssessmentSummaryProps) {
  const formatCurrency = (amount?: number) => {
    if (amount == null || Number.isNaN(amount)) return "PHP 0.00";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const handleBreakdownUpdate = (field: keyof BillingBreakdown, val: number) => {
    if (!onChangeBreakdown || isReadOnly) return;
    const updated = { ...billingBreakdown, [field]: val };
    onChangeBreakdown(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#0a4f42]" />
            Tuition Assessment & Billing Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified financial breakdown extracted from official Statement of Account (SOA)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Assessment Date:</span>
          {isReadOnly ? (
            <span className="text-slate-900 font-bold">{assessmentDate || "Not stated"}</span>
          ) : (
            <input
              type="date"
              value={assessmentDate || ""}
              onChange={(e) => onChangeAssessmentDate?.(e.target.value)}
              className="px-2 py-0.5 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:border-[#0a4f42]"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-emerald-700" />
            Total Balance Due for Disbursement
          </span>
          <div className="mt-2">
            {isReadOnly ? (
              <p className="text-2xl font-black text-[#0a4f42]">{formatCurrency(totalAssessment)}</p>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-700">PHP</span>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={totalAssessment}
                  onChange={(e) => onChangeTotalAssessment?.(Number(e.target.value))}
                  className="w-full text-xl font-black text-[#0a4f42] bg-white px-2.5 py-1 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a4f42]/20"
                />
              </div>
            )}
            <p className="text-[11px] text-emerald-700/80 mt-1 font-medium">
              Exact balance to be endorsed to Grantor disbursement queue upon approval
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-slate-50/80 border border-slate-200/80 rounded-xl p-4">
          <span className="text-xs font-bold text-slate-700 block mb-2.5">Assessment Ledger Breakdown</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Tuition Fee</span>
              {isReadOnly ? (
                <span className="font-semibold text-slate-800">{formatCurrency(billingBreakdown.tuition_fee)}</span>
              ) : (
                <input
                  type="number"
                  value={billingBreakdown.tuition_fee ?? ""}
                  placeholder="0.00"
                  onChange={(e) => handleBreakdownUpdate("tuition_fee", Number(e.target.value))}
                  className="w-full px-2 py-0.5 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-none focus:border-[#0a4f42]"
                />
              )}
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Laboratory Fees</span>
              {isReadOnly ? (
                <span className="font-semibold text-slate-800">{formatCurrency(billingBreakdown.lab_fees)}</span>
              ) : (
                <input
                  type="number"
                  value={billingBreakdown.lab_fees ?? ""}
                  placeholder="0.00"
                  onChange={(e) => handleBreakdownUpdate("lab_fees", Number(e.target.value))}
                  className="w-full px-2 py-0.5 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-none focus:border-[#0a4f42]"
                />
              )}
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Misc & Other Fees</span>
              {isReadOnly ? (
                <span className="font-semibold text-slate-800">{formatCurrency(billingBreakdown.misc_fees)}</span>
              ) : (
                <input
                  type="number"
                  value={billingBreakdown.misc_fees ?? ""}
                  placeholder="0.00"
                  onChange={(e) => handleBreakdownUpdate("misc_fees", Number(e.target.value))}
                  className="w-full px-2 py-0.5 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-none focus:border-[#0a4f42]"
                />
              )}
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Previous Balance</span>
              {isReadOnly ? (
                <span className="font-semibold text-slate-800">
                  {formatCurrency(billingBreakdown.previous_balance)}
                </span>
              ) : (
                <input
                  type="number"
                  value={billingBreakdown.previous_balance ?? ""}
                  placeholder="0.00"
                  onChange={(e) => handleBreakdownUpdate("previous_balance", Number(e.target.value))}
                  className="w-full px-2 py-0.5 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-none focus:border-[#0a4f42]"
                />
              )}
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Discounts / Grants</span>
              {isReadOnly ? (
                <span className="font-semibold text-emerald-700">{formatCurrency(billingBreakdown.discounts)}</span>
              ) : (
                <input
                  type="number"
                  value={billingBreakdown.discounts ?? ""}
                  placeholder="0.00"
                  onChange={(e) => handleBreakdownUpdate("discounts", Number(e.target.value))}
                  className="w-full px-2 py-0.5 border border-slate-200 rounded-md font-medium text-emerald-700 focus:outline-none focus:border-[#0a4f42]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
