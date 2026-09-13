"use client";

import { Eye, FileText, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type GradeItem, retryDocumentOcr, syncParseur } from "@/lib/api/documents";
import { DialogFooterBar } from "./DialogFooterBar";
import { DialogHeaderBar } from "./DialogHeaderBar";
import { DocumentPreviewCarousel } from "./DocumentPreviewCarousel";
import { DocumentSummaryForm } from "./DocumentSummaryForm";
import { ExtractedMetadataView } from "./ExtractedMetadataView";
import { GradeItemsTable } from "./GradeItemsTable";
import {
  type ConfirmedDataShape,
  type DocumentReviewDialogProps,
  type EditableGradeItem,
  type ExtractedDataShape,
  type ExtractedGradeRaw,
  generatePreviewPageUrls,
} from "./types";

export function DocumentReviewDialog({ document: doc, open, onOpenChange, onConfirm }: DocumentReviewDialogProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentPage, setCurrentPage] = useState(1);
  const [failedPages, setFailedPages] = useState<Record<number, boolean>>({});
  const [mobileTab, setMobileTab] = useState<"preview" | "data">("preview");

  // Extracted data form states
  const [academicYear, setAcademicYear] = useState("");
  const [generalAverage, setGeneralAverage] = useState<string>("");
  const [gradeItems, setGradeItems] = useState<EditableGradeItem[]>([]);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [manualBypass, setManualBypass] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const isReadOnly = doc?.status === "VERIFIED" || doc?.status === "STUDENT_CONFIRMED";

  // Parse candidate page URLs safely
  const candidatePageUrls = useMemo(() => {
    if (!doc?.file_url) return [];
    return generatePreviewPageUrls(doc.file_url, doc.file_type);
  }, [doc?.file_url, doc?.file_type]);

  const validPageUrls = useMemo(() => {
    return candidatePageUrls.filter((_, idx) => !failedPages[idx]);
  }, [candidatePageUrls, failedPages]);

  // Extract raw JSON blobs
  const rawExtracted = useMemo(() => {
    if (!doc?.extracted_data) return {} as ExtractedDataShape;
    return (
      typeof doc.extracted_data === "string" ? JSON.parse(doc.extracted_data) : doc.extracted_data
    ) as ExtractedDataShape;
  }, [doc?.extracted_data]);

  const rawConfirmed = useMemo(() => {
    if (!doc?.confirmed_data) return null;
    return (
      typeof doc.confirmed_data === "string" ? JSON.parse(doc.confirmed_data) : doc.confirmed_data
    ) as ConfirmedDataShape;
  }, [doc?.confirmed_data]);

  // Sync state when dialog opens or document changes
  useEffect(() => {
    if (!doc || !open) {
      setManualBypass(false);
      setSyncMessage("");
      return;
    }

    setFailedPages({});
    setFormError("");

    // Populate AY
    const ay = rawConfirmed?.academic_year || rawExtracted?.academic_year || "";
    setAcademicYear(ay);

    // Populate GA
    const ga =
      rawConfirmed?.general_average != null
        ? String(rawConfirmed.general_average)
        : rawExtracted?.general_average != null
          ? String(rawExtracted.general_average)
          : "";
    setGeneralAverage(ga);

    // Populate Grades
    let rawList: ExtractedGradeRaw[] = [];
    if (Array.isArray(rawConfirmed?.grade_items) && rawConfirmed.grade_items.length > 0) {
      rawList = rawConfirmed.grade_items;
    } else if (Array.isArray(rawExtracted?.grades) && rawExtracted.grades.length > 0) {
      rawList = rawExtracted.grades;
    }

    const initialItems: EditableGradeItem[] = rawList.map((g, idx) => ({
      id: `grade-${idx}-${Date.now()}`,
      subject_code: String(g.subject_code || ""),
      subject_name: String(g.subject_name || g.subject_code || `Subject ${idx + 1}`),
      units: g.units != null && !Number.isNaN(Number(g.units)) ? Number(g.units) : 1,
      grade: g.grade != null && !Number.isNaN(Number(g.grade)) ? Number(g.grade) : "",
      semester: g.semester ? String(g.semester) : undefined,
    }));

    setGradeItems(initialItems);
  }, [doc, open, rawConfirmed, rawExtracted]);

  const isOcrPending =
    doc?.status === "PENDING" && !manualBypass && (!rawConfirmed?.grade_items || rawConfirmed.grade_items.length === 0);

  async function handleRetryOrSync() {
    if (!doc) return;
    setSyncing(true);
    setSyncMessage("");
    try {
      const res = await retryDocumentOcr(doc.document_id);
      if (res?.processed || res?.status === "PASSED_PRECHECK") {
        setSyncMessage("AI extraction complete! Refreshing fields...");
      } else {
        setSyncMessage("AI analysis dispatched. Please check again in a few seconds.");
      }
    } catch {
      try {
        const parseurRes = await syncParseur(doc.document_id);
        if (parseurRes?.ocr_data) {
          setSyncMessage("Extraction completed! Reloading data...");
        } else {
          setSyncMessage("Analysis still processing. You can also enter grades manually.");
        }
      } catch {
        setSyncMessage("AI analysis encountered an issue. You can enter grades manually below.");
      }
    } finally {
      setSyncing(false);
    }
  }

  // Track active slide in carousel
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentPage(carouselApi.selectedScrollSnap() + 1);
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  if (!doc) return null;

  function handleAddSubject() {
    setGradeItems((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${prev.length}`,
        subject_code: "",
        subject_name: "",
        units: 1,
        grade: "",
      },
    ]);
  }

  function handleRemoveSubject(id: string) {
    setGradeItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleItemChange(id: string, field: keyof EditableGradeItem, val: string | number) {
    setGradeItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, [field]: val };
      }),
    );
  }

  function handleComputeAverage() {
    const valid = gradeItems.filter((i) => i.grade !== "" && !Number.isNaN(Number(i.grade)));
    if (valid.length === 0) return;

    const totalWeighted = valid.reduce((sum, i) => sum + Number(i.grade) * (i.units || 1), 0);
    const totalUnits = valid.reduce((sum, i) => sum + (i.units || 1), 0);
    const avg = totalUnits > 0 ? (totalWeighted / totalUnits).toFixed(2) : "0";
    setGeneralAverage(avg);
  }

  function handlePageFailed(index: number) {
    setFailedPages((prev) => ({
      ...prev,
      [index]: true,
    }));
  }

  async function handleSubmit() {
    if (!doc) return;
    setFormError("");
    const parsedGa = generalAverage.trim() ? Number(generalAverage) : undefined;
    if (parsedGa !== undefined && (Number.isNaN(parsedGa) || parsedGa <= 0 || parsedGa > 100)) {
      setFormError("General Average must be a valid positive number (e.g., 1.00–5.00 or 75–100).");
      return;
    }

    const invalidGrade = gradeItems.find(
      (i) => i.grade === "" || Number.isNaN(Number(i.grade)) || Number(i.grade) <= 0 || Number(i.grade) > 100,
    );
    if (invalidGrade) {
      setFormError(
        `Grade for "${invalidGrade.subject_name || "subject"}" must be a valid positive number (e.g., 1.00–5.00 or 75–100).`,
      );
      return;
    }

    setSubmitting(true);
    try {
      const payloadGradeItems: GradeItem[] = gradeItems.map((i) => ({
        subject_code: i.subject_code.trim() || i.subject_name.trim() || "N/A",
        subject_name: i.subject_name.trim() || i.subject_code.trim() || "N/A",
        units: Number(i.units) || 1,
        grade: Number(i.grade),
      }));

      await onConfirm(doc.document_id, {
        academic_year: academicYear.trim() || undefined,
        general_average: parsedGa,
        grade_items: payloadGradeItems,
      });

      onOpenChange(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to confirm document.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95dvh] max-h-[95dvh] w-[96vw] max-w-6xl! flex-col overflow-hidden p-0 rounded-2xl sm:h-auto sm:max-h-[90vh]">
        {/* Header */}
        <DialogHeaderBar document={doc} />

        {/* Mobile Segmented Switcher (< lg only) */}
        <div className="flex shrink-0 items-center border-b border-border bg-muted/50 p-1.5 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mobileTab === "preview" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-navy"
            }`}
          >
            <Eye className="size-3.5" />
            <span>Document Preview</span>
            {validPageUrls.length > 1 && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] text-navy">
                {currentPage}/{validPageUrls.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("data")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mobileTab === "data" ? "bg-white text-navy shadow-xs" : "text-muted-foreground hover:text-navy"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Extracted Data</span>
            {gradeItems.length > 0 && (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] text-navy">{gradeItems.length}</span>
            )}
          </button>
        </div>

        {/* Content Body: Two columns on desktop, tabbed switch on mobile */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
          {/* Left Column: Document Preview with Carousel */}
          <div
            className={
              mobileTab === "preview" ? "flex flex-col lg:col-span-5" : "hidden lg:col-span-5 lg:flex lg:flex-col"
            }
          >
            <DocumentPreviewCarousel
              document={doc}
              candidatePageUrls={candidatePageUrls}
              validPageUrls={validPageUrls}
              failedPages={failedPages}
              currentPage={currentPage}
              carouselApi={carouselApi}
              setCarouselApi={setCarouselApi}
              onPageFailed={handlePageFailed}
              onSwitchToData={() => setMobileTab("data")}
            />
          </div>

          {/* Right Column: OCR Extracted Data Review & Editor */}
          <div
            className={
              mobileTab === "data"
                ? "flex flex-col gap-3.5 overflow-y-auto p-3.5 sm:gap-4 sm:p-5 lg:col-span-7"
                : "hidden gap-3.5 overflow-y-auto p-3.5 sm:gap-4 sm:p-5 lg:col-span-7 lg:flex lg:flex-col"
            }
          >
            {/* Quick link to preview on mobile */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs lg:hidden">
              <span className="text-muted-foreground">Checking document?</span>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className="flex items-center gap-1 font-semibold text-navy transition-colors hover:text-amber"
              >
                <Eye className="size-3.5" />
                <span>View Document (Page {currentPage})</span>
              </button>
            </div>

            {isOcrPending ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-sky-200 bg-sky-50/60 p-6 text-center dark:border-sky-900/40 dark:bg-sky-950/20">
                <div className="relative mb-3 flex size-12 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/50">
                  <Sparkles className="size-6 text-amber-500 animate-pulse" />
                  <Loader2 className="absolute size-10 animate-spin text-sky-600 opacity-60" />
                </div>
                <h4 className="text-sm font-semibold text-navy">AI is reading your document...</h4>
                <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Our Vision AI is extracting your academic year, general average, and subject grades (10–25s). Hang
                  tight!
                </p>
                {syncMessage && (
                  <p className="mt-2 text-xs font-medium text-sky-800 dark:text-sky-300">{syncMessage}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs!"
                    disabled={syncing}
                    onClick={handleRetryOrSync}
                  >
                    <RefreshCw className={`size-3.5 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Checking..." : "Check Status"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs! text-muted-foreground hover:text-navy"
                    onClick={() => setManualBypass(true)}
                  >
                    Enter manually instead
                  </Button>
                </div>
                <div className="mt-6 w-full space-y-2 border-t border-sky-200/60 pt-4 text-left dark:border-sky-900/30">
                  <p className="text-[0.7rem] font-medium text-sky-800 dark:text-sky-300">
                    Awaiting extracted information:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 animate-pulse rounded-md bg-sky-100/70 dark:bg-sky-900/30" />
                    <div className="h-9 animate-pulse rounded-md bg-sky-100/70 dark:bg-sky-900/30" />
                  </div>
                  <div className="h-16 animate-pulse rounded-md bg-sky-100/50 dark:bg-sky-900/20" />
                </div>
              </div>
            ) : (
              <>
                {doc.status === "NEEDS_REUPLOAD" && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 shrink-0 text-amber-600" />
                        <span className="font-semibold">AI Extraction Notice</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs! gap-1 border-amber-300 bg-white hover:bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
                        onClick={handleRetryOrSync}
                        disabled={syncing}
                      >
                        <RefreshCw className={`size-3 ${syncing ? "animate-spin" : ""}`} />
                        {syncing ? "Retrying..." : "Retry AI Extraction"}
                      </Button>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                      {doc.rejection_reason ||
                        "Automatic grade extraction could not read all fields. You can retry AI Extraction, replace the file, or enter your subjects and grades manually below."}
                    </p>
                  </div>
                )}

                {/* Metadata and advisories */}
                <ExtractedMetadataView
                  extractedData={rawExtracted}
                  isReadOnly={isReadOnly}
                  showConfirmedNotice={isReadOnly}
                />

                {/* Editable Document Summary */}
                <DocumentSummaryForm
                  academicYear={academicYear}
                  generalAverage={generalAverage}
                  isReadOnly={isReadOnly}
                  onAcademicYearChange={setAcademicYear}
                  onGeneralAverageChange={setGeneralAverage}
                  onComputeAverage={handleComputeAverage}
                />

                {/* Editable Subjects & Grades Table */}
                <GradeItemsTable
                  gradeItems={gradeItems}
                  isReadOnly={isReadOnly}
                  onAddSubject={handleAddSubject}
                  onRemoveSubject={handleRemoveSubject}
                  onItemChange={handleItemChange}
                />
              </>
            )}

            {formError && (
              <div className="rounded-lg border border-destructive/30 bg-bad-bg px-3 py-2 text-xs font-medium text-destructive">
                {formError}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooterBar
          isReadOnly={isReadOnly}
          submitting={submitting}
          disabled={isOcrPending}
          onClose={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
