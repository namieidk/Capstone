"use client";

import { CalendarClock, Check, ExternalLink, Eye, FileText } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Application } from "@/lib/api/applications";
import type { ScholarDocument } from "@/lib/api/documents";
import { DocumentReviewDialog } from "./DocumentReviewDialog";
import { appStatusMeta, docStatusMeta, formatDateTime } from "./wizard-helpers";

interface StatusStepProps {
  application: Application | null;
  documents: ScholarDocument[];
  onBackToDocuments: () => void;
}

const TIMELINE_STEPS = ["Application", "Verification", "Interview", "Decision"];

// Derives the current node from backend state (no history endpoint exists).
// Note: stage "Interview" alone (no interview_at yet) still counts as the
// Interview node — the label move is the coordinator declaring the meeting,
// the scheduled date/link card below appears once it exists.
function currentNodeIndex(app: Application, docs: ScholarDocument[]): number {
  if (app.status === "APPROVED" || app.status === "REJECTED") return 3;
  if (app.interview_at || app.stage.toLowerCase().includes("interview")) return 2;
  const verified = docs.some((d) => d.status === "VERIFIED" || d.status === "STUDENT_CONFIRMED");
  if (app.status === "UNDER_REVIEW" || verified || app.stage.toLowerCase().includes("verif")) return 1;
  return 0;
}

export function StatusStep({ application, documents, onBackToDocuments }: StatusStepProps) {
  const [previewDoc, setPreviewDoc] = useState<ScholarDocument | null>(null);

  if (!application) {
    return (
      <Card className="rounded-[18px]! border-border bg-white shadow-xs">
        <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
          <p className="text-base font-semibold text-navy">No application yet</p>
          <p className="text-sm text-muted-foreground">Submit your application first to track it here.</p>
        </CardContent>
      </Card>
    );
  }

  const meta = appStatusMeta(application.status);
  const current = currentNodeIndex(application, documents);

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-[18px]! border-border bg-white shadow-xs">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg! text-navy">Application status</CardTitle>
              <CardDescription className="text-sm!">
                Submitted {formatDateTime(application.submitted_at)}
                {application.stage ? ` · Currently: ${application.stage}` : ""}
              </CardDescription>
            </div>
            <Badge variant={meta.variant} className="h-7 px-3 text-xs!">
              {meta.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="flex items-start">
            {TIMELINE_STEPS.map((label, i) => {
              const done = i < current || application.status === "APPROVED";
              const active = i === current && application.status !== "APPROVED";
              const failed = i === current && application.status === "REJECTED";
              return (
                <li key={label} className="flex flex-1 items-start last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`flex size-9 items-center justify-center rounded-full text-sm font-bold ${
                        done
                          ? "bg-navy! text-white!"
                          : active
                            ? "bg-amber! text-navy!"
                            : failed
                              ? "bg-destructive! text-white!"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="size-4" /> : <span className="tabular-nums">{i + 1}</span>}
                    </span>
                    <span
                      className={`text-center text-xs ${done || active || failed ? "font-semibold text-navy" : "text-muted-foreground"}`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`mx-1 mt-4 h-0.5 flex-1 rounded-full ${i < current || application.status === "APPROVED" ? "bg-navy" : "bg-border"}`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {application.interview_at ? (
        <Card className="rounded-[18px]! border-border bg-white shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white shadow-xs">
                <CalendarClock className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg! text-navy">Interview scheduled</CardTitle>
                <CardDescription className="text-sm!">{formatDateTime(application.interview_at)}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {application.provider_notes && (
              <p className="text-sm leading-relaxed text-foreground">{application.provider_notes}</p>
            )}
            {application.interview_meeting_link && (
              <Button
                type="button"
                variant="outline"
                className="h-10 self-start text-sm!"
                onClick={() => window.open(application.interview_meeting_link ?? "", "_blank", "noopener")}
              >
                <ExternalLink className="size-4" />
                Open meeting link
              </Button>
            )}
            {application.reschedule_reason && (
              <p className="text-xs text-muted-foreground">Reschedule note: {application.reschedule_reason}</p>
            )}
          </CardContent>
        </Card>
      ) : (
        current === 2 && (
          <Card className="rounded-[18px]! border-border bg-white shadow-xs">
            <CardContent className="flex items-center gap-3 px-6 py-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint text-navy shadow-xs">
                <CalendarClock className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">You are in the interview stage</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Your interview date and meeting link will appear here once confirmed.
                </p>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {application.status === "REJECTED" && (
        <Card className="rounded-[18px]! border-destructive/30 bg-white shadow-xs">
          <CardContent className="px-6 py-5">
            <p className="text-sm font-semibold text-destructive">Application not approved</p>
            {application.rejection_reason && (
              <p className="mt-1 text-sm leading-relaxed text-foreground">{application.rejection_reason}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="rounded-[18px]! border-border bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg! text-navy">Documents ({documents.length})</CardTitle>
          <CardDescription className="text-sm!">Verification progress per file.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {documents.length === 0 ? (
            <p className="py-2 text-sm text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => {
              const dm = docStatusMeta(doc.status);
              return (
                <div
                  key={doc.document_id}
                  className="flex items-center gap-3 rounded-xl border border-border px-3.5 py-2.5"
                >
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-navy">{doc.document_type}</p>
                  <Badge variant={dm.variant} className="h-6 shrink-0 px-2.5 text-xs!">
                    {dm.label}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setPreviewDoc(doc)}
                    title="View document & extracted data"
                    className="text-muted-foreground hover:text-navy"
                  >
                    <Eye className="size-4" />
                  </Button>
                </div>
              );
            })
          )}
          <Separator className="my-1" />
          <div>
            <Button type="button" variant="outline" className="h-10 text-sm! text-navy" onClick={onBackToDocuments}>
              Back to documents
            </Button>
          </div>
        </CardContent>
      </Card>

      <DocumentReviewDialog
        document={previewDoc}
        open={previewDoc !== null}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        onConfirm={async () => {
          // Read-only in StatusStep
        }}
      />
    </div>
  );
}
