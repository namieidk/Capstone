"use client";

import { ArrowRight, CheckCircle2, Download } from "lucide-react";
import type { Applicant, Stage } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getStageVariant } from "./applicant-helpers";

interface ApplicantDialogProps {
  applicant: Applicant | null;
  onClose: () => void;
  onMoveStage: (id: number, stage: Stage) => void;
}

const DOCUMENTS = ["Grades / TOR", "Proof of employment", "Report card / Form 138"];

export function ApplicantDialog({ applicant, onClose, onMoveStage }: ApplicantDialogProps) {
  return (
    <Dialog open={applicant !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-lg!">
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
                <dd className="font-medium tabular-nums">{applicant.gwa}%</dd>
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
              <p className="mb-1.5 text-sm font-medium text-muted-foreground">Documents on file</p>
              <ul className="flex flex-col gap-2">
                {DOCUMENTS.map((d) => (
                  <li key={d} className="flex items-center gap-2.5 rounded-md bg-muted px-3 py-2.5 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-navy" />
                    <span className="flex-1">{d}</span>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Download ${d}`}>
                      <Download className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              {applicant.stage !== "Interview" && applicant.stage !== "Accepted" && (
                <Button type="button" className="h-11 text-sm!" onClick={() => onMoveStage(applicant.id, "Interview")}>
                  Pass to Interview
                  <ArrowRight className="size-4" />
                </Button>
              )}
              {applicant.stage === "Interview" && (
                <Button type="button" className="h-11 text-sm!" onClick={() => onMoveStage(applicant.id, "Accepted")}>
                  Accept applicant
                  <ArrowRight className="size-4" />
                </Button>
              )}
              {applicant.stage !== "Rejected" && applicant.stage !== "Accepted" && (
                <Button
                  type="button"
                  variant="destructive"
                  className="h-11 text-sm!"
                  onClick={() => onMoveStage(applicant.id, "Rejected")}
                >
                  Reject application
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
