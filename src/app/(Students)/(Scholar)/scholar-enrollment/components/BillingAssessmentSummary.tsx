"use client";

import { Banknote, Calendar, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Card className="shadow-xs border-border/80">
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Receipt className="size-4 text-emerald-700" />
              Tuition Assessment & Billing Ledger
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Verified financial breakdown extracted from official Statement of Account (SOA)
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Calendar className="size-3.5 text-muted-foreground" />
            <span>Assessment Date:</span>
            {isReadOnly ? (
              <Badge variant="outline" className="text-xs font-bold text-foreground">
                {assessmentDate || "Not stated"}
              </Badge>
            ) : (
              <Input
                type="date"
                value={assessmentDate || ""}
                onChange={(e) => onChangeAssessmentDate?.(e.target.value)}
                className="h-8 w-36 text-xs"
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-emerald-50/60 border-emerald-200/70 p-4 flex flex-col justify-between shadow-none">
            <span className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
              <Banknote className="size-4 text-emerald-700" />
              Total Balance Due for Disbursement
            </span>
            <div className="mt-2">
              {isReadOnly ? (
                <p className="text-2xl font-black text-emerald-800">{formatCurrency(totalAssessment)}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground">PHP</span>
                  <Input
                    type="number"
                    step="100"
                    min="0"
                    value={totalAssessment}
                    onChange={(e) => onChangeTotalAssessment?.(Number(e.target.value))}
                    className="text-lg font-black text-emerald-800 bg-white border-emerald-300 h-9"
                  />
                </div>
              )}
              <p className="text-[11px] text-emerald-800/80 mt-1 font-medium">
                Exact balance to be endorsed to Grantor disbursement queue upon approval
              </p>
            </div>
          </Card>

          <Card className="md:col-span-2 bg-muted/30 border-border/80 p-4 shadow-none">
            <span className="text-xs font-bold text-foreground block mb-2.5">Assessment Ledger Breakdown</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-medium">Tuition Fee</Label>
                {isReadOnly ? (
                  <p className="font-semibold text-foreground">{formatCurrency(billingBreakdown.tuition_fee)}</p>
                ) : (
                  <Input
                    type="number"
                    value={billingBreakdown.tuition_fee ?? ""}
                    placeholder="0.00"
                    onChange={(e) => handleBreakdownUpdate("tuition_fee", Number(e.target.value))}
                    className="h-8 text-xs font-medium"
                  />
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-medium">Laboratory Fees</Label>
                {isReadOnly ? (
                  <p className="font-semibold text-foreground">{formatCurrency(billingBreakdown.lab_fees)}</p>
                ) : (
                  <Input
                    type="number"
                    value={billingBreakdown.lab_fees ?? ""}
                    placeholder="0.00"
                    onChange={(e) => handleBreakdownUpdate("lab_fees", Number(e.target.value))}
                    className="h-8 text-xs font-medium"
                  />
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-medium">Misc & Other Fees</Label>
                {isReadOnly ? (
                  <p className="font-semibold text-foreground">{formatCurrency(billingBreakdown.misc_fees)}</p>
                ) : (
                  <Input
                    type="number"
                    value={billingBreakdown.misc_fees ?? ""}
                    placeholder="0.00"
                    onChange={(e) => handleBreakdownUpdate("misc_fees", Number(e.target.value))}
                    className="h-8 text-xs font-medium"
                  />
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-medium">Previous Balance</Label>
                {isReadOnly ? (
                  <p className="font-semibold text-foreground">{formatCurrency(billingBreakdown.previous_balance)}</p>
                ) : (
                  <Input
                    type="number"
                    value={billingBreakdown.previous_balance ?? ""}
                    placeholder="0.00"
                    onChange={(e) => handleBreakdownUpdate("previous_balance", Number(e.target.value))}
                    className="h-8 text-xs font-medium"
                  />
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-medium">Discounts / Grants</Label>
                {isReadOnly ? (
                  <p className="font-semibold text-emerald-700">{formatCurrency(billingBreakdown.discounts)}</p>
                ) : (
                  <Input
                    type="number"
                    value={billingBreakdown.discounts ?? ""}
                    placeholder="0.00"
                    onChange={(e) => handleBreakdownUpdate("discounts", Number(e.target.value))}
                    className="h-8 text-xs font-medium text-emerald-700"
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
