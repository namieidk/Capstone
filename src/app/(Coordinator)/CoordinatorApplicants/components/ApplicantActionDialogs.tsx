"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { ScheduleMeetingDialog } from "@/app/(Grantor)/grantMeeting/components/ScheduleMeetingDialog";
import type { Applicant, Stage } from "@/components/Coordinatorshared";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export interface ApplicantActionDialogsProps {
  applicant: Applicant | null;
  acting: boolean;
  confirmingReject: boolean;
  setConfirmingReject: (open: boolean) => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  confirmingReopen: boolean;
  setConfirmingReopen: (open: boolean) => void;
  acceptWarningText: string | null;
  setAcceptWarningText: (text: string | null) => void;
  scheduling: boolean;
  setScheduling: (open: boolean) => void;
  onMoveStage: (
    id: number,
    stage: Stage,
    rejectionReason?: string,
    confirmWithoutMeeting?: boolean,
  ) => Promise<void> | void;
  handleScheduleSuccess: () => void;
}

export function ApplicantActionDialogs({
  applicant,
  acting,
  confirmingReject,
  setConfirmingReject,
  rejectReason,
  setRejectReason,
  confirmingReopen,
  setConfirmingReopen,
  acceptWarningText,
  setAcceptWarningText,
  scheduling,
  setScheduling,
  onMoveStage,
  handleScheduleSuccess,
}: ApplicantActionDialogsProps) {
  return (
    <>
      {/* Accept Safeguard Alert Dialog */}
      <AlertDialog open={acceptWarningText !== null} onOpenChange={(open) => !open && setAcceptWarningText(null)}>
        <AlertDialogContent className="max-w-md rounded-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <AlertTriangle className="size-6" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-navy">Proceed with Endorsement?</AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
              {acceptWarningText} Are you sure you want to advance this applicant without a completed interview?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2">
            <AlertDialogCancel className="h-10 rounded-lg text-sm!">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-10 rounded-lg bg-navy px-4 text-sm! font-medium text-white hover:bg-navy/90"
              onClick={async () => {
                if (applicant) {
                  setAcceptWarningText(null);
                  await onMoveStage(applicant.id, "Endorsed", undefined, true);
                }
              }}
            >
              Proceed anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Reason Modal Dialog */}
      <Dialog open={confirmingReject} onOpenChange={(open) => !open && setConfirmingReject(false)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-navy">Reject Application</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              You can optionally provide remarks or feedback explaining this evaluation decision.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-navy mb-1">Standard notification message to applicant:</p>
              <p className="italic leading-relaxed">
                &ldquo;Thank you for applying for our scholarship program. After careful evaluation of all submissions,
                your application was not selected for this cycle.&rdquo;
              </p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                If custom remarks are entered below, they will be attached to the applicant&apos;s decision notice.
              </p>
            </div>

            <Textarea
              placeholder="Optional remarks or feedback (e.g. GWA threshold, missing prerequisite)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-24 text-sm!"
              aria-label="Optional rejection reason"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 text-sm!"
              disabled={acting}
              onClick={() => {
                setConfirmingReject(false);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-10 text-sm!"
              disabled={acting}
              onClick={() => {
                if (applicant) {
                  onMoveStage(applicant.id, "Rejected", rejectReason.trim() || undefined);
                  setConfirmingReject(false);
                }
              }}
            >
              Confirm rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reopen Confirmation Alert Dialog */}
      <AlertDialog open={confirmingReopen} onOpenChange={setConfirmingReopen}>
        <AlertDialogContent className="max-w-md rounded-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-navy/10 text-navy">
              <RotateCcw className="size-6" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-navy">Reopen Application?</AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to reopen the application for <strong>{applicant?.name}</strong>? This will return
              their application to active review (&ldquo;Under review&rdquo;) and clear the previous rejection record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2">
            <AlertDialogCancel className="h-10 rounded-lg text-sm!">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-10 rounded-lg bg-navy px-4 text-sm! font-medium text-white hover:bg-navy/90"
              onClick={async () => {
                if (applicant) {
                  setConfirmingReopen(false);
                  await onMoveStage(applicant.id, "Under review");
                }
              }}
            >
              Confirm Reopen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScheduleMeetingDialog
        applicationId={applicant?.id ?? null}
        applicantName={applicant?.name}
        open={scheduling}
        onOpenChange={setScheduling}
        mode={applicant?.hasInterview ? "reschedule" : "schedule"}
        onSuccess={handleScheduleSuccess}
      />
    </>
  );
}
