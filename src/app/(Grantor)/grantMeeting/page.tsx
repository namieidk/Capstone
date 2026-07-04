"use client";

import React, { useState, FormEvent } from "react";
import { Field, UPCOMING_MEETINGS, ScheduledMeeting, AMBER_BG, s } from "@/components/Grantorshared";

interface MeetingForm {
  title: string;
  date: string;
  time: string;
  invitee: string;
}

export default function GrantorMeetingPage() {
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>(UPCOMING_MEETINGS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MeetingForm>({ title: "", date: "", time: "", invitee: "" });

  const bookMeeting = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.invitee) return;
    setMeetings((prev) => [
      ...prev,
      { id: Date.now(), title: form.title, date: form.date, time: form.time, with: form.invitee, status: "pending" },
    ]);
    setForm({ title: "", date: "", time: "", invitee: "" });
    setShowForm(false);
  };

  return (
    <div style={s.pageContentTop}>
      <div style={s.pageHeaderRow}>
        <p style={s.pageSub}>Meetings with your ViaScholar coordinator.</p>
        <button onClick={() => setShowForm(true)} style={s.continueBtnSmall}>
          Book a meeting
        </button>
      </div>

      <div style={s.meetingList}>
        {meetings.length === 0 && <p style={s.pageSub}>No meetings scheduled yet.</p>}
        {meetings
          .slice()
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((m) => (
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
              <span style={{ ...s.meetingStatusTag, background: AMBER_BG, color: "#6b5220" }}>{m.status}</span>
            </div>
          ))}
      </div>

      {showForm && (
        <div style={s.drawerOverlay} onClick={() => setShowForm(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.drawerName}>Book a meeting</h3>
            <p style={s.drawerMeta}>with the ViaScholar coordinator office</p>
            <form onSubmit={bookMeeting} style={{ marginTop: 20 }}>
              <Field label="Meeting title" required>
                <input style={s.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Quarterly partnership review" />
              </Field>
              <div className="vg-field-row-2" style={s.fieldRow2}>
                <Field label="Date" required>
                  <input type="date" style={s.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </Field>
                <Field label="Time" required>
                  <input type="time" style={s.input} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </Field>
              </div>
              <Field label="With" required>
                <select style={s.select} value={form.invitee} onChange={(e) => setForm({ ...form, invitee: e.target.value })}>
                  <option value="">Select a person...</option>
                  <option>Engr. Paolo R. — HR Coordinator</option>
                  <option>Coordinator Office — ViaScholar staff</option>
                </select>
              </Field>
              <div style={s.modalActionsRow}>
                <button type="button" onClick={() => setShowForm(false)} style={s.backBtn}>
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