"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

interface DocumentStatusBannerProps {
  shouldShowUploadCard: boolean;
  currentYearLevel: number;
}

export function DocumentStatusBanner({ shouldShowUploadCard, currentYearLevel }: DocumentStatusBannerProps) {
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

  if (currentYearLevel >= 2) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-50/80 p-3.5 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="leading-relaxed">
          <p className="font-semibold">Year {currentYearLevel} Document Requirement</p>
          <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300">
            Students in Year {currentYearLevel} (2nd to 4th year) are required to upload a Transcript of Records (TOR)
            or Certified Copy of Grades instead of Senior High School Form 138 / Form 9.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-sky-500/30 bg-sky-50/80 p-3.5 text-sm text-sky-900 dark:bg-sky-950/30 dark:text-sky-200">
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-sky-600 dark:text-sky-400" />
      <div className="leading-relaxed">
        <p className="font-semibold">1st Year Document Requirement</p>
        <p className="mt-0.5 text-xs text-sky-800 dark:text-sky-300">
          As a 1st-year applicant, upload your Senior High School Form 138 (Report Card) or Form 9 / SF9. If your report
          card has multiple pages (e.g. front & back), select both files — AI will analyze all pages together.
        </p>
      </div>
    </div>
  );
}
