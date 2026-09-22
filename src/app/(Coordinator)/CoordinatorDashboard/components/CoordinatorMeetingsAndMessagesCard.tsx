"use client";

import { ArrowRight, Calendar, ExternalLink, MessageSquare, Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CoordinatorConversationItem, CoordinatorMeetingItem } from "@/lib/api/coordinator-dashboard";

interface CoordinatorMeetingsAndMessagesCardProps {
  meetings: CoordinatorMeetingItem[];
  conversations: CoordinatorConversationItem[];
}

export function CoordinatorMeetingsAndMessagesCard({
  meetings,
  conversations,
}: CoordinatorMeetingsAndMessagesCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Upcoming Interviews & Mentoring Meetings */}
      <Card className="flex flex-col justify-between rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8.5 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Calendar className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Interviews & Mentoring Sessions</h2>
              <p className="text-xs text-muted-foreground">Google Meet calendar appointments</p>
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
          >
            <Link href="/CoordinatorMeeting" className="flex items-center gap-1">
              <span>All Meetings</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-3">
          {meetings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
              <Calendar className="mx-auto mb-1.5 size-5 text-muted-foreground/50" />
              <p>No upcoming interviews or meetings scheduled.</p>
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7.5 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800">
                    <Video className="size-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#14213a]">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {m.attendee} •{" "}
                      {new Date(m.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      • {m.time}
                    </p>
                  </div>
                </div>

                {m.meeting_link && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full border-line text-[11px] font-semibold text-[#0a4f42]"
                  >
                    <a href={m.meeting_link} target="_blank" rel="noopener noreferrer">
                      Join <ExternalLink className="ml-1 size-3" />
                    </a>
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* RIGHT: Direct Scholar Communications */}
      <Card className="flex flex-col justify-between rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Scholar Direct Messages</h2>
              <p className="text-xs text-muted-foreground">Inquiries, appeals & academic follow-ups</p>
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
          >
            <Link href="/CoordinatorMessage" className="flex items-center gap-1">
              <span>Chat Center</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-3">
          {conversations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
              <MessageSquare className="mx-auto mb-1.5 size-5 text-muted-foreground/50" />
              <p>No active message threads found.</p>
            </div>
          ) : (
            conversations.map((c) => (
              <Link
                key={c.id}
                href="/CoordinatorMessage"
                className="group flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-[#0a4f42] text-white font-bold text-xs">
                    {c.scholar_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2) || "SC"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#14213a] group-hover:text-[#0a4f42] transition-colors truncate">
                      {c.scholar_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate leading-relaxed">{c.last_message}</p>
                  </div>
                </div>

                <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-[#0a4f42] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
