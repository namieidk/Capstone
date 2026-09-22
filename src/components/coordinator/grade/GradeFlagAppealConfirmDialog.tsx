"use client";

import { AlertTriangle, FileText, Loader2, ShieldAlert } from "lucide-react";
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

interface GradeFlagAppealConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarName: string;
  failedCount: number;
  failedSubjectsText: string;
  isGwaDeficient: boolean;
  computedGwa: number;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function GradeFlagAppealConfirmDialog({
  open,
  onOpenChange,
  scholarName,
  failedCount,
  failedSubjectsText,
  isGwaDeficient,
  computedGwa,
  notes,
  onNotesChange,
  onConfirm,
  isSubmitting,
}: GradeFlagAppealConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-900">
            <ShieldAlert className="size-5 text-rose-600" />
            Certify Academic Deficiency & Flag for Appeal
          </DialogTitle>
          <DialogDescription className="text-xs">
            Certify this grade audit for {scholarName}. This will record the transcript grades and invite the scholar to
            file an academic second chance appeal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Summary Box */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 space-y-1.5 text-xs text-rose-900">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <AlertTriangle className="size-4 text-rose-600 shrink-0" />
              <span>Academic Deficiencies Identified</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700 pl-1">
              {failedCount > 0 && (
                <li>
                  <span className="font-semibold">{failedCount} Failed Subject(s):</span> {failedSubjectsText}
                </li>
              )}
              {isGwaDeficient && (
                <li>
                  <span className="font-semibold">GWA Below Retention:</span> {computedGwa.toFixed(2)} does not meet the
                  required standard.
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <FileText className="size-3.5 text-navy" />
              <span>What happens next?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              1. The scholar's grade report is marked as <span className="font-semibold text-rose-700">FLAGGED</span>.
              <br />
              2. The scholar is notified and prompted to submit an{" "}
              <span className="font-semibold text-navy">Academic Second Chance Appeal</span> on their dashboard.
              <br />
              3. The Grantor reviews their appeal justification to grant or deny probationary continuation.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="grade-flag-notes" className="text-xs font-semibold text-slate-700">
              Coordinator Audit Notes / Guidance <span className="text-muted-foreground text-[10px]">(Optional)</span>
            </label>
            <Textarea
              id="grade-flag-notes"
              placeholder="e.g., Student encountered family emergency during midterms. Advised to attach formal medical/family letter in their second chance appeal."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="min-h-20 text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl text-xs sm:text-sm font-semibold border-slate-200"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="h-10 px-6 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-bold gap-2 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                Recording & Flagging...
              </>
            ) : (
              "Confirm & Flag for Appeal"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
