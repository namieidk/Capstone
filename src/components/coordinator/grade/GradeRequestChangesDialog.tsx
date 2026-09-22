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

interface GradeRequestChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function GradeRequestChangesDialog({
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onConfirm,
  isSubmitting,
}: GradeRequestChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="size-5 text-amber-600" />
            Request Grade Document Correction
          </DialogTitle>
          <DialogDescription className="text-xs">
            Notify the scholar to re-upload their Certified Copy of Grades (CCG) or correct extracted subject entries.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label htmlFor="grade-audit-notes" className="text-xs font-semibold text-slate-700">
            Correction Instructions for Scholar <span className="text-rose-500">*</span>
          </label>
          <Textarea
            id="grade-audit-notes"
            placeholder="e.g., The official seal on your CCG is cropped. Please re-upload a clear scan showing the complete registrar stamp."
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-24 text-xs"
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isSubmitting || !notes.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold gap-1.5"
          >
            {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : null}
            <span>Send Correction Request</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
