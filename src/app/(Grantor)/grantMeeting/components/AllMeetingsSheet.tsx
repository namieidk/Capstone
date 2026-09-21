"use client";

import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatTime } from "./date-utils";
import { getMeetingStatusClass, getMeetingStatusLabel, MONTH_ABBR, type UIMeeting } from "./meeting-types";

interface AllMeetingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetings: UIMeeting[];
  searchQuery: string;
  onSelect: (meeting: UIMeeting) => void;
}

export function AllMeetingsSheet({ open, onOpenChange, meetings, searchQuery, onSelect }: AllMeetingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-4 overflow-y-auto sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg!">All meetings</SheetTitle>
          <SheetDescription className="text-sm!">{meetings.length} scheduled</SheetDescription>
        </SheetHeader>
        {meetings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <CalendarDays className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No meetings match your search." : "No meetings scheduled yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {meetings.map((m) => {
              const label = getMeetingStatusLabel(m);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelect(m)}
                  className="flex w-full items-center gap-3.5 rounded-2xl bg-tint p-3.5 text-left transition-opacity hover:opacity-90"
                >
                  <span className="flex min-w-14 flex-col items-center rounded-[10px] bg-white px-3 py-2">
                    <span className="text-[0.68rem] font-bold text-warn uppercase">
                      {MONTH_ABBR[m.scheduledAt.getMonth()]}
                    </span>
                    <span className="text-lg font-bold text-navy">{m.scheduledAt.getDate()}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-navy">{m.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatTime(m.scheduledAt)} · with {m.applicantName}
                    </span>
                  </span>
                  <Badge variant="secondary" className={`h-6 shrink-0 px-2.5 text-xs! ${getMeetingStatusClass(label)}`}>
                    {label}
                  </Badge>
                </button>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
