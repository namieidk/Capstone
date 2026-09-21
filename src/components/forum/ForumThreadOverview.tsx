"use client";

import { Pin, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForumPost } from "@/lib/api/forum";
import { formatTime, getAuthorEmail, getAuthorName, getInitials, getRoleBadgeVariant } from "./forum-utils";

interface ForumThreadOverviewProps {
  activePost: ForumPost | null;
  otherPosts: ForumPost[];
  onSelectPost: (id: number) => void;
}

export function ForumThreadOverview({ activePost, otherPosts, onSelectPost }: ForumThreadOverviewProps) {
  const activeAuthorName = activePost ? getAuthorName(activePost.author) : "";
  const activeAuthorEmail = activePost ? getAuthorEmail(activePost.author) : "";
  const activeRoleBadge = activePost ? getRoleBadgeVariant(activePost.author.role) : null;

  return (
    <div className="hidden lg:col-span-4 lg:block sticky top-0 space-y-3.5">
      {activePost ? (
        <Card className="py-0 gap-0 rounded-2xl border-border/70 bg-white p-5 shadow-xs">
          <CardHeader className="p-0 pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
                Thread Overview
              </span>
              {activePost.is_pinned && (
                <Badge className="rounded-full bg-amber/15 text-amber-900 border-amber/30 text-[0.65rem] font-bold">
                  <Pin className="size-2.5 mr-1" /> Pinned
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-bold text-navy leading-snug line-clamp-2 mt-1">
              {activePost.title}
            </CardTitle>
            <span className="text-[0.68rem] text-muted-foreground mt-0.5">
              Posted {formatTime(activePost.created_at)}
            </span>
          </CardHeader>

          {/* Author Spotlight */}
          <CardContent className="p-0 py-4 flex flex-col items-center text-center">
            <div className="relative mb-2.5">
              <Avatar className="size-14 ring-3 ring-amber/20 shadow-xs">
                <AvatarFallback className="bg-amber-100 text-amber-900 font-bold text-base">
                  {getInitials(activeAuthorName)}
                </AvatarFallback>
              </Avatar>
            </div>

            <p className="font-bold text-navy text-sm leading-tight">{activeAuthorName}</p>
            {activeAuthorEmail ? (
              <p className="text-[0.72rem] text-muted-foreground mb-2 truncate max-w-full">{activeAuthorEmail}</p>
            ) : (
              <div className="mb-2" />
            )}

            {activeRoleBadge && (
              <Badge
                variant="outline"
                className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ${activeRoleBadge.className}`}
              >
                {activeRoleBadge.label}
              </Badge>
            )}
          </CardContent>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 border-y border-border/50 py-3 text-center">
            <div>
              <p className="text-base font-bold text-navy leading-none">{activePost.views_count}</p>
              <p className="text-[0.68rem] text-muted-foreground mt-1">Total Views</p>
            </div>
            <div>
              <p className="text-base font-bold text-navy leading-none">
                {activePost.comments_count || activePost.comments?.length || 0}
              </p>
              <p className="text-[0.68rem] text-muted-foreground mt-1">Total Replies</p>
            </div>
          </div>

          {/* Other Discussions Quick Links */}
          {otherPosts.length > 0 && (
            <div className="pt-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span>Other Discussions</span>
                <span className="text-[0.7rem] text-muted-foreground font-normal">{otherPosts.length} more</span>
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {otherPosts.slice(0, 8).map((other) => {
                  const otherAuthorName = getAuthorName(other.author);
                  return (
                    <button
                      key={`sidebar-thread-${other.post_id}`}
                      type="button"
                      onClick={() => onSelectPost(other.post_id)}
                      className="group flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-tint/60"
                    >
                      <Avatar className="size-6 shrink-0">
                        <AvatarFallback className="bg-tint text-[0.6rem] font-bold text-navy">
                          {getInitials(otherAuthorName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 truncate text-xs font-medium text-foreground/80 group-hover:text-navy">
                        {other.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="py-0 gap-0 rounded-2xl border-border/70 bg-white p-5 shadow-xs text-center">
          <CardHeader className="p-0 pb-2 border-b border-border/40">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">
              Thread Overview
            </span>
          </CardHeader>
          <CardContent className="p-0 py-6 text-xs text-muted-foreground">
            Select a discussion from the feed to view author spotlight, participants, and quick statistics.
          </CardContent>
        </Card>
      )}

      {/* Guidelines Card */}
      <Card className="py-0 gap-0 rounded-2xl border-border/60 bg-white/70 p-4.5 shadow-2xs">
        <div className="flex items-center gap-2 text-navy mb-2">
          <Shield className="size-4 text-emerald-600" />
          <span className="text-xs font-bold">Community Guidelines</span>
        </div>
        <ul className="space-y-1.5 text-[0.72rem] text-muted-foreground leading-relaxed">
          <li>• Keep conversations professional, inclusive, and supportive.</li>
          <li>• Protect personal identifiable and financial information.</li>
          <li>• Tag coordinators or grantors for official inquiries.</li>
        </ul>
      </Card>
    </div>
  );
}
