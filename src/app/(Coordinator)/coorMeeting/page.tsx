"use client";

import React, { useState, FormEvent } from "react";
import {
  InterviewIcon,
  TabButton,
  Field,
  APPLICANTS,
  UPCOMING_INTERVIEWS,
  ScheduledInterview,
  AMBER_BG,
  s,
} from "@/components/Coordinatorshared";

interface PickerForm {
  date: string;
  time: string;
}

export default function MeetingPage() {
  const [tab, setTab] = useState<"schedule" | "toSchedule">("schedule");
  const [scheduled, setScheduled] = useState<ScheduledInterview[]>(UPCOMING_INTERVIEWS);
  const [passedApplicants, setPassedApplicants] = useState(
    APPLICANTS.filter((a) => a.stage === "Interview" && !UPCOMING_INTERVIEWS.find((iv) => iv.id === a.id))
  );
  const [pickerFor, setPickerFor] = useState<(typeof APPLICANTS)[number] | null>(null);
  const [form, setForm] = useState<PickerForm>({ date: "", time: "" });

  const openPicker = (applicant: (typeof APPLICANTS)[number]) => {
    setPickerFor(applicant);
    setForm({ date: "", time: "" });
  };

  const confirmSchedule = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.date || !form.time || !pickerFor) return;
    setScheduled((prev) => [...prev, { id: pickerFor.id, name: pickerFor.name, initials: pickerFor.initials, date: form.date, time: form.time }]);
    setPassedApplicants((prev) => prev.filter((a) => a.id !== pickerFor.id));
    setPickerFor(null);
  };

  return (
    <div style={s.pageContentTop}>
      <div style={s.tabRow}>
        <TabButton active={tab === "schedule"} onClick={() => setTab("schedule")}>
          Scheduled ({scheduled.length})
        </TabButton>
        <TabButton active={tab === "toSchedule"} onClick={() => setTab("toSchedule")}>
          Awaiting schedule ({passedApplicants.length})
        </TabButton>
      </div>

      {tab === "schedule" && (
        <div style={s.meetingList}>
          {scheduled.length === 0 && <p style={s.pageSub}>No interviews scheduled yet.</p>}
          {scheduled
            .slice()
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((iv) => (
              <div key={iv.id} style={s.meetingCard}>
                <div style={s.meetingDateBox}>
                  <span style={s.meetingDateMonth}>{iv.date.split(" ")[0]}</span>
                  <span style={s.meetingDateDay}>{iv.date.split(" ")[1]?.replace(",", "")}</span>
                </div>
                <span style={s.convoAvatar}>{iv.initials}</span>
                <div style={s.meetingInfoCol}>
                  <p style={s.meetingTitle}>{iv.name}</p>
                  <p style={s.meetingMeta}>{iv.time} · Scholarship interview</p>
                </div>
                <span style={{ ...s.meetingStatusTag, background: AMBER_BG, color: "#6b5220" }}>Confirmed</span>
              </div>
            ))}
        </div>
      )}

      {tab === "toSchedule" && (
        <div style={s.meetingList}>
          {passedApplicants.length === 0 && <p style={s.pageSub}>Everyone who passed review has been scheduled.</p>}
          {passedApplicants.map((a) => (
            <div key={a.id} style={s.meetingCard}>
              <span style={s.convoAvatar}>{a.initials}</span>
              <div style={s.meetingInfoCol}>
                <p style={s.meetingTitle}>{a.name}</p>
                <p style={s.meetingMeta}>
                  {a.course} · {a.track} track · Passed review
                </p>
              </div>
              <button onClick={() => openPicker(a)} style={s.continueBtnSmall}>
                Select date <InterviewIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {pickerFor && (
        <div style={s.drawerOverlay} onClick={() => setPickerFor(null)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.drawerName}>Schedule interview</h3>
            <p style={s.drawerMeta}>with {pickerFor.name}</p>
            <form onSubmit={confirmSchedule} style={{ marginTop: 20 }}>
              <div className="vc-field-row-2" style={s.fieldRow2}>
                <Field label="Date" required>
                  <input type="date" style={s.input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </Field>
                <Field label="Time" required>
                  <input type="time" style={s.input} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </Field>
              </div>
              <div style={s.modalActionsRow}>
                <button type="button" onClick={() => setPickerFor(null)} style={s.backBtn}>
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
    </div>
  );
}