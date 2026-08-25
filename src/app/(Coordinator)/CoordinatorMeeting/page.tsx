"use client";

import React, { useMemo, useState, FormEvent } from "react";
import {
  CalendarIcon,
  InterviewIcon,
  XCircleIcon,
  Field,
  APPLICANTS,
  UPCOMING_INTERVIEWS,
  ScheduledInterview,
  Applicant,
  NAVY,
  WHITE,
  TINT,
  LINE,
  AMBER,
  AMBER_BG,
  GOOD,
  BORDER_SUBTLE,
  SHADOW_SM,
  s,
  MenuIcon,
  SearchIcon,
  BellIcon,
} from "@/components/Coordinatorshared";
import { useSidebar } from "@/components/SidebarContext";

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

interface BookForm {
  applicantId: string;
  date: string;
  time: string;
}

export default function MeetingPage() {
  const { toggleMobile } = useSidebar();

  const [search, setSearch] = useState("");
  const [scheduled, setScheduled] = useState<ScheduledInterview[]>(UPCOMING_INTERVIEWS);
  const [passedApplicants, setPassedApplicants] = useState<Applicant[]>(
    APPLICANTS.filter((a) => a.stage === "Interview" && !UPCOMING_INTERVIEWS.find((iv) => iv.id === a.id))
  );
  const [form, setForm] = useState<BookForm>({ applicantId: "", date: "", time: "" });
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<"month" | "year">("month");

  const query = search.trim().toLowerCase();

  const combined = useMemo(() => {
    return scheduled
      .map((m) => ({ ...m, dateObj: parseFlexibleDate(m.date), minutes: parseTimeToMinutes(m.time) }))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime() || a.minutes - b.minutes);
  }, [scheduled]);

  const filteredCombined = useMemo(
    () => (query ? combined.filter((m) => m.name.toLowerCase().includes(query)) : combined),
    [combined, query]
  );
  const filteredPassedApplicants = useMemo(
    () => (query ? passedApplicants.filter((a) => a.name.toLowerCase().includes(query)) : passedApplicants),
    [passedApplicants, query]
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

  let startHour = 8;
  let endHour = 18;
  if (dayMeetings.length > 0) {
    const minM = Math.min(...dayMeetings.map((m) => m.minutes));
    const maxM = Math.max(...dayMeetings.map((m) => m.minutes));
    startHour = Math.max(6, Math.floor(minM / 60) - 1);
    endHour = Math.min(21, Math.ceil(maxM / 60) + 2);
    if (endHour - startHour < 6) endHour = startHour + 6;
  }
  // Taller hour blocks give each card more room, so text and the Join button
  // never crowd the card edges.
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

  const openBookModal = (presetApplicantId?: number) => {
    setForm({ applicantId: presetApplicantId ? String(presetApplicantId) : "", date: selectedDateKey, time: "" });
    setShowBookModal(true);
  };

  const confirmSchedule = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const applicant = passedApplicants.find((a) => String(a.id) === form.applicantId);
    if (!applicant || !form.date || !form.time) return;
    setScheduled((prev) => [...prev, { id: applicant.id, name: applicant.name, initials: applicant.initials, date: form.date, time: form.time }]);
    setPassedApplicants((prev) => prev.filter((a) => a.id !== applicant.id));
    const d = parseFlexibleDate(form.date);
    setSelectedDateKey(dateKey(d));
    setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    setForm({ applicantId: "", date: "", time: "" });
    setShowBookModal(false);
  };

  const joinMeeting = (iv: ScheduledInterview) => {
    // Hook up to your actual video call link / room here.
    console.log("Joining meeting with", iv.name);
  };

  const selectedLabel = isSelectedToday
    ? "TODAY"
    : selectedDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const selectedDateFull = selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

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
        <button className="vc-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Meeting</h1>
          <p style={s.topbarSub}>Schedule interviews for applicants who passed review.</p>
        </div>
        <div style={s.topbarRight}>
          <div className="vc-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              placeholder="Search applicant name..."
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
                  {query ? "No matching interviews on this day." : "No interviews scheduled for this day."}
                </p>
                {passedApplicants.length > 0 && !query && (
                  <button onClick={() => openBookModal()} style={{ ...s.continueBtnSmall, marginTop: 6 }}>
                    <CalendarIcon /> Schedule an interview
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
                              {m.name}
                            </p>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: GOOD, marginTop: 6, flexShrink: 0 }} />
                          </div>
                          <p style={{ fontSize: "0.78rem", color: "#5a5a55", marginTop: 4 }}>
                            {formatTimeLabel(m.minutes)} · Scholarship interview
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
                onClick={() => openBookModal()}
                disabled={passedApplicants.length === 0}
                style={{
                  ...s.continueBtn,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  opacity: passedApplicants.length === 0 ? 0.5 : 1,
                  cursor: passedApplicants.length === 0 ? "default" : "pointer",
                }}
              >
                <CalendarIcon /> Schedule an interview
              </button>
            </div>

            {filteredPassedApplicants.length > 0 && (
              <div style={{ marginTop: 20, borderTop: `1px solid ${LINE}`, paddingTop: 18 }}>
                <p style={{ fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94", marginBottom: 10 }}>
                  Awaiting schedule ({filteredPassedApplicants.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {filteredPassedApplicants.map((a) => (
                    <button
                      key={a.id}
                      className="waiting-row"
                      onClick={() => openBookModal(a.id)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderRadius: 10, textAlign: "left", width: "100%" }}
                    >
                      <span style={{ ...s.convoAvatar, width: 30, height: 30, fontSize: "0.72rem" }}>{a.initials}</span>
                      <span style={{ flexGrow: 1, minWidth: 0, fontSize: "0.84rem", fontWeight: 600, color: "#3a3a36", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.name}
                      </span>
                      <InterviewIcon />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && filteredPassedApplicants.length === 0 && passedApplicants.length > 0 && (
              <p style={{ marginTop: 20, fontSize: "0.8rem", color: "#9a9a94", textAlign: "center" }}>
                No awaiting applicants match {search}.
              </p>
            )}

            <button className="view-all-link" onClick={() => setShowAllDrawer(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 16, fontSize: "0.86rem", fontWeight: 700, color: "#8A6410" }}>
              View all interviews <span aria-hidden>→</span>
            </button>
          </aside>
        </div>
      </div>

      {/* ---------------- Book interview modal ---------------- */}
      {showBookModal && (
        <div style={s.drawerOverlay} onClick={() => setShowBookModal(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.drawerName}>Schedule an interview</h3>
            <p style={s.drawerMeta}>Pick an applicant who passed review, then choose a date and time.</p>
            <form onSubmit={confirmSchedule} style={{ marginTop: 20 }}>
              <Field label="Applicant" required>
                <select style={s.select} value={form.applicantId} onChange={(e) => setForm({ ...form, applicantId: e.target.value })}>
                  <option value="">Select an applicant...</option>
                  {passedApplicants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.course}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="vc-field-row-2" style={s.fieldRow2}>
                <Field label="Date" required>
                  <input type="date" style={s.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </Field>
                <Field label="Time" required>
                  <input type="time" style={s.input} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </Field>
              </div>
              <div style={s.modalActionsRow}>
                <button type="button" onClick={() => setShowBookModal(false)} style={s.backBtn}>
                  Cancel
                </button>
                <button type="submit" style={s.continueBtn}>
                  Confirm interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- All interviews drawer ---------------- */}
      {showAllDrawer && (
        <div style={s.drawerOverlay} onClick={() => setShowAllDrawer(false)}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.drawerHeader, marginBottom: 22 }}>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>All interviews</h3>
                <p style={s.drawerMeta}>{combined.length} scheduled, {passedApplicants.length} awaiting</p>
              </div>
              <button onClick={() => setShowAllDrawer(false)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Scheduled</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              {filteredCombined.length === 0 && (
                <p style={{ fontSize: "0.86rem", color: "#9a9a94" }}>
                  {query ? "No scheduled interviews match your search." : "No interviews scheduled yet."}
                </p>
              )}
              {filteredCombined.map((m) => (
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
                    <p style={{ fontSize: "0.92rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{m.name}</p>
                    <p style={{ fontSize: "0.8rem", color: "#7a7a74" }}>{formatTimeLabel(m.minutes)} · Scholarship interview</p>
                  </div>
                  <span style={{ ...s.meetingStatusTag, background: AMBER_BG, color: "#7A5C0A" }}>Confirmed</span>
                </button>
              ))}
            </div>

            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Awaiting schedule</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredPassedApplicants.length === 0 && (
                <p style={{ fontSize: "0.86rem", color: "#9a9a94" }}>
                  {query ? "No awaiting applicants match your search." : "Everyone who passed review has been scheduled."}
                </p>
              )}
              {filteredPassedApplicants.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setShowAllDrawer(false);
                    openBookModal(a.id);
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 14, background: TINT, borderRadius: 14, padding: "14px 16px", textAlign: "left", width: "100%" }}
                >
                  <span style={s.convoAvatar}>{a.initials}</span>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.92rem", fontWeight: 700, color: NAVY, marginBottom: 2 }}>{a.name}</p>
                    <p style={{ fontSize: "0.8rem", color: "#7a7a74" }}>
                      {a.course} · {a.track} track · Passed review
                    </p>
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "5px 11px", borderRadius: 999, background: TINT, color: NAVY, whiteSpace: "nowrap", flexShrink: 0, border: `1px solid ${LINE}` }}>
                    Select date
                  </span>
                </button>
              ))}
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