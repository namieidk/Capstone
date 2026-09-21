"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { listMeetings, type StaffMeeting } from "@/lib/api/meetings";
import { dateKey, parseDateKey, parseFlexibleDate, parseTimeToMinutes } from "./date-utils";
import { formatScheduledBy, type UIMeeting } from "./meeting-types";

function toUIMeeting(m: StaffMeeting): UIMeeting | null {
  let scheduled: Date | null = null;
  if (m.scheduled_at) {
    const d = parseFlexibleDate(m.scheduled_at);
    if (!Number.isNaN(d.getTime())) scheduled = d;
  }
  if (!scheduled && m.meeting_date) {
    const base = parseFlexibleDate(m.meeting_date);
    if (!Number.isNaN(base.getTime())) {
      if (m.meeting_time) {
        const mins = parseTimeToMinutes(m.meeting_time);
        base.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
      }
      scheduled = base;
    }
  }
  if (!scheduled) return null;
  const link = (m.meeting_link ?? "").trim();
  const profile = m.scholar_profile;
  const applicantName =
    profile && (profile.first_name || profile.last_name)
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
      : m.application_id != null
        ? `Applicant #${m.application_id}`
        : "—";
  const staff = m.employee;
  return {
    id: m.meeting_id,
    applicationId: m.application_id,
    title: m.title?.trim() || "Meeting",
    applicantName,
    scheduledAt: scheduled,
    durationMinutes: m.duration_minutes ?? 45,
    meetingLink: link ? link : null,
    rawStatus: m.status,
    notes: m.notes ?? null,
    scheduledBy: staff ? formatScheduledBy(staff.first_name, staff.last_name, staff.user?.role ?? null) : null,
  };
}

export function useMeetings() {
  const [meetings, setMeetings] = useState<UIMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedDateKey, setSelectedDateKey] = useState(() => dateKey(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [calendarViewMode, setCalendarViewMode] = useState<"month" | "year">("month");
  const initialized = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await listMeetings({ limit: 200, page: 1 });
      const mapped = res.data
        .filter((m) => (m.status ?? "").toUpperCase() !== "CANCELLED")
        .map(toUIMeeting)
        .filter((m): m is UIMeeting => m !== null)
        .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
      setMeetings(mapped);
      if (!initialized.current) {
        initialized.current = true;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const next = mapped.find((m) => m.scheduledAt.getTime() >= startOfToday.getTime());
        if (next) {
          setSelectedDateKey(dateKey(next.scheduledAt));
          setCalendarMonth(new Date(next.scheduledAt.getFullYear(), next.scheduledAt.getMonth(), 1));
        }
      }
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Could not load meetings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const query = search.trim().toLowerCase();
  const filteredMeetings = useMemo(
    () =>
      query
        ? meetings.filter((m) => m.title.toLowerCase().includes(query) || m.applicantName.toLowerCase().includes(query))
        : meetings,
    [meetings, query],
  );

  const meetingDateKeys = useMemo(() => new Set(meetings.map((m) => dateKey(m.scheduledAt))), [meetings]);

  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const todayKey = dateKey(new Date());
  const isSelectedToday = selectedDateKey === todayKey;

  const dayMeetings = useMemo(
    () => filteredMeetings.filter((m) => dateKey(m.scheduledAt) === selectedDateKey),
    [filteredMeetings, selectedDateKey],
  );

  const upcomingMeetings = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return filteredMeetings.filter((m) => m.scheduledAt.getTime() >= startOfToday.getTime()).slice(0, 5);
  }, [filteredMeetings]);

  const jumpToToday = useCallback(() => {
    const t = new Date();
    setSelectedDateKey(dateKey(t));
    setCalendarMonth(new Date(t.getFullYear(), t.getMonth(), 1));
    setCalendarViewMode("month");
  }, []);

  return {
    meetings,
    filteredMeetings,
    dayMeetings,
    upcomingMeetings,
    meetingDateKeys,
    search,
    setSearch,
    loading,
    loadError,
    refresh,
    selectedDateKey,
    setSelectedDateKey,
    selectedDate,
    isSelectedToday,
    calendarMonth,
    setCalendarMonth,
    calendarViewMode,
    setCalendarViewMode,
    jumpToToday,
    totalCount: meetings.length,
  };
}
