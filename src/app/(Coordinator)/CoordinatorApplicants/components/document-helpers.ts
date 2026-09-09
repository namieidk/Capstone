import type {
  ConfirmedDataShape,
  EditableGradeItem,
  ExtractedDataShape,
  ExtractedGradeRaw,
} from "@/app/(Students)/(Applicants)/ApplicantsApplication/components/DocumentReviewDialog/types";
import type { DocumentStatus, ScholarDocument } from "@/lib/api/documents";
import type { BadgeVariant } from "./applicant-helpers";

export function getDocStatusMeta(status: DocumentStatus): { label: string; variant: BadgeVariant } {
  switch (status) {
    case "VERIFIED":
      return { label: "Verified", variant: "default" };
    case "STUDENT_CONFIRMED":
      return { label: "Confirmed", variant: "secondary" };
    case "PASSED_PRECHECK":
      return { label: "Pre-check passed", variant: "secondary" };
    case "NEEDS_REUPLOAD":
      return { label: "Needs re-upload", variant: "destructive" };
    case "REJECTED":
      return { label: "Rejected", variant: "destructive" };
    case "PENDING":
      return { label: "Analyzing with AI...", variant: "outline" };
    default:
      return { label: "Pending", variant: "outline" };
  }
}

function toNumberOrEmpty(value: unknown): number | "" {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  return Number.isNaN(n) ? "" : n;
}

// Editable rows for the coordinator verify dialog — student-confirmed data
// wins, otherwise fall back to the OCR-extracted grades.
export function toEditableGradeItems(doc: ScholarDocument): EditableGradeItem[] {
  const confirmed = (doc.confirmed_data ?? {}) as ConfirmedDataShape;
  const extracted = (doc.extracted_data ?? {}) as ExtractedDataShape;
  const rawList: ExtractedGradeRaw[] =
    Array.isArray(confirmed.grade_items) && confirmed.grade_items.length > 0
      ? confirmed.grade_items
      : Array.isArray(extracted.grades)
        ? extracted.grades
        : [];
  return rawList.map((g, idx) => ({
    id: `grade-${idx}-${Date.now()}`,
    subject_code: String(g.subject_code || ""),
    subject_name: String(g.subject_name || g.subject_code || `Subject ${idx + 1}`),
    units: g.units != null && !Number.isNaN(Number(g.units)) ? Number(g.units) : 1,
    grade: toNumberOrEmpty(g.grade),
    semester: g.semester ? String(g.semester) : undefined,
  }));
}

export function initialDocSummary(doc: ScholarDocument): { academicYear: string; generalAverage: string } {
  const confirmed = (doc.confirmed_data ?? {}) as ConfirmedDataShape;
  const extracted = (doc.extracted_data ?? {}) as ExtractedDataShape;
  const ga = confirmed.general_average ?? extracted.general_average;
  return {
    academicYear: String(confirmed.academic_year || extracted.academic_year || ""),
    generalAverage: ga !== null && ga !== undefined ? String(ga) : "",
  };
}
