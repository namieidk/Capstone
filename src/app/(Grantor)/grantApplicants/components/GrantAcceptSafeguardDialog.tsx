"use client";

import { AlertTriangle } from "lucide-react";
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

interface GrantAcceptSafeguardDialogProps {
  warningText: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function GrantAcceptSafeguardDialog({
  warningText,
  onClose,
  onConfirm,
}: GrantAcceptSafeguardDialogProps) {
  return (
    <AlertDialog
      open={warningText !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <AlertDialogContent className="max-w-md rounded-2xl p-6">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <AlertTriangle className="size-6" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-navy">
            Proceed with Approval?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
            {warningText} Are you sure you want to approve this applicant without a scheduled interview?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2">
          <AlertDialogCancel className="h-10 rounded-lg text-sm!">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-10 rounded-lg bg-navy px-4 text-sm! font-medium text-white hover:bg-navy/90"
            onClick={onConfirm}
          >
            Proceed anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
