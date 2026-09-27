import type { AppNotification } from "@/contexts/NotificationContext";
import { apiDelete, apiGet, apiPatch } from "../api";

const B = "/api/proxy/notifications";

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

export function getNotifications(params?: { limit?: number; unreadOnly?: boolean }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.unreadOnly !== undefined) qs.set("unreadOnly", String(params.unreadOnly));
  const query = qs.toString();
  return apiGet<NotificationsResponse>(`${B}${query ? `?${query}` : ""}`);
}

export function getUnreadNotificationCount() {
  return apiGet<{ unreadCount: number }>(`${B}/unread-count`);
}

export function markNotificationAsRead(id: string) {
  return apiPatch<{ success: boolean; notificationId: string; unreadCount: number }>(`${B}/${id}/read`);
}

export function markAllNotificationsAsRead() {
  return apiPatch<{ success: boolean; unreadCount: number }>(`${B}/read-all`);
}

export function deleteNotification(id: string) {
  return apiDelete<{ success: boolean; unreadCount: number }>(`${B}/${id}`);
}

export function clearAllNotifications() {
  return apiDelete<{ success: boolean; unreadCount: number }>(B);
}
