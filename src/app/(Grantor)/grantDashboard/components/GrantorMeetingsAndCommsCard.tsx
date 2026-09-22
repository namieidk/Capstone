"use client";

import { ArrowRight, Calendar, ExternalLink, MessageSquare, Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GrantorConversationItem, GrantorMeetingItem } from "@/lib/api/grantor-dashboard";

interface GrantorMeetingsAndCommsCardProps {
  meetings: GrantorMeetingItem[];
  conversations: GrantorConversationItem[];
}

export function GrantorMeetingsAndCommsCard({ meetings, conversations }: GrantorMeetingsAndCommsCardProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Executive Consultations & Meetings */}
      <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8.5 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Calendar className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Executive Meetings & Consultations</h2>
              <p className="text-xs text-muted-foreground">Upcoming coordinator syncs & candidate interviews</p>
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
          >
            <Link href="/grantMeeting" className="flex items-center gap-1">
              <span>Meeting Room</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-3">
          {meetings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
              No executive meetings scheduled for this period.
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 text-purple-800 font-bold text-xs">
                    <Video className="size-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#14213a]">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {m.attendee} • {m.date ? new Date(m.date).toLocaleDateString() : "Scheduled"} ({m.time})
                    </p>
                  </div>
                </div>

                {m.meeting_link ? (
                  <Button
                    asChild
                    size="sm"
                    className="h-7 rounded-full bg-[#0a4f42] px-2.5 text-[10px] font-semibold text-white! hover:bg-[#083c32]"
                  >
                    <a
                      href={m.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white!"
                    >
                      <span className="text-white!">Join Call</span>
                      <ExternalLink className="size-2.5 text-white" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full border-line bg-white px-2.5 text-[10px] font-semibold text-foreground"
                  >
                    <Link href="/grantMeeting">Details</Link>
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Direct Communications */}
      <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8.5 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Direct Messages & Coordinator Sync</h2>
              <p className="text-xs text-muted-foreground">Inquiries, updates, and communications</p>
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
          >
            <Link href="/grantMessage" className="flex items-center gap-1">
              <span>Open Inbox</span>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-3">
          {conversations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
              No recent conversations found.
            </div>
          ) : (
            conversations.map((c) => (
              <Link
                key={c.id}
                href={`/grantMessage?id=${c.id}`}
                className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex size-8 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-xs shrink-0">
                    {c.scholar_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2) || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#14213a] truncate">{c.scholar_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{c.last_message}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right ml-2">
                  <p className="text-[10px] text-muted-foreground">
                    {c.last_message_at
                      ? new Date(c.last_message_at).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })
                      : "Recently"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
