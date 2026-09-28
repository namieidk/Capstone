"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  acting?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  acting = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md! p-5 sm:p-6 rounded-2xl overflow-hidden">
        <DialogHeader className="pr-8 sm:pr-0 text-left">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5.5" />
            </span>
            <div className="w-full min-w-0 flex-1">
              <DialogTitle className="text-base sm:text-lg font-bold text-navy leading-snug wrap-break-word">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground wrap-anywhere">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 mt-4 sm:mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto h-11 text-sm! text-navy font-medium"
            onClick={() => onOpenChange(false)}
            disabled={acting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-auto h-11 px-5 text-sm! font-medium"
            onClick={onConfirm}
            disabled={acting}
          >
            {acting ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
