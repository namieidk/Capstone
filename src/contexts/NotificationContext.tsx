"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { formatStageLabel } from "@/lib/formatters";
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
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (item: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
  addNotification: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // 1. Load persisted notifications for the current user
  useEffect(() => {
    if (!user?.user_id) {
      setNotifications([]);
      return;
    }

    try {
      const stored = localStorage.getItem(`viascholar_notifications_${user.user_id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load notifications from storage:", err);
    }
  }, [user?.user_id]);

  // 2. Persist notifications on change
  useEffect(() => {
    if (!user?.user_id) return;
    try {
      localStorage.setItem(`viascholar_notifications_${user.user_id}`, JSON.stringify(notifications.slice(0, 50)));
    } catch (err) {
      console.error("Failed to persist notifications:", err);
    }
  }, [notifications, user?.user_id]);

  const addNotification = useCallback((item: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotification: AppNotification = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // 3. Listen to real-time events via Socket
  useEffect(() => {
    if (!socket || !user) return;

    const isStaff = ["ADMIN", "COORDINATOR", "GRANTOR"].includes(user.role || "");
    const staffApplicantLink = user.role === "GRANTOR" ? "/grantApplicants" : "/CoordinatorApplicants";
    const staffMeetingLink = user.role === "GRANTOR" ? "/grantMeeting" : "/CoordinatorMeeting";
    const staffMessageLink = user.role === "GRANTOR" ? "/grantMessage" : "/CoordinatorMessage";

    const handleRolePromoted = (data?: { userId?: number; studentName?: string }) => {
      if (isStaff) {
        addNotification({
          title: "Applicant Promoted 🎉",
          message: data?.studentName
            ? `${data.studentName} has signed their scholarship agreement and is now officially a Scholar.`
            : "An applicant has signed their scholarship agreement and is now officially a Scholar.",
          category: "system",
          link: staffApplicantLink,
        });
      } else {
        addNotification({
          title: "Role Promoted 🎉",
          message: "Congratulations! You have been officially promoted to Scholar!",
          category: "system",
          link: "/scholardashboard",
        });
      }
    };

    const handleAppSubmitted = (data: { trackName?: string }) => {
      if (isStaff) {
        addNotification({
          title: "New Application Submitted",
          message: `A new application was submitted for ${data?.trackName || "scholarship track"}.`,
          category: "application",
          link: staffApplicantLink,
        });
      }
    };

    const handleDocConfirmed = (data: { studentName?: string }) => {
      if (isStaff) {
        addNotification({
          title: "Documents Confirmed",
          message: `${data?.studentName || "An applicant"} confirmed their document details.`,
          category: "document",
          link: staffApplicantLink,
        });
      }
    };

    const handleDocChanges = (data: { reason?: string }) => {
      if (isStaff) {
        addNotification({
          title: "Document Revision Requested",
          message: "Revisions were requested for applicant documents.",
          category: "document",
          link: staffApplicantLink,
        });
      } else {
        addNotification({
          title: "Document Revision Needed",
          message: data?.reason || "Please review your documents and re-upload required files.",
          category: "document",
          link: "/ApplicantsApplication",
        });
      }
    };

    const handleDocVerified = () => {
      addNotification({
        title: "Documents Verified",
        message: isStaff
          ? "Applicant documents verified. Application moved to Under Review."
          : "Your documents have been verified! Your application is now Under Review.",
        category: "document",
        link: isStaff ? staffApplicantLink : "/ApplicantsApplication",
      });
    };

    const handleStageUpdated = (data: { stage?: string; newStage?: string; status?: string; studentName?: string }) => {
      const rawStage = data?.stage || data?.newStage;
      if (rawStage === "Document Verification Complete") {
        return;
      }
      const stageLabel = formatStageLabel(rawStage || data?.status);
      addNotification({
        title: "Milestone Updated",
        message: isStaff
          ? `${data?.studentName ? `${data.studentName}'s application` : "Application"} moved to ${stageLabel}.`
          : `Your application has moved to ${stageLabel}.`,
        category: "application",
        link: isStaff ? staffApplicantLink : "/ApplicantsDashboard",
      });
    };

    const handleInterviewScheduled = (data?: { studentName?: string }) => {
      if (isStaff) {
        addNotification({
          title: "Interview Scheduled",
          message: data?.studentName
            ? `An interview meeting has been scheduled for ${data.studentName}.`
            : "An interview meeting has been scheduled with the applicant.",
          category: "interview",
          link: staffMeetingLink,
        });
      } else {
        addNotification({
          title: "Interview Scheduled",
          message: "An interview meeting has been scheduled for your application.",
          category: "interview",
          link: "/scholarMeeting",
        });
      }
    };

    const handleInterviewRescheduleReq = () => {
      if (isStaff) {
        addNotification({
          title: "Interview Reschedule Requested",
          message: "A candidate requested to reschedule their interview meeting.",
          category: "interview",
          link: staffMeetingLink,
        });
      }
    };

    const handleContractCreated = (data?: { studentName?: string }) => {
      if (isStaff) {
        addNotification({
          title: "Scholarship Agreement Ready",
          message: data?.studentName
            ? `A scholarship agreement has been prepared for ${data.studentName}.`
            : "A scholarship agreement has been prepared for an applicant.",
          category: "contract",
          link: staffApplicantLink,
        });
      } else {
        addNotification({
          title: "Scholarship Agreement Ready",
          message: "Your scholarship agreement is ready for review and signing!",
          category: "contract",
          link: "/ApplicantsContract",
        });
      }
    };

    const handleContractSigned = (data?: { studentName?: string }) => {
      if (isStaff) {
        addNotification({
          title: "Agreement Signed",
          message: data?.studentName
            ? `${data.studentName} has signed their scholarship agreement.`
            : "The scholarship agreement has been signed by the applicant.",
          category: "contract",
          link: staffApplicantLink,
        });
      } else {
        addNotification({
          title: "Agreement Signed",
          message: "You have successfully signed your scholarship agreement!",
          category: "contract",
          link: "/ApplicantsContract",
        });
      }
    };

    const handleForumComment = (data: { postTitle?: string; authorName?: string }) => {
      addNotification({
        title: "Forum Discussion Reply",
        message: `${data?.authorName || "Someone"} replied to "${data?.postTitle || "Forum discussion"}"`,
        category: "forum",
        link: "/SchoForum",
      });
    };

    const handleMessageRequest = () => {
      if (isStaff) {
        addNotification({
          title: "Message Access Request",
          message: "A scholar requested permission to start a direct message thread with you.",
          category: "chat",
          link: staffMessageLink,
        });
      }
    };

    const handleRequestResponded = (data: { status: string }) => {
      addNotification({
        title: "Message Request Update",
        message: `Your message request was ${data.status === "ACTIVE" ? "accepted! You can now chat." : "declined."}`,
        category: "chat",
        link: "/scholarMessage",
      });
    };

    socket.on("user:role_promoted", handleRolePromoted);
    socket.on("application:submitted", handleAppSubmitted);
    socket.on("document:confirmed_by_applicant", handleDocConfirmed);
    socket.on("document:changes_requested", handleDocChanges);
    socket.on("document:verified", handleDocVerified);
    socket.on("application:stage_updated", handleStageUpdated);
    socket.on("interview:scheduled", handleInterviewScheduled);
    socket.on("interview:reschedule_requested", handleInterviewRescheduleReq);
    socket.on("contract:created", handleContractCreated);
    socket.on("contract:signed", handleContractSigned);
    socket.on("forum:comment_notification", handleForumComment);
    socket.on("chat:message_request", handleMessageRequest);
    socket.on("chat:request_responded", handleRequestResponded);

    return () => {
      socket.off("user:role_promoted", handleRolePromoted);
      socket.off("application:submitted", handleAppSubmitted);
      socket.off("document:confirmed_by_applicant", handleDocConfirmed);
      socket.off("document:changes_requested", handleDocChanges);
      socket.off("document:verified", handleDocVerified);
      socket.off("application:stage_updated", handleStageUpdated);
      socket.off("interview:scheduled", handleInterviewScheduled);
      socket.off("interview:reschedule_requested", handleInterviewRescheduleReq);
      socket.off("contract:created", handleContractCreated);
      socket.off("contract:signed", handleContractSigned);
      socket.off("forum:comment_notification", handleForumComment);
      socket.off("chat:message_request", handleMessageRequest);
      socket.off("chat:request_responded", handleRequestResponded);
    };
  }, [socket, user, addNotification]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
