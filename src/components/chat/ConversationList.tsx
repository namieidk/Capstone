"use client";

import { Clock, MessageSquare, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ConversationItem, CoordinatorContact, GrantorContact } from "@/lib/api/chat";
import { ConversationItemCard } from "./ConversationItemCard";
import { ConversationListSkeleton } from "./ConversationListSkeleton";
import { CoordinatorDirectoryList } from "./CoordinatorDirectoryList";
import { GrantorDirectoryList } from "./GrantorDirectoryList";

interface ConversationListProps {
  conversations: ConversationItem[];
  activeId: number | null;
  onSelect: (id: number) => void;
  query: string;
  onQueryChange: (query: string) => void;
  loading: boolean;
  userRole?: string;
  coordinators: CoordinatorContact[];
  grantors: GrantorContact[];
  tab: "chats" | "coordinators" | "grantors";
  onTabChange: (tab: "chats" | "coordinators" | "grantors") => void;
  onStartCoordinatorChat: (userId: number) => void;
  onRequestGrantorAccess: (grantor: GrantorContact) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  query,
  onQueryChange,
  loading,
  userRole,
  coordinators,
  grantors,
  tab,
  onTabChange,
  onStartCoordinatorChat,
  onRequestGrantorAccess,
}: ConversationListProps) {
  const isScholar = userRole === "SCHOLAR";
  const q = query.toLowerCase().trim();

  // Filter conversations
  const filteredConvos = conversations.filter((c) => {
    const name = `${c.partner.first_name} ${c.partner.last_name}`.toLowerCase();
    const prev = (c.last_message_preview || "").toLowerCase();
    return name.includes(q) || prev.includes(q);
  });

  // Filter coordinators
  const filteredCoordinators = coordinators.filter((c) => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase();
    const title = (c.title || "").toLowerCase();
    const dept = (c.department || "").toLowerCase();
    return name.includes(q) || title.includes(q) || dept.includes(q);
  });

  // Filter grantors
  const filteredGrantors = grantors.filter((g) => {
    const name = `${g.first_name} ${g.last_name}`.toLowerCase();
    const title = (g.title || "").toLowerCase();
    const dept = (g.department || "").toLowerCase();
    return name.includes(q) || title.includes(q) || dept.includes(q);
  });

  const pendingRequestsCount = conversations.filter((c) => c.status === "PENDING_REQUEST").length;

  return (
    <div className="flex h-full flex-col border-r border-line bg-white">
      {/* Search Header */}
      <div className="p-3.5 border-b border-line/60 space-y-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={
              tab === "chats"
                ? "Search messages..."
                : tab === "coordinators"
                  ? "Search coordinators..."
                  : "Search grantors..."
            }
            className="h-9 w-full rounded-full border-line bg-tint/40 pl-9 pr-8 text-xs placeholder:text-muted-foreground/70 focus-visible:bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Directory & Chats Tabs for Scholars */}
        {isScholar && (
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-tint/60 p-1 text-center">
            <button
              type="button"
              onClick={() => onTabChange("chats")}
              className={`rounded-md py-1.5 text-[0.72rem] font-bold transition-all ${
                tab === "chats" ? "bg-white text-navy shadow-2xs" : "text-muted-foreground hover:text-navy"
              }`}
            >
              Chats ({conversations.length})
            </button>
            <button
              type="button"
              onClick={() => onTabChange("coordinators")}
              className={`rounded-md py-1.5 text-[0.72rem] font-bold transition-all ${
                tab === "coordinators" ? "bg-white text-navy shadow-2xs" : "text-muted-foreground hover:text-navy"
              }`}
            >
              Coordinators
            </button>
            <button
              type="button"
              onClick={() => onTabChange("grantors")}
              className={`rounded-md py-1.5 text-[0.72rem] font-bold transition-all ${
                tab === "grantors" ? "bg-white text-navy shadow-2xs" : "text-muted-foreground hover:text-navy"
              }`}
            >
              Grantors
            </button>
          </div>
        )}
      </div>

      {/* Content Stream */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <ConversationListSkeleton />
        ) : tab === "chats" ? (
          <>
            {!isScholar && pendingRequestsCount > 0 && (
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200/80">
                <Clock className="size-3.5 shrink-0 text-amber-600" />
                <p className="text-[0.72rem]">
                  <strong>{pendingRequestsCount}</strong> pending message request{pendingRequestsCount > 1 ? "s" : ""}.
                </p>
              </div>
            )}
            {filteredConvos.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <MessageSquare className="mx-auto mb-2 size-6 opacity-40" />
                <p className="font-semibold text-navy">No conversations yet</p>
                {isScholar ? (
                  <div className="mt-3">
                    <p className="text-[0.7rem] text-muted-foreground mb-3">
                      You can contact your coordinators directly anytime.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onTabChange("coordinators")}
                      className="h-8 rounded-full bg-navy text-xs font-semibold text-white hover:bg-navy/90"
                    >
                      View Coordinators
                    </Button>
                  </div>
                ) : (
                  <p className="text-[0.72rem] mt-1">Incoming messages from scholars will appear here.</p>
                )}
              </div>
            ) : (
              filteredConvos.map((c) => (
                <ConversationItemCard
                  key={`conversation-${c.conversation_id}`}
                  conversation={c}
                  isActive={c.conversation_id === activeId}
                  onSelect={onSelect}
                />
              ))
            )}
          </>
        ) : tab === "coordinators" ? (
          <CoordinatorDirectoryList
            coordinators={filteredCoordinators}
            onStartCoordinatorChat={onStartCoordinatorChat}
          />
        ) : (
          <GrantorDirectoryList
            grantors={filteredGrantors}
            onSelect={onSelect}
            onRequestGrantorAccess={onRequestGrantorAccess}
          />
        )}
      </div>
    </div>
  );
}
