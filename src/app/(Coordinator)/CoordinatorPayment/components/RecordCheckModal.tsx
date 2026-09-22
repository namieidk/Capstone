"use client";

import { AlertCircle, CheckCircle2, CreditCard, Loader2, Lock, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type DisbursementItem, recordCoordinatorCheckIssuance } from "@/lib/api/disbursements";

interface RecordCheckModalProps {
  disbursement: DisbursementItem | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_BANKS = [
  "Land Bank of the Philippines",
  "BDO Unibank, Inc.",
  "Bank of the Philippine Islands (BPI)",
  "Metropolitan Bank & Trust Co. (Metrobank)",
  "Development Bank of the Philippines (DBP)",
  "Security Bank Corporation",
  "Philippine National Bank (PNB)",
  "UnionBank of the Philippines",
];

export function RecordCheckModal({ disbursement, open, onClose, onSuccess }: RecordCheckModalProps) {
  const [bankName, setBankName] = useState(COMMON_BANKS[0]);
  const [customBank, setCustomBank] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [voucherNumber, setVoucherNumber] = useState(disbursement?.voucher_number || "");
  const [dateIssued, setDateIssued] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open || !disbursement) return null;

  const scholarName = `${disbursement.scholar_profile?.first_name || ""} ${disbursement.scholar_profile?.last_name || ""}`;
  const lockedPayee = disbursement.check_payee || disbursement.scholar_profile?.school_name || "University Cashier";

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkNumber.trim()) {
      toast.error("Please enter the physical check number.");
      return;
    }

    const finalBank = bankName === "OTHER" ? customBank.trim() : bankName;
    if (!finalBank) {
      toast.error("Please enter or select the bank name.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await recordCoordinatorCheckIssuance(disbursement.disbursement_id, {
        check_number: checkNumber.trim(),
        bank_name: finalBank,
        voucher_number: voucherNumber.trim() || undefined,
        date_issued: dateIssued,
        payment_method: "DIRECT_TO_SCHOOL_CHECK",
        remarks: remarks.trim() || undefined,
      });
      toast.success(res.message || "Check issuance recorded successfully.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record check issuance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-line w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard className="size-5 text-[#0a4f42]" />
            <h2 className="text-base font-bold text-navy">Record Check Issuance</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tuition Amount Banner */}
          <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-navy">{scholarName}</p>
              <p className="text-[11px] text-muted-foreground">
                AY {disbursement.academic_year} • {disbursement.semester}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0a4f42]">SOA Tuition Balance</p>
              <p className="text-lg font-black text-[#0a4f42] tabular-nums font-mono">
                {formatCurrency(Number(disbursement.amount))}
              </p>
            </div>
          </div>

          {/* Locked Institutional Payee Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700">Payee Entity</Label>
              <Badge
                variant="outline"
                className="text-[10px] bg-slate-100 text-slate-600 border-slate-300 gap-1 font-semibold"
              >
                <Lock className="size-2.5" />
                Locked to School Institution
              </Badge>
            </div>
            <Input
              value={lockedPayee}
              disabled
              className="h-9.5 rounded-xl border-slate-200 bg-slate-100/80 text-xs font-bold text-slate-800 cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground">
              Direct-to-school settlement strictly prohibits issuing checks to personal accounts.
            </p>
          </div>

          {/* Bank Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Drawee Bank Name</Label>
            <Select value={bankName} onValueChange={setBankName}>
              <SelectTrigger className="h-9.5 rounded-xl border-line bg-white text-xs font-semibold">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank} className="text-xs">
                    {bank}
                  </SelectItem>
                ))}
                <SelectItem value="OTHER" className="text-xs font-semibold">
                  Other Bank...
                </SelectItem>
              </SelectContent>
            </Select>

            {bankName === "OTHER" && (
              <Input
                placeholder="Enter bank name..."
                value={customBank}
                onChange={(e) => setCustomBank(e.target.value)}
                className="h-9 rounded-xl border-line bg-white text-xs mt-1.5"
                required
              />
            )}
          </div>

          {/* Check Number & Date Issued Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Check Serial Number</Label>
              <Input
                placeholder="e.g. CHK-2026-0814"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                className="h-9.5 rounded-xl border-line bg-white text-xs font-mono font-semibold"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Date Issued</Label>
              <Input
                type="date"
                value={dateIssued}
                onChange={(e) => setDateIssued(e.target.value)}
                className="h-9.5 rounded-xl border-line bg-white text-xs font-semibold"
                required
              />
            </div>
          </div>

          {/* Optional Voucher Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Disbursement Voucher # (Optional)</Label>
            <Input
              placeholder="e.g. DV-2026-0001 (Leave blank if not applicable)"
              value={voucherNumber}
              onChange={(e) => setVoucherNumber(e.target.value)}
              className="h-9.5 rounded-xl border-line bg-white text-xs font-mono"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Coordinator Notes (Optional)</Label>
            <Textarea
              placeholder="e.g., Check signed and ready for scholar handover at Matina office..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              className="rounded-xl border-line bg-white text-xs resize-none"
            />
          </div>

          {/* Crossed Check Notice */}
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-900">
            <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Ensure physical check is crossed with <strong>&quot;Account Payee Only&quot;</strong> before handing over
              to scholar for university cashier remittance.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 rounded-xl border-line text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="h-9 rounded-xl bg-[#0a4f42] hover:bg-[#083c32] text-white text-xs font-bold px-5 gap-1.5"
            >
              {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              <span>Save & Issue Check</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
