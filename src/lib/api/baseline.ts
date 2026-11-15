import type { ActiveScholar } from "@/components/Coordinatorshared";
import { apiGet, apiPatch, apiPost, apiPut } from "../api";
import { compressDocumentImage } from "../image-compression";

const B = "/api/proxy/academic-baseline";
const S = "/api/proxy/settings";

export interface SchoolGradingSystem {
  school_id: number;
  school_name: string;
  grading_scale: string;
  passing_grade: number;
  highest_grade: number;
  failing_grade: number;
  min_grade?: number | null;
  max_grade?: number | null;
  is_verified: boolean;
  special_codes?: Record<string, string> | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProspectusSubject {
  subject_id: number;
  prospectus_id: number;
  subject_code: string;
  descriptive_title: string;
  units: number;
  year_level: number;
  semester: string;
  prerequisites?: string[] | null;
  status: "UNTAKEN" | "CREDITED" | "ENROLLED" | "PASSED" | "FAILED" | string;
  grade?: number | null;
  historical_document_id?: number | null;
  credited_term?: string | null;
  remarks?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScholarProspectus {
  prospectus_id: number;
  scholar_profile_id: number;
  document_id?: number | null;
  curriculum_year: string;
  course_code?: string | null;
  course_name: string;
  total_units?: number | null;
  is_frozen: boolean;
  frozen_at?: string | null;
  frozen_by_employee_id?: number | null;
  status: "DRAFT" | "PENDING_REVIEW" | "FROZEN" | string;
  created_at: string;
  updated_at: string;
  subjects?: ProspectusSubject[];
  document?: {
    document_id: number;
    file_name: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
  } | null;
  frozen_by_employee?: {
    employee_id?: number;
    first_name: string;
    last_name: string;
    title?: string | null;
    user?: {
      role: string;
    } | null;
  } | null;
}

export interface ScholarBaselineState {
  profile_id: number;
  student_name: string;
  student_number?: string | null;
  course_of_study?: string | null;
  current_year_level?: number | null;
  academic_baseline_status: string;
  school_grading_system?: SchoolGradingSystem | null;
  prospectus?: ScholarProspectus | null;
  documents?: Array<{
    document_id: number;
    document_type: string;
    label?: string | null;
    file_name?: string | null;
    file_url: string;
    file_size?: string | null;
    uploaded_at: string;
  }>;
  metrics: {
    total_subjects: number;
    total_units: number;
    credited_subjects: number;
    credited_units: number;
    untaken_subjects: number;
    remaining_units: number;
    is_baseline_frozen: boolean;
  };
}

export interface SelectSchoolInput {
  school_id?: number;
  new_school_name?: string;
  grading_scale?: string;
  passing_grade?: number;
  highest_grade?: number;
  failing_grade?: number;
  min_grade?: number;
  max_grade?: number;
  special_codes?: Record<string, string>;
  notes?: string;
}

export interface UpdateProspectusSubjectInput {
  subject_id?: number;
  subject_code: string;
  descriptive_title: string;
  units: number;
  year_level: number;
  semester: string;
  prerequisites?: string[];
  status?: string;
  grade?: number;
  credited_term?: string;
  remarks?: string;
}

export interface BatchUpdateSubjectsInput {
  curriculum_year?: string;
  course_code?: string;
  course_name?: string;
  subjects: UpdateProspectusSubjectInput[];
}

export interface PendingBaselineItem {
  profile_id: number;
  first_name: string;
  last_name: string;
  student_number?: string | null;
  course_of_study?: string | null;
  school_name?: string | null;
  current_year_level?: number | null;
  academic_baseline_status: string;
  user?: { email: string; role: string };
  school_grading_system?: SchoolGradingSystem | null;
  prospectus?: ScholarProspectus | null;
}

// 1. Get Scholar Baseline State
export async function getMyBaseline(forceRefresh = true): Promise<ScholarBaselineState> {
  return apiGet<ScholarBaselineState>(`${B}/me${forceRefresh ? "?refresh=true" : ""}`);
}

// 2. Select or propose school
export async function selectOrProposeSchool(
  data: SelectSchoolInput,
): Promise<{ message: string; scholar_profile: unknown }> {
  return apiPost<{ message: string; scholar_profile: unknown }>(`${B}/select-school`, data);
}

// 3. Upload Prospectus
export async function uploadProspectus(
  formData: FormData,
): Promise<{ message: string; prospectus: ScholarProspectus; academic_baseline_status: string }> {
  const preparedFormData = new FormData();
  for (const [key, val] of formData.entries()) {
    if (val instanceof File) {
      const compressed = await compressDocumentImage(val);
      preparedFormData.append(key, compressed);
    } else {
      preparedFormData.append(key, val);
    }
  }

  return apiPost<{ message: string; prospectus: ScholarProspectus; academic_baseline_status: string }>(
    `${B}/upload-prospectus`,
    preparedFormData,
  );
}

// 4. Update Prospectus Subjects
export async function updateProspectusSubjects(
  data: BatchUpdateSubjectsInput,
): Promise<{ message: string; prospectus: ScholarProspectus }> {
  return apiPut<{ message: string; prospectus: ScholarProspectus }>(`${B}/prospectus/subjects`, data);
}

// 5. Upload Historical CCG
export async function uploadHistoricalCcg(formData: FormData): Promise<{
  message: string;
  matched_credited: Array<{ subject_code: string; grade: number; title: string }>;
  unmapped_items: Array<{ subject_code: string; grade: number }>;
  prospectus: ScholarProspectus;
  academic_baseline_status: string;
}> {
  const preparedFormData = new FormData();
  for (const [key, val] of formData.entries()) {
    if (val instanceof File) {
      const compressed = await compressDocumentImage(val);
      preparedFormData.append(key, compressed);
    } else {
      preparedFormData.append(key, val);
    }
  }

  return apiPost<{
    message: string;
    matched_credited: Array<{ subject_code: string; grade: number; title: string }>;
    unmapped_items: Array<{ subject_code: string; grade: number }>;
    prospectus: ScholarProspectus;
    academic_baseline_status: string;
  }>(`${B}/upload-historical-ccg`, preparedFormData);
}

// 6. Submit for review
export async function submitBaselineForReview(): Promise<{
  message: string;
  academic_baseline_status: string;
}> {
  return apiPost<{ message: string; academic_baseline_status: string }>(`${B}/submit-for-review`, {});
}

// 7. Coordinator: Pending Baselines
export async function getCoordinatorPendingBaselines(): Promise<PendingBaselineItem[]> {
  return apiGet<PendingBaselineItem[]>(`${B}/coordinator/pending`);
}

// 8. Coordinator: Review Detail
export async function getCoordinatorBaselineReview(scholarProfileId: number): Promise<{
  scholar_profile: {
    profile_id: number;
    student_name: string;
    student_number?: string | null;
    course_of_study?: string | null;
    school_name?: string | null;
    current_year_level?: number | null;
    email: string;
    academic_baseline_status: string;
  };
  school_grading_system?: SchoolGradingSystem | null;
  prospectus?: ScholarProspectus | null;
  documents?: Array<{
    document_id: number;
    document_type: string;
    label?: string | null;
    file_name?: string | null;
    file_url: string;
    file_size?: string | null;
    uploaded_at: string;
  }>;
  metrics: {
    total_subjects: number;
    total_units: number;
    credited_units: number;
    remaining_units: number;
    is_frozen: boolean;
  };
}> {
  return apiGet(`${B}/coordinator/review/${scholarProfileId}`);
}

// 9. Coordinator: Update subjects
export async function coordinatorUpdateSubjects(
  prospectusId: number,
  data: BatchUpdateSubjectsInput,
): Promise<{ message: string; prospectus: ScholarProspectus }> {
  return apiPut<{ message: string; prospectus: ScholarProspectus }>(
    `${B}/coordinator/review/${prospectusId}/subjects`,
    data,
  );
}

// 10. Coordinator: Freeze baseline
export async function freezeBaseline(
  prospectusId: number,
  remarks?: string,
): Promise<{ message: string; prospectus: ScholarProspectus; academic_baseline_status: string }> {
  return apiPost<{ message: string; prospectus: ScholarProspectus; academic_baseline_status: string }>(
    `${B}/coordinator/freeze/${prospectusId}`,
    { remarks },
  );
}

// 11. Coordinator: Unfreeze baseline
export async function unfreezeBaseline(
  prospectusId: number,
): Promise<{ message: string; prospectus: ScholarProspectus; academic_baseline_status: string }> {
  return apiPost<{ message: string; prospectus: ScholarProspectus; academic_baseline_status: string }>(
    `${B}/coordinator/unfreeze/${prospectusId}`,
    {},
  );
}

// 12. List School Grading Systems
export async function listSchoolGradings(): Promise<SchoolGradingSystem[]> {
  return apiGet<SchoolGradingSystem[]>(`${S}/schools`);
}

// 13. Verify School Grading System
export async function verifySchoolGrading(schoolId: number): Promise<SchoolGradingSystem> {
  return apiPatch<SchoolGradingSystem>(`${S}/schools/${schoolId}/verify`, {});
}

// 14. Coordinator: Get Active Scholars
export async function getCoordinatorActiveScholars(): Promise<ActiveScholar[]> {
  return apiGet<ActiveScholar[]>(`${B}/coordinator/active-scholars`);
}

export interface ScholarDetailProfile {
  profile_id: number;
  user_id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  sex?: string | null;
  email: string;
  role: string;
  is_active: boolean;
  is_email_verified: boolean;
  public_profile: boolean;
  phone_number: string;
  is_phone_verified: boolean;
  student_address?: string | null;
  school_address?: string | null;
  student_number?: string | null;
  scholarship_track?: string | null;
  course_of_study?: string | null;
  school_name?: string | null;
  academic_baseline_status: string;
  current_year_level?: number | null;
  bio?: string | null;
  avatar_url?: string | null;
  banner_url?: string | null;
  archived_at?: string | null;
  created_at: string;
}

export interface ScholarDetailDocument {
  document_id: number;
  scholar_profile_id: number;
  document_type: string;
  label?: string | null;
  file_name?: string | null;
  file_url: string;
  file_size?: string | null;
  file_type: string;
  status: string;
  rejection_reason?: string | null;
  uploaded_at: string;
  verified_at?: string | null;
  reviewed_by_employee?: {
    employee_id: number;
    first_name: string;
    last_name: string;
  } | null;
}

export interface ScholarDetailProspectus extends Omit<ScholarProspectus, "subjects" | "document"> {
  frozen_by_employee?: {
    employee_id: number;
    first_name: string;
    last_name: string;
    title?: string | null;
  } | null;
  document?: ScholarDetailDocument | null;
  subjects: ProspectusSubject[];
}

export interface ScholarDetailDisbursement {
  disbursement_id: number;
  scholar_profile_id: number;
  academic_year: string;
  semester: string;
  amount: number;
  voucher_number?: string | null;
  check_payee?: string | null;
  check_number?: string | null;
  bank_name?: string | null;
  payment_method?: string | null;
  status: string;
  date_issued?: string | null;
  date_claimed?: string | null;
  or_number?: string | null;
  or_payment_date?: string | null;
  or_verified_at?: string | null;
  settled_at?: string | null;
  remarks?: string | null;
  created_at: string;
  or_document?: {
    document_id: number;
    file_url: string;
    file_name?: string | null;
    file_type: string;
    status: string;
  } | null;
  approved_by_employee?: {
    employee_id: number;
    first_name: string;
    last_name: string;
  } | null;
  settled_by_employee?: {
    employee_id: number;
    first_name: string;
    last_name: string;
  } | null;
  term_enrollment?: {
    enrollment_id: number;
    academic_year: string;
    semester: string;
    year_level: number;
    total_units: number;
    total_assessment: number;
    status: string;
    cor_document?: { document_id: number; file_url: string; file_name?: string | null } | null;
    soa_document?: { document_id: number; file_url: string; file_name?: string | null } | null;
  } | null;
}

export interface ScholarDetailGradeReport {
  report_id: number;
  academic_year: string;
  semester: string;
  term?: string | null;
  gpa: number;
  status: string;
  evaluation_flag?: string | null;
  is_eligible: boolean;
  appeal_status: string;
  submitted_at: string;
  reviewed_at?: string | null;
  remarks?: string | null;
  document?: {
    document_id: number;
    file_url: string;
    file_name?: string | null;
    status: string;
  } | null;
  grade_items: {
    item_id: number;
    subject_code: string;
    subject_name?: string | null;
    units: number;
    grade: string;
    is_passing: boolean;
  }[];
}

export interface ScholarDetailTermEnrollment {
  enrollment_id: number;
  academic_year: string;
  semester: string;
  year_level: number;
  total_units: number;
  total_assessment: number;
  status: string;
  reviewed_at?: string | null;
  coordinator_notes?: string | null;
  created_at: string;
  cor_document?: { document_id: number; file_url: string; file_name?: string | null; status: string } | null;
  soa_document?: { document_id: number; file_url: string; file_name?: string | null; status: string } | null;
}

export interface ScholarDetailContract {
  contract_id: number;
  contract_number: string;
  status: string;
  effective_date?: string | null;
  expiry_date?: string | null;
  signed_at?: string | null;
  document_url?: string | null;
  signed_document_url?: string | null;
}

export interface CoordinatorScholarDetails {
  scholar_profile: ScholarDetailProfile;
  school_grading_system: SchoolGradingSystem | null;
  prospectus: ScholarDetailProspectus | null;
  documents: ScholarDetailDocument[];
  disbursements: ScholarDetailDisbursement[];
  grade_reports: ScholarDetailGradeReport[];
  term_enrollments: ScholarDetailTermEnrollment[];
  contracts: ScholarDetailContract[];
  metrics: {
    gwa: number | null;
    health: "good" | "warn" | "bad";
    total_subjects: number;
    total_units: number;
    credited_units: number;
    enrolled_units: number;
    remaining_units: number;
    total_documents: number;
    verified_documents: number;
    pending_documents: number;
    total_disbursements: number;
    total_disbursed_amount: number;
    settled_disbursed_amount: number;
  };
}

export async function getCoordinatorScholarDetails(scholarProfileId: number): Promise<CoordinatorScholarDetails> {
  return apiGet<CoordinatorScholarDetails>(`${B}/coordinator/scholars/${scholarProfileId}/details`);
}
