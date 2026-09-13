import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../api";

const B = "/api/proxy/documents";

export type DocumentStatus =
  | "PENDING"
  | "PASSED_PRECHECK"
  | "STUDENT_CONFIRMED"
  | "VERIFIED"
  | "NEEDS_REUPLOAD"
  | "REJECTED";

export type GradeReportStatus = "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED";

export interface ScholarDocument {
  document_id: number;
  scholar_profile_id: number;
  document_type: string;
  label?: string | null;
  file_name?: string | null;
  file_url: string;
  file_size?: string | null;
  file_type?: string | null;
  status: DocumentStatus;
  rejection_reason?: string | null;
  extracted_data?: Record<string, unknown> | null;
  confirmed_data?: Record<string, unknown> | null;
  uploaded_at: string;
  verified_at?: string | null;
}

export interface GradeItem {
  subject_code?: string;
  subject_name?: string;
  units?: number;
  grade: number;
}

export interface GradeReport {
  id: number;
  academic_year: string;
  semester?: string;
  general_average: number;
  status: GradeReportStatus;
  remarks?: string;
  grade_items: GradeItem[];
  scholar?: import("./auth").User;
  created_at: string;
  updated_at: string;
}

export function uploadDocuments(files: File[], documentType: string) {
  const form = new FormData();
  for (const file of files) {
    form.append("files", file);
  }
  form.append("document_type", documentType);
  return apiPost<ScholarDocument>(`${B}/upload`, form);
}

export function replaceDocument(id: number, files: File[] | File) {
  const form = new FormData();
  const list = Array.isArray(files) ? files : [files];
  for (const file of list) {
    form.append("files", file);
  }
  return apiPut<ScholarDocument>(`${B}/${id}/replace`, form);
}

export function deleteDocument(id: number) {
  return apiDelete<{ success: boolean; message: string }>(`${B}/${id}`);
}

export function getMyDocuments() {
  return apiGet<ScholarDocument[]>(`${B}/me`);
}

export function getGradeReportsMe() {
  return apiGet<GradeReport[]>(`${B}/grade-reports/me`);
}

export function getGradeReports(params?: {
  status?: GradeReportStatus;
  academic_year?: string;
  semester?: string;
  search?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.academic_year) qs.set("academic_year", params.academic_year);
  if (params?.semester) qs.set("semester", params.semester);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return apiGet<GradeReport[]>(`${B}/grade-reports${query ? `?${query}` : ""}`);
}

export function updateGradeReportStatus(id: number, data: { status: GradeReportStatus; remarks?: string }) {
  return apiPatch<GradeReport>(`${B}/grade-reports/${id}/status`, data);
}

export function getExtractedData(id: number) {
  return apiGet<{ ocr_data: Record<string, unknown> }>(`${B}/${id}/extracted-data`);
}

export function confirmDocument(
  id: number,
  data: {
    academic_year?: string;
    general_average?: number;
    grade_items?: GradeItem[];
  },
) {
  return apiPatch<ScholarDocument>(`${B}/${id}/confirm`, data);
}

export function getPendingDocuments() {
  return apiGet<ScholarDocument[]>(`${B}/pending`);
}

export function getDocument(id: number) {
  return apiGet<ScholarDocument>(`${B}/${id}`);
}

export function syncParseur(id: number) {
  return apiPost<{ ocr_data: Record<string, unknown> }>(`${B}/${id}/sync-parseur`);
}

export function retryDocumentOcr(id: number) {
  return apiPost<{ processed: boolean; status: string; extracted_data: Record<string, unknown> }>(
    `${B}/${id}/retry-ocr`,
  );
}

export function requestDocumentChanges(id: number, reason: string) {
  return apiPatch<ScholarDocument>(`${B}/${id}/request-changes`, { reason });
}

export function verifyDocument(
  id: number,
  data: {
    academic_year?: string;
    general_average?: number;
    grade_items?: GradeItem[];
    notes?: string;
  },
) {
  return apiPatch<VerifyDocumentResult>(`${B}/${id}/verify`, data);
}

// PATCH /documents/:id/verify — coordinator confirms grades, the backend
// creates the grade report, marks the document VERIFIED, and (for APPLICANT
// users with a pending application) moves the application to UNDER_REVIEW.
export interface VerifyDocumentResult {
  report: {
    report_id: number;
    academic_year: string;
    semester: string;
    gpa: number | string;
    status: string;
    is_eligible: boolean;
  };
  isEligible: boolean;
  evaluationFlag: string;
  application: { application_id: number; status: string; stage: string } | null;
}
