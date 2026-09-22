"use client";

import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface GrantorAppealConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decision: "APPROVED" | "DENIED" | null;
  scholarName: string;
  academicYear: string;
  semester: string;
  computedGwa: number | string;
  decisionNotes: string;
  onDecisionNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function GrantorAppealConfirmDialog({
  open,
  onOpenChange,
  decision,
  scholarName,
  academicYear,
  semester,
  computedGwa,
  decisionNotes,
  onDecisionNotesChange,
  onConfirm,
  isSubmitting,
}: GrantorAppealConfirmDialogProps) {
  if (!decision) return null;

  const isApproved = decision === "APPROVED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-6">
        <DialogHeader className="space-y-1.5">
          <DialogTitle
            className={`flex items-center gap-2 text-base sm:text-lg font-bold ${isApproved ? "text-emerald-950" : "text-rose-950"}`}
          >
            {isApproved ? (
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="size-5 text-rose-600 shrink-0" />
            )}
            <span>
              {isApproved ? "Confirm 1-Semester Probationary Grant" : "Confirm Appeal Denial & Disqualification"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isApproved
              ? `You are approving the Second Chance Appeal for ${scholarName} for ${academicYear} • ${semester}. The scholar will be granted a probationary extension to continue.`
              : `You are about to deny the Second Chance Appeal for ${scholarName} for ${academicYear} • ${semester}. This will terminate scholarship renewal and conclude future disbursements.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 py-2">
          {/* Summary Details Box */}
          <div
            className={`rounded-xl border p-3.5 space-y-2 text-xs ${
              isApproved
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-950"
                : "border-rose-200 bg-rose-50/70 text-rose-950"
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span>Scholar: {scholarName}</span>
              <span>GWA: {Number(computedGwa || 0).toFixed(2)}</span>
            </div>
            <div className="text-[11px] leading-relaxed pt-1 border-t border-current/10 space-y-1">
              {isApproved ? (
                <>
                  <p className="font-medium">
                    ✅ <strong>What happens upon approval:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-emerald-900">
                    <li>Scholar's academic standing status is cleared under probation.</li>
                    <li>Start-of-term enrollment (COR & Assessment uploads) is immediately unlocked.</li>
                    <li>The scholar receives an official verdict notice in chat and email.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-medium text-rose-900">
                    ⚠️ <strong>What happens upon denial:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-rose-800">
                    <li>Scholarship contract is updated to TERMINATED status.</li>
                    <li>Pending tuition disbursements for this scholar are cancelled.</li>
                    <li>Future enrollment and grade submissions remain permanently locked.</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Decision Notes Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm-decision-notes"
              className="text-xs font-bold text-slate-900 flex items-center justify-between"
            >
              <span>{isApproved ? "Probation Terms & Guidance" : "Reason for Denial / Remarks"}</span>
              <span className="text-[10px] text-muted-foreground font-normal">(Included in official verdict)</span>
            </label>
            <Textarea
              id="confirm-decision-notes"
              placeholder={
                isApproved
                  ? "e.g., Granted 1-semester probationary extension. Scholar must achieve minimum 85.00 GWA next term with no failing marks."
                  : "e.g., Retention standards not met after comprehensive review of academic records."
              }
              value={decisionNotes}
              onChange={(e) => onDecisionNotesChange(e.target.value)}
              className="min-h-24 text-xs rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold border-slate-200"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`h-11 px-6 rounded-xl text-xs sm:text-sm font-bold text-white gap-2 shadow-xs ${
              isApproved ? "bg-[#0a4f42] hover:bg-[#083c32]" : "bg-rose-700 hover:bg-rose-800"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1" />
                <span>Processing Verdict...</span>
              </>
            ) : isApproved ? (
              <>
                <CheckCircle2 className="size-4" />
                <span>Confirm & Grant Probation</span>
              </>
            ) : (
              <>
                <ShieldAlert className="size-4" />
                <span>Confirm Denial & Disqualify</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
