"use client";

import { RotateCcw } from "lucide-react";
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

interface GrantReopenDialogProps {
  open: boolean;
  applicantName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function GrantReopenDialog({ open, applicantName, onClose, onConfirm }: GrantReopenDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="max-w-md rounded-2xl p-6">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy">
            <RotateCcw className="size-6" />
          </div>
          <AlertDialogTitle className="text-lg font-bold text-navy">Reopen Application?</AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
            Are you sure you want to reopen the application for <strong>{applicantName ?? "this applicant"}</strong>?
            This will return their application to active review (&ldquo;Under review&rdquo;) and clear the previous
            rejection record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2">
          <AlertDialogCancel className="h-10 rounded-lg text-sm!">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="h-10 rounded-lg bg-navy px-4 text-sm! font-medium text-white hover:bg-navy/90"
            onClick={onConfirm}
          >
            Confirm Reopen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
