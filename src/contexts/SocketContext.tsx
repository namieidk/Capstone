"use client";

import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useToast } from "@/components/ToastContext";
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

  useEffect(() => {
    if (!user) {
      if (activeSocketRef.current) {
        activeSocketRef.current.disconnect();
        activeSocketRef.current = null;
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

        // If we already have a connected socket with the same user, reuse it
        if (activeSocketRef.current?.connected) {
          return;
        }

        const socketInstance = io(getSocketUrl(), {
          auth: {
            token: `Bearer ${token}`,
          },
          transports: ["websocket", "polling"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 2000,
        });

        socketInstance.on("connect", () => {
          if (!isMounted) return;
          setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
          if (!isMounted) return;
          setIsConnected(false);
        });

        // Global lifecycle notifications
        socketInstance.on("user:role_promoted", () => {
          showToast("🎉 Congratulations! You have been officially promoted to Scholar!", "success");
          refreshUser();
        });

        const staffRoles = ["ADMIN", "COORDINATOR", "GRANTOR"];
        const isStaff = staffRoles.includes(user?.role || "");

        socketInstance.on("application:submitted", (data: { trackName?: string }) => {
          if (isStaff) {
            showToast(`New application submitted for ${data?.trackName || "scholarship"}!`, "success");
          }
        });

        socketInstance.on("document:confirmed_by_applicant", (data: { studentName?: string }) => {
          if (isStaff) {
            showToast(`${data?.studentName || "Applicant"} confirmed their submitted documents.`, "success");
          }
        });

        socketInstance.on("document:changes_requested", (data: { reason?: string }) => {
          showToast(`Document changes requested: ${data?.reason || "Please review your documents."}`, "error");
        });

        socketInstance.on("document:verified", () => {
          showToast("Your documents were verified! Application moved to Under Review.", "success");
        });

        socketInstance.on("application:stage_updated", (data: { newStage?: string; status?: string }) => {
          const label = data?.newStage || data?.status;
          if (label) {
            showToast(`Application milestone updated: ${label}`, "success");
          }
        });

        socketInstance.on("interview:scheduled", () => {
          showToast("An interview meeting has been scheduled.", "success");
        });

        socketInstance.on("interview:reschedule_requested", () => {
          if (isStaff) {
            showToast("A reschedule request was submitted for an interview.", "success");
          }
        });

        socketInstance.on("interview:rescheduled", () => {
          showToast("Interview meeting has been rescheduled.", "success");
        });

        socketInstance.on("interview:cancelled", () => {
          showToast("An interview meeting was cancelled.", "error");
        });

        socketInstance.on("contract:created", () => {
          showToast("Your scholarship agreement is ready for review and signing!", "success");
        });

        socketInstance.on("contract:changes_requested", () => {
          showToast("Revisions requested on scholarship agreement.", "error");
        });

        socketInstance.on("contract:signed", () => {
          showToast("Scholarship agreement has been signed!", "success");
        });

        socketInstance.on("forum:comment_notification", (data: { postTitle?: string; authorName?: string }) => {
          showToast(
            `${data?.authorName || "Someone"} replied to your discussion: "${data?.postTitle || "Forum post"}"`,
            "success",
          );
        });

        activeSocketRef.current = socketInstance;
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
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user, refreshUser, showToast]);

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
