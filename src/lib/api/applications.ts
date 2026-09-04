import { apiGet, apiPost, apiPatch } from "../api";

const B = "/api/proxy/applications";

export type ApplicationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface Application {
  id: number;
  scholarship_track: string;
  student_number: string;
  student_address: string;
  course_of_study: string;
  school_name: string;
  school_address: string;
  phone_number?: string;
  relative_employee?: string;
  status: ApplicationStatus;
  stage: string;
  interview_at?: string;
  interview_meeting_link?: string;
  reschedule_reason?: string;
  provider_notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  applicant?: import("./auth").User;
}

export interface ApplicationStageTimeline {
  application: Application;
  stages: {
    stage: string;
    status: string;
    timestamp: string;
  }[];
}

export function createApplication(data: {
  scholarship_track: string;
  student_number: string;
  student_address: string;
  course_of_study: string;
  school_name: string;
  school_address: string;
  phone_number?: string;
  relative_employee?: string;
}) {
  return apiPost<Application>(B, data);
}

export function getMyApplication() {
  return apiGet<ApplicationStageTimeline>(`${B}/me`);
}

export function requestReschedule(data: {
  reason: string;
  preferred_availability?: string;
}) {
  return apiPost<{ ok: boolean }>(`${B}/me/request-reschedule`, data);
}

export function listApplications(params?: {
  status?: ApplicationStatus;
  track?: string;
  search?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.track) qs.set("track", params.track);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return apiGet<Application[]>(`${B}${query ? `?${query}` : ""}`);
}

export function scheduleInterview(
  id: number,
  data: {
    interview_at: string;
    duration_minutes?: number;
    provider_notes?: string;
    manual_meeting_link?: string;
  },
) {
  return apiPost<Application>(`${B}/${id}/schedule-interview`, data);
}

export function rescheduleInterview(
  id: number,
  data: {
    new_interview_at: string;
    duration_minutes?: number;
    reschedule_notes?: string;
    manual_meeting_link?: string;
  },
) {
  return apiPatch<Application>(`${B}/${id}/reschedule-interview`, data);
}

export function updateStage(
  id: number,
  data: {
    status: ApplicationStatus;
    stage: string;
    interview_at?: string;
    interview_meeting_link?: string;
    interview_calendar_event_id?: string;
    reschedule_reason?: string;
    provider_notes?: string;
    rejection_reason?: string;
  },
) {
  return apiPatch<Application>(`${B}/${id}/stage`, data);
}
