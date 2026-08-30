"use client";

import React, { useState, ReactNode } from "react";
import { ToggleIcon, NAVY, s, MenuIcon } from "../../../../components/StudentShared";
import { useSidebar } from "../../../../components/SidebarContext";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  danger?: boolean;
}

function SettingsSection({ title, children, danger }: SettingsSectionProps) {
  return (
    <div
      style={{
        ...s.settingsSection,
        border: danger ? "1px solid #F0C9BC" : s.settingsSection.border,
      }}
    >
      <h3
        style={{
          ...s.settingsSectionTitle,
          color: danger ? "#8a3a2e" : NAVY,
        }}
      >
        {title}
      </h3>
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
      <button onClick={onToggle} style={{ flexShrink: 0, cursor: "pointer" }}>
        <ToggleIcon on={on} />
      </button>
    </div>
  );
}

interface Toggles {
  emailNotifs: boolean;
  smsNotifs: boolean;
  forumDigest: boolean;
  twoFactor: boolean;
  publicProfile: boolean;
}

export default function SettingsPage() {
  const { toggleMobile } = useSidebar();

  const [toggles, setToggles] = useState<Toggles>({
    emailNotifs: true,
    smsNotifs: false,
    forumDigest: true,
    twoFactor: false,
    publicProfile: true,
  });

  const flip = (key: keyof Toggles) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Settings</h1>
          <p style={s.topbarSub}>Manage your notifications, security, and privacy.</p>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 4px 60px" }}>
          <SettingsSection title="Notifications">
            <SettingsRow
              label="Email notifications"
              desc="Get updates about your application status and requirements."
              on={toggles.emailNotifs}
              onToggle={() => flip("emailNotifs")}
            />
            <SettingsRow
              label="SMS notifications"
              desc="Receive a text for time-sensitive reminders."
              on={toggles.smsNotifs}
              onToggle={() => flip("smsNotifs")}
            />
            <SettingsRow
              label="Weekly forum digest"
              desc="A summary email of top forum posts."
              on={toggles.forumDigest}
              onToggle={() => flip("forumDigest")}
            />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsRow
              label="Two-factor authentication"
              desc="Add an extra layer of protection to your account."
              on={toggles.twoFactor}
              onToggle={() => flip("twoFactor")}
            />
            <div style={s.settingsRow}>
              <div>
                <p style={s.settingsRowLabel}>Password</p>
                <p style={s.settingsRowDesc}>Last changed 3 months ago.</p>
              </div>
              <button style={s.settingsActionBtn}>Change password</button>
            </div>
          </SettingsSection>

          <SettingsSection title="Privacy">
            <SettingsRow
              label="Public profile"
              desc="Allow other applicants to view your forum activity and bio."
              on={toggles.publicProfile}
              onToggle={() => flip("publicProfile")}
            />
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
      </div>
    </div>
  );
}