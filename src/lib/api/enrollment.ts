import { apiDelete, apiGet, apiPost } from "../api";
import { compressDocumentImage } from "../image-compression";
import type { ScholarProspectus, SchoolGradingSystem } from "./baseline";

const E = "/api/proxy/term-enrollment";

export const ACCEPTED_ENROLLMENT_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "webp"] as const;
export const ACCEPTED_ENROLLMENT_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);
export const ACCEPTED_ENROLLMENT_FORMATS_LABEL = "PDF, PNG, JPG, JPEG, or WEBP";
export const MAX_ENROLLMENT_FILE_SIZE_BYTES = 15 * 1024 * 1024;

function getFileExtension(filename: string): string {
  const trimmed = filename.trim();
  const dotIndex = trimmed.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === trimmed.length - 1) return "";
  return trimmed.slice(dotIndex + 1).toLowerCase();
}

/**
 * Validates that a selected/dropped enrollment document matches accepted formats and size limits.
 * Returns a human-readable error message if invalid, or null if valid.
 */
export function validateEnrollmentDocumentFile(file: File): string | null {
  const ext = getFileExtension(file.name);
  const mime = (file.type || "").trim().toLowerCase();
  const hasAllowedExt = Boolean(ext && (ACCEPTED_ENROLLMENT_EXTENSIONS as readonly string[]).includes(ext));
  const hasAllowedMime = Boolean(mime && ACCEPTED_ENROLLMENT_MIME_TYPES.has(mime));

  if (ext && !hasAllowedExt) {
    return `Unsupported file type (.${ext}) for "${file.name}". Please upload a ${ACCEPTED_ENROLLMENT_FORMATS_LABEL} file.`;
  }
  if (mime && !hasAllowedMime) {
    return `Unsupported file format${ext ? ` (.${ext})` : ""} for "${file.name}". Please upload a ${ACCEPTED_ENROLLMENT_FORMATS_LABEL} file.`;
  }
  if (!hasAllowedExt && !hasAllowedMime) {
    return `Unsupported file format for "${file.name}". Please upload a ${ACCEPTED_ENROLLMENT_FORMATS_LABEL} file.`;
  }
  if (file.size === 0) {
    return `The selected file "${file.name}" is empty. Please upload a readable PDF or image document.`;
  }
  if (file.size > MAX_ENROLLMENT_FILE_SIZE_BYTES) {
    return `File "${file.name}" exceeds the maximum upload limit of 15 MB.`;
  }
  return null;
}

export interface EnrolledSubjectItem {
  subject_code: string;
  descriptive_title: string;
  units: number;
  section?: string;
  schedule?: string;
  room?: string;
  prerequisites?: string[];
  status?: "ON_TRACK" | "OFF_TRACK" | "PREREQUISITE_CLEARED" | "MISSING_PREREQUISITE" | string;
  curriculum_subject_id?: number;
  unmet_prerequisites?: string[];
  remarks?: string;
}

export interface BillingBreakdown {
  tuition_fee?: number;
  lab_fees?: number;
  misc_fees?: number;
  other_fees?: number;
  previous_balance?: number;
  discounts?: number;
  net_balance_due?: number;
}

export interface CrossDocReconciliation {
  is_match: boolean;
  student_id_match?: boolean;
  student_name_match?: boolean;
  confidence_score: number;
  mismatches: string[];
}

export interface TermEnrollment {
  enrollment_id: number;
  scholar_profile_id: number;
  academic_year: string;
  semester: string;
  year_level: number;
  is_consolidated: boolean;
  cor_document_id?: number | null;
  soa_document_id?: number | null;
  total_units: number;
  total_assessment: number;
  assessment_date?: string | null;
  status: "PENDING_REVIEW" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED" | string;
  audit_flags?: string[] | null;
  enrolled_subjects?: EnrolledSubjectItem[] | null;
  billing_breakdown?: BillingBreakdown | null;
  cross_doc_reconciliation?: CrossDocReconciliation | null;
  reviewed_by_employee_id?: number | null;
  reviewed_at?: string | null;
  coordinator_notes?: string | null;
  disbursement_id?: number | null;
  disbursement?: {
    disbursement_id: number;
    amount: number;
    status: "PENDING" | "RELEASED" | "CLAIMED" | "CANCELLED" | string;
    check_number?: string | null;
    check_payee?: string | null;
    voucher_number?: string | null;
    bank_name?: string | null;
    payment_method?: string | null;
    date_issued?: string | null;
    date_claimed?: string | null;
    remarks?: string | null;
  } | null;
  cor_document?: {
    document_id: number;
    file_url: string;
    file_name: string;
    file_size?: string;
  } | null;
  soa_document?: {
    document_id: number;
    file_url: string;
    file_name: string;
    file_size?: string;
  } | null;
  scholar_profile?: {
    profile_id: number;
    first_name: string;
    last_name: string;
    student_number?: string;
    course_of_study?: string;
    school_name?: string;
    current_year_level?: number;
    school_grading_system?: SchoolGradingSystem | null;
    prospectus?: ScholarProspectus | null;
  };
  created_at: string;
  updated_at: string;
}

export interface EnrollmentAuditResult {
  all_cleared: boolean;
  flags: string[];
  total_units: number;
  overload_flag?: boolean;
  underload_flag?: boolean;
  subjects_audit: EnrolledSubjectItem[];
  cross_doc_reconciliation?: CrossDocReconciliation;
}

export interface AcademicStandingLock {
  is_locked: boolean;
  reason?: "APPEAL_PENDING" | "APPEAL_REQUIRED" | "DISCONTINUED" | string;
  appeal_status?: string;
  report_id?: number;
  academic_year?: string;
  semester?: string;
  gpa?: number;
  evaluation_flag?: string;
  archive_reason?: string | null;
  scholar_name?: string;
  student_number?: string;
  course_of_study?: string;
  grantor_email?: string;
  coordinator_email?: string;
  message?: string;
}

export interface CurrentEnrollmentState {
  scholar: {
    profile_id: number;
    first_name: string;
    last_name: string;
    student_number?: string;
    course_of_study?: string;
    school_name?: string;
    current_year_level?: number;
    prospectus?: ScholarProspectus | null;
    school_grading_system?: SchoolGradingSystem | null;
  };
  enrollment?: TermEnrollment | null;
  completed_previous_enrollment?: TermEnrollment | null;
  prospectus_frozen: boolean;
  academic_lock?: AcademicStandingLock | null;
}

export interface SubmitEnrollmentPayload {
  academic_year: string;
  semester: string;
  year_level: number;
  is_consolidated?: boolean;
  cor_document_id?: number;
  soa_document_id?: number;
  total_units: number;
  total_assessment: number;
  assessment_date?: string;
  enrolled_subjects: EnrolledSubjectItem[];
  billing_breakdown?: BillingBreakdown;
}

export interface ExtractedEnrollmentResponse {
  document_id: number;
  file_url: string;
  extracted_data: {
    student_name?: string;
    student_number?: string;
    school_name?: string;
    course_name?: string;
    academic_year?: string;
    semester?: string;
    year_level?: number;
    total_units?: number;
    assessment_date?: string;
    total_assessment?: number;
    tuition_fee?: number;
    lab_fees?: number;
    misc_fees?: number;
    other_fees?: number;
    previous_balance?: number;
    discounts?: number;
    net_balance_due?: number;
    subjects?: EnrolledSubjectItem[];
  };
  draft_enrollment?: TermEnrollment;
  audit_result?: EnrollmentAuditResult;
}

// 1. Get current scholar enrollment state
export async function getCurrentEnrollment(academicYear?: string, semester?: string): Promise<CurrentEnrollmentState> {
  const query = new URLSearchParams();
  if (academicYear) query.set("academic_year", academicYear);
  if (semester) query.set("semester", semester);
  const qStr = query.toString();
  return apiGet<CurrentEnrollmentState>(`${E}/current${qStr ? `?${qStr}` : ""}`);
}

async function uploadEnrollmentDocument(
  endpoint: string,
  fallbackError: string,
  file: File,
): Promise<ExtractedEnrollmentResponse> {
  const validationError = validateEnrollmentDocumentFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const preparedFile = await compressDocumentImage(file);
  const formData = new FormData();
  formData.append("files", preparedFile);

  const res = await fetch(`${E}/${endpoint}`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const rawMsg = Array.isArray(err?.message) ? err.message.join(". ") : err?.message;
    const isOpaqueServerError = typeof rawMsg === "string" && /^internal\s+server\s+error$/i.test(rawMsg.trim());
    throw new Error(!isOpaqueServerError && rawMsg ? rawMsg : fallbackError);
  }
  return res.json();
}

// 2. Upload COR document
export async function uploadCorDocument(file: File): Promise<ExtractedEnrollmentResponse> {
  return uploadEnrollmentDocument(
    "upload-cor",
    "We could not read a valid Certificate of Registration (COR) from this file. Please make sure you uploaded the correct document.",
    file,
  );
}

// 3. Upload SOA document
export async function uploadSoaDocument(file: File): Promise<ExtractedEnrollmentResponse> {
  return uploadEnrollmentDocument(
    "upload-soa",
    "We could not read a valid Statement of Account (SOA) from this file. Please make sure you uploaded the correct assessment or billing document.",
    file,
  );
}

// 4. Upload Consolidated COR+SOA document
export async function uploadConsolidatedDocument(file: File): Promise<ExtractedEnrollmentResponse> {
  return uploadEnrollmentDocument(
    "upload-consolidated",
    "We could not read a valid Consolidated Enrollment & Assessment form from this file. Please verify the document and try again.",
    file,
  );
}

// 5. Run pre-audit checks
export async function runPreAudit(payload: SubmitEnrollmentPayload): Promise<EnrollmentAuditResult> {
  return apiPost<EnrollmentAuditResult>(`${E}/pre-audit`, payload);
}

// 6. Save or update draft enrollment
export async function saveEnrollmentDraft(
  payload: SubmitEnrollmentPayload,
): Promise<{ message: string; enrollment: TermEnrollment; audit_result: EnrollmentAuditResult }> {
  return apiPost<{ message: string; enrollment: TermEnrollment; audit_result: EnrollmentAuditResult }>(
    `${E}/draft`,
    payload,
  );
}

// 7. Discard draft enrollment
export async function discardEnrollmentDraft(
  academicYear?: string,
  semester?: string,
): Promise<{ message: string; count: number }> {
  const query = new URLSearchParams();
  if (academicYear) query.set("academic_year", academicYear);
  if (semester) query.set("semester", semester);
  const qStr = query.toString();
  return apiDelete<{ message: string; count: number }>(`${E}/draft${qStr ? `?${qStr}` : ""}`);
}

// 7b. Clear a specific document from draft
export async function clearDraftDocument(
  docType: "cor" | "soa" | "consolidated",
): Promise<{ message: string; count?: number }> {
  return apiDelete<{ message: string; count?: number }>(`${E}/draft/document/${docType}`);
}

// 8. Submit final enrollment
export async function submitTermEnrollment(
  payload: SubmitEnrollmentPayload,
): Promise<{ message: string; enrollment: TermEnrollment; audit_result: EnrollmentAuditResult }> {
  return apiPost<{ message: string; enrollment: TermEnrollment; audit_result: EnrollmentAuditResult }>(
    `${E}/submit`,
    payload,
  );
}

// 7. Coordinator: Get pending queue
export async function getCoordinatorPendingEnrollments(search?: string, status?: string): Promise<TermEnrollment[]> {
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (status) query.set("status", status);
  const qStr = query.toString();
  return apiGet<TermEnrollment[]>(`${E}/coordinator/pending${qStr ? `?${qStr}` : ""}`);
}

// 8. Coordinator: Get enrollment details
export async function getCoordinatorEnrollmentDetails(enrollmentId: number): Promise<TermEnrollment> {
  return apiGet<TermEnrollment>(`${E}/coordinator/${enrollmentId}`);
}

// 9. Coordinator: Review enrollment (Approve / Request Changes / Reject)
export async function reviewCoordinatorEnrollment(
  enrollmentId: number,
  payload: {
    action: "APPROVE" | "REQUEST_CHANGES" | "REJECT";
    coordinator_notes?: string;
    approved_amount?: number;
    adjusted_subjects?: EnrolledSubjectItem[];
  },
): Promise<{ message: string; enrollment: TermEnrollment; disbursement?: Record<string, unknown> }> {
  return apiPost<{ message: string; enrollment: TermEnrollment; disbursement?: Record<string, unknown> }>(
    `${E}/coordinator/${enrollmentId}/review`,
    payload,
  );
}

// 10. Grantor: Authorize and release disbursement for approved enrollment
export async function authorizeGrantorDisbursement(
  enrollmentId: number,
  payload?: {
    remarks?: string;
    check_number?: string;
    payment_method?: string;
  },
): Promise<{ message: string; disbursement: Record<string, unknown> }> {
  return apiPost<{ message: string; disbursement: Record<string, unknown> }>(
    `${E}/grantor/${enrollmentId}/authorize-disbursement`,
    payload || {},
  );
}
