"use client";

import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface DialogFooterBarProps {
  isReadOnly: boolean;
  isMismatch?: boolean;
  submitting: boolean;
  disabled?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function DialogFooterBar({
  isReadOnly,
  isMismatch,
  submitting,
  disabled,
  onClose,
  onSubmit,
}: DialogFooterBarProps) {
  return (
    <DialogFooter className="shrink-0 border-t border-border bg-white px-4 py-3 sm:px-6 sm:py-3.5">
      <div className="flex w-full flex-col-reverse items-stretch justify-between gap-2.5 sm:flex-row sm:items-center sm:gap-3">
        <p className="text-center text-[0.7rem] text-muted-foreground sm:text-left sm:text-xs">
          {isMismatch ? (
            <span className="flex items-center justify-center gap-1 font-medium text-destructive sm:justify-start">
              <Info className="size-3.5 shrink-0" />
              Invalid document type for your year level.
            </span>
          ) : isReadOnly ? (
            <span className="flex items-center justify-center gap-1 sm:justify-start">
              <Info className="size-3.5 shrink-0" />
              Document confirmed and locked.
            </span>
          ) : (
            <span>Confirming submits these grades for verification.</span>
          )}
        </p>

        <div
          className={`grid gap-2 sm:flex sm:items-center ${isReadOnly ? "grid-cols-1 sm:w-auto" : "grid-cols-2 sm:w-auto"}`}
        >
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs! text-navy sm:h-9.5 sm:px-4"
            onClick={onClose}
            disabled={submitting}
          >
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button
              type="button"
              className="h-9 px-3 text-xs! shadow-xs sm:h-9.5 sm:px-5"
              onClick={onSubmit}
              disabled={submitting || disabled}
              title={disabled ? "Please wait for AI extraction to complete or enter grades manually" : undefined}
            >
              <Check className="size-3.5 shrink-0" />
              <span className="truncate">{submitting ? "Saving..." : "Confirm & Submit"}</span>
            </Button>
          )}
        </div>
      </div>
    </DialogFooter>
  );
}
