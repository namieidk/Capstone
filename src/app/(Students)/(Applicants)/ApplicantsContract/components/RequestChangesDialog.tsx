"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import type { Contract } from "@/lib/api/contracts";
import { requestContractChanges } from "@/lib/api/contracts";

interface RequestChangesDialogProps {
  contract: Contract | null;
  onClose: () => void;
  onSent: () => void;
}

export function RequestChangesDialog({ contract, onClose, onSent }: RequestChangesDialogProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setReason("");
    setError(null);
    onClose();
  }

  async function handleSend() {
    if (!contract || reason.trim().length < 10) return;
    setError(null);
    setSubmitting(true);
    try {
      await requestContractChanges(contract.contract_id, reason.trim());
      onSent();
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={contract !== null} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg sm:max-w-lg!">
        <DialogHeader>
          <DialogTitle className="text-lg!">Request corrections</DialogTitle>
          <DialogDescription className="text-sm!">
            {contract ? `Contract #${contract.contract_number} will stay unsigned until staff revises it.` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Textarea
            placeholder="Describe what is wrong (minimum 10 characters)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-24 text-sm!"
            aria-label="Correction details"
          />
          {error && <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 text-sm!"
              disabled={submitting}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-11 flex-1 text-sm!"
              disabled={submitting || reason.trim().length < 10}
              onClick={handleSend}
            >
              {submitting ? "Sending..." : "Send request"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
