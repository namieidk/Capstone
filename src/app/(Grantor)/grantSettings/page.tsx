"use client";

import React, { useState, ReactNode } from "react";
import { ToggleIcon, NAVY, BAD, s } from "@/components/Grantorshared";

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
  disbursementAlerts: boolean;
  scholarRiskAlerts: boolean;
  autoApprove: boolean;
  twoFactor: boolean;
}

export default function GrantorSettingsPage() {
  const [toggles, setToggles] = useState<Toggles>({
    emailNotifs: true,
    disbursementAlerts: true,
    scholarRiskAlerts: true,
    autoApprove: false,
    twoFactor: false,
  });

  const flip = (key: keyof Toggles) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div style={s.pageWrap}>
      <SettingsSection title="Notifications">
        <SettingsRow label="Disbursement alerts" desc="Get notified when a new payment batch is ready for approval." on={toggles.disbursementAlerts} onToggle={() => flip("disbursementAlerts")} />
        <SettingsRow label="Scholar risk alerts" desc="Alert when a funded scholar's GWA drops below threshold." on={toggles.scholarRiskAlerts} onToggle={() => flip("scholarRiskAlerts")} />
        <SettingsRow label="Email notifications" desc="General account email notifications." on={toggles.emailNotifs} onToggle={() => flip("emailNotifs")} />
      </SettingsSection>

      <SettingsSection title="Approvals">
        <SettingsRow label="Auto-approve on-schedule payments" desc="Skip manual review for payments with no flags." on={toggles.autoApprove} onToggle={() => flip("autoApprove")} />
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Default GWA threshold</p>
            <p style={s.settingsRowDesc}>Minimum GWA shown without a warning flag.</p>
          </div>
          <input type="number" defaultValue={90} style={{ ...s.input, width: 90, textAlign: "center" }} />
        </div>
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingsRow label="Two-factor authentication" desc="Add an extra layer of protection to your account." on={toggles.twoFactor} onToggle={() => flip("twoFactor")} />
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Password</p>
            <p style={s.settingsRowDesc}>Last changed 4 months ago.</p>
          </div>
          <button style={s.settingsActionBtn}>Change password</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Account" danger>
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Transfer account access</p>
            <p style={s.settingsRowDesc}>Hand off this companys ViaScholar account to another representative.</p>
          </div>
          <button style={s.settingsDangerBtn}>Transfer access</button>
        </div>
      </SettingsSection>
    </div>
  );
}