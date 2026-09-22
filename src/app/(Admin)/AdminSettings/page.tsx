"use client";

import {
  AlertTriangle,
  Bell,
  ChevronRight,
  FileClock,
  KeyRound,
  Mail,
  ShieldCheck,
  Users2,
} from "lucide-react";
import type React from "react";
import { type ReactNode, useState } from "react";
import {
  BAD,
  BAD_BG,
  BORDER_SUBTLE,
  GOOD,
  MenuIcon,
  NAVY,
  s,
  SHADOW_MD,
  SHADOW_SM,
  TINT,
  ToggleIcon,
  WARN,
  WARN_BG,
  WHITE,
} from "@/components/Adminshared";
import { useSidebar } from "@/components/SidebarContext";

// ============================================================
// Page-local design tokens
// ============================================================

const MUTED = "#8a8a84";
const HAIRLINE = "#EEF0F3";

type Tone = "neutral" | "warn" | "danger";

const TONE_ICON_BG: Record<Tone, string> = { neutral: TINT, warn: WARN_BG, danger: BAD_BG };
const TONE_ICON_COLOR: Record<Tone, string> = { neutral: NAVY, warn: WARN, danger: BAD };
const TONE_TITLE_COLOR: Record<Tone, string> = { neutral: NAVY, warn: WARN, danger: BAD };
const TONE_BORDER: Record<Tone, string> = {
  neutral: BORDER_SUBTLE,
  warn: `1px solid ${WARN_BG}`,
  danger: `1px solid ${BAD_BG}`,
};

interface SettingsSectionProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
  tone?: Tone;
}

function SettingsSection({ title, subtitle, icon, children, tone = "neutral" }: SettingsSectionProps) {
  return (
    <div
      style={{
        background: WHITE,
        border: TONE_BORDER[tone],
        borderRadius: 20,
        padding: "26px 28px 8px",
        marginBottom: 20,
        boxShadow: SHADOW_SM,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: TONE_ICON_BG[tone],
            color: TONE_ICON_COLOR[tone],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <div>
          <h3
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.08rem",
              fontWeight: 700,
              color: TONE_TITLE_COLOR[tone],
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>
          <p style={{ fontSize: "0.8rem", color: MUTED, marginTop: 1 }}>{subtitle}</p>
        </div>
      </div>
      <div className="vc-settings-rows" style={{ display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

interface SettingsRowProps {
  icon: ReactNode;
  label: string;
  desc: string;
  on: boolean;
  onToggle: () => void;
}

function SettingsRow({ icon, label, desc, on, onToggle }: SettingsRowProps) {
  return (
    <div
      className="vc-settings-row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        padding: "16px 10px",
        borderBottom: `1px solid ${HAIRLINE}`,
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: on ? "#DDEEE3" : TINT,
            color: on ? GOOD : NAVY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
        >
          {icon}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "0.92rem", fontWeight: 600, color: NAVY, marginBottom: 3 }}>{label}</p>
          <p style={{ fontSize: "0.8rem", color: MUTED, lineHeight: 1.5 }}>{desc}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span
          style={{
            fontSize: "0.76rem",
            fontWeight: 700,
            color: on ? GOOD : "#b8b8b2",
            minWidth: 26,
            textAlign: "right",
          }}
        >
          {on ? "On" : "Off"}
        </span>
        <button type="button" onClick={onToggle} style={{ flexShrink: 0, cursor: "pointer", display: "flex" }}>
          <ToggleIcon on={on} />
        </button>
      </div>
    </div>
  );
}

interface ActionRowProps {
  icon: ReactNode;
  label: string;
  desc: string;
  buttonLabel: string;
  tone?: Tone;
  onClick?: () => void;
}

function ActionRow({ icon, label, desc, buttonLabel, tone = "neutral", onClick }: ActionRowProps) {
  const btnClass =
    tone === "danger"
      ? "vc-action-btn vc-action-btn-danger"
      : tone === "warn"
        ? "vc-action-btn vc-action-btn-warn"
        : "vc-action-btn";
  const btnStyle: React.CSSProperties =
    tone === "danger" ? dangerBtnStyle : tone === "warn" ? warnBtnStyle : actionBtnStyle;

  return (
    <div
      className="vc-settings-row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        padding: "16px 10px",
        borderRadius: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: TONE_ICON_BG[tone],
            color: TONE_ICON_COLOR[tone],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {icon}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "0.92rem", fontWeight: 600, color: NAVY, marginBottom: 3 }}>{label}</p>
          <p style={{ fontSize: "0.8rem", color: MUTED, lineHeight: 1.5 }}>{desc}</p>
        </div>
      </div>
      <button type="button" onClick={onClick} className={btnClass} style={btnStyle}>
        {buttonLabel}
        <ChevronRight size={14} strokeWidth={2.4} />
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
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: TINT,
  color: NAVY,
  fontWeight: 600,
  fontSize: "0.84rem",
  padding: "10px 16px 10px 18px",
  borderRadius: 999,
  whiteSpace: "nowrap",
  cursor: "pointer",
  flexShrink: 0,
  transition: "background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease",
};

const warnBtnStyle: React.CSSProperties = {
  ...actionBtnStyle,
  background: WARN_BG,
  color: WARN,
};

const dangerBtnStyle: React.CSSProperties = {
  ...actionBtnStyle,
  background: BAD_BG,
  color: BAD,
};

export default function AdminSettingsPage() {
  const { toggleMobile } = useSidebar();

  const [toggles, setToggles] = useState<Toggles>({
    emailNotifs: true,
    systemAlerts: true,
    weeklyOrgDigest: true,
    twoFactor: true,
    auditLog: true,
  });

  const flip = (key: keyof Toggles) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .vc-settings-row { transition: background-color 0.15s ease; }
        .vc-settings-row:hover { background-color: #FAFBFC; }
        .vc-action-btn:hover { background-color: #E4E9EF; box-shadow: ${SHADOW_MD}; transform: translateY(-1px); }
        .vc-action-btn-warn:hover { background-color: #F8E7B8; box-shadow: ${SHADOW_MD}; transform: translateY(-1px); }
        .vc-action-btn-danger:hover { background-color: #F0D3CD; box-shadow: ${SHADOW_MD}; transform: translateY(-1px); }
        .vc-settings-rows > div:last-child { border-bottom: none; }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button type="button" className="vc-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Settings</h1>
          <p style={s.topbarSub}>Manage notifications, security, and account preferences.</p>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 4px 60px" }}>
          <SettingsSection
            title="Notifications"
            subtitle="Choose what the system keeps you updated on"
            icon={<Bell size={18} strokeWidth={2.2} />}
          >
            <SettingsRow
              icon={<AlertTriangle size={15} strokeWidth={2.2} />}
              label="System alerts"
              desc="Get notified of critical events (terminations, flagged scholars, etc.)."
              on={toggles.systemAlerts}
              onToggle={() => flip("systemAlerts")}
            />
            <SettingsRow
              icon={<FileClock size={15} strokeWidth={2.2} />}
              label="Weekly organization digest"
              desc="Summary email of pipeline and scholar activity org-wide."
              on={toggles.weeklyOrgDigest}
              onToggle={() => flip("weeklyOrgDigest")}
            />
            <SettingsRow
              icon={<Mail size={15} strokeWidth={2.2} />}
              label="Email notifications"
              desc="General account email notifications."
              on={toggles.emailNotifs}
              onToggle={() => flip("emailNotifs")}
            />
          </SettingsSection>

          <SettingsSection
            title="Security"
            subtitle="Protect admin access and track account activity"
            icon={<ShieldCheck size={18} strokeWidth={2.2} />}
          >
            <SettingsRow
              icon={<ShieldCheck size={15} strokeWidth={2.2} />}
              label="Two-factor authentication"
              desc="Required for all admin accounts."
              on={toggles.twoFactor}
              onToggle={() => flip("twoFactor")}
            />
            <SettingsRow
              icon={<FileClock size={15} strokeWidth={2.2} />}
              label="Audit log"
              desc="Track every action taken by coordinators and staff."
              on={toggles.auditLog}
              onToggle={() => flip("auditLog")}
            />
            <ActionRow
              icon={<KeyRound size={15} strokeWidth={2.2} />}
              label="Password"
              desc="Last changed 1 month ago."
              buttonLabel="Change password"
            />
          </SettingsSection>

          <SettingsSection
            title="Access control"
            subtitle="Define what coordinators can act on independently"
            icon={<Users2 size={18} strokeWidth={2.2} />}
            tone="warn"
          >
            <ActionRow
              icon={<Users2 size={15} strokeWidth={2.2} />}
              label="Coordinator permissions"
              desc="Manage what coordinators can approve without admin sign-off."
              buttonLabel="Manage permissions"
              tone="warn"
            />
          </SettingsSection>

          <SettingsSection
            title="Account"
            subtitle="Irreversible or sensitive account-level actions"
            icon={<AlertTriangle size={18} strokeWidth={2.2} />}
            tone="danger"
          >
            <ActionRow
              icon={<AlertTriangle size={15} strokeWidth={2.2} />}
              label="Transfer admin role"
              desc="Hand off main administrator access to another account."
              buttonLabel="Transfer role"
              tone="danger"
            />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}