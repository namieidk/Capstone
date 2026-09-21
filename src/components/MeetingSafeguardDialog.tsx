"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MeetingSafeguardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function MeetingSafeguardDialog({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: MeetingSafeguardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="size-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-navy">Proceed Without Completed Meeting?</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-muted-foreground">
            There is no completed meeting record for this application. Please confirm if you wish to advance the
            applicant without a scheduled or completed meeting.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="rounded-full px-5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-full bg-navy px-5 text-white hover:bg-navy/90"
          >
            {loading ? "Confirming..." : "Confirm & Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
