import { apiDelete, apiGet, apiPatch, apiPost } from "../api";

const B = "/api/proxy/settings";

export interface SystemSettings {
  grade_threshold: number;
  updated_at: string;
}

export interface SchoolGrading {
  id: number;
  school_name: string;
  grading_scale: string;
  passing_grade: number;
  highest_grade: number;
  failing_grade: number;
  special_codes?: Record<string, unknown>;
  notes?: string;
}

export function getSettings() {
  return apiGet<SystemSettings>(B);
}

export function updateSettings(data: { grade_threshold: number }) {
  return apiPatch<SystemSettings>(B, data);
}

export function getSchools() {
  return apiGet<SchoolGrading[]>(`${B}/schools`);
}

export function createSchool(data: {
  school_name: string;
  grading_scale: string;
  passing_grade: number;
  highest_grade: number;
  failing_grade: number;
  special_codes?: Record<string, unknown>;
  notes?: string;
}) {
  return apiPost<SchoolGrading>(`${B}/schools`, data);
}

export function deleteSchool(id: number) {
  return apiDelete<{ ok: boolean }>(`${B}/schools/${id}`);
}

export function updateSchool(
  id: number,
  data: Partial<{
    school_name: string;
    grading_scale: string;
    passing_grade: number;
    highest_grade: number;
    failing_grade: number;
    special_codes: Record<string, unknown>;
    notes: string;
  }>,
) {
  return apiPatch<SchoolGrading>(`${B}/schools/${id}`, data);
}
