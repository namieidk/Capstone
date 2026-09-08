"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Applicant, Stage } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ScholarDocument } from "@/lib/api/documents";
import { ApplicantDocumentsList } from "./ApplicantDocumentsList";
import { acceptWarning, formatGwa, getStageVariant, gwaSourceTitle } from "./applicant-helpers";
import { DocumentVerifyDialog } from "./DocumentVerifyDialog";

interface ApplicantDialogProps {
  applicant: Applicant | null;
  acting: boolean;
  actionError: string | null;
  onClose: () => void;
  onMoveStage: (id: number, stage: Stage, rejectionReason?: string) => void;
  onStagesChanged: (id: number, stage: Stage) => void;
}

export function ApplicantDialog({
  applicant,
  acting,
  actionError,
  onClose,
  onMoveStage,
  onStagesChanged,
}: ApplicantDialogProps) {
  const [confirmingReject, setConfirmingReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const [docsToken, setDocsToken] = useState(0);
  const [verifyingDoc, setVerifyingDoc] = useState<ScholarDocument | null>(null);

  function handleClose() {
    setConfirmingReject(false);
    setRejectReason("");
    setConfirmingAccept(false);
    setVerifyingDoc(null);
    onClose();
  }

  function handleVerifyDone(stage?: Stage) {
    setVerifyingDoc(null);
    setDocsToken((t) => t + 1);
    if (applicant && stage) onStagesChanged(applicant.id, stage);
  }

  return (
    <>
      <Dialog open={applicant !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-lg!">
          <DialogHeader>
            <DialogTitle className="text-lg!">{applicant?.name}</DialogTitle>
            <DialogDescription className="text-sm!">
              {applicant ? `${applicant.course} · ${applicant.year}` : ""}
            </DialogDescription>
          </DialogHeader>
          {applicant && (
            <div className="flex flex-col gap-4">
              <Badge variant={getStageVariant(applicant.stage)} className="h-6 w-fit px-2.5 text-xs!">
                {applicant.stage}
              </Badge>
              <Separator />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Track</dt>
                  <dd className="font-medium">{applicant.track}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">GWA</dt>
                  <dd className="font-medium tabular-nums" title={gwaSourceTitle(applicant.gwaSource)}>
                    {applicant.gwa !== null ? formatGwa(applicant.gwa) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Applied</dt>
                  <dd className="font-medium">{applicant.applied}</dd>
                </div>
                <div>
                  <dt className="mb-0.5 text-muted-foreground">Initials</dt>
                  <dd className="font-medium">{applicant.initials}</dd>
                </div>
              </dl>
              <Separator />
              <div>
                <p className="mb-1.5 text-sm font-medium text-muted-foreground">Documents uploaded by student</p>
                <ApplicantDocumentsList
                  applicationId={applicant.id}
                  refreshToken={docsToken}
                  onVerify={setVerifyingDoc}
                />
              </div>
              {actionError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{actionError}</p>
              )}
              <div className="flex flex-col gap-2">
                {applicant.stage !== "Interview" &&
                  applicant.stage !== "Endorsed" &&
                  applicant.stage !== "Accepted" && (
                    <Button
                      type="button"
                      className="h-11 text-sm!"
                      disabled={acting}
                      onClick={() => onMoveStage(applicant.id, "Interview")}
                    >
                      Pass to Interview
                      <ArrowRight className="size-4" />
                    </Button>
                  )}
                {applicant.stage === "Interview" && !confirmingAccept && (
                  <Button
                    type="button"
                    className="h-11 text-sm!"
                    disabled={acting}
                    onClick={() => {
                      const warning = acceptWarning(applicant.hasInterview, applicant.interviewAt);
                      if (warning) setConfirmingAccept(true);
                      else onMoveStage(applicant.id, "Endorsed");
                    }}
                  >
                    Accept applicant
                    <ArrowRight className="size-4" />
                  </Button>
                )}
                {confirmingAccept && (
                  <>
                    <p className="rounded-md bg-warn-bg px-3 py-2.5 text-sm text-warn">
                      {acceptWarning(applicant.hasInterview, applicant.interviewAt)} Proceed with endorsement anyway?
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
                        onClick={() => onMoveStage(applicant.id, "Endorsed")}
                      >
                        Proceed anyway
                      </Button>
                    </div>
                  </>
                )}
                {applicant.stage !== "Rejected" &&
                  applicant.stage !== "Accepted" &&
                  applicant.stage !== "Endorsed" &&
                  !confirmingReject && (
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
    </>
  );
}
