"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAllNotifications,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notifications";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

export type NotificationCategory = "application" | "document" | "interview" | "contract" | "chat" | "forum" | "system";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: NotificationCategory;
  link?: string;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (item: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
  addNotification: () => {},
  refreshNotifications: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch persistent notifications from database whenever authenticated user changes
  const refreshNotifications = useCallback(async () => {
    if (!user?.user_id) {
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      const res = await getNotifications({ limit: 50 });
      if (res && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications from database:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    // Reset immediately on user switch to avoid any cross-role leakage
    setNotifications([]);
    if (user?.user_id) {
      void refreshNotifications();
    }
  }, [user?.user_id, refreshNotifications]);

  // 2. Real-time updates via targeted WebSocket room
  useEffect(() => {
    if (!socket || !user?.user_id) return;

    const handleNewNotification = (item: AppNotification) => {
      setNotifications((prev) => {
        // Prevent duplicate notification IDs
        if (prev.some((n) => n.id === item.id)) return prev;
        return [item, ...prev];
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, user?.user_id]);

  // 3. Mark single notification as read in database
  const markAsRead = useCallback((id: string) => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

    // Call database API
    markNotificationAsRead(id).catch((err) => {
      console.error(`Failed to mark notification ${id} as read:`, err);
    });
  }, []);

  // 4. Mark all as read in database
  const markAllAsRead = useCallback(() => {
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // Call database API
    markAllNotificationsAsRead().catch((err) => {
      console.error("Failed to mark all notifications as read:", err);
    });
  }, []);

  // 5. Clear all notifications in database
  const clearAll = useCallback(() => {
    // Optimistic UI update
    setNotifications([]);

    // Call database API
    clearAllNotifications().catch((err) => {
      console.error("Failed to clear notifications:", err);
    });
  }, []);

  // 6. Local addNotification helper for optimistic UI
  const addNotification = useCallback((item: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotification: AppNotification = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
