"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GrantorContact } from "@/lib/api/chat";
import { getInitials } from "./chat-utils";

interface GrantorRequestDialogProps {
  grantor: GrantorContact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { grantor_user_id: number; reason: string; subject?: string }) => Promise<void>;
}

export function GrantorRequestDialog({ grantor, open, onOpenChange, onSubmit }: GrantorRequestDialogProps) {
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!grantor) return null;

  const grantorName = `${grantor.first_name} ${grantor.last_name}`.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({
        grantor_user_id: grantor.user_id,
        reason: reason.trim(),
        subject: subject.trim() || undefined,
      });
      setSubject("");
      setReason("");
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <DialogHeader className="gap-1 border-b border-line/60 pb-3">
          <DialogTitle className="text-base font-bold text-navy">Request Message Access</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Scholars require permission before directly messaging Grantors. Please specify your topic or reason for
            reaching out.
          </DialogDescription>
        </DialogHeader>

        {/* Grantor Profile Card */}
        <div className="flex items-center gap-3 rounded-xl border border-line/60 bg-[#F9FBFB] p-3 my-1">
          <Avatar className="size-11 ring-1 ring-border/50">
            <AvatarFallback className="bg-purple-100 text-purple-900 font-bold text-xs">
              {getInitials(grantorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-navy text-xs truncate">{grantorName}</p>
              <Badge
                variant="outline"
                className="rounded-sm bg-purple-50 text-purple-700 border-purple-200 text-[0.62rem] px-1 py-0 font-semibold"
              >
                Grantor
              </Badge>
            </div>
            <p className="text-[0.7rem] text-muted-foreground truncate">
              {grantor.title} • {grantor.department}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div>
            <Label htmlFor="req-subject" className="text-xs font-semibold text-navy">
              Subject (Optional)
            </Label>
            <Input
              id="req-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Inquiry regarding thesis project grant"
              className="mt-1 h-9 rounded-xl border-line text-xs"
            />
          </div>

          <div>
            <Label htmlFor="req-reason" className="text-xs font-semibold text-navy">
              Reason / Message Details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="req-reason"
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context on why you would like to converse with this grantor..."
              className="mt-1 rounded-xl border-line text-xs min-h-20"
            />
          </div>

          <DialogFooter className="gap-2 sm:justify-end pt-2 border-t border-line/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8.5 rounded-full px-4 text-xs font-medium"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!reason.trim() || submitting}
              className="h-8.5 gap-1.5 rounded-full bg-navy px-4 text-xs font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  Submit Request <Send className="size-3" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
