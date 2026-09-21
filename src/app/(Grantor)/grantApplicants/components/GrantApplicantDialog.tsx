"use client";

import { AlertCircle, ArrowRight, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplicantDocumentsList } from "@/app/(Coordinator)/CoordinatorApplicants/components/ApplicantDocumentsList";
import {
  acceptWarning,
  formatGwa,
  getStageVariant,
  gwaSourceTitle,
} from "@/app/(Coordinator)/CoordinatorApplicants/components/applicant-helpers";
import { DocumentVerifyDialog } from "@/app/(Coordinator)/CoordinatorApplicants/components/DocumentVerifyDialog";
import { ScheduleMeetingDialog } from "@/app/(Grantor)/grantMeeting/components/ScheduleMeetingDialog";
import type { Applicant, Stage } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ScholarDocument } from "@/lib/api/documents";
import { ProvideContractForm } from "./ProvideContractForm";

interface GrantApplicantDialogProps {
  applicant: Applicant | null;
  acting: boolean;
  actionError: string | null;
  onClose: () => void;
  onMoveStage: (id: number, stage: Stage, rejectionReason?: string, confirmWithoutMeeting?: boolean) => void;
  onStagesChanged: (id: number, stage: Stage) => void;
  onMeetingScheduled: () => void;
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
  const [rejectReason, setRejectReason] = useState("");
  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const [docsToken, setDocsToken] = useState(0);
  const [verifyingDoc, setVerifyingDoc] = useState<ScholarDocument | null>(null);
  const [loadedDocs, setLoadedDocs] = useState<ScholarDocument[] | null>(null);
  const [scheduling, setScheduling] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: applicant.id and applicant.stage intentionally reset dialog confirmation state on applicant or stage change
  useEffect(() => {
    setLoadedDocs(null);
    setConfirmingAccept(false);
    setConfirmingReject(false);
    setRejectReason("");
    setScheduling(false);
  }, [applicant?.id, applicant?.stage]);

  function handleClose() {
    setConfirmingReject(false);
    setRejectReason("");
    setConfirmingAccept(false);
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
    onMeetingScheduled();
  }

  const isDocsLoading = loadedDocs === null;
  const hasNoDocs = loadedDocs !== null ? loadedDocs.length === 0 : (applicant?.documentsCount ?? 0) === 0;
  const hasConfirmedDocs = Boolean(
    loadedDocs?.some((d) => d.status === "STUDENT_CONFIRMED" || d.status === "VERIFIED"),
  );
  const canPassToInterview = !isDocsLoading && !hasNoDocs && hasConfirmedDocs;
  const isPastInterview =
    applicant?.stage === "Endorsed" ||
    applicant?.stage === "Accepted" ||
    applicant?.stage === "Rejected";
  const canSchedule =
    Boolean(applicant) && !isPastInterview && (applicant?.stage === "Interview" || applicant?.stage === "Under review");

  return (
    <>
      <Dialog open={applicant !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-y-auto sm:max-w-3xl!">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <DialogTitle className="text-xl! font-semibold">{applicant?.name}</DialogTitle>
              {applicant && (
                <Badge variant={getStageVariant(applicant.stage)} className="h-6 px-2.5 text-xs!">
                  {applicant.stage}
                </Badge>
              )}
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              {applicant ? `${applicant.course} · ${applicant.year} · Applied on ${applicant.applied}` : ""}
            </DialogDescription>
          </DialogHeader>

          {applicant && (
            <div className="flex flex-col gap-5 pt-1">
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
              <div>
                <p className="mb-1.5 text-sm font-medium text-muted-foreground">Documents uploaded by student</p>
                <ApplicantDocumentsList
                  applicationId={applicant.id}
                  refreshToken={docsToken}
                  onVerify={setVerifyingDoc}
                  onDocumentsLoaded={setLoadedDocs}
                />
              </div>
              {actionError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{actionError}</p>
              )}
              <div className="flex flex-col gap-2">
                {canSchedule && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 text-sm!"
                    disabled={acting}
                    onClick={() => setScheduling(true)}
                  >
                    <CalendarClock className="size-4" />
                    {applicant.hasInterview ? "Reschedule meeting" : "Schedule meeting"}
                  </Button>
                )}
                {applicant.stage !== "Interview" && applicant.stage !== "Accepted" && (
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
                      className="h-11 text-sm!"
                      disabled={acting || !canPassToInterview}
                      title={
                        hasNoDocs
                          ? "Applicant has not submitted any documents yet"
                          : !hasConfirmedDocs
                            ? "Applicant must review and confirm their document first"
                            : undefined
                      }
                      onClick={() => onMoveStage(applicant.id, "Interview")}
                    >
                      Pass to Interview
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                )}
                {(applicant.stage === "Interview" || applicant.stage === "Endorsed") && !confirmingAccept && (
                  <Button
                    type="button"
                    className="h-11 text-sm!"
                    disabled={acting}
                    onClick={() => {
                      const warning = acceptWarning(applicant.hasInterview, applicant.interviewAt);
                      if (warning) setConfirmingAccept(true);
                      else onMoveStage(applicant.id, "Accepted");
                    }}
                  >
                    Accept applicant
                    <ArrowRight className="size-4" />
                  </Button>
                )}
                {(applicant.stage === "Interview" || applicant.stage === "Endorsed") && confirmingAccept && (
                  <>
                    <p className="rounded-md bg-warn-bg px-3 py-2.5 text-sm text-warn">
                      {acceptWarning(applicant.hasInterview, applicant.interviewAt)} Proceed with approval anyway?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 flex-1 text-sm!"
                        disabled={acting}
                        onClick={() => setConfirmingAccept(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="h-11 flex-1 text-sm!"
                        disabled={acting}
                        onClick={async () => {
                          setConfirmingAccept(false);
                          await onMoveStage(applicant.id, "Accepted", undefined, true);
                        }}
                      >
                        Proceed anyway
                      </Button>
                    </div>
                  </>
                )}
                {applicant.stage !== "Rejected" && applicant.stage !== "Accepted" && !confirmingReject && (
                  <Button
                    type="button"
                    variant="destructive"
                    className="h-11 text-sm!"
                    disabled={acting}
                    onClick={() => setConfirmingReject(true)}
                  >
                    Reject application
                  </Button>
                )}
                {confirmingReject && (
                  <>
                    <Textarea
                      placeholder="Rejection reason (required)"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="min-h-20 text-sm!"
                      aria-label="Rejection reason"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 flex-1 text-sm!"
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
                        className="h-11 flex-1 text-sm!"
                        disabled={acting || rejectReason.trim() === ""}
                        onClick={() => onMoveStage(applicant.id, "Rejected", rejectReason.trim())}
                      >
                        Confirm reject
                      </Button>
                    </div>
                  </>
                )}
              </div>
              {applicant.stage === "Accepted" && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-1.5 text-sm font-medium text-muted-foreground">Scholarship contract</p>
                    <ProvideContractForm profileId={applicant.profileId ?? null} />
                  </div>
                </>
              )}
            </div>
          )}
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
