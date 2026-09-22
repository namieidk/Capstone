"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/contexts/SocketContext";
import type { ConversationItem } from "@/lib/api/chat";
import { formatMessageTime, getInitials, getRoleBadgeVariant } from "./chat-utils";

interface ConversationItemCardProps {
  conversation: ConversationItem;
  isActive: boolean;
  onSelect: (id: number) => void;
}

export function ConversationItemCard({ conversation, isActive, onSelect }: ConversationItemCardProps) {
  const { isUserOnline } = useSocket();
  const isOnline = isUserOnline(conversation.partner.user_id);
  const partnerName = `${conversation.partner.first_name} ${conversation.partner.last_name}`.trim();
  const roleBadge = getRoleBadgeVariant(conversation.partner.role);
  const isPending = conversation.status === "PENDING_REQUEST";
  const isRejected = conversation.status === "REJECTED";

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.conversation_id)}
      className={`group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all duration-150 border ${
        isActive
          ? "bg-amber-50/80 border-amber-300 shadow-2xs"
          : isPending
            ? "bg-amber-50/30 border-amber-200/60 hover:bg-amber-50/60"
            : "border-transparent hover:bg-tint/50"
      }`}
    >
      <div className="relative shrink-0">
        <Avatar className="size-10 ring-1 ring-border/40">
          <AvatarFallback
            className={`font-bold text-xs ${isActive ? "bg-amber-200 text-amber-900" : "bg-tint text-navy"}`}
          >
            {getInitials(partnerName)}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-in zoom-in-50 duration-200" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="truncate text-xs font-bold text-navy group-hover:underline">{partnerName}</span>
          <span className="text-[0.68rem] text-muted-foreground shrink-0">
            {conversation.last_message_at ? formatMessageTime(conversation.last_message_at) : ""}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[0.78rem] text-muted-foreground">
            {isPending
              ? "Message Request Pending Approval"
              : isRejected
                ? "Request Declined"
                : conversation.last_message_preview || "No messages yet"}
          </p>
          {conversation.unread_count > 0 && (
            <Badge className="size-4.5 rounded-full bg-red-600 p-0 text-[0.62rem] font-bold text-white flex items-center justify-center shrink-0">
              {conversation.unread_count}
            </Badge>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <Badge
            variant="outline"
            className={`text-[0.58rem] px-1 py-0 rounded-sm font-semibold ${roleBadge.className}`}
          >
            {roleBadge.label}
          </Badge>
          {isPending && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[0.58rem] px-1 py-0 rounded-sm font-bold">
              Request
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}
