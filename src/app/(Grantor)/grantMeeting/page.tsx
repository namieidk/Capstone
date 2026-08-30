"use client";

import React, { useMemo, useState, FormEvent } from "react";
import {
  InterviewIcon,
  XCircleIcon,
  Field,
  UPCOMING_MEETINGS,
  ScheduledMeeting,
  NAVY,
  WHITE,
  TINT,
  LINE,
  AMBER,
  AMBER_BG,
  GOOD,
  GOOD_BG,
  WARN_BG,
  WARN,
  s,
  MenuIcon,
  SearchIcon,
  BellIcon,
} from "@/components/Grantorshared";
import { useSidebar } from "@/components/SidebarContext";

/* ------------------------------------------------------------------ */
/* Local tokens not exported from Grantorshared                        */
/* ------------------------------------------------------------------ */

const BORDER_SUBTLE = `1px solid ${LINE}`;
const SHADOW_SM = "0 1px 3px rgba(0,0,0,0.04)";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "Live now": { bg: GOOD_BG, text: GOOD },
  pending: { bg: WARN_BG, text: WARN },
  confirmed: { bg: AMBER_BG, text: "#6b5220" },
};

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

function CalendarIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  );
}

function VideoCallIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M16 10l6-4v12l-6-4" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Date / time helpers                                                 */
/* ------------------------------------------------------------------ */

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}
function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function parseFlexibleDate(str: string): Date {
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}
function parseTimeToMinutes(t: string): number {
  const ampm = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let hour = parseInt(ampm[1], 10);
    const minute = parseInt(ampm[2], 10);
    if (/PM/i.test(ampm[3]) && hour !== 12) hour += 12;
    if (/AM/i.test(ampm[3]) && hour === 12) hour = 0;
    return hour * 60 + minute;
  }
  const h24 = t.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (h24) return parseInt(h24[1], 10) * 60 + parseInt(h24[2], 10);
  return 9 * 60;
}
function formatTimeLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${pad2(m)} ${period}`;
}
function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  return `${h12} ${period}`;
}
function getMonthMatrix(monthDate: Date): { date: Date; inMonth: boolean }[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = startWeekday - 1; i >= 0; i--) cells.push({ date: new Date(year, month - 1, prevMonthDays - i), inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), inMonth: true });
  let next = 1;
  while (cells.length < 42) cells.push({ date: new Date(year, month + 1, next++), inMonth: false });
  return cells;
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
function genMeetingId() {
  return Date.now();
}
function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]).join("");
  return (letters || "??").toUpperCase();
}

interface ScheduleForm {
  title: string;
  time: string;
  invitee: string;
}

type ModalStep = "closed" | "choice" | "schedule" | "live";

export default function GrantorMeetingPage() {
  const { toggleMobile } = useSidebar();

  const [search, setSearch] = useState("");
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>(UPCOMING_MEETINGS);
  const [modalStep, setModalStep] = useState<ModalStep>("closed");
  const [liveLink, setLiveLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<"month" | "year">("month");

  const [form, setForm] = useState<ScheduleForm>({ title: "", time: "", invitee: "" });
  const [modalSelectedDate, setModalSelectedDate] = useState<Date | null>(null);

  const query = search.trim().toLowerCase();

  const combined = useMemo(() => {
    return meetings
      .map((m) => ({ ...m, dateObj: parseFlexibleDate(m.date), minutes: parseTimeToMinutes(m.time) }))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime() || a.minutes - b.minutes);
  }, [meetings]);

  const filteredCombined = useMemo(
    () =>
      query
        ? combined.filter((m) => m.title.toLowerCase().includes(query) || m.with.toLowerCase().includes(query))
        : combined,
    [combined, query]
  );

  const meetingDateKeys = useMemo(() => new Set(combined.map((m) => dateKey(m.dateObj))), [combined]);

  const today = new Date();
  const todayKey = dateKey(today);
  const initialKey = combined.length > 0 ? dateKey(combined[0].dateObj) : todayKey;

  const [selectedDateKey, setSelectedDateKey] = useState(initialKey);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = parseFlexibleDate(initialKey);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const selectedDate = parseFlexibleDate(selectedDateKey);
  const isSelectedToday = selectedDateKey === todayKey;
  const dayMeetings = filteredCombined.filter((m) => dateKey(m.dateObj) === selectedDateKey);
  const otherMeetings = filteredCombined.filter((m) => dateKey(m.dateObj) !== selectedDateKey);

  let startHour = 8;
  let endHour = 18;
  if (dayMeetings.length > 0) {
    const minM = Math.min(...dayMeetings.map((m) => m.minutes));
    const maxM = Math.max(...dayMeetings.map((m) => m.minutes));
    startHour = Math.max(6, Math.floor(minM / 60) - 1);
    endHour = Math.min(21, Math.ceil(maxM / 60) + 2);
    if (endHour - startHour < 6) endHour = startHour + 6;
  }
  const HOUR_H = 96;
  const hoursArr = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const trackHeight = (endHour - startHour) * HOUR_H;

  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const showNowLine = isSelectedToday && nowMinutes >= startHour * 60 && nowMinutes <= endHour * 60;
  const nowTop = ((nowMinutes - startHour * 60) / 60) * HOUR_H;

  const monthMatrix = useMemo(() => getMonthMatrix(calendarMonth), [calendarMonth]);

  const jumpToToday = () => {
    setSelectedDateKey(todayKey);
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setCalendarViewMode("month");
  };

  function resetAndCloseModal() {
    setModalStep("closed");
    setModalSelectedDate(null);
    setForm({ title: "", time: "", invitee: "" });
    setCopied(false);
  }

  function startInstantMeeting() {
    const link = genMeetCode();
    const now = new Date();
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
    setSelectedDateKey(dateKey(now));
    setCalendarMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setLiveLink(link);
    setModalStep("live");
  }

  function copyLink() {
    navigator.clipboard.writeText(`https://${liveLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const bookMeeting = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !modalSelectedDate || !form.time || !form.invitee) return;
    const newMeeting: ScheduledMeeting = {
      id: genMeetingId(),
      title: form.title,
      date: formatDate(modalSelectedDate),
      time: form.time,
      with: form.invitee,
      status: "pending",
    };
    setMeetings((prev) => [...prev, newMeeting]);
    setSelectedDateKey(dateKey(modalSelectedDate));
    setCalendarMonth(new Date(modalSelectedDate.getFullYear(), modalSelectedDate.getMonth(), 1));
    resetAndCloseModal();
  };

  const joinMeeting = (m: ScheduledMeeting) => {
    if (m.link) {
      window.open(`https://${m.link}`, "_blank");
    } else {
      console.log("Joining meeting with", m.with);
    }
  };

  const selectedLabel = isSelectedToday
    ? "TODAY"
    : selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const selectedDateFull = selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // --- modal calendar (separate month state, for booking a new meeting) ---
  const [modalCalYear, setModalCalYear] = useState(() => today.getFullYear());
  const [modalCalMonth, setModalCalMonth] = useState(() => today.getMonth());

  function getMonthCells(year: number, month: number) {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }
  const modalMonthCells = getMonthCells(modalCalYear, modalCalMonth);
  const modalMonthLabel = new Date(modalCalYear, modalCalMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function goPrevModalMonth() {
    if (modalCalMonth === 0) {
      setModalCalMonth(11);
      setModalCalYear((y) => y - 1);
    } else {
      setModalCalMonth((m) => m - 1);
    }
  }
  function goNextModalMonth() {
    if (modalCalMonth === 11) {
      setModalCalMonth(0);
      setModalCalYear((y) => y + 1);
    } else {
      setModalCalMonth((m) => m + 1);
    }
  }
  function isPastDay(day: number) {
    const d = new Date(modalCalYear, modalCalMonth, day);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < t;
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .meeting-grid {
          display: grid;
          grid-template-columns: 1fr 328px;
          gap: 16px;
          align-items: stretch;
          margin-top: 16px;
          flex-grow: 1;
          min-height: 0;
        }
        @media (max-width: 980px) {
          .meeting-grid { grid-template-columns: 1fr !important; grid-template-rows: 1fr 1fr !important; }
        }
        .meeting-scroll-col { overflow-y: auto; min-height: 0; }
        .cal-day-btn { transition: background-color 0.12s ease, color 0.12s ease, border-color 0.12s ease; }
        .cal-day-btn:hover:not(.cal-day-selected) { background-color: ${TINT}; }
        .cal-nav-btn:hover { background-color: ${TINT}; }
        .segment-btn { transition: background-color 0.15s ease, color 0.15s ease; }
        .agenda-card { animation: agendaIn 0.32s ease both; }
        @keyframes agendaIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .book-btn:hover { filter: brightness(1.06); }
        .view-all-link:hover { text-decoration: underline; }
        .waiting-row:hover { background-color: ${TINT}; }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button className="vg-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Meeting</h1>
          <p style={s.topbarSub}>Schedule and manage meetings with the coordinator office.</p>
        </div>
        <div style={s.topbarRight}>
          <div className="vg-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              placeholder="Search meetings..."
              style={s.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="meeting-grid">
          {/* ---------------- Left: day timeline (its own scroll region) ---------------- */}
          <div className="meeting-scroll-col" style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, boxShadow: SHADOW_SM, padding: "28px 30px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
              <div>
                <p style={{ fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.08em", color: "#8A6410", marginBottom: 4 }}>
                  {selectedLabel}
                </p>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: NAVY }}>{selectedDateFull}</h2>
              </div>
              {!isSelectedToday && (
                <button onClick={jumpToToday} style={{ background: TINT, color: NAVY, fontWeight: 600, fontSize: "0.8rem", padding: "8px 16px", borderRadius: 999 }}>
                  Today
                </button>
              )}
            </div>

            {dayMeetings.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0", color: "#9a9a94", gap: 10 }}>
                <CalendarIcon />
                <p style={{ fontSize: "0.92rem" }}>
                  {query ? "No matching meetings on this day." : "No meetings scheduled for this day."}
                </p>
                {!query && (
                  <button onClick={() => setModalStep("choice")} style={{ ...s.continueBtnSmall, marginTop: 6 }}>
                    <CalendarIcon /> Book a meeting
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "flex" }}>
                {/* Hour labels */}
                <div style={{ width: 56, flexShrink: 0, position: "relative", height: trackHeight }}>
                  {hoursArr.slice(0, -1).map((h) => (
                    <span key={h} style={{ position: "absolute", top: (h - startHour) * HOUR_H - 7, right: 10, fontSize: "0.74rem", color: "#9a9a94", fontWeight: 600 }}>
                      {formatHourLabel(h)}
                    </span>
                  ))}
                  {showNowLine && (
                    <span style={{ position: "absolute", top: nowTop - 10, right: 10, background: AMBER, color: NAVY, fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, whiteSpace: "nowrap" }}>
                      {formatTimeLabel(nowMinutes)}
                    </span>
                  )}
                </div>

                {/* Track */}
                <div style={{ flexGrow: 1, position: "relative", borderLeft: `1px solid ${LINE}`, height: trackHeight }}>
                  {hoursArr.map((h) => (
                    <div key={h} style={{ position: "absolute", top: (h - startHour) * HOUR_H, left: 0, right: 0, borderTop: `1px solid ${TINT}` }} />
                  ))}
                  {showNowLine && (
                    <div style={{ position: "absolute", top: nowTop, left: 0, right: 0, height: 2, background: AMBER, zIndex: 2 }}>
                      <span style={{ position: "absolute", left: -5, top: -4, width: 10, height: 10, borderRadius: "50%", background: AMBER }} />
                    </div>
                  )}
                  {dayMeetings.map((m, i) => {
                    const top = ((m.minutes - startHour * 60) / 60) * HOUR_H + 6;
                    const cardH = Math.max(88, HOUR_H - 18);
                    const colors = STATUS_COLORS[m.status] || { bg: AMBER_BG, text: "#6b5220" };
                    return (
                      <div
                        key={m.id}
                        className="agenda-card"
                        style={{
                          position: "absolute",
                          top,
                          left: 16,
                          right: 12,
                          height: cardH,
                          background: TINT,
                          borderLeft: `4px solid ${NAVY}`,
                          borderRadius: 12,
                          padding: "14px 16px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          gap: 6,
                          overflow: "hidden",
                          boxSizing: "border-box",
                          animationDelay: `${i * 45}ms`,
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: NAVY, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexGrow: 1, minWidth: 0 }}>
                              {m.title}
                            </p>
                            <span style={{ fontSize: "0.66rem", fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: colors.bg, color: colors.text, whiteSpace: "nowrap", flexShrink: 0 }}>
                              {m.status}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "#5a5a55", marginTop: 4 }}>
                            {formatTimeLabel(m.minutes)} · with {m.with}
                          </p>
                        </div>
                        <button
                          onClick={() => joinMeeting(m)}
                          style={{ alignSelf: "flex-start", background: WHITE, color: NAVY, fontWeight: 600, fontSize: "0.74rem", padding: "6px 14px", borderRadius: 999, border: `1px solid ${LINE}`, flexShrink: 0 }}
                        >
                          Join
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ---------------- Right: calendar sidebar (its own scroll region) ---------------- */}
          <aside className="meeting-scroll-col" style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 20, boxShadow: SHADOW_SM, padding: "24px 24px 26px" }}>
            <div style={{ display: "inline-flex", background: TINT, borderRadius: 999, padding: 4, marginBottom: 22 }}>
              {(["month", "year"] as const).map((mode) => (
                <button
                  key={mode}
                  className="segment-btn"
                  onClick={() => setCalendarViewMode(mode)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "7px 20px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    background: calendarViewMode === mode ? NAVY : "transparent",
                    color: calendarViewMode === mode ? WHITE : "#8a8a84",
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>

            {calendarViewMode === "month" ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: NAVY }}>
                    {MONTH_NAMES[calendarMonth.getMonth()]} <span style={{ color: "#9a9a94", fontWeight: 500 }}>{calendarMonth.getFullYear()}</span>
                  </p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="cal-nav-btn" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} style={navBtnStyle} aria-label="Previous month">
                      <ChevronLeftIcon />
                    </button>
                    <button className="cal-nav-btn" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} style={navBtnStyle} aria-label="Next month">
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
                  {WEEKDAY_LABELS.map((w, i) => (
                    <span key={i} style={{ textAlign: "center", fontSize: "0.68rem", fontWeight: 700, color: "#9a9a94", letterSpacing: "0.04em" }}>
                      {w}
                    </span>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
                  {monthMatrix.map(({ date, inMonth }, i) => {
                    const key = dateKey(date);
                    const isSelected = key === selectedDateKey;
                    const isToday = key === todayKey;
                    const hasMeeting = meetingDateKeys.has(key);
                    return (
                      <div key={i} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                        <button
                          className={`cal-day-btn ${isSelected ? "cal-day-selected" : ""}`}
                          onClick={() => {
                            setSelectedDateKey(key);
                            if (!inMonth) setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                          }}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            fontSize: "0.8rem",
                            fontWeight: isSelected ? 700 : 600,
                            background: isSelected ? NAVY : "transparent",
                            color: isSelected ? WHITE : inMonth ? "#3a3a36" : "#c7c7c2",
                            border: isToday && !isSelected ? `1.5px solid ${AMBER}` : "1.5px solid transparent",
                          }}
                        >
                          {date.getDate()}
                        </button>
                        {hasMeeting && (
                          <span style={{ position: "absolute", bottom: 2, width: 4, height: 4, borderRadius: "50%", background: isSelected ? WHITE : AMBER }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: NAVY }}>{calendarMonth.getFullYear()}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="cal-nav-btn" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear() - 1, calendarMonth.getMonth(), 1))} style={navBtnStyle} aria-label="Previous year">
                      <ChevronLeftIcon />
                    </button>
                    <button className="cal-nav-btn" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear() + 1, calendarMonth.getMonth(), 1))} style={navBtnStyle} aria-label="Next year">
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {MONTH_ABBR.map((abbr, idx) => {
                    const active = idx === calendarMonth.getMonth();
                    return (
                      <button
                        key={abbr}
                        className="cal-day-btn"
                        onClick={() => {
                          setCalendarMonth(new Date(calendarMonth.getFullYear(), idx, 1));
                          setCalendarViewMode("month");
                        }}
                        style={{
                          padding: "12px 0",
                          borderRadius: 10,
                          fontSize: "0.84rem",
                          fontWeight: 700,
                          background: active ? NAVY : TINT,
                          color: active ? WHITE : "#3a3a36",
                        }}
                      >
                        {abbr}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                className="book-btn"
                onClick={() => setModalStep("choice")}
                style={{
                  ...s.continueBtn,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                }}
              >
                <CalendarIcon /> New meeting
              </button>
            </div>

            {otherMeetings.length > 0 && (
              <div style={{ marginTop: 20, borderTop: `1px solid ${LINE}`, paddingTop: 18 }}>
                <p style={{ fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94", marginBottom: 10 }}>
                  Upcoming ({otherMeetings.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {otherMeetings.map((m) => (
                    <button
                      key={m.id}
                      className="waiting-row"
                      onClick={() => {
                        setSelectedDateKey(dateKey(m.dateObj));
                        setCalendarMonth(new Date(m.dateObj.getFullYear(), m.dateObj.getMonth(), 1));
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderRadius: 10, textAlign: "left", width: "100%" }}
                    >
                      <span style={{ ...s.convoAvatar, width: 30, height: 30, fontSize: "0.72rem" }}>{getInitials(m.with)}</span>
                      <span style={{ flexGrow: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: "0.84rem", fontWeight: 600, color: "#3a3a36", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {m.title}
                        </span>
                        <span style={{ display: "block", fontSize: "0.72rem", color: "#9a9a94" }}>
                          {MONTH_ABBR[m.dateObj.getMonth()]} {m.dateObj.getDate()}
                        </span>
                      </span>
                      <InterviewIcon />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && filteredCombined.length === 0 && (
              <p style={{ marginTop: 20, fontSize: "0.8rem", color: "#9a9a94", textAlign: "center" }}>
                No meetings match {search}.
              </p>
            )}

            <button className="view-all-link" onClick={() => setShowAllDrawer(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 16, fontSize: "0.86rem", fontWeight: 700, color: "#8A6410" }}>
              View all meetings <span aria-hidden>→</span>
            </button>
          </aside>
        </div>
      </div>

      {/* ---------------- New meeting: choice modal ---------------- */}
      {modalStep === "choice" && (
        <div style={s.drawerOverlay} onClick={resetAndCloseModal}>
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
              <button style={s.choiceCard} onClick={() => setModalStep("schedule")}>
                <span style={s.choiceIconBox}>
                  <CalendarIcon />
                </span>
                <span style={s.choiceCardTitle}>Schedule for later</span>
                <span style={s.choiceCardDesc}>Pick a date and time on the calendar.</span>
              </button>
            </div>
            <div style={{ ...s.modalActionsRow, marginTop: 20 }}>
              <button type="button" onClick={resetAndCloseModal} style={s.backBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Live meeting modal ---------------- */}
      {modalStep === "live" && (
        <div style={s.drawerOverlay} onClick={resetAndCloseModal}>
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
              <button type="button" onClick={resetAndCloseModal} style={s.backBtn}>
                Close
              </button>
              <button type="button" onClick={resetAndCloseModal} style={s.continueBtn}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Schedule modal ---------------- */}
      {modalStep === "schedule" && (
        <div style={s.drawerOverlay} onClick={resetAndCloseModal}>
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
                    <button type="button" onClick={goPrevModalMonth} style={s.calendarNavBtn}>
                      <ChevronLeftIcon />
                    </button>
                    <span style={s.calendarMonthLabel}>{modalMonthLabel}</span>
                    <button type="button" onClick={goNextModalMonth} style={s.calendarNavBtn}>
                      <ChevronRightIcon />
                    </button>
                  </div>
                  <div style={s.calendarWeekRow}>
                    {WEEKDAY_LABELS.map((w, i) => (
                      <span key={i} style={s.calendarWeekday}>
                        {w}
                      </span>
                    ))}
                  </div>
                  <div style={s.calendarDayGrid}>
                    {modalMonthCells.map((day, i) => {
                      if (day === null) return <span key={i} style={s.calendarDayBtnEmpty} />;
                      const past = isPastDay(day);
                      const isSelected =
                        !!modalSelectedDate &&
                        modalSelectedDate.getFullYear() === modalCalYear &&
                        modalSelectedDate.getMonth() === modalCalMonth &&
                        modalSelectedDate.getDate() === day;
                      const isToday =
                        modalCalYear === today.getFullYear() && modalCalMonth === today.getMonth() && day === today.getDate();
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={past}
                          onClick={() => setModalSelectedDate(new Date(modalCalYear, modalCalMonth, day))}
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
                <button type="button" onClick={resetAndCloseModal} style={s.backBtn}>
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

      {/* ---------------- All meetings drawer ---------------- */}
      {showAllDrawer && (
        <div style={s.drawerOverlay} onClick={() => setShowAllDrawer(false)}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.drawerHeader, marginBottom: 22 }}>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>All meetings</h3>
                <p style={s.drawerMeta}>{combined.length} scheduled</p>
              </div>
              <button onClick={() => setShowAllDrawer(false)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Scheduled</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredCombined.length === 0 && (
                <p style={{ fontSize: "0.86rem", color: "#9a9a94" }}>
                  {query ? "No meetings match your search." : "No meetings scheduled yet."}
                </p>
              )}
              {filteredCombined.map((m) => {
                const colors = STATUS_COLORS[m.status] || { bg: AMBER_BG, text: "#6b5220" };
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedDateKey(dateKey(m.dateObj));
                      setCalendarMonth(new Date(m.dateObj.getFullYear(), m.dateObj.getMonth(), 1));
                      setShowAllDrawer(false);
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 14, background: TINT, borderRadius: 14, padding: "14px 16px", textAlign: "left", width: "100%" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: WHITE, borderRadius: 10, padding: "8px 12px", minWidth: 58, flexShrink: 0 }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#8A6410", textTransform: "uppercase" }}>
                        {MONTH_ABBR[m.dateObj.getMonth()]}
                      </span>
                      <span style={{ fontSize: "1.05rem", fontWeight: 700, color: NAVY }}>{m.dateObj.getDate()}</span>
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "0.92rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{m.title}</p>
                      <p style={{ fontSize: "0.8rem", color: "#7a7a74" }}>{formatTimeLabel(m.minutes)} · with {m.with}</p>
                    </div>
                    <span style={{ ...s.meetingStatusTag, background: colors.bg, color: colors.text }}>{m.status}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  border: `1px solid ${LINE}`,
  background: WHITE,
  color: NAVY,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};