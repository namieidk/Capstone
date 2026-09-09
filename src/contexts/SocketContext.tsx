"use client";

import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useToast } from "@/components/ToastContext";
import { formatRoleLabel, formatStageLabel } from "@/lib/formatters";
import { getSocketUrl } from "@/lib/socket";
import { useAuth } from "./AuthContext";

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeSocketRef = useRef<Socket | null>(null);
  const activeUserIdRef = useRef<number | null>(null);

  const userRef = useRef(user);
  userRef.current = user;
  const refreshUserRef = useRef(refreshUser);
  refreshUserRef.current = refreshUser;
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const userId = user?.user_id ?? null;
  const userRole = user?.role ?? null;

  useEffect(() => {
    if (!userId) {
      if (activeSocketRef.current) {
        activeSocketRef.current.disconnect();
        activeSocketRef.current = null;
        activeUserIdRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    let isMounted = true;

    async function initSocket() {
      try {
        const res = await fetch("/api/auth/token");
        if (!res.ok) return;
        const data = (await res.json()) as { token?: string | null };
        const token = data?.token;

        if (!token || !isMounted) return;

        // If a socket is already active for this exact user, reuse it
        if (activeSocketRef.current?.connected && activeUserIdRef.current === userId) {
          return;
        }

        // If user changed, disconnect previous socket first
        if (activeSocketRef.current) {
          activeSocketRef.current.disconnect();
          activeSocketRef.current = null;
        }

        const socketInstance = io(getSocketUrl(), {
          auth: {
            token: `Bearer ${token}`,
          },
          transports: ["websocket", "polling"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: Number.POSITIVE_INFINITY,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });

        socketInstance.on("connect", () => {
          if (!isMounted) return;
          setIsConnected(true);
          console.log(`[Socket] Connected: ${socketInstance.id} (User: ${userId}, Role: ${userRole})`);
        });

        socketInstance.on("disconnect", (reason) => {
          if (!isMounted) return;
          setIsConnected(false);
          console.warn(`[Socket] Disconnected (Reason: ${reason})`);
        });

        // Global lifecycle notifications
        socketInstance.on("user:role_promoted", (data?: { userId?: number; studentName?: string }) => {
          const isStaff = ["ADMIN", "COORDINATOR", "GRANTOR"].includes(userRef.current?.role || "");
          const isMe = data?.userId ? userRef.current?.user_id === data.userId : !isStaff;

          if (isMe) {
            showToastRef.current("🎉 Congratulations! You have been officially promoted to Scholar!", "success");
            refreshUserRef.current().then(() => {
              if (typeof window !== "undefined" && window.location.pathname.startsWith("/Applicants")) {
                setTimeout(() => {
                  window.location.href = "/scholardashboard";
                }, 1200);
              }
            });
          } else if (isStaff) {
            const student = data?.studentName || "An applicant";
            showToastRef.current(`${student} has signed their agreement and is now officially a Scholar.`, "success");
          }
        });

        socketInstance.on("staff:created", (data: { email?: string; role?: string }) => {
          if (userRef.current?.role === "ADMIN") {
            const roleLabel = formatRoleLabel(data?.role);
            showToastRef.current(
              `New staff account created for ${data?.email || "Employee"} (${roleLabel}).`,
              "success",
            );
          }
        });

        socketInstance.on("user:status_updated", (data: { isActive?: boolean; userId?: number }) => {
          if (data?.isActive === false && userRef.current?.user_id === data.userId) {
            showToastRef.current(
              "Your account has been deactivated. Please contact support if you need assistance.",
              "error",
            );
          }
        });

        socketInstance.on("application:submitted", (data: { trackName?: string }) => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            showToastRef.current(`New application submitted for ${data?.trackName || "scholarship track"}.`, "success");
          }
        });

        socketInstance.on("document:confirmed_by_applicant", (data: { studentName?: string }) => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            showToastRef.current(`${data?.studentName || "An applicant"} confirmed their document details.`, "success");
          }
        });

        socketInstance.on("document:changes_requested", (data: { reason?: string }) => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            showToastRef.current("Document revision request sent to applicant.", "info");
          } else {
            showToastRef.current(
              `Document revisions requested: ${data?.reason || "Please review and re-upload required files."}`,
              "warning",
            );
          }
        });

        socketInstance.on("document:verified", () => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            showToastRef.current("Document verified successfully. Application has moved to Under Review.", "success");
          } else {
            showToastRef.current("Your documents have been verified! Your application is now Under Review.", "success");
          }
        });

        socketInstance.on(
          "application:stage_updated",
          (data: { stage?: string; newStage?: string; status?: string; studentName?: string }) => {
            const rawStage = data?.stage || data?.newStage;
            // Suppress duplicate notification if it was immediately triggered by document verification
            if (rawStage === "Document Verification Complete") {
              return;
            }
            const stageLabel = formatStageLabel(rawStage || data?.status);
            const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
            const isStaff = staffRoles.includes(userRef.current?.role || "");

            if (isStaff) {
              const subject = data?.studentName ? `${data.studentName}'s application` : "Application";
              showToastRef.current(`${subject} has moved to ${stageLabel}.`, "success");
            } else {
              showToastRef.current(`Your application has moved to ${stageLabel}.`, "success");
            }
          },
        );

        socketInstance.on("interview:scheduled", (data?: { studentName?: string }) => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            const student = data?.studentName ? ` for ${data.studentName}` : "";
            showToastRef.current(`Interview meeting scheduled successfully${student}.`, "success");
          } else {
            showToastRef.current("An interview meeting has been scheduled for your application.", "info");
          }
        });

        socketInstance.on("interview:reschedule_requested", () => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            showToastRef.current("An applicant submitted a request to reschedule their interview.", "info");
          }
        });

        socketInstance.on("interview:rescheduled", () => {
          showToastRef.current("Interview meeting has been rescheduled.", "info");
        });

        socketInstance.on("interview:cancelled", () => {
          showToastRef.current("An interview meeting was cancelled.", "warning");
        });

        socketInstance.on("contract:created", (data?: { studentName?: string }) => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            const student = data?.studentName ? ` for ${data.studentName}` : "";
            showToastRef.current(`Scholarship agreement generated${student}.`, "success");
          } else {
            showToastRef.current("Your scholarship agreement is ready for review and signing!", "info");
          }
        });

        socketInstance.on("contract:changes_requested", () => {
          showToastRef.current("Revisions have been requested on the scholarship agreement.", "warning");
        });

        socketInstance.on("contract:signed", (data?: { studentName?: string }) => {
          const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
          if (staffRoles.includes(userRef.current?.role || "")) {
            const student = data?.studentName ? ` by ${data.studentName}` : "";
            showToastRef.current(`The scholarship agreement has been signed${student}.`, "success");
          } else {
            showToastRef.current("Scholarship agreement signed successfully!", "success");
          }
        });

        socketInstance.on("forum:comment_notification", (data: { postTitle?: string; authorName?: string }) => {
          showToastRef.current(
            `${data?.authorName || "Someone"} replied to your discussion: "${data?.postTitle || "Forum post"}"`,
            "info",
          );
        });

        activeSocketRef.current = socketInstance;
        activeUserIdRef.current = userId;
        setSocket(socketInstance);
      } catch (err) {
        console.error("Failed to initialize real-time socket:", err);
      }
    }

    initSocket();

    return () => {
      isMounted = false;
      if (activeSocketRef.current) {
        activeSocketRef.current.disconnect();
        activeSocketRef.current = null;
        activeUserIdRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [userId, userRole]);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}

export function useSocketEvent<T = unknown>(event: string, handler: (data: T) => void) {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) return;

    const eventListener = (data: T) => {
      handlerRef.current?.(data);
    };

    socket.on(event, eventListener);

    return () => {
      socket.off(event, eventListener);
    };
  }, [socket, event]);
}
