"use client";

import React, { useState, FormEvent } from "react";
import {
  CalendarIcon,
  TabButton,
  Field,
  MEETINGS_HOSTING,
  MEETINGS_INVITED,
  HostedMeeting,
  WARN_BG,
  AMBER_BG,
  LINE,
  s,
} from "@/components/AdminShared";

interface MeetingFormState {
  title: string;
  date: string;
  time: string;
  invitee: string;
}

type CombinedMeeting =
  | (HostedMeeting & { kind: "hosting" })
  | ({ id: number; title: string; date: string; time: string; host: string; status: string } & { kind: "invited" });

export default function AdminMeetingPage() {
  const [tab, setTab] = useState<"schedule" | "host">("schedule");
  const [hosting, setHosting] = useState<HostedMeeting[]>(MEETINGS_HOSTING);
  const [form, setForm] = useState<MeetingFormState>({ title: "", date: "", time: "", invitee: "" });

  const allMeetings: CombinedMeeting[] = [
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
        <div />
        <button onClick={() => setTab("host")} style={s.continueBtnSmall}>
          <CalendarIcon /> Book a meeting
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
                  {m.time} · {m.kind === "hosting" ? `You invited ${m.invitee}` : `Invited by ${m.host}`}
                </p>
              </div>
              <span
                style={{
                  ...s.meetingStatusTag,
                  background: m.status === "completed" ? LINE : m.status === "pending" ? WARN_BG : AMBER_BG,
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
            <input style={s.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Coordinator sync" />
          </Field>
          <div className="va-field-row-2" style={s.fieldRow2}>
            <Field label="Date" required>
              <input type="date" style={s.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Time" required>
              <input type="time" style={s.input} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
          </div>
          <Field label="Invite" required>
            <select style={s.select} value={form.invitee} onChange={(e) => setForm({ ...form, invitee: e.target.value })}>
              <option value="">Select a person or group to invite...</option>
              <option>Engr. Paolo Reyes — Coordinator</option>
              <option>Jenny Avila — Coordinator</option>
              <option>All coordinators</option>
              <option>Cawayan River Dev. Corp. — Partner company</option>
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