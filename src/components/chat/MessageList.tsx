"use client";

import { Check, CheckCheck, MessageSquare } from "lucide-react";
import type React from "react";
import type { MessageItem } from "@/lib/api/chat";
import { formatMessageTime } from "./chat-utils";
import { MessageListSkeleton } from "./MessageListSkeleton";

interface MessageListProps {
  messages: MessageItem[];
  currentUserId?: number;
  isPartnerTyping: boolean;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, currentUserId, isPartnerTyping, loading, messagesEndRef }: MessageListProps) {
  if (loading) {
    return <MessageListSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
        <MessageSquare className="size-8 opacity-30" />
        <p className="text-xs">No messages in this discussion yet.</p>
        <p className="text-[0.7rem] text-muted-foreground/80">Send a greeting to start communicating.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#FAF9F7]/50">
      {messages.map((m) => {
        const isMe = m.sender_user_id === currentUserId;

        return (
          <div key={`msg-${m.message_id}`} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[78%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                isMe
                  ? "bg-navy text-white rounded-tr-xs shadow-xs"
                  : "bg-white text-navy border border-border/70 rounded-tl-xs shadow-2xs"
              }`}
            >
              <p className="whitespace-pre-line">{m.message_text}</p>
            </div>

            <div className="mt-1 flex items-center gap-1 text-[0.65rem] text-muted-foreground px-1">
              <span>{formatMessageTime(m.sent_at)}</span>
              {isMe && (
                <span>
                  {m.read_at ? (
                    <CheckCheck className="size-3 text-blue-500 inline" />
                  ) : (
                    <Check className="size-3 text-muted-foreground inline" />
                  )}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Typing Bubble */}
      {isPartnerTyping && (
        <div className="flex items-start">
          <div className="rounded-2xl rounded-tl-xs border border-border/60 bg-white px-3.5 py-2 shadow-2xs">
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
              <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0.2s]" />
              <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
