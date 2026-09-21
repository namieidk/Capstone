"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/components/SidebarContext";
import { Button } from "@/components/ui/button";
import { AllMeetingsSheet } from "./components/AllMeetingsSheet";
import { DayTimeline } from "./components/DayTimeline";
import { dateKey } from "./components/date-utils";
import { MeetingCalendar } from "./components/MeetingCalendar";
import type { UIMeeting } from "./components/meeting-types";
import { ScheduleMeetingDialog } from "./components/ScheduleMeetingDialog";
import { useMeetings } from "./components/useMeetings";

export default function GrantorMeetingPage() {
  const { toggleMobile } = useSidebar();
  const m = useMeetings();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<UIMeeting | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleSelectDate(key: string) {
    m.setSelectedDateKey(key);
    const parts = key.split("-").map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
      m.setCalendarMonth(new Date(parts[0], parts[1] - 1, 1));
    }
  }

  function handleSheetSelect(meeting: UIMeeting) {
    handleSelectDate(dateKey(meeting.scheduledAt));
    setSheetOpen(false);
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-3.5 md:px-8">
        <div className="flex min-w-0 items-center">
          <Button
            type="button"
            variant="outline"
            className="mr-2 h-11 w-11 shrink-0 md:hidden"
            onClick={toggleMobile}
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-navy!">Meeting</h1>
            <p className="truncate text-sm text-muted-foreground">Schedule and manage meetings with applicants.</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden h-10 w-55 items-center gap-2 rounded-full border border-line bg-tint px-3.5 md:flex">
            <Search className="size-4 shrink-0 text-[#9a9a94]" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={m.search}
              onChange={(e) => m.setSearch(e.target.value)}
              className="w-full bg-transparent text-[0.82rem] text-[#2b2b28] outline-none placeholder:text-[#9a9a94]"
              aria-label="Search meetings"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative size-9 rounded-full bg-tint hover:bg-tint"
            aria-label="Notifications"
          >
            <Bell className="size-4 text-navy" />
            <span className="absolute top-2 right-2 size-1.75 rounded-full border-2 border-tint bg-amber" />
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 px-4 py-4 md:hidden">
        <div className="flex h-10 items-center gap-2 rounded-full border border-line bg-white px-3.5">
          <Search className="size-4 shrink-0 text-[#9a9a94]" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={m.search}
            onChange={(e) => m.setSearch(e.target.value)}
            className="w-full bg-transparent text-[0.82rem] outline-none placeholder:text-[#9a9a94]"
            aria-label="Search meetings"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        <div className="grid flex-1 grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_340px]">
          <DayTimeline
            dayMeetings={m.dayMeetings}
            selectedDate={m.selectedDate}
            isSelectedToday={m.isSelectedToday}
            loading={m.loading}
            loadError={m.loadError}
            onRetry={() => void m.refresh()}
            searchQuery={m.search.trim()}
            onBook={() => setScheduleOpen(true)}
            onReschedule={setRescheduleTarget}
            onCancelled={() => void m.refresh()}
            onJumpToday={m.jumpToToday}
          />
          <MeetingCalendar
            calendarMonth={m.calendarMonth}
            onMonthChange={m.setCalendarMonth}
            viewMode={m.calendarViewMode}
            onViewModeChange={m.setCalendarViewMode}
            meetingDateKeys={m.meetingDateKeys}
            selectedDateKey={m.selectedDateKey}
            onSelectDate={handleSelectDate}
            onJumpToday={m.jumpToToday}
            upcoming={m.upcomingMeetings}
            isSelectedToday={m.isSelectedToday}
            onViewAll={() => setSheetOpen(true)}
            onNewMeeting={() => setScheduleOpen(true)}
            searchQuery={m.search.trim()}
          />
        </div>
      </div>

      <ScheduleMeetingDialog
        applicationId={null}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        mode="schedule"
        onSuccess={() => void m.refresh()}
      />
      <ScheduleMeetingDialog
        applicationId={rescheduleTarget?.applicationId ?? null}
        applicantName={rescheduleTarget?.applicantName}
        open={rescheduleTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRescheduleTarget(null);
        }}
        mode="reschedule"
        onSuccess={() => {
          setRescheduleTarget(null);
          void m.refresh();
        }}
      />

      <AllMeetingsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        meetings={m.filteredMeetings}
        searchQuery={m.search.trim()}
        onSelect={handleSheetSelect}
      />
    </div>
  );
}
