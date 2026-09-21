"use client";

import { Check, CheckCheck, MessageSquare } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Bubble, BubbleContent, BubbleTyping } from "@/components/ui/bubble";
import { Message, MessageContent, MessageFooter } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import type { MessageItem } from "@/lib/api/chat";
import { formatMessageTime } from "./chat-utils";
import { MessageListSkeleton } from "./MessageListSkeleton";

import { SystemAppealEventCard } from "./SystemAppealEventCard";

interface MessageListProps {
  messages: MessageItem[];
  currentUserId?: number;
  isPartnerTyping: boolean;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function MessageList({ messages, currentUserId, isPartnerTyping, loading, messagesEndRef }: MessageListProps) {
  const uniqueMessages = useMemo(() => {
    const seen = new Set<string>();
    const result: MessageItem[] = [];
    for (const m of messages) {
      const id = m.message_id !== undefined && m.message_id !== null ? String(m.message_id) : null;
      if (id && seen.has(id)) {
        continue;
      }
      if (id) {
        seen.add(id);
      }
      result.push(m);
    }
    return result;
  }, [messages]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesEndRef]);

  if (loading) {
    return <MessageListSkeleton />;
  }

  if (uniqueMessages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-muted-foreground bg-[#FAF9F7]/40">
        <MessageSquare className="size-8 opacity-30" />
        <p className="text-xs font-semibold">No messages in this discussion yet.</p>
        <p className="text-[0.7rem] text-muted-foreground/80">Send a greeting to start communicating.</p>
      </div>
    );
  }

  return (
    <MessageScrollerProvider>
      <MessageScroller className="bg-[#FAF9F7]/50">
        <MessageScrollerViewport>
          <MessageScrollerContent className="space-y-3">
            {uniqueMessages.map((m, idx) => {
              const isSystemAppeal =
                Boolean(m.message_type) && m.message_type !== "TEXT" && m.message_type?.startsWith("SYSTEM_APPEAL_");
              const key =
                m.message_id !== undefined && m.message_id !== null ? `msg-${m.message_id}` : `msg-idx-${idx}`;

              if (isSystemAppeal) {
                return (
                  <MessageScrollerItem key={key}>
                    <SystemAppealEventCard message={m} />
                  </MessageScrollerItem>
                );
              }

              const isMe = m.sender_user_id === currentUserId;
              const align = isMe ? "end" : "start";
              const bubbleVariant = isMe ? "primary" : "default";

              return (
                <MessageScrollerItem key={key}>
                  <Message align={align}>
                    <MessageContent className={isMe ? "items-end" : "items-start"}>
                      <Bubble variant={bubbleVariant} align={align}>
                        <BubbleContent>{m.message_text}</BubbleContent>
                      </Bubble>
                      <MessageFooter className={isMe ? "justify-end" : "justify-start"}>
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
                      </MessageFooter>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              );
            })}

            {/* Typing Indicator Bubble */}
            {isPartnerTyping && (
              <MessageScrollerItem>
                <Message align="start">
                  <BubbleTyping />
                </Message>
              </MessageScrollerItem>
            )}

            <div ref={messagesEndRef} />
          </MessageScrollerContent>
        </MessageScrollerViewport>

        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
