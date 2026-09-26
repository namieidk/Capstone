"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface GrantRejectDialogProps {
  open: boolean;
  acting: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export function GrantRejectDialog({ open, acting, onClose, onConfirm }: GrantRejectDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-navy">Reject Application</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            You can optionally provide remarks or feedback explaining this evaluation decision.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-navy mb-1">Standard notification message to applicant:</p>
            <p className="italic leading-relaxed">
              &ldquo;Thank you for applying for our scholarship program. After careful evaluation of all submissions,
              your application was not selected for this cycle.&rdquo;
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              If custom remarks are entered below, they will be attached to the applicant&apos;s decision notice.
            </p>
          </div>

          <Textarea
            placeholder="Optional remarks or feedback (e.g. GWA threshold, missing prerequisite)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-24 text-sm!"
            aria-label="Optional rejection reason"
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" className="h-10 text-sm!" disabled={acting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-10 text-sm!"
            disabled={acting}
            onClick={() => onConfirm(reason.trim() || undefined)}
          >
            Confirm rejection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
