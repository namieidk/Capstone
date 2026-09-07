"use client";

import { ExternalLink, Eye, FileText } from "lucide-react";
import { useMemo } from "react";
import { DocumentPreviewCarousel } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/DocumentPreviewCarousel";
import { DocumentSummaryForm } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/DocumentSummaryForm";
import { ExtractedMetadataView } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/ExtractedMetadataView";
import { GradeItemsTable } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/GradeItemsTable";
import type { ExtractedDataShape } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/types";
import type { Stage } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ScholarDocument } from "@/lib/api/documents";
import { getDocStatusMeta } from "./document-helpers";
import { useDocumentVerify } from "./useDocumentVerify";
import { VerifyFooterBar } from "./VerifyFooterBar";

interface DocumentVerifyDialogProps {
  document: ScholarDocument | null;
  applicantName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: (stage?: Stage) => void;
}

export function DocumentVerifyDialog({
  document: doc,
  applicantName,
  open,
  onOpenChange,
  onDone,
}: DocumentVerifyDialogProps) {
  const v = useDocumentVerify(doc, open, onDone);
  const meta = doc ? getDocStatusMeta(doc.status) : null;
  const rawExtracted: ExtractedDataShape = useMemo(() => {
    return (doc?.extracted_data as ExtractedDataShape) || {};
  }, [doc]);

  if (!doc || !meta) return null;
  const isReadOnly = doc.status === "VERIFIED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95dvh] max-h-[95dvh] w-[96vw] max-w-6xl! flex-col overflow-hidden p-0 rounded-2xl sm:h-auto sm:max-h-[90vh]">
        <DialogHeader className="shrink-0 border-b border-border bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5 pr-8 sm:pr-6">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-navy sm:size-10">
                <FileText className="size-4 sm:size-5" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-1.5 text-base! text-navy sm:gap-2 sm:text-lg!">
                  <span className="truncate">{doc.document_type}</span>
                  <Badge
                    variant={meta.variant}
                    className="h-5 px-1.5 text-[0.65rem]! sm:h-5.5 sm:px-2 sm:text-[0.7rem]!"
                  >
                    {meta.label}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="truncate text-[0.7rem]! sm:text-xs!">
                  {applicantName} · {doc.file_name ?? "Document"}
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7.5 shrink-0 px-2.5 text-[0.7rem]! text-navy sm:h-8.5 sm:px-3 sm:text-xs!"
              onClick={() => window.open(doc.file_url, "_blank", "noopener,noreferrer")}
              title="Open raw document in a new tab"
            >
              <ExternalLink className="size-3 sm:size-3.5" />
              <span>Open original file</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex shrink-0 items-center border-b border-border bg-muted/50 p-1.5 lg:hidden">
          <button
            type="button"
            onClick={() => v.setMobileTab("preview")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              v.mobileTab === "preview" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-navy"
            }`}
          >
            <Eye className="size-3.5" />
            <span>Document Preview</span>
          </button>
          <button
            type="button"
            onClick={() => v.setMobileTab("data")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              v.mobileTab === "data" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-navy"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Extracted Grades ({v.gradeItems.length})</span>
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
          <div
            className={
              v.mobileTab === "preview" ? "flex flex-col lg:col-span-5" : "hidden lg:col-span-5 lg:flex lg:flex-col"
            }
          >
            <DocumentPreviewCarousel
              document={doc}
              candidatePageUrls={v.candidatePageUrls}
              validPageUrls={v.validPageUrls}
              failedPages={v.failedPages}
              currentPage={v.currentPage}
              carouselApi={v.carouselApi}
              setCarouselApi={v.setCarouselApi}
              onPageFailed={(idx) => v.setFailedPages((prev) => ({ ...prev, [idx]: true }))}
              onSwitchToData={() => v.setMobileTab("data")}
            />
          </div>
          <div
            className={
              v.mobileTab === "data"
                ? "flex flex-col gap-3.5 overflow-y-auto p-3.5 sm:gap-4 sm:p-5 lg:col-span-7"
                : "hidden gap-3.5 overflow-y-auto p-3.5 sm:gap-4 sm:p-5 lg:col-span-7 lg:flex lg:flex-col"
            }
          >
            <ExtractedMetadataView extractedData={rawExtracted} isReadOnly={isReadOnly} />
            <DocumentSummaryForm
              academicYear={v.academicYear}
              generalAverage={v.generalAverage}
              isReadOnly={isReadOnly}
              onAcademicYearChange={v.setAcademicYear}
              onGeneralAverageChange={v.setGeneralAverage}
              onComputeAverage={v.handleComputeAverage}
            />
            <GradeItemsTable
              gradeItems={v.gradeItems}
              isReadOnly={isReadOnly}
              onAddSubject={v.handleAddSubject}
              onRemoveSubject={v.handleRemoveSubject}
              onItemChange={v.handleItemChange}
            />
            {v.formError && (
              <div className="rounded-lg border border-destructive/30 bg-bad-bg px-3 py-2 text-xs font-medium text-destructive">
                {v.formError}
              </div>
            )}
          </div>
        </div>

        {isReadOnly ? (
          <div className="flex shrink-0 justify-end border-t border-border bg-white px-4 py-3 sm:px-6 sm:py-3.5">
            <Button type="button" variant="outline" className="h-9 px-4 text-xs!" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <VerifyFooterBar
            submitting={v.submitting}
            requestingChanges={v.requestingChanges}
            changeReason={v.changeReason}
            onReasonChange={v.setChangeReason}
            onClose={() => onOpenChange(false)}
            onStartRequestChanges={() => v.setRequestingChanges(true)}
            onCancelRequestChanges={() => v.setRequestingChanges(false)}
            onSendRequestChanges={v.handleSendRequestChanges}
            onVerify={v.handleVerify}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
