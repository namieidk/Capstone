"use client";

import { Clock, HeartHandshake } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/contexts/SocketContext";
import type { GrantorContact } from "@/lib/api/chat";
import { getInitials } from "./chat-utils";

interface GrantorDirectoryListProps {
  grantors: GrantorContact[];
  onSelect: (conversationId: number) => void;
  onRequestGrantorAccess: (grantor: GrantorContact) => void;
}

export function GrantorDirectoryList({ grantors, onSelect, onRequestGrantorAccess }: GrantorDirectoryListProps) {
  const { isUserOnline } = useSocket();

  if (grantors.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        <HeartHandshake className="mx-auto mb-2 size-6 opacity-40 text-purple-600" />
        <p className="font-semibold text-navy">No grantors found</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {grantors.map((grantor) => {
        const isOnline = isUserOnline(grantor.user_id);
        const name = `${grantor.first_name} ${grantor.last_name}`.trim();
        const isPending = grantor.status === "PENDING_REQUEST";
        const isActive = grantor.status === "ACTIVE";
        const isRejected = grantor.status === "REJECTED";

        return (
          <div
            key={`grantor-${grantor.user_id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-white p-3 shadow-2xs hover:border-border transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="size-9 ring-1 ring-purple-200">
                  <AvatarFallback className="bg-purple-50 text-purple-800 font-bold text-xs">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-in zoom-in-50 duration-200" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-bold text-navy">{name}</span>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200 text-[0.58rem] px-1 py-0 font-semibold"
                  >
                    Grantor
                  </Badge>
                </div>
                <p className="truncate text-[0.68rem] text-muted-foreground">
                  {grantor.title} • {grantor.department}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              {isActive ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => grantor.conversation_id && onSelect(grantor.conversation_id)}
                  className="h-7.5 rounded-full bg-navy text-xs font-semibold text-white hover:bg-navy/90 px-3"
                >
                  Message
                </Button>
              ) : isPending ? (
                <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[0.68rem] px-2 py-1 rounded-full font-bold">
                  <Clock className="size-3 mr-1" /> Pending
                </Badge>
              ) : isRejected ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onRequestGrantorAccess(grantor)}
                  className="h-7.5 rounded-full border-line text-xs font-semibold px-2.5"
                >
                  Re-request
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onRequestGrantorAccess(grantor)}
                  className="h-7.5 rounded-full border-purple-300 text-purple-900 hover:bg-purple-50 text-xs font-semibold px-2.5"
                >
                  Request Access
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
