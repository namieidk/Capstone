import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ScholarDocument } from "@/lib/api/documents";

interface DocumentStatusBannerProps {
  shouldShowUploadCard: boolean;
  currentYearLevel: number;
  mismatchedDoc?: ScholarDocument | null;
}

export function DocumentStatusBanner({
  shouldShowUploadCard,
  currentYearLevel,
  mismatchedDoc,
}: DocumentStatusBannerProps) {
  if (mismatchedDoc) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-bad-bg p-4 text-sm text-destructive">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="flex-1 leading-relaxed">
          <p className="font-semibold text-destructive">Document Requirement Mismatch</p>
          <p className="mt-0.5 text-xs text-destructive/90">
            {mismatchedDoc.rejection_reason ||
              (currentYearLevel >= 2
                ? `Students in Year ${currentYearLevel} (2nd to 4th year) are required to submit an official College Transcript of Records (TOR). Senior High School Form 138 / Form 9 cannot be accepted. Please remove this document and upload your official TOR.`
                : "1st-year applicants are only allowed to submit Senior High School Form 138 or Form 9 (SF9). College transcripts (TOR) cannot be accepted for 1st-year applications. Please remove this document and upload your high school report card.")}
          </p>
        </div>
      </div>
    );
  }

  if (!shouldShowUploadCard) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50/80 p-4 text-sm text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-200">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div className="flex-1 leading-relaxed">
          <p className="font-semibold text-emerald-900 dark:text-emerald-100">Document Confirmed & Submitted</p>
          <p className="mt-0.5 text-xs text-emerald-800 dark:text-emerald-300">
            You have verified and confirmed your grade document. Your submission is locked and currently queued for
            coordinator review. You can view your extracted data below or proceed to track your application status.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
