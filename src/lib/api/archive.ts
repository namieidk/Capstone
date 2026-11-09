import { apiGet, apiPatch } from "../api";

const B = "/api/proxy/archive";

export type ArchiveEntity = "scholar" | "applicant" | "school" | "program";

export type ScholarArchiveReason = "GRADUATED" | "FAILED_SECOND_CHANCE" | "WITHDRAWN" | "TERMINATED" | "OTHER";

export type SchoolArchiveReason = "SCHOOL_CLOSED" | "OTHER";

export type ProgramArchiveReason = "PROGRAM_OUTDATED" | "PROGRAM_REMOVED" | "OTHER";

export type ApplicantArchiveReason = "APPLICATION_REJECTED" | "OTHER";

// Reason union for building badges/labels from any entity
export type ArchiveReason = ScholarArchiveReason | SchoolArchiveReason | ProgramArchiveReason | ApplicantArchiveReason;

export const SCHOLAR_ARCHIVE_REASONS = [
  "GRADUATED",
  "FAILED_SECOND_CHANCE",
  "WITHDRAWN",
  "TERMINATED",
  "OTHER",
] as const;

export const SCHOOL_ARCHIVE_REASONS = ["SCHOOL_CLOSED", "OTHER"] as const;

export const PROGRAM_ARCHIVE_REASONS = ["PROGRAM_OUTDATED", "PROGRAM_REMOVED", "OTHER"] as const;

export const APPLICANT_ARCHIVE_REASONS = ["APPLICATION_REJECTED", "OTHER"] as const;

export function archiveReasonLabel(reason?: string | null): string {
  if (!reason) return "Other";
  switch (reason) {
    case "GRADUATED":
      return "Graduated";
    case "FAILED_SECOND_CHANCE":
      return "Failed 2nd chance";
    case "WITHDRAWN":
      return "Withdrawn";
    case "TERMINATED":
      return "Terminated";
    case "SCHOOL_CLOSED":
      return "School closed";
    case "PROGRAM_OUTDATED":
      return "Program outdated";
    case "PROGRAM_REMOVED":
      return "Program removed";
    case "APPLICATION_REJECTED":
      return "Application rejected";
    case "OTHER":
      return "Other";
    default:
      return reason.replaceAll("_", " ").toLowerCase();
  }
}

function archiveReasonBadge(reason?: string | null): string {
  switch (reason) {
    case "GRADUATED":
      return "good";
    case "FAILED_SECOND_CHANCE":
    case "TERMINATED":
      return "bad";
    case "WITHDRAWN":
    case "PROGRAM_OUTDATED":
      return "warn";
    default:
      return "neutral";
  }
}

export { archiveReasonBadge };

// ---------- Entity row shapes (mirrors the backend archive service) ----------

export interface ArchivedUserRef {
  user_id: number;
  email: string;
  role: string;
  is_active: boolean;
}

export interface ArchivedApplication {
  application_id: number;
  status: string;
  stage: string;
  rejection_reason: string | null;
  decision_at: string | null;
  archived_at: string | null;
}

export interface ArchivedScholarProfile {
  profile_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  student_number: string | null;
  course_of_study: string | null;
  scholarship_track: string | null;
  school_name: string | null;
  archived_at: string | null;
  archived_by_user_id: number | null;
  archive_reason: ArchiveReason | null;
  archive_notes: string | null;
  academic_baseline_status: string;
  user: ArchivedUserRef;
  school?: {
    school_id: number;
    school_name: string;
    school_code: string | null;
  } | null;
  applications?: ArchivedApplication[];
}

export type ArchivedApplicantProfile = Omit<ArchivedScholarProfile, "user"> & {
  user: ArchivedUserRef;
  applications: ArchivedApplication[];
};

export interface ArchivedSchool {
  school_id: number;
  school_name: string;
  school_code: string | null;
  address: string | null;
  contact_email: string | null;
  contact_number: string | null;
  is_active: boolean;
  grading_system_id: number | null;
  archived_at: string | null;
  archive_reason: SchoolArchiveReason | null;
  archive_notes: string | null;
  grading_system?: {
    school_id: number;
    school_name: string;
    grading_scale: string;
  } | null;
  _count?: { scholar_profiles: number };
}

export interface ArchivedProgram {
  program_id: number;
  program_code: string;
  program_name: string;
  category: string | null;
  description: string | null;
  is_active: boolean;
  archived_at: string | null;
  archive_reason: ProgramArchiveReason | null;
  archive_notes: string | null;
}

export interface ArchiveListResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArchiveSummary {
  totals: {
    scholars: number;
    applicants: number;
    schools: number;
    programs: number;
    all: number;
  };
  scholar_reasons: Record<string, number>;
  applicant_reasons: Record<string, number>;
  school_reasons: Record<string, number>;
  program_reasons: Record<string, number>;
}

export interface ListArchivedParams {
  entity: ArchiveEntity;
  reason?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function listArchived(
  params: ListArchivedParams,
): Promise<ArchiveListResult<ArchivedScholarProfile | ArchivedApplicantProfile | ArchivedSchool | ArchivedProgram>> {
  const query = new URLSearchParams();
  query.set("entity", params.entity);
  if (params.reason && params.reason !== "ALL") query.set("reason", params.reason);
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiGet<
    ArchiveListResult<ArchivedScholarProfile | ArchivedApplicantProfile | ArchivedSchool | ArchivedProgram>
  >(`${B}?${query.toString()}`);
}

export async function getArchiveSummary(): Promise<ArchiveSummary> {
  return apiGet<ArchiveSummary>(`${B}/summary`);
}

export interface ArchiveRecordInput {
  archive_reason: string;
  archive_notes?: string;
}

export async function archiveSchool(id: number, data: ArchiveRecordInput): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/schools/${id}`, data);
}

export async function restoreSchool(id: number): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/schools/${id}/restore`, {});
}

export async function archiveProgram(id: number, data: ArchiveRecordInput): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/programs/${id}`, data);
}

export async function restoreProgram(id: number): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/programs/${id}/restore`, {});
}

export async function archiveScholar(id: number, data: ArchiveRecordInput): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/scholars/${id}`, data);
}

export async function restoreScholar(id: number): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/scholars/${id}/restore`, {});
}

export async function archiveApplicant(id: number, data: ArchiveRecordInput): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/applicants/${id}`, data);
}

export async function restoreApplicant(id: number): Promise<{ message: string }> {
  return apiPatch<{ message: string }>(`${B}/applicants/${id}/restore`, {});
}
