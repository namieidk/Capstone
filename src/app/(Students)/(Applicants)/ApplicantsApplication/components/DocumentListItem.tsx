"use client";

import { AlertCircle, Check, Eye, FileText, Loader2, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScholarDocument } from "@/lib/api/documents";
import { docStatusMeta, formatDateTime, isInvalidOrMismatchedDoc } from "./wizard-helpers";

const CONFIRMABLE = ["PENDING", "PASSED_PRECHECK", "NEEDS_REUPLOAD"];

interface DocumentListItemProps {
  doc: ScholarDocument;
  currentYearLevel: number;
  busy: boolean;
  retrying: boolean;
  onReview: (doc: ScholarDocument) => void;
  onRetryOcr: (docId: number) => void;
  onRequestReplace: (doc: ScholarDocument) => void;
  onRequestDelete: (doc: ScholarDocument) => void;
}

export function DocumentListItem({
  doc,
  currentYearLevel,
  busy,
  retrying,
  onReview,
  onRetryOcr,
  onRequestReplace,
  onRequestDelete,
}: DocumentListItemProps) {
  const meta = docStatusMeta(doc.status);
  const confirmable = CONFIRMABLE.includes(doc.status);
  const isLocked = doc.status === "STUDENT_CONFIRMED" || doc.status === "VERIFIED";

  // Check if document type fundamentally contradicts applicant's year level or was flagged as invalid type
  const isMismatch = isInvalidOrMismatchedDoc(doc, currentYearLevel);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-navy">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">
          {doc.document_type}
          {doc.file_name ? <span className="font-normal text-muted-foreground"> · {doc.file_name}</span> : null}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">Uploaded {formatDateTime(doc.uploaded_at)}</p>

        {doc.status === "PENDING" && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-sky-700 dark:text-sky-400">
            <Sparkles className="size-3 text-amber-500 animate-pulse" />
            <span>Extracting grades with AI (15–30s). Hang tight!</span>
          </p>
        )}

        {isMismatch ? (
          <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-destructive">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {doc.rejection_reason ||
                (currentYearLevel >= 2
                  ? "Form 138 / Form 9 is not accepted for Year 2–4 applicants. Please remove this and upload your College TOR or Certificate of Grades."
                  : "College TOR is not accepted for 1st-year applicants. Please remove this and upload your Senior High School Form 138 or Form 9.")}
            </span>
          </p>
        ) : (
          doc.status === "NEEDS_REUPLOAD" &&
          doc.rejection_reason && (
            <p className="mt-1 text-xs font-medium text-destructive">
              {doc.rejection_reason.includes("AI") ? "Notice: " : "Coordinator: "}
              {doc.rejection_reason}
            </p>
          )
        )}
      </div>

      {doc.status !== "PENDING" && (
        <Badge variant={isMismatch ? "destructive" : meta.variant} className="h-6 px-2.5 text-xs! gap-1.5">
          {isMismatch ? "Invalid Doc Type" : meta.label}
        </Badge>
      )}

      <div className="flex items-center gap-1.5">
        {doc.status === "PENDING" ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs! text-navy border-sky-300 bg-sky-50/50 hover:bg-sky-100/60 dark:border-sky-800 dark:bg-sky-950/30"
            onClick={() => onReview(doc)}
            disabled={busy}
          >
            <Loader2 className="size-3.5 animate-spin text-sky-600" />
            View Progress
          </Button>
        ) : isMismatch ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs! text-navy"
              onClick={() => onReview(doc)}
              title="View uploaded document"
            >
              <Eye className="size-3.5" />
              View File
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="h-8 gap-1.5 text-xs!"
              onClick={() => onRequestDelete(doc)}
              disabled={busy}
              title="Remove invalid document"
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          </>
        ) : doc.status === "NEEDS_REUPLOAD" ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs! text-navy border-amber-300 bg-amber-50/60 hover:bg-amber-100/80 dark:border-amber-800 dark:bg-amber-950/30"
              onClick={() => onRetryOcr(doc.document_id)}
              disabled={busy || retrying}
              title="Retry AI OCR analysis"
            >
              {retrying ? (
                <Loader2 className="size-3.5 animate-spin text-amber-600" />
              ) : (
                <Sparkles className="size-3.5 text-amber-600" />
              )}
              {retrying ? "Retrying..." : "Retry AI"}
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 text-xs!"
              onClick={() => onReview(doc)}
              disabled={busy}
            >
              <Check className="size-3.5" />
              Enter Manually
            </Button>
          </>
        ) : confirmable ? (
          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 text-xs!"
            onClick={() => onReview(doc)}
            disabled={busy}
          >
            <Check className="size-3.5" />
            {busy ? "Confirming..." : "Review & Confirm"}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs! text-navy"
            onClick={() => onReview(doc)}
          >
            <Eye className="size-3.5" />
            View Data
          </Button>
        )}

        {!isLocked && !isMismatch && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Replace ${doc.document_type} (select file or files)`}
            title="Replace file(s)"
            onClick={() => onRequestReplace(doc)}
            disabled={busy}
          >
            <RefreshCw className="size-4" />
          </Button>
        )}

        {!isLocked && !isMismatch && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${doc.document_type}`}
            title="Delete document"
            className="hover:text-destructive"
            onClick={() => onRequestDelete(doc)}
            disabled={busy}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
