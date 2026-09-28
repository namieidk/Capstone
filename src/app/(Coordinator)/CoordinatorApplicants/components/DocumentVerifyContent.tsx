"use client";

import { AlertCircle, ArrowLeft, ExternalLink, Eye, FileText } from "lucide-react";
import { useMemo } from "react";
import { DocumentPreviewCarousel } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/DocumentPreviewCarousel";
import { DocumentSummaryForm } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/DocumentSummaryForm";
import { ExtractedMetadataView } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/ExtractedMetadataView";
import { GradeItemsTable } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/GradeItemsTable";
import type { ExtractedDataShape } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/types";
import type { Stage } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ScholarDocument } from "@/lib/api/documents";
import { AcademicEvaluationCard } from "./AcademicEvaluationCard";
import { getDocStatusMeta } from "./document-helpers";
import { useDocumentVerify } from "./useDocumentVerify";
import { VerifyFooterBar } from "./VerifyFooterBar";

export interface DocumentVerifyContentProps {
  document: ScholarDocument;
  applicantName: string;
  onBack?: () => void;
  onClose: () => void;
  onDone: (stage?: Stage) => void;
  isMobileDrawer?: boolean;
}

export function DocumentVerifyContent({
  document: doc,
  applicantName,
  onBack,
  onClose,
  onDone,
  isMobileDrawer = false,
}: DocumentVerifyContentProps) {
  const v = useDocumentVerify(doc, true, onDone);
  const meta = doc ? getDocStatusMeta(doc.status) : null;
  const rawExtracted: ExtractedDataShape = useMemo(() => {
    return (doc?.extracted_data as ExtractedDataShape) || {};
  }, [doc]);

  if (!doc || !meta) return null;
  const isVerified = doc.status === "VERIFIED";
  const isStudentConfirmed = doc.status === "STUDENT_CONFIRMED";
  const canVerify = isStudentConfirmed;
  const isReadOnly = !isStudentConfirmed;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      {isMobileDrawer ? (
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3.5 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs font-semibold text-navy hover:bg-slate-100 -ml-1"
              onClick={onBack}
            >
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </Button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="min-w-0 flex items-center gap-1.5">
              <span className="truncate text-xs font-bold text-navy">{doc.document_type}</span>
              <Badge variant={meta.variant} className="h-4.5 shrink-0 px-1.5 text-[0.62rem] font-semibold">
                {meta.label}
              </Badge>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8 rounded-lg border-border text-navy hover:bg-slate-100"
            onClick={() => window.open(doc.file_url, "_blank", "noopener,noreferrer")}
            title="Open original file in new tab"
          >
            <ExternalLink className="size-3.5" />
          </Button>
        </div>
      ) : (
        <DialogHeader className="shrink-0 border-b border-border bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5 pr-8 sm:pr-6">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-navy sm:size-10">
                <FileText className="size-4 sm:size-5" />
              </span>
              <div className="min-w-0">
                <DialogTitle className="flex flex-wrap items-center gap-1.5 text-base! text-navy sm:gap-2 sm:text-lg!">
                  <span className="truncate">{doc.document_type}</span>
                  <Badge variant={meta.variant} className="h-5 px-1.5 text-[0.65rem]! sm:h-5.5 sm:px-2 sm:text-[0.7rem]!">
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
      )}

      {/* Segmented Switcher for Mobile Screens */}
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

      {/* Main Body (Side-by-Side on Desktop, Tabbed on Mobile) */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
        <div
          className={
            v.mobileTab === "preview"
              ? "flex flex-col min-h-0 flex-1 lg:col-span-5"
              : "hidden min-h-0 flex-1 lg:col-span-5 lg:flex lg:flex-col"
          }
        >
          <ScrollArea className="flex-1 min-h-0 h-full">
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
          </ScrollArea>
        </div>
        <div
          className={
            v.mobileTab === "data"
              ? "flex flex-col min-h-0 flex-1 lg:col-span-7"
              : "hidden min-h-0 flex-1 lg:col-span-7 lg:flex lg:flex-col"
          }
        >
          <ScrollArea className="flex-1 min-h-0 h-full">
            <div className="flex flex-col gap-3.5 p-3.5 sm:gap-4 sm:p-5">
              {!isStudentConfirmed && !isVerified && (
                <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                  <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="flex-1 leading-relaxed">
                    <span className="font-semibold">Awaiting Student Confirmation:</span> This document is currently in{" "}
                    <strong>{meta.label}</strong> status. The applicant has not reviewed and confirmed their grades
                    yet. You can preview the document, but you cannot verify it until the applicant confirms.
                  </div>
                </div>
              )}
              <ExtractedMetadataView extractedData={rawExtracted} isReadOnly={isReadOnly} />
              <AcademicEvaluationCard
                generalAverage={v.generalAverage}
                extractedData={rawExtracted}
                globalThreshold={90}
              />
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
          </ScrollArea>
        </div>
      </div>

      {/* Footer Bar */}
      {isVerified ? (
        <div className="flex shrink-0 justify-end border-t border-border bg-white px-4 py-3 sm:px-6 sm:py-3.5">
          <Button type="button" variant="outline" className="h-9 px-4 text-xs!" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <VerifyFooterBar
          submitting={v.submitting}
          requestingChanges={v.requestingChanges}
          changeReason={v.changeReason}
          canVerify={canVerify}
          verifyDisabledReason="The applicant must review and confirm this document before coordinator verification."
          onReasonChange={v.setChangeReason}
          onClose={onClose}
          onStartRequestChanges={() => v.setRequestingChanges(true)}
          onCancelRequestChanges={() => v.setRequestingChanges(false)}
          onSendRequestChanges={v.handleSendRequestChanges}
          onVerify={v.handleVerify}
        />
      )}
    </div>
  );
}
