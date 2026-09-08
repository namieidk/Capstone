"use client";

import { MessageSquare } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatRequestBanner } from "@/components/chat/ChatRequestBanner";
import { ConversationList } from "@/components/chat/ConversationList";
import { GrantorRequestDialog } from "@/components/chat/GrantorRequestDialog";
import { MessageComposer } from "@/components/chat/MessageComposer";
import { MessageList } from "@/components/chat/MessageList";
import { useChatSocket } from "@/components/chat/useChatSocket";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import {
  sendMessage as apiSendMessage,
  type ConversationItem,
  type CoordinatorContact,
  type GrantorContact,
  getCoordinators,
  getGrantors,
  getMessages,
  getOrCreateConversation,
  getUserConversations,
  type MessageItem,
  markAsRead,
  requestGrantorAccess,
  respondToMessageRequest,
} from "@/lib/api/chat";

interface ChatContainerProps {
  title?: string;
  subtitle?: string;
}

export function ChatContainer({ title = "Messages", subtitle = "Chat directly in real-time." }: ChatContainerProps) {
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

  // Directory & Request state
  const [coordinators, setCoordinators] = useState<CoordinatorContact[]>([]);
  const [grantors, setGrantors] = useState<GrantorContact[]>([]);
  const [tab, setTab] = useState<"chats" | "coordinators" | "grantors">("chats");
  const [selectedGrantor, setSelectedGrantor] = useState<GrantorContact | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [respondingToRequest, setRespondingToRequest] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch conversations list
  const loadConversations = useCallback(async () => {
    try {
      const data = await getUserConversations();
      setConvos(data);
      if (data.length > 0 && activeId === null) {
        setActiveId(data[0].conversation_id);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConvos(false);
    }
  }, [activeId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // 2. Fetch coordinators & grantors directory (for Scholars)
  const loadDirectories = useCallback(async () => {
    if (user?.role !== "SCHOLAR") return;
    try {
      const [coordData, grantorData] = await Promise.all([getCoordinators(), getGrantors()]);
      setCoordinators(coordData);
      setGrantors(grantorData);
    } catch (err) {
      console.error("Failed to load directories:", err);
    }
  }, [user?.role]);

  useEffect(() => {
    loadDirectories();
  }, [loadDirectories]);

  // 3. Fetch messages for active conversation
  const loadActiveMessages = useCallback(async (conversationId: number) => {
    setLoadingMessages(true);
    try {
      const data = await getMessages(conversationId);
      setMessages(data.messages || []);
      await markAsRead(conversationId);
      setConvos((prev) => prev.map((c) => (c.conversation_id === conversationId ? { ...c, unread_count: 0 } : c)));
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (activeId !== null) {
      loadActiveMessages(activeId);
    } else {
      setMessages([]);
    }
  }, [activeId, loadActiveMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 || isPartnerTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isPartnerTyping]);

  // 4. WebSocket subscriptions via custom hook
  const { emitTyping } = useChatSocket({
    socket,
    activeId,
    userId: user?.user_id,
    setMessages,
    setConvos,
    setIsPartnerTyping,
    onRefreshConvos: loadConversations,
    onRefreshDirectories: loadDirectories,
  });

  // Handle draft change & typing indicator
  const handleDraftChange = (text: string) => {
    setDraft(text);
    emitTyping();
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!draft.trim() || !activeId || sending) return;
    const text = draft.trim();
    setSending(true);

    try {
      const newMsg = await apiSendMessage(activeId, text);
      setMessages((prev) => [...prev, newMsg]);
      setDraft("");
      setConvos((prev) =>
        prev.map((c) =>
          c.conversation_id === activeId
            ? {
                ...c,
                last_message_at: newMsg.sent_at,
                last_message_preview: newMsg.message_text,
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

  // Handle starting a chat with a coordinator
  const handleStartCoordinatorChat = async (coordinatorUserId: number) => {
    try {
      const convo = await getOrCreateConversation({
        target_user_id: coordinatorUserId,
        subject: "General Inquiry",
      });

      await loadConversations();
      await loadDirectories();
      setActiveId(convo.conversation_id);
      setTab("chats");
    } catch (err) {
      console.error("Failed to start coordinator chat:", err);
    }
  };

  // Open Grantor message request dialog
  const handleOpenGrantorRequestModal = (grantor: GrantorContact) => {
    setSelectedGrantor(grantor);
    setRequestModalOpen(true);
  };

  // Handle grantor message request submission
  const handleSubmitGrantorRequest = async (data: { grantor_user_id: number; reason: string; subject?: string }) => {
    try {
      const newConvo = await requestGrantorAccess(data);
      await loadConversations();
      await loadDirectories();
      setActiveId(newConvo.conversation_id);
      setTab("chats");
    } catch (err) {
      console.error("Failed to submit grantor request:", err);
      throw err;
    }
  };

  // Handle Grantor accepting or rejecting a message request
  const handleRespondRequest = async (action: "ACCEPT" | "REJECT") => {
    if (!activeId || respondingToRequest) return;
    setRespondingToRequest(true);
    try {
      const updated = await respondToMessageRequest(activeId, action);
      setConvos((prev) => prev.map((c) => (c.conversation_id === activeId ? { ...c, status: updated.status } : c)));
    } catch (err) {
      console.error("Failed to respond to request:", err);
    } finally {
      setRespondingToRequest(false);
    }
  };

  const activeConvo = convos.find((c) => c.conversation_id === activeId);
  const isGrantorOrStaff = ["GRANTOR", "COORDINATOR", "ADMIN"].includes(user?.role || "");
  const partnerName = activeConvo ? `${activeConvo.partner.first_name} ${activeConvo.partner.last_name}`.trim() : "";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAF8F5]">
      {/* Top Header */}
      <PageHeader title={title} subtitle={subtitle} />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden p-3 md:p-6">
        <div className="w-full h-full rounded-2xl border border-line bg-white shadow-xs overflow-hidden">
          <div className="grid h-full grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* LEFT COLUMN: Conversations & Directory List */}
            <div
              className={`md:col-span-4 lg:col-span-4 h-full border-r border-line overflow-hidden ${
                activeId !== null ? "hidden md:block" : "block"
              }`}
            >
              <ConversationList
                conversations={convos}
                activeId={activeId}
                onSelect={(id) => setActiveId(id)}
                query={query}
                onQueryChange={setQuery}
                loading={loadingConvos}
                userRole={user?.role}
                coordinators={coordinators}
                grantors={grantors}
                tab={tab}
                onTabChange={setTab}
                onStartCoordinatorChat={handleStartCoordinatorChat}
                onRequestGrantorAccess={handleOpenGrantorRequestModal}
              />
            </div>

            {/* RIGHT COLUMN: Active Chat Panel */}
            <div className="md:col-span-8 lg:col-span-8 h-full flex flex-col min-h-0 bg-white">
              {activeConvo ? (
                <>
                  <ChatHeader conversation={activeConvo} isPartnerTyping={isPartnerTyping} />

                  {/* Message Request Action & Status Banners */}
                  <ChatRequestBanner
                    activeConvo={activeConvo}
                    isGrantorOrStaff={isGrantorOrStaff}
                    partnerName={partnerName}
                    respondingToRequest={respondingToRequest}
                    onRespondRequest={handleRespondRequest}
                  />

                  {/* Message Stream */}
                  <MessageList
                    messages={messages}
                    currentUserId={user?.user_id}
                    isPartnerTyping={isPartnerTyping}
                    loading={loadingMessages}
                    messagesEndRef={messagesEndRef}
                  />

                  {/* Message Input Composer (Blocked if request is not approved) */}
                  {activeConvo.status === "PENDING_REQUEST" ? (
                    <div className="border-t border-line/70 bg-tint/30 p-3.5 text-center text-xs text-muted-foreground">
                      Messaging is disabled until this request is approved.
                    </div>
                  ) : activeConvo.status === "REJECTED" ? (
                    <div className="border-t border-line/70 bg-tint/30 p-3.5 text-center text-xs text-muted-foreground">
                      This request has been declined. Messaging is disabled.
                    </div>
                  ) : (
                    <MessageComposer
                      draft={draft}
                      onDraftChange={handleDraftChange}
                      onSend={handleSendMessage}
                      sending={sending}
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-muted-foreground">
                  <MessageSquare className="size-10 opacity-30" />
                  <p className="text-sm font-medium">Select a conversation or browse coordinators to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grantor Request Dialog Modal */}
      <GrantorRequestDialog
        grantor={selectedGrantor}
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        onSubmit={handleSubmitGrantorRequest}
      />
    </div>
  );
}
