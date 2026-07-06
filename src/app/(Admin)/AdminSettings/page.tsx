"use client";

import React, { useState, ReactNode } from "react";
import { ToggleIcon, NAVY, BAD, s } from "@/components/AdminShared";

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
  systemAlerts: boolean;
  weeklyOrgDigest: boolean;
  twoFactor: boolean;
  auditLog: boolean;
}

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
    <div style={s.pageWrap}>
      <SettingsSection title="Notifications">
        <SettingsRow label="System alerts" desc="Get notified of critical events (terminations, flagged scholars, etc.)." on={toggles.systemAlerts} onToggle={() => flip("systemAlerts")} />
        <SettingsRow label="Weekly organization digest" desc="Summary email of pipeline and scholar activity org-wide." on={toggles.weeklyOrgDigest} onToggle={() => flip("weeklyOrgDigest")} />
        <SettingsRow label="Email notifications" desc="General account email notifications." on={toggles.emailNotifs} onToggle={() => flip("emailNotifs")} />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingsRow label="Two-factor authentication" desc="Required for all admin accounts." on={toggles.twoFactor} onToggle={() => flip("twoFactor")} />
        <SettingsRow label="Audit log" desc="Track every action taken by coordinators and staff." on={toggles.auditLog} onToggle={() => flip("auditLog")} />
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Password</p>
            <p style={s.settingsRowDesc}>Last changed 1 month ago.</p>
          </div>
          <button style={s.settingsActionBtn}>Change password</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Access control">
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Coordinator permissions</p>
            <p style={s.settingsRowDesc}>Manage what coordinators can approve without admin sign-off.</p>
          </div>
          <button style={s.settingsActionBtn}>Manage permissions</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Account" danger>
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Transfer admin role</p>
            <p style={s.settingsRowDesc}>Hand off main administrator access to another account.</p>
          </div>
          <button style={s.settingsDangerBtn}>Transfer role</button>
        </div>
      </SettingsSection>
    </div>
  );
}