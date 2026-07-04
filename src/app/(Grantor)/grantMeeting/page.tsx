"use client";

import React, { useState, FormEvent } from "react";
import {
  Field,
  UPCOMING_MEETINGS,
  ScheduledMeeting,
  AMBER_BG,
  GOOD_BG,
  GOOD,
  WARN_BG,
  WARN,
  NAVY,
  s,
} from "@/components/Grantorshared";

interface MeetingForm {
  title: string;
  time: string;
  invitee: string;
}

type Step = "closed" | "choice" | "schedule" | "live";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "Live now": { bg: GOOD_BG, text: GOOD },
  pending: { bg: WARN_BG, text: WARN },
  confirmed: { bg: AMBER_BG, text: "#6b5220" },
};

function VideoCallIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l6-4v12l-6-4" />
    </svg>
  );
}

function CalendarDaysIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getNow() {
  return new Date();
}

function genMeetingId() {
  return Date.now();
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function genMeetCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `meet.viascholar.app/${seg()}-${seg()}-${seg()}`;
}

function getMonthCells(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function GrantorMeetingPage() {
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>(UPCOMING_MEETINGS);
  const [step, setStep] = useState<Step>("closed");
  const [liveLink, setLiveLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [today] = useState(() => getNow());
  const [calYear, setCalYear] = useState(() => today.getFullYear());
  const [calMonth, setCalMonth] = useState(() => today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [form, setForm] = useState<MeetingForm>({ title: "", time: "", invitee: "" });

  function resetAndClose() {
    setStep("closed");
    setSelectedDate(null);
    setForm({ title: "", time: "", invitee: "" });
    setCopied(false);
  }

  function startInstantMeeting() {
    const link = genMeetCode();
    const now = getNow();
    const newMeeting: ScheduledMeeting = {
      id: genMeetingId(),
      title: "Instant meeting",
      date: formatDate(now),
      time: formatTime(now),
      with: "Coordinator office",
      status: "Live now",
      link,
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    setLiveLink(link);
    setStep("live");
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://${liveLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const bookMeeting = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !selectedDate || !form.time || !form.invitee) return;
    setMeetings((prev) => [
      ...prev,
      { id: genMeetingId(), title: form.title, date: formatDate(selectedDate), time: form.time, with: form.invitee, status: "pending" },
    ]);
    resetAndClose();
  };

  const monthCells = getMonthCells(calYear, calMonth);
  const monthLabel = new Date(calYear, calMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function goPrevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  }

  function isPastDay(day: number) {
    const d = new Date(calYear, calMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  return (
    <div style={s.pageContentTop}>
      <div style={s.pageHeaderRow}>
        <p style={s.pageSub}>Meetings with your ViaScholar coordinator.</p>
        <button onClick={() => setStep("choice")} style={s.continueBtnSmall}>
          Book a meeting
        </button>
      </div>

      <div style={s.meetingList}>
        {meetings.length === 0 && <p style={s.pageSub}>No meetings scheduled yet.</p>}
        {meetings
          .slice()
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((m) => {
            const colors = STATUS_COLORS[m.status] || { bg: AMBER_BG, text: "#6b5220" };
            return (
              <div key={m.id} style={s.meetingCard}>
                <div style={s.meetingDateBox}>
                  <span style={s.meetingDateMonth}>{m.date.split(" ")[0]}</span>
                  <span style={s.meetingDateDay}>{m.date.split(" ")[1]?.replace(",", "")}</span>
                </div>
                <div style={s.meetingInfoCol}>
                  <p style={s.meetingTitle}>{m.title}</p>
                  <p style={s.meetingMeta}>
                    {m.time} · with {m.with}
                  </p>
                </div>
                <span style={{ ...s.meetingStatusTag, background: colors.bg, color: colors.text }}>{m.status}</span>
              </div>
            );
          })}
      </div>

      {step === "choice" && (
        <div style={s.drawerOverlay} onClick={resetAndClose}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.drawerName}>New meeting</h3>
            <p style={s.drawerMeta}>Start a meeting now, or schedule one for later.</p>
            <div style={s.choiceGrid}>
              <button style={s.choiceCard} onClick={startInstantMeeting}>
                <span style={s.choiceIconBox}>
                  <VideoCallIcon />
                </span>
                <span style={s.choiceCardTitle}>Instant meeting</span>
                <span style={s.choiceCardDesc}>Start now and share the link with the coordinator.</span>
              </button>
              <button style={s.choiceCard} onClick={() => setStep("schedule")}>
                <span style={s.choiceIconBox}>
                  <CalendarDaysIcon />
                </span>
                <span style={s.choiceCardTitle}>Schedule for later</span>
                <span style={s.choiceCardDesc}>Pick a date and time on the calendar.</span>
              </button>
            </div>
            <div style={{ ...s.modalActionsRow, marginTop: 20 }}>
              <button type="button" onClick={resetAndClose} style={s.backBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "live" && (
        <div style={s.drawerOverlay} onClick={resetAndClose}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.drawerName}>Your meeting is ready</h3>
            <p style={s.drawerMeta}>Share this link with the coordinator to join.</p>
            <div style={s.liveMeetingCard}>
              <div style={s.liveMeetingLinkRow}>
                <span style={s.liveMeetingLinkText}>{liveLink}</span>
                <button type="button" onClick={copyLink} style={s.copyBtn}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <div style={s.modalActionsRow}>
              <button type="button" onClick={resetAndClose} style={s.backBtn}>
                Close
              </button>
              <button type="button" onClick={resetAndClose} style={s.continueBtn}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "schedule" && (
        <div style={s.drawerOverlay} onClick={resetAndClose}>
          <div
            style={{ ...s.modalCard, maxHeight: "85vh", overflowY: "auto", padding: "24px 26px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={s.drawerName}>Schedule a meeting</h3>
            <p style={s.drawerMeta}>with the ViaScholar coordinator office</p>

            <form onSubmit={bookMeeting} style={{ marginTop: 16 }}>
              <Field label="Meeting title" required>
                <input
                  style={s.input}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Quarterly partnership review"
                />
              </Field>

              <Field label="Date" required>
                <div style={s.calendarWrap}>
                  <div style={s.calendarHeaderRow}>
                    <button type="button" onClick={goPrevMonth} style={s.calendarNavBtn}>
                      <ChevronLeftIcon />
                    </button>
                    <span style={s.calendarMonthLabel}>{monthLabel}</span>
                    <button type="button" onClick={goNextMonth} style={s.calendarNavBtn}>
                      <ChevronRightIcon />
                    </button>
                  </div>
                  <div style={s.calendarWeekRow}>
                    {WEEKDAYS.map((w, i) => (
                      <span key={i} style={s.calendarWeekday}>
                        {w}
                      </span>
                    ))}
                  </div>
                  <div style={s.calendarDayGrid}>
                    {monthCells.map((day, i) => {
                      if (day === null) return <span key={i} style={s.calendarDayBtnEmpty} />;
                      const past = isPastDay(day);
                      const isSelected =
                        !!selectedDate &&
                        selectedDate.getFullYear() === calYear &&
                        selectedDate.getMonth() === calMonth &&
                        selectedDate.getDate() === day;
                      const isToday =
                        calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={past}
                          onClick={() => setSelectedDate(new Date(calYear, calMonth, day))}
                          style={{
                            ...s.calendarDayBtn,
                            background: isSelected ? NAVY : "transparent",
                            color: past ? "#c9c4b4" : isSelected ? "#FFFFFF" : "#3a3a36",
                            border: isToday && !isSelected ? "1.5px solid #C9943D" : "1.5px solid transparent",
                            cursor: past ? "not-allowed" : "pointer",
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Field>

              <div className="vg-field-row-2" style={s.fieldRow2}>
                <Field label="Time" required>
                  <input type="time" style={s.input} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </Field>
                <Field label="With" required>
                  <select style={s.select} value={form.invitee} onChange={(e) => setForm({ ...form, invitee: e.target.value })}>
                    <option value="">Select a person...</option>
                    <option>Engr. Paolo R. — HR Coordinator</option>
                    <option>Coordinator Office — ViaScholar staff</option>
                  </select>
                </Field>
              </div>

              <div style={{ ...s.modalActionsRow, marginTop: 4 }}>
                <button type="button" onClick={resetAndClose} style={s.backBtn}>
                  Cancel
                </button>
                <button type="submit" style={s.continueBtn}>
                  Confirm meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}