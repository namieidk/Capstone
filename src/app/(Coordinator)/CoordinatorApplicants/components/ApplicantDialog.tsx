"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ScholarDocument } from "@/lib/api/documents";
import { ApplicantDocumentsList } from "./ApplicantDocumentsList";
import { ApplicantEligibilityBanner } from "./ApplicantEligibilityBanner";
import {
  acceptWarning,
  formatGwa,
  getStageVariant,
  gwaSourceTitle,
} from "./applicant-helpers";
import { DocumentVerifyDialog } from "./DocumentVerifyDialog";

interface ApplicantDialogProps {
  applicant: Applicant | null;
  acting: boolean;
  actionError: string | null;
  onClose: () => void;
  onMoveStage: (
    id: number,
    stage: Stage,
    rejectionReason?: string,
    confirmWithoutMeeting?: boolean,
  ) => Promise<void> | void;
  onStagesChanged: (id: number, stage: Stage) => void;
  onMeetingScheduled?: () => void;
}

export function ApplicantDialog({
  applicant,
  acting,
  actionError,
  onClose,
  onMoveStage,
  onStagesChanged,
  onMeetingScheduled,
}: ApplicantDialogProps) {
  const [confirmingReject, setConfirmingReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [acceptWarningText, setAcceptWarningText] = useState<string | null>(
    null,
  );
  const [docsToken, setDocsToken] = useState(0);
  const [verifyingDoc, setVerifyingDoc] = useState<ScholarDocument | null>(
    null,
  );
  const [loadedDocs, setLoadedDocs] = useState<ScholarDocument[] | null>(null);
  const [scheduling, setScheduling] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: applicant.id and applicant.stage intentionally reset dialog confirmation state on applicant or stage change
  useEffect(() => {
    setLoadedDocs(null);
    setAcceptWarningText(null);
    setConfirmingReject(false);
    setRejectReason("");
    setScheduling(false);
  }, [applicant?.id, applicant?.stage, applicant?.documentsCount]);

  function handleClose() {
    setConfirmingReject(false);
    setRejectReason("");
    setAcceptWarningText(null);
    setVerifyingDoc(null);
    setLoadedDocs(null);
    setScheduling(false);
    onClose();
  }

  function handleVerifyDone(stage?: Stage) {
    setVerifyingDoc(null);
    setDocsToken((t) => t + 1);
    if (applicant && stage) onStagesChanged(applicant.id, stage);
  }

  function handleScheduleSuccess() {
    setScheduling(false);
    if (applicant) {
      onStagesChanged(applicant.id, "Interview");
    }
    onMeetingScheduled?.();
  }

  const isDocsLoading = loadedDocs === null;
  const hasNoDocs =
    loadedDocs !== null
      ? loadedDocs.length === 0
      : (applicant?.documentsCount ?? 0) === 0;
  const hasConfirmedDocs = Boolean(
    loadedDocs?.some(
      (d) => d.status === "STUDENT_CONFIRMED" || d.status === "VERIFIED",
    ),
  );
  const canPassToInterview = !isDocsLoading && !hasNoDocs && hasConfirmedDocs;
  const isPastInterview =
    (applicant?.stage as string) === "Endorsed" ||
    (applicant?.stage as string) === "Accepted" ||
    (applicant?.stage as string) === "Approved" ||
    (applicant?.stage as string) === "Scholar" ||
    (applicant?.stage as string) === "Rejected";
  const canSchedule =
    Boolean(applicant) && !isPastInterview && applicant?.stage === "Interview";

  return (
    <>
      <Dialog
        open={applicant !== null}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] max-w-3xl! flex-col gap-0 overflow-hidden p-0 rounded-2xl sm:max-w-3xl!">
          <DialogHeader className="shrink-0 border-b border-border bg-white px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <DialogTitle className="text-xl! font-semibold">
                {applicant?.name}
              </DialogTitle>
              {applicant && (
                <Badge
                  variant={getStageVariant(applicant.stage)}
                  className="h-6 px-2.5 text-xs!"
                >
                  {applicant.stage}
                </Badge>
              )}
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              {applicant
                ? `${applicant.course} · ${applicant.year} · Applied on ${applicant.applied}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {applicant && (
            <>
              <ScrollArea className="flex-1 min-h-0">
                <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
                  {/* Academic Eligibility Banner */}
                  <ApplicantEligibilityBanner
                    applicant={applicant}
                    documents={loadedDocs}
                    onInspectDocument={setVerifyingDoc}
                  />

                  {/* Academic & Institution Information */}
                  <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Academic & Institution Details
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Scholarship Track
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.track || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Course of Study
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.course || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Current Year Level
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.year || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          General Weighted Average (GWA)
                        </dt>
                        <dd
                          className="font-medium tabular-nums text-foreground"
                          title={gwaSourceTitle(applicant.gwaSource)}
                        >
                          {applicant.gwa !== null
                            ? formatGwa(applicant.gwa)
                            : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          School Name
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.schoolName || "—"}
                        </dd>
                      </div>
                      <div className="sm:col-span-2 md:col-span-1">
                        <dt className="text-xs text-muted-foreground">
                          School Address
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.schoolAddress || "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Personal, Contact & Affiliation Details */}
                  <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Personal, Contact & Affiliation Details
                    </h3>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Student Number
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.studentNumber || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Phone Number
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.phoneNumber || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Home Address
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.studentAddress || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Relative Employed By Partner
                        </dt>
                        <dd className="font-medium text-foreground">
                          {applicant.relativeEmployee || "None / N/A"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <Separator />

                  {/* Documents Section */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        Documents uploaded by student
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {loadedDocs?.length ?? applicant?.documentsCount ?? 0}{" "}
                        {(loadedDocs?.length ??
                          applicant?.documentsCount ??
                          0) === 1
                          ? "document"
                          : "documents"}
                      </span>
                    </div>
                    <ApplicantDocumentsList
                      applicationId={applicant.id}
                      refreshToken={docsToken}
                      onVerify={setVerifyingDoc}
                      onDocumentsLoaded={setLoadedDocs}
                    />
                  </div>
                </div>
              </ScrollArea>

              {/* Action Buttons Footer */}
              <div className="shrink-0 border-t border-border bg-white px-5 py-3.5 sm:px-6 flex flex-col gap-2">
                {actionError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {actionError}
                  </p>
                )}

                {/* Interview Stage Status Info */}
                {applicant.stage === "Interview" && (
                  <div className="flex items-center justify-between rounded-lg border border-navy/20 bg-navy/5 px-3.5 py-2 text-xs text-navy">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="size-4 shrink-0 text-navy" />
                      <span>
                        {applicant.hasInterview && applicant.interviewAt ? (
                          <>
                            Interview scheduled on{" "}
                            <strong>
                              {new Date(applicant.interviewAt).toLocaleString(
                                undefined,
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                },
                              )}
                            </strong>
                          </>
                        ) : (
                          <>
                            Applicant is in <strong>Interview Stage</strong> (no
                            meeting scheduled yet)
                          </>
                        )}
                      </span>
                    </div>
                    {applicant.hasInterview && (
                      <Badge
                        variant="outline"
                        className="border-navy/30 bg-white text-navy text-[0.65rem]!"
                      >
                        Scheduled
                      </Badge>
                    )}
                  </div>
                )}

                {/* Schedule / Reschedule Meeting button inside ApplicantDialog */}
                {canSchedule && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 text-sm!"
                    disabled={acting}
                    onClick={() => setScheduling(true)}
                  >
                    <CalendarClock className="size-4" />
                    {applicant.hasInterview
                      ? "Reschedule meeting"
                      : "Schedule meeting"}
                  </Button>
                )}

                {/* Pass to Interview button */}
                {applicant.stage !== "Interview" &&
                  applicant.stage !== "Endorsed" &&
                  applicant.stage !== "Accepted" && (
                    <div className="flex flex-col gap-2">
                      {hasNoDocs && !isDocsLoading && (
                        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                          <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span>
                            Cannot pass applicant to interview: No documents
                            have been submitted yet.
                          </span>
                        </div>
                      )}
                      {!hasNoDocs && !hasConfirmedDocs && !isDocsLoading && (
                        <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                          <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span>
                            Cannot pass applicant to interview: Submitted
                            document(s) have not been confirmed by the applicant
                            yet (awaiting student review).
                          </span>
                        </div>
                      )}
                      <Button
                        type="button"
                        className="h-10 text-sm!"
                        disabled={acting || !canPassToInterview}
                        title={
                          hasNoDocs
                            ? "Applicant has not submitted any documents yet"
                            : !hasConfirmedDocs
                              ? "Applicant must review and confirm their document first"
                              : undefined
                        }
                        onClick={async () => {
                          try {
                            await onMoveStage(applicant.id, "Interview");
                            setScheduling(true);
                          } catch {
                            // Handled by actionError in parent
                          }
                        }}
                      >
                        Pass to Interview
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  )}

                {/* Accept / Endorse Applicant button */}
                {applicant.stage === "Interview" && (
                  <Button
                    type="button"
                    className="h-10 text-sm!"
                    disabled={acting}
                    onClick={() => {
                      const warning = acceptWarning(
                        applicant.hasInterview,
                        applicant.interviewAt,
                      );
                      if (warning) {
                        setAcceptWarningText(warning);
                      } else {
                        onMoveStage(applicant.id, "Endorsed");
                      }
                    }}
                  >
                    Accept applicant
                    <ArrowRight className="size-4" />
                  </Button>
                )}

                {/* Reject Application */}
                {applicant.stage !== "Rejected" &&
                  applicant.stage !== "Accepted" &&
                  applicant.stage !== "Endorsed" && (
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-10 text-sm!"
                      disabled={acting}
                      onClick={() => setConfirmingReject(true)}
                    >
                      Reject application
                    </Button>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Accept Safeguard Alert Dialog */}
      <AlertDialog
        open={acceptWarningText !== null}
        onOpenChange={(open) => !open && setAcceptWarningText(null)}
      >
        <AlertDialogContent className="max-w-md rounded-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <AlertTriangle className="size-6" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-navy">
              Proceed with Endorsement?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
              {acceptWarningText} Are you sure you want to advance this
              applicant without a completed interview?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2">
            <AlertDialogCancel className="h-10 rounded-lg text-sm!">
              Cancel
            </AlertDialogCancel>
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
      <Dialog
        open={confirmingReject}
        onOpenChange={(open) => !open && setConfirmingReject(false)}
      >
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-navy">
              Reject Application
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Please provide a reason for rejecting this application. This
              feedback will be recorded.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="Rejection reason (required)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-24 text-sm!"
              aria-label="Rejection reason"
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
              disabled={acting || rejectReason.trim() === ""}
              onClick={() => {
                if (applicant) {
                  onMoveStage(applicant.id, "Rejected", rejectReason.trim());
                  setConfirmingReject(false);
                }
              }}
            >
              Confirm rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DocumentVerifyDialog
        document={verifyingDoc}
        applicantName={applicant?.name ?? ""}
        open={verifyingDoc !== null}
        onOpenChange={(open) => !open && setVerifyingDoc(null)}
        onDone={handleVerifyDone}
      />
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
