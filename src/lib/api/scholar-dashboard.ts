import { apiGet } from "../api";
import type { SchoolGrading } from "./settings";

export interface ScholarProfileData {
  profile_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  student_number: string;
  school_name?: string;
  course_of_study?: string;
  current_year_level: number;
  academic_baseline_status: string;
  avatar_url?: string;
  banner_url?: string;
}

export interface ScholarAcademicStanding {
  standing_type: "GOOD_STANDING" | "PROBATION" | "ACTION_REQUIRED" | "PENDING_REVIEW";
  gwa: number;
  threshold: number;
  is_on_probation: boolean;
  is_flagged: boolean;
  has_pending_appeal: boolean;
  latest_report: {
    report_id: number;
    academic_year: string;
    semester: string;
    gpa: number;
    status: string;
    evaluation_flag?: string;
    appeal_status: string;
    appeal_notes?: string;
    appeal_decision_notes?: string;
  } | null;
}

export interface ScholarCurriculumData {
  total_units: number;
  passed_units: number;
  percentage: number;
  total_subjects: number;
  passed_subjects_count: number;
  is_frozen: boolean;
  prospectus_status: string;
}

export interface ScholarEnrollmentData {
  enrollment_id: number;
  academic_year: string;
  semester: string;
  year_level: number;
  status: string;
  total_units: number;
  total_assessment: number;
  enrolled_subjects?: unknown;
  audit_flags?: unknown;
  cor_document_id?: number;
  soa_document_id?: number;
  coordinator_notes?: string;
  created_at: string;
}

export interface ScholarDisbursementItem {
  disbursement_id: number;
  academic_year: string;
  semester: string;
  amount: number;
  status: string;
  date_issued?: string;
  date_claimed?: string;
  voucher_number?: string;
  check_number?: string;
  or_number?: string;
  or_document_id?: number;
}

export interface ScholarDisbursementsData {
  latest: ScholarDisbursementItem | null;
  history: ScholarDisbursementItem[];
  total_disbursed_amount: number;
  pending_or_count: number;
}

export interface ScholarCommunicationData {
  unread_messages_count: number;
  coordinator: {
    name: string;
    title: string;
  } | null;
  recent_messages: Array<{
    message_id: number;
    sender_user_id: number;
    message_text: string;
    message_type: string;
    sent_at: string;
    is_read: boolean;
  }>;
}

export interface ScholarMeetingItem {
  meeting_id: number;
  title: string;
  meeting_date: string;
  meeting_time?: string;
  meeting_link?: string;
  status?: string;
  coordinator_name: string;
}

export interface ScholarAnnouncementItem {
  post_id: number;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  created_at: string;
  author_name: string;
}

export interface ScholarDashboardResponse {
  profile: ScholarProfileData;
  school_grading_system?: SchoolGrading | null;
  academic_standing: ScholarAcademicStanding;
  curriculum: ScholarCurriculumData;
  latest_enrollment: ScholarEnrollmentData | null;
  disbursements: ScholarDisbursementsData;
  communication: ScholarCommunicationData;
  upcoming_meetings: ScholarMeetingItem[];
  announcements: ScholarAnnouncementItem[];
}

export function getScholarDashboardSummary() {
  return apiGet<ScholarDashboardResponse>("/api/proxy/academic-baseline/scholar/dashboard-summary");
}
