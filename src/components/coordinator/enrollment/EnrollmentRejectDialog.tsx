"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface EnrollmentRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: string;
  onNotesChange: (val: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function EnrollmentRejectDialog({
  open,
  onOpenChange,
  notes,
  onNotesChange,
  onConfirm,
  isSubmitting,
}: EnrollmentRejectDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md rounded-2xl p-6">
        <AlertDialogHeader className="space-y-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <AlertCircle className="size-5" />
          </div>
          <AlertDialogTitle className="text-base font-bold text-slate-900">Reject Term Enrollment?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500">
            Are you sure you want to reject this term enrollment submission? The scholar will be notified. You can
            provide an explanation below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-2">
          <label htmlFor="reject-notes" className="text-xs font-semibold text-slate-700">
            Reason for Rejection (Optional)
          </label>
          <Textarea
            id="reject-notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="e.g. Ineligible enrollment load or invalid document credentials."
            className="min-h-24 rounded-xl border-line bg-white text-xs leading-relaxed placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-rose-500/30"
          />
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel
            disabled={isSubmitting}
            className="h-9 rounded-xl border-line text-xs font-semibold text-slate-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isSubmitting}
            className="h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold gap-1.5"
          >
            {isSubmitting ? <Loader2 className="size-3.5 animate-spin" /> : null}
            <span>Confirm Rejection</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
