"use client";

import type { Stage } from "@/components/Coordinatorshared";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { ScholarDocument } from "@/lib/api/documents";
import { DocumentVerifyContent } from "./DocumentVerifyContent";

export interface DocumentVerifyDialogProps {
  document: ScholarDocument | null;
  applicantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: (stage?: Stage) => void;
}

export function DocumentVerifyDialog({
  document: doc,
  applicantName,
  open,
  onOpenChange,
  onDone,
}: DocumentVerifyDialogProps) {
  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95dvh] max-h-[95dvh] w-[96vw] max-w-6xl! flex-col gap-0 overflow-hidden p-0 rounded-2xl sm:h-auto sm:max-h-[90vh]">
        <DocumentVerifyContent
          document={doc}
          applicantName={applicantName}
          onClose={() => onOpenChange(false)}
          onDone={onDone}
          isMobileDrawer={false}
        />
      </DialogContent>
    </Dialog>
  );
}
