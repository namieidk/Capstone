"use client";

import {
  ArrowRight,
  Calendar,
  ExternalLink,
  MessageSquare,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type {
  ScholarCommunicationData,
  ScholarMeetingItem,
} from "@/lib/api/scholar-dashboard";

interface ScholarCoordinatorAndMeetingsCardProps {
  communication: ScholarCommunicationData;
  meetings: ScholarMeetingItem[];
}

export function ScholarCoordinatorAndMeetingsCard({
  communication,
  meetings,
}: ScholarCoordinatorAndMeetingsCardProps) {
  const coordinatorName =
    communication.coordinator?.name || "Assigned Coordinator";
  const coordinatorTitle =
    communication.coordinator?.title || "Scholarship Coordinator";

  return (
    <Card className="flex flex-col justify-between rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-[#0a4f42]/10 text-[#0a4f42]">
            <MessageSquare className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">
              Coordinator & Advisory
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct guidance & mentoring sessions
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/scholarMessage" className="flex items-center gap-1">
            <span>Messages</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Coordinator contact box */}
        <div className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0a4f42] text-white font-bold text-xs">
              {coordinatorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "CO"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#14213a] truncate">
                {coordinatorName}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {coordinatorTitle}
              </p>
            </div>
          </div>

          <Button
            asChild
            size="sm"
            className="h-7.5 rounded-full bg-[#0a4f42] px-3.5 text-[11px] font-semibold text-white! hover:bg-[#0a4f42]/90 shadow-2xs"
          >
            <Link
              href="/scholarMessage"
              className="flex items-center gap-1.5 text-white!"
            >
              <span className="text-white!">Chat</span>
              {communication.unread_messages_count > 0 && (
                <Badge className="h-4 rounded-full bg-[#f1b71e] text-[#14213a] px-1 text-[9px] font-bold">
                  {communication.unread_messages_count}
                </Badge>
              )}
            </Link>
          </Button>
        </div>

        {/* Upcoming Meetings List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Upcoming Meetings & Check-ins
            </p>
            <Link
              href="/scholarMeeting"
              className="text-[11px] font-semibold text-[#0a4f42] hover:underline"
            >
              Schedule
            </Link>
          </div>

          {meetings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line/70 p-4 text-center text-xs text-muted-foreground">
              <Calendar className="mx-auto mb-1.5 size-5 text-muted-foreground/50" />
              <p>No upcoming meetings scheduled.</p>
            </div>
          ) : (
            meetings.map((m) => (
              <div
                key={m.meeting_id}
                className="flex items-center justify-between rounded-xl border border-line/60 bg-white p-3 text-xs shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7.5 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <Video className="size-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-[#14213a]">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(m.meeting_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      • {m.meeting_time || "Scheduled Time"}
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
                    <a
                      href={m.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join <ExternalLink className="ml-1 size-3" />
                    </a>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
