"use client";

import { Loader2, Menu, MessageSquare, Search, Send } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import {
  sendMessage as apiSendMessage,
  type ConversationItem,
  getMessages,
  getUserConversations,
  type MessageItem,
  markAsRead,
} from "@/lib/api/chat";

const NAVY = "#1B2A4A";
const AMBER = "#E5A93C";
const AMBER_BG = "#FDF6E9";
const LINE = "#ECEAE4";
const TINT = "#F3F1EC";
const WHITE = "#FFFFFF";
const GREEN = "#4C9A6A";
const BAD = "#C24A3B";
const SHADOW_SM = "0 4px 14px rgba(20,33,58,0.05)";
const BORDER_SUBTLE = `1px solid ${LINE}`;

interface ChatContainerProps {
  title?: string;
  subtitle?: string;
}

function formatMessageTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "";
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function getInitials(name: string): string {
  if (!name.trim()) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function ChatContainer({ title = "Messages", subtitle = "Chat directly in real-time." }: ChatContainerProps) {
  const { toggleMobile } = useSidebar();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [convos, setConvos] = useState<ConversationItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeIdRef = useRef<number | null>(null);
  activeIdRef.current = activeId;

  // 1. Fetch conversations on mount
  const loadConversations = useCallback(async () => {
    try {
      const data = await getUserConversations();
      setConvos(data);
      if (data.length > 0 && activeIdRef.current === null) {
        setActiveId(data[0].conversation_id);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConvos(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // 2. Fetch messages when activeId changes
  const loadMessages = useCallback(async (conversationId: number) => {
    setLoadingMessages(true);
    try {
      const res = await getMessages(conversationId, { limit: 100 });
      setMessages(res.messages);
      // Mark read in local convos list
      setConvos((prev) => prev.map((c) => (c.conversation_id === conversationId ? { ...c, unread_count: 0 } : c)));
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (activeId !== null) {
      loadMessages(activeId);
    } else {
      setMessages([]);
    }
  }, [activeId, loadMessages]);

  // 3. Socket real-time events for active room
  useEffect(() => {
    if (!socket || activeId === null) return;

    socket.emit("chat:join_conversation", { conversationId: activeId });

    const handleNewMessage = (msg: MessageItem) => {
      if (msg.conversation_id === activeIdRef.current) {
        setMessages((prev) => {
          if (prev.some((m) => m.message_id === msg.message_id)) return prev;
          return [...prev, msg];
        });
        markAsRead(activeId).catch(() => undefined);
      }

      // Update conversation list preview
      setConvos((prev) =>
        prev.map((c) => {
          if (c.conversation_id === msg.conversation_id) {
            return {
              ...c,
              last_message_preview: msg.message_text,
              last_message_at: msg.sent_at,
              unread_count:
                msg.conversation_id === activeIdRef.current || msg.sender_user_id === user?.user_id
                  ? 0
                  : c.unread_count + 1,
            };
          }
          return c;
        }),
      );
    };

    const handleTyping = (payload: { conversationId: number; userId: number; isTyping: boolean }) => {
      if (payload.conversationId === activeIdRef.current && payload.userId !== user?.user_id) {
        setIsPartnerTyping(payload.isTyping);
      }
    };

    const handleMessagesRead = (payload: { conversationId: number; readByUserId: number }) => {
      if (payload.conversationId === activeIdRef.current) {
        setMessages((prev) => prev.map((m) => (m.sender_user_id === user?.user_id ? { ...m, is_read: true } : m)));
      }
    };

    const handleConversationCreated = () => {
      loadConversations();
    };

    socket.on("chat:new_message", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:messages_read", handleMessagesRead);
    socket.on("chat:conversation_created", handleConversationCreated);

    return () => {
      socket.emit("chat:leave_conversation", { conversationId: activeId });
      socket.off("chat:new_message", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:messages_read", handleMessagesRead);
      socket.off("chat:conversation_created", handleConversationCreated);
      setIsPartnerTyping(false);
    };
  }, [socket, activeId, user?.user_id, loadConversations]);

  // Scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages or typing update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  // Handle typing debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    if (!socket || activeId === null) return;

    socket.emit("chat:typing", { conversationId: activeId, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("chat:typing", { conversationId: activeId, isTyping: false });
    }, 2000);
  };

  const handleSendMessage = async () => {
    const text = draft.trim();
    if (!text || activeId === null || sending) return;

    if (socket) {
      socket.emit("chat:typing", { conversationId: activeId, isTyping: false });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    setSending(true);
    setDraft("");

    try {
      const created = await apiSendMessage(activeId, text);
      setMessages((prev) => {
        if (prev.some((m) => m.message_id === created.message_id)) return prev;
        return [...prev, created];
      });
      setConvos((prev) =>
        prev.map((c) =>
          c.conversation_id === activeId
            ? {
                ...c,
                last_message_preview: text,
                last_message_at: created.sent_at,
              }
            : c,
        ),
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const activeConvo = convos.find((c) => c.conversation_id === activeId) ?? null;
  const filteredConvos = convos.filter((c) => {
    const name = `${c.partner.first_name} ${c.partner.last_name}`.toLowerCase();
    return name.includes(query.toLowerCase()) || c.partner.email.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top Navbar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 24px",
          borderBottom: BORDER_SUBTLE,
          background: WHITE,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={toggleMobile}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
            borderRadius: 8,
            border: BORDER_SUBTLE,
            background: TINT,
            cursor: "pointer",
          }}
          aria-label="Toggle menu"
        >
          <Menu className="size-5 text-navy" />
        </button>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: NAVY, margin: 0 }}>{title}</h1>
          <p style={{ fontSize: "0.82rem", color: "#8a8a84", margin: 0 }}>{subtitle}</p>
        </div>
      </header>

      {/* Main Shell */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 12px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            gap: 0,
            background: WHITE,
            border: BORDER_SUBTLE,
            borderRadius: 22,
            overflow: "hidden",
            flexGrow: 1,
            minHeight: 0,
            boxShadow: SHADOW_SM,
          }}
        >
          {/* ================= LEFT: Conversation List ================= */}
          <div style={{ borderRight: `1px solid ${LINE}`, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "18px 16px 14px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: TINT,
                  borderRadius: 999,
                  padding: "10px 14px",
                }}
              >
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search conversations..."
                  style={{
                    flexGrow: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "0.86rem",
                    color: "#2B2B28",
                  }}
                />
              </div>
            </div>

            <div style={{ flexGrow: 1, overflowY: "auto", padding: "0 10px 12px", minHeight: 0 }}>
              {loadingConvos ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                  <Loader2 className="size-6 animate-spin text-navy" />
                </div>
              ) : filteredConvos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 16px", color: "#8a8a84", fontSize: "0.86rem" }}>
                  <MessageSquare className="size-8 mx-auto mb-2 opacity-40" />
                  <p>No conversations found.</p>
                </div>
              ) : (
                filteredConvos.map((c) => {
                  const isActive = c.conversation_id === activeId;
                  const partnerName = `${c.partner.first_name} ${c.partner.last_name}`.trim() || c.partner.email;
                  const initials = getInitials(partnerName);

                  return (
                    <button
                      type="button"
                      key={c.conversation_id}
                      onClick={() => setActiveId(c.conversation_id)}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 10px",
                        borderRadius: 14,
                        background: isActive ? AMBER_BG : "transparent",
                        border: isActive ? `1px solid ${AMBER}` : "1px solid transparent",
                        marginBottom: 4,
                        cursor: "pointer",
                        transition: "background-color 0.12s ease",
                      }}
                    >
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <span
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            background: isActive ? WHITE : TINT,
                            color: NAVY,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                          }}
                        >
                          {initials}
                        </span>
                        <span
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: GREEN,
                            border: `2px solid ${isActive ? AMBER_BG : WHITE}`,
                          }}
                        />
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                          <span
                            style={{
                              fontSize: "0.88rem",
                              fontWeight: 700,
                              color: NAVY,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {partnerName}
                          </span>
                          {c.last_message_at && (
                            <span style={{ fontSize: "0.7rem", color: "#9a9a94", flexShrink: 0 }}>
                              {formatMessageTime(c.last_message_at)}
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "#8a8a84",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            margin: 0,
                          }}
                        >
                          {c.last_message_preview || "Start a conversation..."}
                        </p>
                      </div>
                      {c.unread_count > 0 && (
                        <span
                          style={{
                            flexShrink: 0,
                            marginTop: 2,
                            background: BAD,
                            color: WHITE,
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            borderRadius: 999,
                            minWidth: 18,
                            height: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 5px",
                          }}
                        >
                          {c.unread_count}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ================= RIGHT: Messages Thread ================= */}
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            {activeConvo ? (
              <>
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    borderBottom: `1px solid ${LINE}`,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: AMBER_BG,
                        color: "#7A5C0A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(`${activeConvo.partner.first_name} ${activeConvo.partner.last_name}`)}
                    </span>
                    <div>
                      <p style={{ fontSize: "0.98rem", fontWeight: 700, color: NAVY, margin: 0 }}>
                        {activeConvo.partner.first_name} {activeConvo.partner.last_name}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "#9a9a94", margin: 0 }}>
                        {activeConvo.partner.role} • {activeConvo.subject}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: GREEN,
                      background: "#DDEEE3",
                      padding: "5px 12px",
                      borderRadius: 999,
                    }}
                  >
                    Online
                  </span>
                </div>

                {/* Messages Container */}
                <div
                  style={{
                    flexGrow: 1,
                    overflowY: "auto",
                    minHeight: 0,
                    padding: "20px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    background: "#FBFCFD",
                  }}
                >
                  {loadingMessages ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                      <Loader2 className="size-6 animate-spin text-navy" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94" }}>
                      <p className="text-sm">No messages yet. Send a greeting to start chatting!</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_user_id === user?.user_id;

                      return (
                        <div
                          key={m.message_id}
                          style={{
                            display: "flex",
                            justifyContent: isMe ? "flex-end" : "flex-start",
                          }}
                        >
                          <div style={{ maxWidth: "72%" }}>
                            <div
                              style={{
                                background: isMe ? NAVY : WHITE,
                                color: isMe ? WHITE : "#2B2B28",
                                border: isMe ? "none" : `1px solid ${LINE}`,
                                borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                padding: "12px 16px",
                                fontSize: "0.9rem",
                                lineHeight: 1.5,
                                wordBreak: "break-word",
                                boxShadow: isMe ? "0 4px 14px rgba(30,58,95,0.18)" : "none",
                              }}
                            >
                              {m.message_text}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginTop: 4,
                                justifyContent: isMe ? "flex-end" : "flex-start",
                              }}
                            >
                              <span style={{ fontSize: "0.7rem", color: "#b5b5af" }}>
                                {formatMessageTime(m.sent_at)}
                              </span>
                              {isMe && (
                                <span style={{ fontSize: "0.68rem", color: m.is_read ? GREEN : "#b5b5af" }}>
                                  {m.is_read ? "✓✓ Read" : "✓ Sent"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isPartnerTyping && (
                    <div style={{ display: "flex", justifyContent: "flex-start" }}>
                      <div
                        style={{
                          background: TINT,
                          color: "#7A5C0A",
                          borderRadius: "16px 16px 16px 4px",
                          padding: "8px 14px",
                          fontSize: "0.8rem",
                          fontStyle: "italic",
                        }}
                      >
                        Typing...
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 20px",
                    borderTop: `1px solid ${LINE}`,
                    flexShrink: 0,
                    background: WHITE,
                  }}
                >
                  <input
                    value={draft}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    disabled={sending}
                    style={{
                      flexGrow: 1,
                      border: `1px solid ${LINE}`,
                      outline: "none",
                      background: "#F7F9FB",
                      borderRadius: 999,
                      padding: "12px 18px",
                      fontSize: "0.9rem",
                      color: "#2B2B28",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!draft.trim() || sending}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: draft.trim() ? NAVY : TINT,
                      color: draft.trim() ? WHITE : "#b5b5af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      cursor: draft.trim() && !sending ? "pointer" : "default",
                      boxShadow: draft.trim() ? "0 4px 14px rgba(30,58,95,0.25)" : "none",
                      transition: "background-color 0.15s ease",
                      border: "none",
                    }}
                    aria-label="Send message"
                  >
                    {sending ? <Loader2 className="size-4 animate-spin text-white" /> : <Send className="size-4" />}
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  color: "#9a9a94",
                  padding: 24,
                }}
              >
                <MessageSquare className="size-12 opacity-30" />
                <p style={{ fontSize: "0.94rem" }}>Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
