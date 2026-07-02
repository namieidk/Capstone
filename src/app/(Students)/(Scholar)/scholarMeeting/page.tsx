"use client";

import React, { useState, FormEvent, ReactNode } from "react";
import {
  PlusIcon,
  Field,
  MEETINGS_HOSTING,
  MEETINGS_INVITED,
  AMBER,
  AMBER_BG,
  NAVY,
  s,
} from "@/components/ScholarShared";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button onClick={onClick} style={{ ...s.tabButton, color: active ? NAVY : "#8a8a84", borderBottomColor: active ? AMBER : "transparent" }}>
      {children}
    </button>
  );
}

interface MeetingFormState {
  title: string;
  date: string;
  time: string;
  invitee: string;
}

export default function ScholarMeetingPage() {
  const [tab, setTab] = useState<"schedule" | "host">("schedule");
  const [hosting, setHosting] = useState(MEETINGS_HOSTING);
  const [form, setForm] = useState<MeetingFormState>({ title: "", date: "", time: "", invitee: "" });

  const allMeetings = [
    ...hosting.map((m) => ({ ...m, kind: "hosting" as const })),
    ...MEETINGS_INVITED.map((m) => ({ ...m, kind: "invited" as const })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const createMeeting = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.invitee) return;
    setHosting((prev) => [...prev, { id: Date.now(), ...form, status: "pending" }]);
    setForm({ title: "", date: "", time: "", invitee: "" });
    setTab("schedule");
  };

  return (
    <div style={s.pageWrap}>
      <div style={s.pageHeaderRow}>
        <div>
          <h2 style={s.pageHeading}>Meetings</h2>
          <p style={s.pageSub}>Book a meeting or check whats been scheduled for you.</p>
        </div>
        <button onClick={() => setTab("host")} style={s.continueBtnSmall}>
          <PlusIcon /> Book a meeting
        </button>
      </div>

      <div style={s.tabRow}>
        <TabButton active={tab === "schedule"} onClick={() => setTab("schedule")}>
          My schedule
        </TabButton>
        <TabButton active={tab === "host"} onClick={() => setTab("host")}>
          Book new
        </TabButton>
      </div>

      {tab === "schedule" && (
        <div style={s.meetingList}>
          {allMeetings.map((m) => (
            <div key={m.id} style={s.meetingCard}>
              <div style={s.meetingDateBox}>
                <span style={s.meetingDateMonth}>{m.date.split(" ")[0]}</span>
                <span style={s.meetingDateDay}>{m.date.split(" ")[1]?.replace(",", "")}</span>
              </div>
              <div style={s.meetingInfoCol}>
                <p style={s.meetingTitle}>{m.title}</p>
                <p style={s.meetingMeta}>
                  {m.time} · {m.kind === "hosting" ? `You invited ${(m as typeof MEETINGS_HOSTING[number]).invitee}` : `Invited by ${(m as typeof MEETINGS_INVITED[number]).host}`}
                </p>
              </div>
              <span
                style={{
                  ...s.statusTag,
                  background: m.status === "completed" ? "#E4DCC8" : m.status === "pending" ? "#F3E6C8" : AMBER_BG,
                  color: m.status === "completed" ? "#6b6b66" : "#6b5220",
                }}
              >
                {m.kind === "hosting" ? "Hosting" : "Invited"} · {m.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "host" && (
        <form onSubmit={createMeeting} style={s.meetingForm}>
          <Field label="Meeting title" required>
            <input style={s.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Study plan check-in" />
          </Field>
          <div style={s.fieldRow2}>
            <Field label="Date" required>
              <input type="date" style={s.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Time" required>
              <input type="time" style={s.input} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
          </div>
          <Field label="Invite" required>
            <select style={s.select} value={form.invitee} onChange={(e) => setForm({ ...form, invitee: e.target.value })}>
              <option value="">Select a person to invite...</option>
              <option>Engr. Paolo R. — HR Coordinator</option>
              <option>Coordinator Office — ViaScholar staff</option>
            </select>
          </Field>
          <button type="submit" style={s.continueBtn}>
            Book meeting
          </button>
        </form>
      )}
    </div>
  );
}