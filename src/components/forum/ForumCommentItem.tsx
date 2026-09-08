"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ForumComment } from "@/lib/api/forum";
import { formatTime, getAuthorName, getInitials, getRoleBadgeVariant } from "./forum-utils";

interface ForumCommentItemProps {
  comment: ForumComment;
}

export function ForumCommentItem({ comment }: ForumCommentItemProps) {
  const authorName = getAuthorName(comment.author);
  const roleBadge = getRoleBadgeVariant(comment.author.role);

  return (
    <div className="flex items-start gap-3 rounded-xl bg-white border border-border/50 p-3 shadow-2xs">
      <Avatar className="size-7 shrink-0 ring-1 ring-border/40 mt-0.5">
        <AvatarFallback className="bg-tint text-[0.65rem] font-bold text-navy">
          {getInitials(authorName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-navy truncate">{authorName}</span>
            <Badge
              variant="outline"
              className={`rounded-sm px-1 py-0 text-[0.6rem] font-semibold ${roleBadge.className}`}
            >
              {roleBadge.label}
            </Badge>
          </div>
          <span className="text-[0.65rem] text-muted-foreground shrink-0">{formatTime(comment.created_at)}</span>
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{comment.content}</p>
      </div>
    </div>
  );
}
