"use client";

import { useState, type ReactNode } from "react";
import { s, NAVY, ToggleIcon } from "../../../../components/ScholarShared";

type Toggles = {
  emailNotifs: boolean;
  smsNotifs: boolean;
  forumDigest: boolean;
  twoFactor: boolean;
  publicProfile: boolean;
};

export default function Settings() {
  const [toggles, setToggles] = useState<Toggles>({
    emailNotifs: true,
    smsNotifs: false,
    forumDigest: true,
    twoFactor: false,
    publicProfile: true,
  });
  const flip = (key: keyof Toggles) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div style={s.pageWrap}>
      <h2 style={s.pageHeading}>Settings</h2>
      <p style={s.pageSub}>Manage your notifications, security, and privacy.</p>

      <SettingsSection title="Notifications">
        <SettingsRow label="Email notifications" desc="Get updates about your application and disbursements." on={toggles.emailNotifs} onToggle={() => flip("emailNotifs")} />
        <SettingsRow label="SMS notifications" desc="Receive a text for time-sensitive reminders." on={toggles.smsNotifs} onToggle={() => flip("smsNotifs")} />
        <SettingsRow label="Weekly forum digest" desc="A summary email of top forum posts." on={toggles.forumDigest} onToggle={() => flip("forumDigest")} />
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingsRow label="Two-factor authentication" desc="Add an extra layer of protection to your account." on={toggles.twoFactor} onToggle={() => flip("twoFactor")} />
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Password</p>
            <p style={s.settingsRowDesc}>Last changed 3 months ago.</p>
          </div>
          <button style={s.settingsActionBtn}>Change password</button>
        </div>
      </SettingsSection>

      <SettingsSection title="Privacy">
        <SettingsRow label="Public profile" desc="Allow other scholars to view your forum activity and bio." on={toggles.publicProfile} onToggle={() => flip("publicProfile")} />
      </SettingsSection>

      <SettingsSection title="Account" danger>
        <div style={s.settingsRow}>
          <div>
            <p style={s.settingsRowLabel}>Deactivate account</p>
            <p style={s.settingsRowDesc}>Temporarily disable your ViaScholar account.</p>
          </div>
          <button style={s.settingsDangerBtn}>Deactivate</button>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ title, children, danger }: { title: string; children: ReactNode; danger?: boolean }) {
  return (
    <div style={s.settingsSection}>
      <h3 style={{ ...s.settingsSectionTitle, color: danger ? "#8a3a2e" : NAVY }}>{title}</h3>
      <div style={s.settingsRowList}>{children}</div>
    </div>
  );
}

function SettingsRow({ label, desc, on, onToggle }: { label: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={s.settingsRow}>
      <div>
        <p style={s.settingsRowLabel}>{label}</p>
        <p style={s.settingsRowDesc}>{desc}</p>
      </div>
      <button onClick={onToggle}><ToggleIcon on={on} /></button>
    </div>
  );
}