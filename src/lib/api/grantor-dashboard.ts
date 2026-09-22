import { apiGet } from "../api";

export interface GrantorDashboardKpis {
  endorsedApplicantsCount: number;
  totalApplicants: number;
  pendingAppealsCount: number;
  pendingDisbursementsCount: number;
  pendingDisbursementsSum: number;
  totalScholars: number;
  goodStandingCount: number;
  probationCount: number;
  actionRequiredCount: number;
  totalDisbursedSum: number;
  pendingOrCount: number;
}

export interface GrantorEndorsedApplicantItem {
  id: number;
  name: string;
  email: string;
  track: string;
  school: string;
  stage: string;
  status: string;
  submitted_at?: string;
  stage_updated_at?: string | null;
}

export interface GrantorAppealItem {
  id: number;
  scholar_name: string;
  school: string;
  course: string;
  term: string;
  gpa: number;
  appeal_status: string;
  appeal_notes: string;
  submitted_at?: string;
}

export interface GrantorDisbursementItem {
  disbursement_id: number;
  scholar_name: string;
  term: string;
  amount: number;
  status: string;
  has_or: boolean;
  date_issued?: string | null;
  date_claimed?: string | null;
}

export interface GrantorScholarHealthItem {
  id: number;
  userId: number;
  name: string;
  email: string;
  school: string;
  course: string;
  gwa: number;
  health: "good" | "warn" | "bad";
  academic_baseline_status: string;
  is_frozen: boolean;
}

export interface GrantorMeetingItem {
  id: number;
  title: string;
  attendee: string;
  date?: string;
  time: string;
  meeting_link?: string | null;
  status: string;
}

export interface GrantorConversationItem {
  id: number;
  scholar_id: number;
  scholar_name: string;
  email: string;
  last_message: string;
  last_message_at?: string;
}

export interface GrantorDashboardResponse {
  kpis: GrantorDashboardKpis;
  endorsedApplicants: GrantorEndorsedApplicantItem[];
  pendingAppeals: GrantorAppealItem[];
  pendingDisbursements: GrantorDisbursementItem[];
  scholars: GrantorScholarHealthItem[];
  meetings: GrantorMeetingItem[];
  recentConversations: GrantorConversationItem[];
}

export async function getGrantorDashboardData(): Promise<GrantorDashboardResponse> {
  return apiGet<GrantorDashboardResponse>("/api/proxy/users/grantor/dashboard");
}
