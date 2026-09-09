"use client";

import { useEffect, useMemo, useState } from "react";
import type { EditableGradeItem } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/types";
import { generatePreviewPageUrls } from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/types";
import type { Stage } from "@/components/Coordinatorshared";
import type { CarouselApi } from "@/components/ui/carousel";
import { ApiError } from "@/lib/api";
import { type GradeItem, requestDocumentChanges, type ScholarDocument, verifyDocument } from "@/lib/api/documents";
import { normalizeStage } from "./applicant-helpers";
import { initialDocSummary, toEditableGradeItems } from "./document-helpers";

export function useDocumentVerify(doc: ScholarDocument | null, open: boolean, onDone: (stage?: Stage) => void) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentPage, setCurrentPage] = useState(1);
  const [failedPages, setFailedPages] = useState<Record<number, boolean>>({});
  const [mobileTab, setMobileTab] = useState<"preview" | "data">("preview");

  const [academicYear, setAcademicYear] = useState("");
  const [generalAverage, setGeneralAverage] = useState("");
  const [gradeItems, setGradeItems] = useState<EditableGradeItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [requestingChanges, setRequestingChanges] = useState(false);
  const [changeReason, setChangeReason] = useState("");

  const candidatePageUrls = useMemo(() => {
    if (!doc?.file_url) return [];
    return generatePreviewPageUrls(doc.file_url, doc.file_type);
  }, [doc?.file_url, doc?.file_type]);

  const validPageUrls = useMemo(() => {
    return candidatePageUrls.filter((_, idx) => !failedPages[idx]);
  }, [candidatePageUrls, failedPages]);

  useEffect(() => {
    if (!doc || !open) return;
    setFailedPages({});
    setCurrentPage(1);
    setMobileTab("preview");
    setFormError("");
    setRequestingChanges(false);
    setChangeReason("");
    const summary = initialDocSummary(doc);
    setAcademicYear(summary.academicYear);
    setGeneralAverage(summary.generalAverage);
    setGradeItems(toEditableGradeItems(doc));
  }, [doc, open]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentPage(carouselApi.selectedScrollSnap() + 1);
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  function handleItemChange(id: string, field: keyof EditableGradeItem, val: string | number) {
    setGradeItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  }

  function handleAddSubject() {
    setGradeItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}-${prev.length}`, subject_code: "", subject_name: "", units: 1, grade: "" },
    ]);
  }

  function handleRemoveSubject(id: string) {
    setGradeItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleComputeAverage() {
    const valid = gradeItems.filter((i) => i.grade !== "" && !Number.isNaN(Number(i.grade)));
    if (valid.length === 0) return;
    const weighted = valid.reduce((sum, i) => sum + Number(i.grade) * (i.units || 1), 0);
    const units = valid.reduce((sum, i) => sum + (i.units || 1), 0);
    setGeneralAverage(units > 0 ? (weighted / units).toFixed(2) : "0");
  }

  function buildPayload(): { academic_year?: string; general_average?: number; grade_items: GradeItem[] } {
    const parsedGa = generalAverage.trim() ? Number(generalAverage) : undefined;
    if (parsedGa !== undefined && (Number.isNaN(parsedGa) || parsedGa < 50 || parsedGa > 100)) {
      throw new Error("General Average must be a valid number between 50 and 100.");
    }
    const invalid = gradeItems.find(
      (i) => i.grade === "" || Number.isNaN(Number(i.grade)) || Number(i.grade) < 50 || Number(i.grade) > 100,
    );
    if (invalid) {
      throw new Error(`Grade for "${invalid.subject_name || "subject"}" must be between 50 and 100.`);
    }
    return {
      academic_year: academicYear.trim() || undefined,
      general_average: parsedGa,
      grade_items: gradeItems.map((i) => ({
        subject_code: i.subject_code.trim() || i.subject_name.trim() || "N/A",
        subject_name: i.subject_name.trim() || i.subject_code.trim() || "N/A",
        units: Number(i.units) || 1,
        grade: Number(i.grade),
      })),
    };
  }

  async function handleVerify() {
    if (!doc) return;
    if (doc.status !== "STUDENT_CONFIRMED") {
      setFormError("Cannot verify: The applicant must review and confirm this document first.");
      return;
    }
    setFormError("");
    let payload: ReturnType<typeof buildPayload>;
    try {
      payload = buildPayload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Invalid grades.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await verifyDocument(doc.document_id, payload);
      onDone(result.application ? normalizeStage(result.application.stage) : undefined);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to verify document.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendRequestChanges() {
    if (!doc || changeReason.trim() === "") return;
    setFormError("");
    setSubmitting(true);
    try {
      await requestDocumentChanges(doc.document_id, changeReason.trim());
      onDone();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to request changes.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    carouselApi,
    setCarouselApi,
    currentPage,
    failedPages,
    setFailedPages,
    mobileTab,
    setMobileTab,
    academicYear,
    setAcademicYear,
    generalAverage,
    setGeneralAverage,
    gradeItems,
    submitting,
    formError,
    requestingChanges,
    setRequestingChanges,
    changeReason,
    setChangeReason,
    candidatePageUrls,
    validPageUrls,
    handleItemChange,
    handleAddSubject,
    handleRemoveSubject,
    handleComputeAverage,
    handleVerify,
    handleSendRequestChanges,
  };
}
