"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { AllMeetingsSheet } from "./components/AllMeetingsSheet";
import { DayTimeline } from "./components/DayTimeline";
import { dateKey } from "./components/date-utils";
import { MeetingCalendar } from "./components/MeetingCalendar";
import type { UIMeeting } from "./components/meeting-types";
import { ScheduleMeetingDialog } from "./components/ScheduleMeetingDialog";
import { useMeetings } from "./components/useMeetings";

export default function GrantorMeetingPage() {
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
      <PageHeader
        title="Meeting"
        subtitle="Schedule and manage meetings with applicants."
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Search meetings..."
      />

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
