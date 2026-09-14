"use client";

import { CalendarClock } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mapApplicationToApplicant } from "@/app/(Coordinator)/CoordinatorApplicants/components/applicant-helpers";
import { AllMeetingsSheet } from "@/app/(Grantor)/grantMeeting/components/AllMeetingsSheet";
import { DayTimeline } from "@/app/(Grantor)/grantMeeting/components/DayTimeline";
import { dateKey } from "@/app/(Grantor)/grantMeeting/components/date-utils";
import { MeetingCalendar } from "@/app/(Grantor)/grantMeeting/components/MeetingCalendar";
import type { UIMeeting } from "@/app/(Grantor)/grantMeeting/components/meeting-types";
import { ScheduleMeetingDialog } from "@/app/(Grantor)/grantMeeting/components/ScheduleMeetingDialog";
import { useMeetings } from "@/app/(Grantor)/grantMeeting/components/useMeetings";
import type { Applicant } from "@/components/Coordinatorshared";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listApplications } from "@/lib/api/applications";

export default function CoordinatorMeetingPage() {
  const m = useMeetings();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<UIMeeting | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [schedulingId, setSchedulingId] = useState<number | null>(null);

  const fetchApplicants = useCallback(async () => {
    try {
      const rows = await listApplications();
      setApplicants(rows.map(mapApplicationToApplicant));
    } catch (err) {
      console.error("Failed to load applicants:", err);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  // Interview-stage applicants with no real interview yet — the coordinator's
  // declaration queue. (Stage label alone never counts as scheduled.)
  const awaiting = useMemo(() => applicants.filter((a) => a.stage === "Interview" && !a.hasInterview), [applicants]);

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

  function handleMeetingChanged() {
    void m.refresh();
    fetchApplicants();
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title="Meeting"
        subtitle="Schedule interviews for applicants who passed review."
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Search meetings..."
      />

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {awaiting.length > 0 && (
          <Card className="rounded-[18px]! shadow-va-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base! text-navy">Awaiting schedule</CardTitle>
                <Badge variant="secondary" className="h-6 px-2.5 text-xs! tabular-nums">
                  {awaiting.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {awaiting.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {a.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.course} · {a.year}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 shrink-0 gap-1.5 px-3.5 text-xs!"
                    onClick={() => setSchedulingId(a.id)}
                  >
                    <CalendarClock className="size-4" />
                    Schedule
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

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
        onSuccess={handleMeetingChanged}
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
          handleMeetingChanged();
        }}
      />
      <ScheduleMeetingDialog
        applicationId={schedulingId}
        applicantName={awaiting.find((a) => a.id === schedulingId)?.name}
        open={schedulingId !== null}
        onOpenChange={(open) => {
          if (!open) setSchedulingId(null);
        }}
        mode="schedule"
        onSuccess={() => {
          setSchedulingId(null);
          handleMeetingChanged();
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
