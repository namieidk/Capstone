"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ConversationItem } from "@/lib/api/chat";
import { getInitials, getRoleBadgeVariant } from "./chat-utils";

interface ChatHeaderProps {
  conversation: ConversationItem;
  isPartnerTyping: boolean;
}

export function ChatHeader({ conversation, isPartnerTyping }: ChatHeaderProps) {
  const partnerName = `${conversation.partner.first_name} ${conversation.partner.last_name}`.trim();
  const roleBadge = getRoleBadgeVariant(conversation.partner.role);

  return (
    <div className="flex shrink-0 items-center justify-between border-b border-line bg-white px-6 py-3.5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="size-10 ring-1 ring-border/50">
            <AvatarFallback className="bg-amber-100 font-bold text-amber-900 text-xs">
              {getInitials(partnerName)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-navy leading-none">{partnerName}</h2>
            <Badge
              variant="outline"
              className={`text-[0.62rem] px-1.5 py-0 rounded-md font-semibold ${roleBadge.className}`}
            >
              {roleBadge.label}
            </Badge>
          </div>
          <p className="text-[0.7rem] text-muted-foreground mt-0.5">
            {isPartnerTyping ? (
              <span className="font-semibold text-amber-700 animate-pulse">Typing...</span>
            ) : (
              conversation.partner.email
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 text-[0.65rem] font-bold px-2.5 py-0.5"
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Active now
        </Badge>
      </div>
    </div>
  );
}
