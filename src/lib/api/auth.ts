import { apiGet, apiPatch, apiPost } from "../api";

const B = "/api/auth";

export interface User {
  user_id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  scholar_profile?: {
    profile_id: number;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    student_address?: string;
    school_address?: string;
    student_number?: string;
    course_of_study?: string;
    school_name?: string;
    current_year_level?: number;
    year_level?: number;
    scholarship_track?: string;
    relative_employee?: string;
    academic_baseline_status?: string;
    avatar_url?: string | null;
    banner_url?: string | null;
    bio?: string | null;
    home_address?: string | null;
    school_grading_system?: {
      school_id?: number;
      school_name?: string;
      grading_scale?: string;
      passing_grade?: number;
      highest_grade?: number;
      failing_grade?: number;
      min_grade?: number;
      max_grade?: number;
      special_codes?: Record<string, string>;
    } | null;
  };
  employee?: {
    employee_id: number;
    first_name?: string;
    last_name?: string;
    bio?: string;
    avatar_url?: string;
    banner_url?: string;
    title?: string;
    department?: string;
  };
}

export interface LoginResponse {
  user: User;
}

export interface RegisterResponse {
  user: User;
}

export function login(email: string, password: string, remember?: boolean) {
  return apiPost<LoginResponse>(`${B}/login`, { email, password, remember });
}

export function register(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}) {
  return apiPost<RegisterResponse>(`${B}/register`, data);
}

export function getMe() {
  return apiGet<User>(`${B}/me`);
}

export function updateMe(data: {
  first_name?: string;
  last_name?: string;
  bio?: string;
  phone_number?: string;
  student_address?: string;
  school_address?: string;
  student_number?: string;
  course_of_study?: string;
  school_name?: string;
  current_year_level?: number;
  scholarship_track?: string;
  title?: string;
  department?: string;
}) {
  return apiPatch<User>(`${B}/me`, data);
}

export function uploadAvatar(file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiPost<{ avatar_url: string }>(`${B}/me/avatar`, form);
}

export function uploadBanner(file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiPost<{ banner_url: string }>(`${B}/me/banner`, form);
}

export function logout() {
  return apiPost<{ ok: boolean }>(`${B}/logout`);
}

export function requestPasswordReset(email: string) {
  return apiPost<{ message: string }>(`${B}/forgot-password`, { email });
}

export function executePasswordReset(token: string, new_password: string) {
  return apiPost<{ message: string }>(`${B}/reset-password`, {
    token,
    new_password,
  });
}

export function googleLogin(credential: string) {
  return apiPost<LoginResponse>(`${B}/google`, { credential });
}
