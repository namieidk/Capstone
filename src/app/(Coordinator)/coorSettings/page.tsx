"use client";

import React, { useState, ReactNode } from "react";
import {
  ToggleIcon,
  NAVY,
  BAD,
  BAD_BG,
  WHITE,
  TINT,
  LINE,
  SHADOW_SM,
  BORDER_SUBTLE,
} from "@/components/Coordinatorshared";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  danger?: boolean;
}

function SettingsSection({ title, children, danger }: SettingsSectionProps) {
  return (
    <div
      style={{
        background: WHITE,
        border: danger ? `1px solid ${BAD_BG}` : BORDER_SUBTLE,
        borderRadius: 20,
        padding: "28px 30px",
        marginBottom: 24,
        boxShadow: SHADOW_SM,
      }}
    >
      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "1.2rem",
          fontWeight: 700,
          color: danger ? BAD : NAVY,
          marginBottom: 22,
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>{children}</div>
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
      <div>
        <p style={{ fontSize: "0.96rem", fontWeight: 600, color: NAVY, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: "0.84rem", color: "#8a8a84", lineHeight: 1.5 }}>{desc}</p>
      </div>
      <button onClick={onToggle} style={{ flexShrink: 0, cursor: "pointer" }}>
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

const actionBtnStyle: React.CSSProperties = {
  background: TINT,
  color: NAVY,
  fontWeight: 600,
  fontSize: "0.86rem",
  padding: "11px 20px",
  borderRadius: 999,
  whiteSpace: "nowrap",
  cursor: "pointer",
  flexShrink: 0,
};

const dangerBtnStyle: React.CSSProperties = {
  background: BAD_BG,
  color: BAD,
  fontWeight: 600,
  fontSize: "0.86rem",
  padding: "11px 20px",
  borderRadius: 999,
  whiteSpace: "nowrap",
  cursor: "pointer",
  flexShrink: 0,
};

const numberInputStyle: React.CSSProperties = {
  width: 90,
  textAlign: "center",
  border: `1px solid ${LINE}`,
  borderRadius: 12,
  padding: "10px 12px",
  fontSize: "0.9rem",
  color: NAVY,
  fontWeight: 600,
  outline: "none",
  flexShrink: 0,
};

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
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 4px 60px" }}>
      <SettingsSection title="Notifications">
        <SettingsRow
          label="New applicant alerts"
          desc="Get notified when a student submits a new application."
          on={toggles.newApplicantAlert}
          onToggle={() => flip("newApplicantAlert")}
        />
        <SettingsRow
          label="Interview reminders"
          desc="Reminder 1 hour before a scheduled interview."
          on={toggles.interviewReminders}
          onToggle={() => flip("interviewReminders")}
        />
        <SettingsRow
          label="Weekly pipeline digest"
          desc="Summary email of applicant pipeline movement."
          on={toggles.weeklyDigest}
          onToggle={() => flip("weeklyDigest")}
        />
        <SettingsRow
          label="Email notifications"
          desc="General account email notifications."
          on={toggles.emailNotifs}
          onToggle={() => flip("emailNotifs")}
        />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingsRow
          label="Two-factor authentication"
          desc="Add an extra layer of protection to your account."
          on={toggles.twoFactor}
          onToggle={() => flip("twoFactor")}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: "0.96rem", fontWeight: 600, color: NAVY, marginBottom: 4 }}>Password</p>
            <p style={{ fontSize: "0.84rem", color: "#8a8a84" }}>Last changed 2 months ago.</p>
          </div>
          <button style={actionBtnStyle}>Change password</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Review preferences">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: "0.96rem", fontWeight: 600, color: NAVY, marginBottom: 4 }}>Default GWA threshold</p>
            <p style={{ fontSize: "0.84rem", color: "#8a8a84", lineHeight: 1.5 }}>
              Minimum GWA shown without a warning flag.
            </p>
          </div>
          <input type="number" defaultValue={90} style={numberInputStyle} />
        </div>
      </SettingsSection>

      <SettingsSection title="Account" danger>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: "0.96rem", fontWeight: 600, color: NAVY, marginBottom: 4 }}>Transfer coordinator role</p>
            <p style={{ fontSize: "0.84rem", color: "#8a8a84", lineHeight: 1.5 }}>
              Hand off your applicant queue to another coordinator.
            </p>
          </div>
          <button style={dangerBtnStyle}>Transfer role</button>
        </div>
      </SettingsSection>
    </div>
  );
}