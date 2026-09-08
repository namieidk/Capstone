import { apiGet, apiPost } from "../api";

const B = "/api/proxy/meetings";
const AB = "/api/proxy/applications";

export type MeetingStatus = "SCHEDULED" | "RESCHEDULED" | "CANCELLED";

export interface StaffMeeting {
  meeting_id: number;
  scholar_profile_id: number | null;
  employee_id: number | null;
  application_id: number | null;
  title: string;
  meeting_date: string;
  meeting_time?: string | null;
  scheduled_at: string | null;
  duration_minutes?: number | null;
  meeting_link?: string | null;
  calendar_event_id?: string | null;
  invitee_role?: string | null;
  status: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  application?: {
    application_id: number;
    status: string;
    stage: string;
  } | null;
  scholar_profile?: {
    profile_id: number;
    first_name: string;
    last_name: string;
    course_of_study?: string | null;
    scholarship_track?: string | null;
  } | null;
  employee?: {
    employee_id: number;
    first_name: string;
    last_name: string;
    title?: string | null;
    user?: { role: string } | null;
  } | null;
}

export interface MeetingsResponse {
  data: StaffMeeting[];
  total: number;
  page: number;
  limit: number;
}

export function listMeetings(params?: {
  status?: string;
  from?: string;
  to?: string;
  applicationId?: number;
  page?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.from) qs.set("from", params.from);
  if (params?.to) qs.set("to", params.to);
  if (params?.applicationId) qs.set("applicationId", String(params.applicationId));
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiGet<MeetingsResponse>(`${B}${query ? `?${query}` : ""}`);
}

export function getMeeting(id: number) {
  return apiGet<StaffMeeting>(`${B}/${id}`);
}

export function cancelInterview(id: number, data?: { reason?: string }) {
  return apiPost<import("./applications").Application>(`${AB}/${id}/cancel-interview`, data ?? {});
}
