"use client";

import React, { useState, ReactNode } from "react";
import { ToggleIcon, NAVY, BAD, s } from "@/components/Coordinatorshared";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  danger?: boolean;
}

function SettingsSection({ title, children, danger }: SettingsSectionProps) {
  return (
    <div style={s.settingsSection}>
      <h3 style={{ ...s.settingsSectionTitle, color: danger ? BAD : NAVY }}>{title}</h3>
      <div style={s.settingsRowList}>{children}</div>
    </div>
  );
}

interface SettingsRowProps {
  label: string;
  desc: string;
  on: boolean;
  onToggle: () => void;
}

function SettingsRow({ label, desc, on, onToggle }: SettingsRowProps) {
  return (
    <div style={s.settingsRow}>
      <div>
        <p style={s.settingsRowLabel}>{label}</p>
        <p style={s.settingsRowDesc}>{desc}</p>
      </div>
      <button onClick={onToggle}>
        <ToggleIcon on={on} />
      </button>
    </div>
  );
}

interface Toggles {
  emailNotifs: boolean;
  newApplicantAlert: boolean;
  interviewReminders: boolean;
  twoFactor: boolean;
  weeklyDigest: boolean;
}

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Toggles>({
    emailNotifs: true,
    newApplicantAlert: true,
    interviewReminders: true,
    twoFactor: false,
    weeklyDigest: true,
  });

  const flip = (key: keyof Toggles) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div style={s.pageWrap}>
      <SettingsSection title="Notifications">
        <SettingsRow label="New applicant alerts" desc="Get notified when a student submits a new application." on={toggles.newApplicantAlert} onToggle={() => flip("newApplicantAlert")} />
        <SettingsRow label="Interview reminders" desc="Reminder 1 hour before a scheduled interview." on={toggles.interviewReminders} onToggle={() => flip("interviewReminders")} />
        <SettingsRow label="Weekly pipeline digest" desc="Summary email of applicant pipeline movement." on={toggles.weeklyDigest} onToggle={() => flip("weeklyDigest")} />
        <SettingsRow label="Email notifications" desc="General account email notifications." on={toggles.emailNotifs} onToggle={() => flip("emailNotifs")} />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingsRow label="Two-factor authentication" desc="Add an extra layer of protection to your account." on={toggles.twoFactor} onToggle={() => flip("twoFactor")} />
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Password</p>
            <p style={s.settingsRowDesc}>Last changed 2 months ago.</p>
          </div>
          <button style={s.settingsActionBtn}>Change password</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Review preferences">
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Default GWA threshold</p>
            <p style={s.settingsRowDesc}>Minimum GWA shown without a warning flag.</p>
          </div>
          <input type="number" defaultValue={90} style={{ ...s.input, width: 90, textAlign: "center" }} />
        </div>
      </SettingsSection>

      <SettingsSection title="Account" danger>
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Transfer coordinator role</p>
            <p style={s.settingsRowDesc}>Hand off your applicant queue to another coordinator.</p>
          </div>
          <button style={s.settingsDangerBtn}>Transfer role</button>
        </div>
      </SettingsSection>
    </div>
  );
}