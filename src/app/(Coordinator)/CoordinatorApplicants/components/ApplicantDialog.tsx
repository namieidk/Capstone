/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { AlertCircle, AlertTriangle, ArrowRight, CalendarClock, FileText, RotateCcw, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ScholarDocument } from "@/lib/api/documents";
import { ApplicantDocumentsList } from "./ApplicantDocumentsList";
import { ApplicantEligibilityBanner } from "./ApplicantEligibilityBanner";
import { acceptWarning, formatGwa, getStageVariant, gwaSourceTitle } from "./applicant-helpers";
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
  const [confirmingReopen, setConfirmingReopen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [acceptWarningText, setAcceptWarningText] = useState<string | null>(null);
  const [docsToken, setDocsToken] = useState(0);
  const [verifyingDoc, setVerifyingDoc] = useState<ScholarDocument | null>(null);
  const [loadedDocs, setLoadedDocs] = useState<ScholarDocument[] | null>(null);
  const [scheduling, setScheduling] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: applicant.id and applicant.stage intentionally reset dialog confirmation state on applicant or stage change
  useEffect(() => {
    setLoadedDocs(null);
    setAcceptWarningText(null);
    setConfirmingReject(false);
    setConfirmingReopen(false);
    setRejectReason("");
    setScheduling(false);
  }, [applicant?.id, applicant?.stage, applicant?.documentsCount]);

  function handleClose() {
    setConfirmingReject(false);
    setConfirmingReopen(false);
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

  if (!applicant) return null;

  const isDocsLoading = loadedDocs === null;
  const hasNoDocs = loadedDocs !== null ? loadedDocs.length === 0 : (applicant?.documentsCount ?? 0) === 0;
  const hasConfirmedDocs = Boolean(
    loadedDocs?.some((d) => d.status === "STUDENT_CONFIRMED" || d.status === "VERIFIED"),
  );
  const canPassToInterview = !isDocsLoading && !hasNoDocs && hasConfirmedDocs;
  const isPastInterview =
    (applicant?.stage as string) === "Endorsed" ||
    (applicant?.stage as string) === "Accepted" ||
    (applicant?.stage as string) === "Approved" ||
    (applicant?.stage as string) === "Scholar" ||
    (applicant?.stage as string) === "Rejected";
  const canSchedule = Boolean(applicant) && !isPastInterview && applicant?.stage === "Interview";

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity"
        onClick={handleClose}
      >
        <div
          className="w-full max-w-6xl bg-slate-50 h-full flex flex-col shadow-2xl overflow-hidden border-l border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <FileText className="size-5 text-[#0a4f42]" />
                <h2 className="text-lg font-bold text-slate-900">{applicant.name}</h2>
                <Badge variant={getStageVariant(applicant.stage)} className="h-6 px-2.5 text-xs!">
                  {applicant.stage}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {applicant.course} · {applicant.year} · Applied on {applicant.applied}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Documents Panel */}
            <div className="lg:col-span-5 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 shrink-0">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <FileText className="size-3.5" />
                  Documents uploaded by student
                </span>
                <span className="text-xs text-slate-500">
                  {loadedDocs?.length ?? applicant?.documentsCount ?? 0}{" "}
                  {(loadedDocs?.length ?? applicant?.documentsCount ?? 0) === 1 ? "document" : "documents"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <ApplicantEligibilityBanner
                  applicant={applicant}
                  documents={loadedDocs}
                  onInspectDocument={setVerifyingDoc}
                />

                <ApplicantDocumentsList
                  applicationId={applicant.id}
                  refreshToken={docsToken}
                  onVerify={setVerifyingDoc}
                  onDocumentsLoaded={setLoadedDocs}
                />
              </div>
            </div>

            {/* Right: Applicant Details & Actions */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-white">
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Academic & Institution Information */}
                <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Academic & Institution Details
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">Scholarship Track</dt>
                      <dd className="font-medium text-foreground">{applicant.track || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Course of Study</dt>
                      <dd className="font-medium text-foreground">{applicant.course || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Current Year Level</dt>
                      <dd className="font-medium text-foreground">{applicant.year || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">General Weighted Average (GWA)</dt>
                      <dd
                        className="font-medium tabular-nums text-foreground"
                        title={gwaSourceTitle(applicant.gwaSource)}
                      >
                        {applicant.gwa !== null ? formatGwa(applicant.gwa) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">School Name</dt>
                      <dd className="font-medium text-foreground">{applicant.schoolName || "—"}</dd>
                    </div>
                    <div className="sm:col-span-2 md:col-span-1">
                      <dt className="text-xs text-muted-foreground">School Address</dt>
                      <dd className="font-medium text-foreground">{applicant.schoolAddress || "—"}</dd>
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
                      <dt className="text-xs text-muted-foreground">Student Number</dt>
                      <dd className="font-medium text-foreground">{applicant.studentNumber || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Phone Number</dt>
                      <dd className="font-medium text-foreground">{applicant.phoneNumber || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Home Address</dt>
                      <dd className="font-medium text-foreground">{applicant.studentAddress || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Relative Employed By Partner</dt>
                      <dd className="font-medium text-foreground">{applicant.relativeEmployee || "None / N/A"}</dd>
                    </div>
                  </dl>
                </div>

                <Separator />

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
                              {new Date(applicant.interviewAt).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </strong>
                          </>
                        ) : (
                          <>
                            Applicant is in <strong>Interview Stage</strong> (no meeting scheduled yet)
                          </>
                        )}
                      </span>
                    </div>
                    {applicant.hasInterview && (
                      <Badge variant="outline" className="border-navy/30 bg-white text-navy text-[0.65rem]!">
                        Scheduled
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3.5 flex flex-col gap-2">
                {actionError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{actionError}</p>
                )}

                {/* Schedule / Reschedule Meeting button */}
                {canSchedule && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 text-sm!"
                    disabled={acting}
                    onClick={() => setScheduling(true)}
                  >
                    <CalendarClock className="size-4" />
                    {applicant.hasInterview ? "Reschedule meeting" : "Schedule meeting"}
                  </Button>
                )}

                {/* Pass to Interview button (only in Submitted or Under review stages) */}
                {(applicant.stage === "Submitted" || applicant.stage === "Under review") && (
                  <div className="flex flex-col gap-2">
                    {hasNoDocs && !isDocsLoading && (
                      <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                        <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>Cannot pass applicant to interview: No documents have been submitted yet.</span>
                      </div>
                    )}
                    {!hasNoDocs && !hasConfirmedDocs && !isDocsLoading && (
                      <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                        <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span>
                          Cannot pass applicant to interview: Submitted document(s) have not been confirmed by the
                          applicant yet (awaiting student review).
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
                      const warning = acceptWarning(applicant.hasInterview, applicant.interviewAt);
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
                {applicant.stage !== "Rejected" && applicant.stage !== "Accepted" && applicant.stage !== "Endorsed" && (
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

                {/* Reopen Application (e.g. after successful inquiry) */}
                {applicant.stage === "Rejected" && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-3">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold text-navy">Application is currently marked as Rejected</p>
                      <p>
                        If an applicant inquiry or clarification was accepted, you can reopen this application for
                        evaluation.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 px-4 text-xs! font-semibold border-navy/30 text-navy hover:bg-navy/5 shrink-0 gap-1.5"
                      disabled={acting}
                      onClick={() => setConfirmingReopen(true)}
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Reopen Application</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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