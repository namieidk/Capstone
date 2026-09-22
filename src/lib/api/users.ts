import { apiGet, apiPatch, apiPost } from "../api";

const B = "/api/proxy/users";

export interface AuditLogUser {
  user_id: number;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  employee?: { first_name?: string; last_name?: string } | null;
}

export interface AuditLogEntry {
  log_id: number;
  user_id: number;
  action: string;
  details: string;
  created_at: string;
  user: AuditLogUser;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export function listUsers(params?: { role?: string; roles?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.role) qs.set("role", params.role);
  if (params?.roles) qs.set("roles", params.roles);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return apiGet<import("./auth").User[]>(`${B}${query ? `?${query}` : ""}`);
}

export function getAuditLogs(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiGet<AuditLogsResponse>(`${B}/logs${query ? `?${query}` : ""}`);
}

export function getAdminDashboardData() {
  return apiGet<{
    metrics: {
      totalStaff: number;
      activeStaff: number;
      coordinatorCount: number;
      grantorCount: number;
      adminCount: number;
      totalStudents: number;
      activeScholarsCount: number;
      applicantCount: number;
      totalSchools: number;
      verifiedSchools: number;
      gradeThreshold: number;
    };
    staff: Array<{
      id: number;
      name: string;
      initials: string;
      email: string;
      type: "Coordinator" | "Grantor" | "Admin";
      title: string;
      department: string;
      phone: string;
      active: boolean;
      joined: string;
    }>;
    schools: Array<import("./settings").SchoolGrading>;
    settings: import("./settings").GlobalSettings | null;
    recentLogs: Array<AuditLogEntry>;
  }>(`${B}/admin/dashboard`);
}

export function createStaff(data: {
  email: string;
  password: string;
  role: string;
  first_name: string;
  last_name: string;
  title?: string;
  department?: string;
}) {
  return apiPost<{
    message: string;
    user: import("./auth").User;
  }>("/api/proxy/auth/create-staff", data);
}

export function getUser(id: number) {
  return apiGet<import("./auth").User>(`${B}/${id}`);
}

export function updateUserStatus(id: number, is_active: boolean) {
  return apiPatch<import("./auth").User>(`${B}/${id}/status`, { is_active });
}

export function resetPassword(id: number, new_password: string) {
  return apiPatch<{ ok: boolean }>(`${B}/${id}/reset-password`, {
    new_password,
  });
}
