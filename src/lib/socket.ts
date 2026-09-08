export function getSocketUrl(): string {
  if (typeof window !== "undefined") {
    // If NEXT_PUBLIC_SOCKET_URL is specified, use it
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      return process.env.NEXT_PUBLIC_SOCKET_URL;
    }
    // If NEXT_PUBLIC_API_URL is specified, use it
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
  }
  return "http://localhost:3001";
}

export interface ChatMessagePayload {
  message_id: number;
  conversation_id: number;
  sender_user_id: number;
  sender_name: string;
  sender_role: string;
  message_text: string;
  is_read: boolean;
  sent_at: string;
}

export interface ForumCommentPayload {
  comment_id: number;
  post_id: number;
  content: string;
  author_user_id: number;
  author_name: string;
  author_role: string;
  created_at: string;
}

export interface ForumPostPayload {
  post_id: number;
  title: string;
  content: string;
  category?: string;
  author_user_id: number;
  author_name: string;
  author_role: string;
  created_at: string;
}
