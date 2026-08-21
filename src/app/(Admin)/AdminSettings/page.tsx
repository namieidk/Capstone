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
} from "@/components/Adminshared";

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
  systemAlerts: boolean;
  weeklyOrgDigest: boolean;
  twoFactor: boolean;
  auditLog: boolean;
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

export default function AdminSettingsPage() {
  const [toggles, setToggles] = useState<Toggles>({
    emailNotifs: true,
    systemAlerts: true,
    weeklyOrgDigest: true,
    twoFactor: true,
    auditLog: true,
  });

  const flip = (key: keyof Toggles) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 4px 60px" }}>
      <SettingsSection title="Notifications">
        <SettingsRow
          label="System alerts"
          desc="Get notified of critical events (terminations, flagged scholars, etc.)."
          on={toggles.systemAlerts}
          onToggle={() => flip("systemAlerts")}
        />
        <SettingsRow
          label="Weekly organization digest"
          desc="Summary email of pipeline and scholar activity org-wide."
          on={toggles.weeklyOrgDigest}
          onToggle={() => flip("weeklyOrgDigest")}
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
          desc="Required for all admin accounts."
          on={toggles.twoFactor}
          onToggle={() => flip("twoFactor")}
        />
        <SettingsRow
          label="Audit log"
          desc="Track every action taken by coordinators and staff."
          on={toggles.auditLog}
          onToggle={() => flip("auditLog")}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: "0.96rem", fontWeight: 600, color: NAVY, marginBottom: 4 }}>Password</p>
            <p style={{ fontSize: "0.84rem", color: "#8a8a84" }}>Last changed 1 month ago.</p>
          </div>
          <button style={actionBtnStyle}>Change password</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Access control">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: "0.96rem", fontWeight: 600, color: NAVY, marginBottom: 4 }}>Coordinator permissions</p>
            <p style={{ fontSize: "0.84rem", color: "#8a8a84", lineHeight: 1.5 }}>
              Manage what coordinators can approve without admin sign-off.
            </p>
          </div>
          <button style={actionBtnStyle}>Manage permissions</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Account" danger>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: "0.96rem", fontWeight: 600, color: NAVY, marginBottom: 4 }}>Transfer admin role</p>
            <p style={{ fontSize: "0.84rem", color: "#8a8a84", lineHeight: 1.5 }}>
              Hand off main administrator access to another account.
            </p>
          </div>
          <button style={dangerBtnStyle}>Transfer role</button>
        </div>
      </SettingsSection>
    </div>
  );
}