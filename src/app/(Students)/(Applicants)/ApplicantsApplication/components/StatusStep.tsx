"use client";

import {
  AlertCircle,
  ArrowRight,
  Award,
  CalendarClock,
  Clock,
  ExternalLink,
  Eye,
  FileSignature,
  FileText,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
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
  scholarshipTrack?: string;
  currentYearLevel?: number;
  onBackToDocuments: () => void;
}

export function StatusStep({
  application,
  documents,
  scholarshipTrack,
  currentYearLevel,
  onBackToDocuments,
}: StatusStepProps) {
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
  const isApproved = application.status === "APPROVED";
  const isRejected = application.status === "REJECTED";
  const verifiedDocsCount = documents.filter((d) => d.status === "VERIFIED" || d.status === "STUDENT_CONFIRMED").length;

  const gmailInquiryUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=support@viascholar.edu&su=${encodeURIComponent(
    `Scholarship Application Inquiry - Ref #${String(application.application_id).padStart(5, "0")}`,
  )}&body=${encodeURIComponent(
    `Dear Scholarship Committee,\n\nI am writing to respectfully inquire regarding my scholarship application (Ref #${String(application.application_id).padStart(5, "0")}) for the current academic cycle.\n\nThank you for your guidance.\n\nSincerely,\nApplicant`,
  )}`;

  return (
    <div className="flex flex-col gap-5">
      {/* 1. HERO REJECTION DECISION BANNER (Top prominence when REJECTED) */}
      {isRejected && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-destructive/40 bg-linear-to-br from-red-50/70 via-white to-red-50/30 p-6 shadow-md dark:from-red-950/30 dark:via-background dark:to-red-950/10">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 size-32 rounded-full bg-destructive/10 blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-xs ring-4 ring-destructive/10">
                <AlertCircle className="size-7" />
              </div>
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="px-2.5 py-0.5 text-xs font-semibold">
                    Application Unsuccessful
                  </Badge>
                  {application?.decision_at && (
                    <span className="text-xs text-muted-foreground">
                      Decided on {new Date(application.decision_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-navy dark:text-foreground">Application Decision: Not Selected</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Thank you for applying for our scholarship program. After careful evaluation of all submissions, your
                  application was not selected for this cycle.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
              <a href={gmailInquiryUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-11 px-5 text-sm font-semibold border-border/80 text-navy gap-2"
                >
                  <Mail className="size-4" />
                  <span>Inquire via Gmail</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Official Feedback / Remarks */}
          {application.rejection_reason && (
            <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-destructive mb-1">
                Evaluation Committee Remarks:
              </p>
              <p className="text-sm leading-relaxed text-foreground italic">"{application.rejection_reason}"</p>
            </div>
          )}

          <div className="mt-4 pt-3.5 border-t border-border/60 text-xs text-muted-foreground">
            <span>
              Your submitted profile remains preserved in read-only mode for your reference. Document uploads and wizard
              edits for this cycle are closed.
            </span>
          </div>
        </div>
      )}

      {/* 2. HERO CELEBRATORY CONTRACT SIGNING BANNER (High-prominence when APPROVED) */}
      {isApproved && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-linear-to-br from-emerald-50 via-white to-emerald-50/40 p-6 shadow-md dark:from-emerald-950/30 dark:via-background dark:to-emerald-950/10">
          <div className="absolute right-0 top-0 -mt-4 -mr-4 size-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950">
                <FileSignature className="size-7" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="size-3" />
                    Action Required
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold"
                  >
                    Approved
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-navy dark:text-foreground">
                  Your Scholarship Agreement is Ready to Sign!
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Congratulations! Your application has been officially accepted. Review your scholarship terms and
                  submit your digital signature to finalize your agreement and activate your scholar status.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
              <Link href="/ApplicantsContract" className="w-full sm:w-auto">
                <Button
                  type="button"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm gap-2 rounded-xl transition-all hover:scale-[1.02]"
                >
                  <span>Review & Sign Agreement</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <span className="text-[0.7rem] text-muted-foreground text-center md:text-right">
                ⚡ Takes ~2 minutes · Official digital sign-off
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. APPLICATION OVERVIEW & STATUS CARD */}
      <Card className="rounded-[18px]! border-border bg-white shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg! text-navy">Application Overview</CardTitle>
              <CardDescription className="text-sm!">
                Application Reference #{String(application.application_id).padStart(5, "0")}
              </CardDescription>
            </div>
            <Badge variant={meta.variant} className="h-7 px-3 text-xs! font-semibold">
              {meta.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">Submitted On</span>
              <p className="font-semibold text-foreground">{formatDateTime(application.submitted_at)}</p>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Scholarship Track</span>
              <p className="font-semibold text-foreground">{scholarshipTrack || "General Track"}</p>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Current Stage</span>
              <p className="font-semibold text-navy">{application.stage || "Under Review"}</p>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Verified Documents</span>
              <p className="font-semibold text-foreground">
                {verifiedDocsCount} of {documents.length} verified
              </p>
            </div>
          </div>

          {/* Current Evaluation Stage Callout */}
          <div className="flex items-start gap-3 rounded-xl border border-navy/15 bg-navy/5 p-4 text-xs">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy mt-0.5">
              {isApproved ? (
                <Award className="size-4" />
              ) : isRejected ? (
                <AlertCircle className="size-4 text-destructive" />
              ) : application.interview_at ? (
                <CalendarClock className="size-4 text-navy" />
              ) : (
                <Clock className="size-4 text-navy" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-navy text-sm">
                {isApproved
                  ? "Application Accepted & Approved"
                  : isRejected
                    ? "Application Evaluation Finished"
                    : application.interview_at
                      ? "Interview Session Scheduled"
                      : "Application in Progress"}
              </p>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                {isApproved
                  ? "Congratulations! Your scholarship application has been officially accepted. Please proceed to review and sign your scholarship contract above."
                  : isRejected
                    ? "Your application review has concluded. The evaluation decision and committee remarks are detailed in the notice above."
                    : application.interview_at
                      ? "An interview has been scheduled by the scholarship committee. Check the interview session details below."
                      : "Your credentials and academic records are actively being reviewed by the scholarship coordinators and grant committee."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* INTERVIEW SCHEDULED DETAILS */}
      {application.interview_at && (
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
      )}

      {/* 4. DOCUMENTS VERIFICATION STATUS (Only show if documents exist) */}
      {documents.length > 0 && (
        <Card className="rounded-[18px]! border-border bg-white shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg! text-navy">
                  {isRejected ? "Submitted Application Documents" : "Submitted Documents"} ({documents.length})
                </CardTitle>
                <CardDescription className="text-sm!">
                  {isRejected
                    ? "Archived record of all requirements submitted during this application."
                    : "Verification status and data confirmation per file."}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-good" />
                <span>{isRejected ? "Archived record" : "Securely stored"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {documents.map((doc) => {
              const dm = docStatusMeta(doc.status);
              return (
                <div
                  key={doc.document_id}
                  className="flex items-center gap-3 rounded-xl border border-border px-3.5 py-2.5 hover:bg-muted/20 transition-colors"
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
            })}
            {!isRejected && (
              <>
                <Separator className="my-1" />
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 text-sm! text-navy"
                    onClick={onBackToDocuments}
                  >
                    Back to documents
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <DocumentReviewDialog
        document={previewDoc}
        open={previewDoc !== null}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        currentYearLevel={currentYearLevel}
        onConfirm={async () => {
          // Read-only in StatusStep
        }}
      />
    </div>
  );
}
