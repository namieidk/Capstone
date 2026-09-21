"use client";

import { Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CoordinatorContact } from "@/lib/api/chat";
import { getInitials } from "./chat-utils";

interface CoordinatorDirectoryListProps {
  coordinators: CoordinatorContact[];
  onStartCoordinatorChat: (userId: number) => void;
}

export function CoordinatorDirectoryList({ coordinators, onStartCoordinatorChat }: CoordinatorDirectoryListProps) {
  if (coordinators.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        <Shield className="mx-auto mb-2 size-6 opacity-40 text-blue-600" />
        <p className="font-semibold text-navy">No coordinators found</p>
        <p className="text-[0.7rem] mt-1">Check your search keywords or try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {coordinators.map((coord) => {
        const name = `${coord.first_name} ${coord.last_name}`.trim();
        const hasExistingChat = Boolean(coord.conversation_id);

        return (
          <div
            key={`coord-${coord.user_id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-white p-3 shadow-2xs hover:border-border transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar className="size-9 shrink-0 ring-1 ring-blue-200">
                <AvatarFallback className="bg-blue-50 text-blue-800 font-bold text-xs">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-bold text-navy">{name}</span>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-[0.58rem] px-1 py-0 font-semibold"
                  >
                    Coordinator
                  </Badge>
                </div>
                <p className="truncate text-[0.68rem] text-muted-foreground">
                  {coord.title} • {coord.department}
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant={hasExistingChat ? "outline" : "default"}
              onClick={() => onStartCoordinatorChat(coord.user_id)}
              className={`h-7.5 shrink-0 rounded-full px-3 text-xs font-semibold ${
                hasExistingChat ? "border-line text-navy hover:bg-tint" : "bg-navy text-white hover:bg-navy/90"
              }`}
            >
              {hasExistingChat ? "Chat" : "Message"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
