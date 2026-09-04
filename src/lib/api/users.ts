import { apiGet, apiPatch } from "../api";

const B = "/api/proxy/users";

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  details?: Record<string, unknown>;
  created_at: string;
  user?: { id: number; email: string; first_name: string; last_name: string };
}

export interface PaginatedLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function listUsers(params?: { role?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.role) qs.set("role", params.role);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return apiGet<import("./auth").User[]>(`${B}${query ? `?${query}` : ""}`);
}

export function getAuditLogs(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiGet<PaginatedLogs>(`${B}/logs${query ? `?${query}` : ""}`);
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
