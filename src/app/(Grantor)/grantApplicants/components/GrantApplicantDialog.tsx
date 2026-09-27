"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  Eye,
  FileSignature,
  FileText,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ApplicantDocumentsList } from "@/app/(Coordinator)/CoordinatorApplicants/components/ApplicantDocumentsList";
import { ApplicantEligibilityBanner } from "@/app/(Coordinator)/CoordinatorApplicants/components/ApplicantEligibilityBanner";
import {
  acceptWarning,
  formatGwa,
  getStageVariant,
  gwaSourceTitle,
} from "@/app/(Coordinator)/CoordinatorApplicants/components/applicant-helpers";
import { DocumentVerifyDialog } from "@/app/(Coordinator)/CoordinatorApplicants/components/DocumentVerifyDialog";
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
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { type Contract, listContracts } from "@/lib/api/contracts";
import type { ScholarDocument } from "@/lib/api/documents";
import { CreateContractDialog } from "./CreateContractDialog";

interface GrantApplicantDialogProps {
  applicant: Applicant | null;
  acting: boolean;
  actionError: string | null;
  onClose: () => void;
  onMoveStage: (id: number, stage: Stage, rejectionReason?: string, confirmWithoutMeeting?: boolean) => void;
  onStagesChanged: (id: number, stage: Stage) => void;
  onMeetingScheduled: () => void;
}

const SECTION_LABEL = "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80";

function DetailItem({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground" title={title}>
        {value}
      </p>
    </div>
  );
}

export function GrantApplicantDialog({
  applicant,
  acting,
  actionError,
  onClose,
  onMoveStage,
  onStagesChanged,
  onMeetingScheduled,
}: GrantApplicantDialogProps) {
  const [confirmingReject, setConfirmingReject] = useState(false);
  const [confirmingReopen, setConfirmingReopen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [acceptWarningText, setAcceptWarningText] = useState<string | null>(null);
  const [docsToken, setDocsToken] = useState(0);
  const [verifyingDoc, setVerifyingDoc] = useState<ScholarDocument | null>(null);
  const [loadedDocs, setLoadedDocs] = useState<ScholarDocument[] | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [creatingContract, setCreatingContract] = useState(false);
  const [existingContract, setExistingContract] = useState<Contract | null>(null);
  const [loadingContract, setLoadingContract] = useState(false);

  // Fetch existing contracts whenever the applicant's profile changes
  useEffect(() => {
    if (!applicant?.profileId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExistingContract(null);
      return;
    }
    let isMounted = true;
    setLoadingContract(true);
    listContracts()
      .then((contracts) => {
        if (isMounted) {
          const found = contracts.find((c) => c.scholar_profile_id === applicant.profileId);
          setExistingContract(found ?? null);
        }
      })
      .catch((err) => {
        console.error("Failed to load existing contract:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingContract(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applicant?.profileId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: applicant.id and applicant.stage intentionally reset dialog confirmation state on applicant or stage change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadedDocs(null);
    setAcceptWarningText(null);
    setConfirmingReject(false);
    setConfirmingReopen(false);
    setRejectReason("");
    setScheduling(false);
    setCreatingContract(false);
  }, [applicant?.id, applicant?.stage]);

  function handleClose() {
    setConfirmingReject(false);
    setConfirmingReopen(false);
    setRejectReason("");
    setAcceptWarningText(null);
    setVerifyingDoc(null);
    setLoadedDocs(null);
    setScheduling(false);
    setCreatingContract(false);
    onClose();
  }

  function handleVerifyDone(stage?: Stage) {
    setVerifyingDoc(null);
    setDocsToken((t) => t + 1);
    if (applicant && stage) onStagesChanged(applicant.id, stage);
  }

  function handleScheduleSuccess() {
    setScheduling(false);
    onMeetingScheduled();
  }

  const isDocsLoading = loadedDocs === null;
  const hasNoDocs = loadedDocs !== null ? loadedDocs.length === 0 : (applicant?.documentsCount ?? 0) === 0;
  const hasConfirmedDocs = Boolean(
    loadedDocs?.some((d) => d.status === "STUDENT_CONFIRMED" || d.status === "VERIFIED"),
  );
  const canSchedule = Boolean(applicant) && (applicant?.stage === "Endorsed" || applicant?.stage === "Interview");

  return (
    <>
      <Sheet open={!!applicant} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-6xl!" showCloseButton={false}>
          {applicant && (
            <>
              {/* Drawer Header */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileText className="size-4.5" />
                    </span>
                    <h2 className="text-base font-semibold text-foreground">{applicant.name}</h2>
                    <Badge variant={getStageVariant(applicant.stage)} className="h-6 rounded-full px-2.5 text-xs! font-medium">
                      {applicant.stage}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {applicant.course} · {applicant.year} · Applied on {applicant.applied}
                  </p>
                </div>

                <SheetClose asChild>
                  <button
                    type="button"
                    className="shrink-0 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4.5" />
                  </button>
                </SheetClose>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-12">
                {/* Left: Documents Panel */}
                <div className="flex h-full flex-col overflow-hidden border-b border-border/70 lg:col-span-5 lg:border-b-0 lg:border-r">
                  <div className="flex shrink-0 items-center justify-between border-b border-border/70 bg-card px-5 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <FileText className="size-3.5 text-muted-foreground" />
                      Documents uploaded by student
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {loadedDocs?.length ?? applicant?.documentsCount ?? 0}{" "}
                      {(loadedDocs?.length ?? applicant?.documentsCount ?? 0) === 1 ? "document" : "documents"}
                    </span>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto p-5">
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
                <div className="flex h-full flex-col overflow-hidden lg:col-span-7">
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-5 p-6">
                    {(applicant.stage === "Submitted" || applicant.stage === "Under review") && (
                      <>
                        {hasNoDocs && !isDocsLoading && (
                          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>Cannot pass applicant to interview: No documents have been submitted yet.</span>
                          </div>
                        )}
                        {!hasNoDocs && !hasConfirmedDocs && !isDocsLoading && (
                          <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300">
                            <AlertCircle className="size-4 shrink-0" />
                            <span>
                              Cannot pass applicant to interview: Submitted document(s) have not been confirmed by the
                              applicant yet (awaiting student review).
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {/* Academic & Institution Information */}
                    <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
                      <p className={SECTION_LABEL}>Academic & Institution Details</p>
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                        <DetailItem label="Scholarship Track" value={applicant.track || "—"} />
                        <DetailItem label="Course of Study" value={applicant.course || "—"} />
                        <DetailItem label="Current Year Level" value={applicant.year || "—"} />
                        <DetailItem
                          label="General Weighted Average (GWA)"
                          value={applicant.gwa !== null ? formatGwa(applicant.gwa) : "—"}
                          title={gwaSourceTitle(applicant.gwaSource)}
                        />
                        <DetailItem label="School Name" value={applicant.schoolName || "—"} />
                        <div className="sm:col-span-2 md:col-span-1">
                          <DetailItem label="School Address" value={applicant.schoolAddress || "—"} />
                        </div>
                      </dl>
                    </div>

                    {/* Personal, Contact & Affiliation Details */}
                    <div className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
                      <p className={SECTION_LABEL}>Personal, Contact & Affiliation Details</p>
                      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <DetailItem label="Student Number" value={applicant.studentNumber || "—"} />
                        <DetailItem label="Phone Number" value={applicant.phoneNumber || "—"} />
                        <DetailItem label="Home Address" value={applicant.studentAddress || "—"} />
                        <DetailItem label="Relative Employed By Partner" value={applicant.relativeEmployee || "None / N/A"} />
                      </dl>
                    </div>

                    {/* Scholarship Agreement / Contract */}
                    {applicant.stage === "Accepted" && (
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="flex items-start gap-3.5 sm:items-center">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              {loadingContract ? (
                                <Loader2 className="size-5 animate-spin" />
                              ) : (
                                <FileSignature className="size-5" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-foreground">Scholarship Agreement</h4>
                                {existingContract && (
                                  <Badge
                                    variant="outline"
                                    className={`rounded-full text-[0.65rem]! font-semibold ${
                                      existingContract.status === "SIGNED"
                                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                        : "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                    }`}
                                  >
                                    {existingContract.status === "SIGNED" ? "Signed & Active" : "Awaiting Signature"}
                                  </Badge>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {existingContract
                                  ? `Contract #${existingContract.contract_number} has been generated (${existingContract.status === "SIGNED" ? "Signed by student" : "Awaiting student signature"}).`
                                  : "Application is approved. You can now issue the digital scholarship contract."}
                              </p>
                              {existingContract?.effective_date && (
                                <p className="mt-1 text-[0.7rem] text-muted-foreground">
                                  Effective: {existingContract.effective_date}
                                  {existingContract.expiry_date ? ` · Expiry: ${existingContract.expiry_date}` : ""}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {existingContract ? (
                              <>
                                {(existingContract.signed_document_url || existingContract.document_url) && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1 rounded-lg text-xs! font-medium"
                                    onClick={() =>
                                      window.open(
                                        existingContract.signed_document_url || existingContract.document_url || "",
                                        "_blank",
                                      )
                                    }
                                  >
                                    <Eye className="size-3.5" />
                                    <span>View PDF</span>
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  className="h-8 gap-1 rounded-lg text-xs! font-medium"
                                  onClick={() => setCreatingContract(true)}
                                >
                                  <FileSignature className="size-3.5" />
                                  <span>Re-issue</span>
                                </Button>
                              </>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                className="h-9 gap-1.5 rounded-lg text-xs! font-semibold shadow-xs"
                                onClick={() => setCreatingContract(true)}
                              >
                                <FileSignature className="size-3.5" />
                                <span>Issue Contract</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Endorsed / Interview Stage Status Info */}
                    {(applicant.stage === "Interview" || applicant.stage === "Endorsed") && (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-foreground">
                        <div className="flex items-center gap-2.5">
                          <CalendarClock className="size-4 shrink-0 text-primary" />
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
                            ) : applicant.stage === "Endorsed" ? (
                              <>
                                Applicant is <strong>Endorsed by Coordinator</strong> (ready for Grantor interview &
                                review)
                              </>
                            ) : (
                              <>
                                Applicant is in <strong>Interview Stage</strong> (no meeting scheduled yet)
                              </>
                            )}
                          </span>
                        </div>
                        {applicant.hasInterview && (
                          <Badge variant="outline" className="rounded-full border-primary/30 bg-card text-[0.65rem]! text-primary">
                            Scheduled
                          </Badge>
                        )}
                      </div>
                    )}
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="sticky bottom-0 flex justify-end bg-background px-6 py-4">
                    <div className="flex w-full flex-col items-end gap-2">
                    {actionError && (
                      <p className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive">
                        {actionError}
                      </p>
                    )}

                    {canSchedule && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 min-w-[180px] rounded-xl text-xs! font-medium"
                        disabled={acting}
                        onClick={() => setScheduling(true)}
                      >
                        <CalendarClock className="size-3.5" />
                        {applicant.hasInterview ? "Reschedule meeting" : "Schedule meeting"}
                      </Button>
                    )}

                    {/* Only pre-endorsement stages can Pass to Interview */}
                    {(applicant.stage === "Submitted" || applicant.stage === "Under review") && (
                      <Button
                        type="button"
                        className="h-9 min-w-[180px] rounded-xl text-xs! font-medium"
                        disabled={acting || isDocsLoading || hasNoDocs || !hasConfirmedDocs}
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
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}

                    {(applicant.stage === "Interview" || applicant.stage === "Endorsed") && (
                      <Button
                        type="button"
                        className="h-9 min-w-[180px] rounded-xl text-xs! font-medium"
                        disabled={acting}
                        onClick={() => {
                          const warning = acceptWarning(applicant.hasInterview, applicant.interviewAt);
                          if (warning) {
                            setAcceptWarningText(warning);
                          } else {
                            onMoveStage(applicant.id, "Accepted");
                          }
                        }}
                      >
                        Accept applicant
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}

                    {applicant.stage !== "Rejected" && applicant.stage !== "Accepted" && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="h-9 min-w-[180px] rounded-xl text-xs! font-medium"
                        disabled={acting}
                        onClick={() => setConfirmingReject(true)}
                      >
                        Reject application
                      </Button>
                    )}

                    {/* Reopen Application (e.g. after successful inquiry) */}
                    {applicant.stage === "Rejected" && (
                      <div className="flex w-full flex-col items-stretch justify-between gap-3 rounded-xl border border-border/70 bg-card p-3.5 sm:flex-row sm:items-center">
                        <div className="text-xs text-muted-foreground">
                          <p className="font-semibold text-foreground">Application is currently marked as Rejected</p>
                          <p className="mt-0.5">
                            If an applicant inquiry or clarification was accepted, you can reopen this application for
                            evaluation.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-8 shrink-0 gap-1.5 rounded-xl border-primary/30 px-3.5 text-xs! font-semibold text-primary hover:bg-primary/5"
                          disabled={acting}
                          onClick={() => setConfirmingReopen(true)}
                        >
                          <RotateCcw className="size-3.5" />
                          <span>Reopen Application</span>
                        </Button>
                      </div>
                    )}

                    {applicant.stage === "Accepted" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 rounded-xl text-xs! font-medium"
                          onClick={() => handleClose()}
                        >
                          Close
                        </Button>
                        <Button
                          type="button"
                          className="h-9 gap-1.5 rounded-xl text-xs! font-semibold"
                          onClick={() => setCreatingContract(true)}
                        >
                          <FileSignature className="size-3.5" />
                          <span>{existingContract ? "Re-issue Contract" : "Issue Scholarship Contract"}</span>
                        </Button>
                      </div>
                    )}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Accept Safeguard Alert Dialog */}
      <AlertDialog open={acceptWarningText !== null} onOpenChange={(open) => !open && setAcceptWarningText(null)}>
        <AlertDialogContent className="max-w-md rounded-2xl p-6">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-6" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-foreground">Proceed with Approval?</AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
              {acceptWarningText} Are you sure you want to approve this applicant without a scheduled interview?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2.5">
            <AlertDialogCancel className="h-10 rounded-xl text-sm! font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-10 rounded-xl px-4 text-sm! font-medium"
              onClick={async () => {
                if (applicant) {
                  setAcceptWarningText(null);
                  await onMoveStage(applicant.id, "Accepted", undefined, true);
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
            <DialogTitle className="text-lg font-semibold text-foreground">Reject Application</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              You can optionally provide remarks or feedback explaining this evaluation decision.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="rounded-xl border border-border/70 bg-card p-4 text-xs text-muted-foreground">
              <p className="mb-1 font-semibold text-foreground">Standard notification message to applicant:</p>
              <p className="leading-relaxed italic">
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
              className="min-h-24 rounded-xl text-sm!"
              aria-label="Optional rejection reason"
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl text-sm! font-medium"
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
              className="h-10 rounded-xl text-sm! font-medium"
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
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RotateCcw className="size-6" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-foreground">Reopen Application?</AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to reopen the application for <strong>{applicant?.name}</strong>? This will return
              their application to active review (&ldquo;Under review&rdquo;) and clear the previous rejection record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row justify-end gap-2.5">
            <AlertDialogCancel className="h-10 rounded-xl text-sm! font-medium">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-10 rounded-xl px-4 text-sm! font-medium"
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
      <CreateContractDialog
        applicant={applicant}
        existingContract={existingContract}
        open={creatingContract}
        onOpenChange={setCreatingContract}
        onContractCreated={(contract) => {
          setExistingContract(contract);
        }}
      />
    </>
  );
}