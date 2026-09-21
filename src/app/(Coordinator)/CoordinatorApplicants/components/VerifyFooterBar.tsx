"use client";

import { Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface VerifyFooterBarProps {
  submitting: boolean;
  requestingChanges: boolean;
  changeReason: string;
  canVerify?: boolean;
  verifyDisabledReason?: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onStartRequestChanges: () => void;
  onCancelRequestChanges: () => void;
  onSendRequestChanges: () => void;
  onVerify: () => void;
}

export function VerifyFooterBar({
  submitting,
  requestingChanges,
  changeReason,
  canVerify = true,
  verifyDisabledReason,
  onReasonChange,
  onClose,
  onStartRequestChanges,
  onCancelRequestChanges,
  onSendRequestChanges,
  onVerify,
}: VerifyFooterBarProps) {
  return (
    <DialogFooter className="shrink-0 flex-col items-stretch gap-2.5 border-t border-border bg-white px-4 py-3 sm:px-6 sm:py-3.5">
      {requestingChanges && (
        <Textarea
          placeholder="Tell the student what is unclear (required)"
          value={changeReason}
          onChange={(e) => onReasonChange(e.target.value)}
          className="min-h-16 text-xs! sm:text-xs!"
          aria-label="Reason for requesting changes"
        />
      )}
      <div className="flex w-full flex-col-reverse items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3">
        <p className="text-center text-[0.7rem] text-muted-foreground sm:text-left sm:text-xs">
          {requestingChanges
            ? "The student will be asked to re-upload this document."
            : !canVerify
              ? (verifyDisabledReason ??
                "The applicant must review and confirm this document before coordinator verification.")
              : "Confirming verifies the grades and updates the application."}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          {requestingChanges ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3 text-xs! text-navy sm:h-9.5 sm:px-4"
                onClick={onCancelRequestChanges}
                disabled={submitting}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="h-9 px-3 text-xs! shadow-xs sm:h-9.5 sm:px-5"
                onClick={onSendRequestChanges}
                disabled={submitting || changeReason.trim() === ""}
              >
                <Undo2 className="size-3.5 shrink-0" />
                <span className="truncate">{submitting ? "Sending..." : "Send request"}</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3 text-xs! text-navy sm:h-9.5 sm:px-4"
                onClick={onClose}
                disabled={submitting}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3 text-xs! text-navy sm:h-9.5 sm:px-4"
                onClick={onStartRequestChanges}
                disabled={submitting}
              >
                <Undo2 className="size-3.5 shrink-0" />
                <span className="truncate">Request changes</span>
              </Button>
              <Button
                type="button"
                className="col-span-2 h-9 px-3 text-xs! shadow-xs sm:col-span-1 sm:h-9.5 sm:px-5"
                onClick={onVerify}
                disabled={submitting || !canVerify}
                title={
                  !canVerify
                    ? (verifyDisabledReason ?? "Applicant must review and confirm their grades before verification.")
                    : undefined
                }
              >
                <Check className="size-3.5 shrink-0" />
                <span className="truncate">
                  {submitting ? "Verifying..." : !canVerify ? "Awaiting Student Confirmation" : "Confirm & Verify"}
                </span>
              </Button>
            </>
          )}
        </div>
      </div>
    </DialogFooter>
  );
}
