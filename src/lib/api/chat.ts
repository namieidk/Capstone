import { apiGet, apiPatch, apiPost } from "../api";

const B = "/api/proxy/chat";

export interface ChatPartner {
  user_id: number;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface ConversationItem {
  conversation_id: number;
  subject: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
  partner: ChatPartner;
}

export interface MessageItem {
  message_id: number;
  conversation_id: number;
  sender_user_id: number;
  sender_name: string;
  sender_role: string;
  message_text: string;
  is_read: boolean;
  sent_at: string;
  read_at?: string | null;
}

export interface PaginatedMessagesResponse {
  conversation_id: number;
  total: number;
  page: number;
  limit: number;
  messages: MessageItem[];
}

export function getUserConversations(): Promise<ConversationItem[]> {
  return apiGet<ConversationItem[]>(`${B}/conversations`);
}

export function getOrCreateConversation(targetUserId: number, subject?: string) {
  return apiPost<{ conversation_id: number }>(`${B}/conversations`, {
    target_user_id: targetUserId,
    subject,
  });
}

export function getMessages(
  conversationId: number,
  params?: { page?: number; limit?: number },
): Promise<PaginatedMessagesResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString();
  return apiGet<PaginatedMessagesResponse>(`${B}/conversations/${conversationId}/messages${query ? `?${query}` : ""}`);
}

export function sendMessage(conversationId: number, messageText: string): Promise<MessageItem> {
  return apiPost<MessageItem>(`${B}/conversations/${conversationId}/messages`, {
    message_text: messageText,
  });
}

export function markAsRead(conversationId: number): Promise<{ success: boolean; count: number }> {
  return apiPatch<{ success: boolean; count: number }>(`${B}/conversations/${conversationId}/read`);
}
