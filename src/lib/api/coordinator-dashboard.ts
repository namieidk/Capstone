import { apiGet } from "../api";

export interface CoordinatorDashboardKpis {
  totalScholars: number;
  goodStandingCount: number;
  probationCount: number;
  actionRequiredCount: number;
  pendingBaselineFreezeCount: number;
  totalApplicants: number;
  pendingReviewApplicants: number;
  endorsedApplicantsCount: number;
  pendingEnrollmentsCount: number;
  pendingOrCount: number;
  totalDisbursedSum: number;
  unreadMessagesCount: number;
}

export interface CoordinatorApplicantItem {
  id: number;
  name: string;
  track: string;
  school: string;
  stage: string;
  status: string;
  submitted_at: string;
}

export interface CoordinatorScholarItem {
  id: number;
  user_id: number;
  name: string;
  email: string;
  school: string;
  course: string;
  gwa: number;
  health: "good" | "warn" | "bad";
  academic_baseline_status: string;
  is_frozen: boolean;
}

export interface CoordinatorEnrollmentQueueItem {
  enrollment_id: number;
  scholar_name: string;
  term: string;
  units: number;
  assessment: number;
  status: string;
  has_cor: boolean;
  has_soa: boolean;
  created_at: string;
}

export interface CoordinatorDisbursementItem {
  disbursement_id: number;
  scholar_name: string;
  term: string;
  amount: number;
  status: string;
  has_or: boolean;
  date_issued: string | null;
  date_claimed: string | null;
}

export interface CoordinatorMeetingItem {
  id: number;
  title: string;
  attendee: string;
  date: string;
  time: string;
  meeting_link?: string;
  status: string;
}

export interface CoordinatorConversationItem {
  id: number;
  scholar_id: number;
  scholar_name: string;
  email: string;
  last_message: string;
  last_message_at: string;
}

export interface CoordinatorDashboardResponse {
  kpis: CoordinatorDashboardKpis;
  applicantStages: Record<string, number>;
  recentApplicants: CoordinatorApplicantItem[];
  scholars: CoordinatorScholarItem[];
  enrollmentQueue: CoordinatorEnrollmentQueueItem[];
  disbursements: CoordinatorDisbursementItem[];
  meetings: CoordinatorMeetingItem[];
  recentConversations: CoordinatorConversationItem[];
}

export function getCoordinatorDashboardData() {
  return apiGet<CoordinatorDashboardResponse>("/api/proxy/users/coordinator/dashboard");
}
