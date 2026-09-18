"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
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

interface EnrollmentRequestChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (val: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function EnrollmentRequestChangesDialog({
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onConfirm,
  isSubmitting,
}: EnrollmentRequestChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-base font-bold text-slate-900">Request Changes from Scholar</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Specify the exact reasons or corrective instructions so the scholar can update their matriculation or
            billing credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label htmlFor="coordinator-notes" className="text-xs font-semibold text-slate-700">
            Coordinator Instructions & Feedback
          </label>
          <Textarea
            id="coordinator-notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="e.g. Please re-upload a clear copy of your Official Statement of Account showing the matriculation assessment date and student number."
            className="min-h-28 rounded-xl border-line bg-white text-xs leading-relaxed placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#0a4f42]/30"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="h-9 rounded-xl border-line text-xs font-semibold text-slate-600"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting || !notes.trim()}
            className="h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-1.5"
          >
            {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : null}
            <span>Send Request</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
