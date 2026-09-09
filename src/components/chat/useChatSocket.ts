"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { type ConversationItem, type MessageItem, markAsRead } from "@/lib/api/chat";

interface UseChatSocketOptions {
  socket: Socket | null;
  activeId: number | null;
  userId?: number;
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  setConvos: React.Dispatch<React.SetStateAction<ConversationItem[]>>;
  setIsPartnerTyping: React.Dispatch<React.SetStateAction<boolean>>;
  onRefreshConvos: () => void;
  onRefreshDirectories: () => void;
}

export function useChatSocket({
  socket,
  activeId,
  userId,
  setMessages,
  setConvos,
  setIsPartnerTyping,
  onRefreshConvos,
  onRefreshDirectories,
}: UseChatSocketOptions) {
  const activeIdRef = useRef<number | null>(activeId);
  activeIdRef.current = activeId;

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    if (activeId !== null) {
      const convoId = Number(activeId);
      socket.emit("chat:join_conversation", { conversationId: convoId });
      socket.emit("chat:join_room", { conversationId: convoId });
    }

    const handleNewMessage = (msg: MessageItem) => {
      if (Number(msg.conversation_id) === Number(activeIdRef.current)) {
        setMessages((prev) => {
          if (prev.some((m) => String(m.message_id) === String(msg.message_id))) return prev;
          return [...prev, msg];
        });
        void markAsRead(msg.conversation_id);
      }

      setConvos((prev) =>
        prev.map((c) => {
          if (Number(c.conversation_id) === Number(msg.conversation_id)) {
            return {
              ...c,
              last_message_at: msg.sent_at,
              last_message_preview: msg.message_text,
              unread_count: Number(msg.conversation_id) === Number(activeIdRef.current) ? 0 : c.unread_count + 1,
            };
          }
          return c;
        }),
      );
    };

    const handleTyping = (data: { conversationId: number; userId: number; isTyping: boolean }) => {
      if (Number(data.conversationId) === Number(activeIdRef.current) && Number(data.userId) !== Number(userId)) {
        setIsPartnerTyping(Boolean(data.isTyping));
      }
    };

    const handleRead = (data: { conversationId: number; readByUserId: number }) => {
      if (Number(data.conversationId) === Number(activeIdRef.current)) {
        setMessages((prev) =>
          prev.map((m) =>
            Number(m.sender_user_id) === Number(userId) ? { ...m, read_at: new Date().toISOString() } : m,
          ),
        );
      }
    };

    const handleMessageRequest = () => {
      onRefreshConvos();
      onRefreshDirectories();
    };

    const handleRequestResponded = (data: { conversationId: number; status: string }) => {
      onRefreshConvos();
      onRefreshDirectories();
      if (Number(data.conversationId) === Number(activeIdRef.current)) {
        setConvos((prev) =>
          prev.map((c) =>
            Number(c.conversation_id) === Number(data.conversationId) ? { ...c, status: data.status } : c,
          ),
        );
      }
    };

    socket.on("chat:new_message", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:messages_read", handleRead);
    socket.on("chat:message_request", handleMessageRequest);
    socket.on("chat:request_responded", handleRequestResponded);

    return () => {
      if (activeId !== null) {
        const convoId = Number(activeId);
        socket.emit("chat:leave_conversation", { conversationId: convoId });
        socket.emit("chat:leave_room", { conversationId: convoId });
      }
      socket.off("chat:new_message", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:messages_read", handleRead);
      socket.off("chat:message_request", handleMessageRequest);
      socket.off("chat:request_responded", handleRequestResponded);
    };
  }, [socket, activeId, userId, setMessages, setConvos, setIsPartnerTyping, onRefreshConvos, onRefreshDirectories]);

  const emitTyping = () => {
    if (!socket || activeIdRef.current === null) return;
    const currentConvoId = Number(activeIdRef.current);

    socket.emit("chat:typing", { conversationId: currentConvoId, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && activeIdRef.current !== null) {
        socket.emit("chat:typing", {
          conversationId: Number(activeIdRef.current),
          isTyping: false,
        });
      }
    }, 1800);
  };

  return { emitTyping };
}
