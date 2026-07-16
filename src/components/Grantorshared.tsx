"use client";

import React, { ReactNode } from "react";
import {
  NAVY, AMBER, AMBER_BG, WHITE, LINE, TINT, GOOD, GOOD_BG, BAD, BAD_BG,
  NAV_KEYS, s,
} from "./Grantorshared.data";

// Re-export everything from the data file so existing imports keep working
export * from "./Grantorshared.data";

// ============================================================
// GLOBAL STYLES
// ============================================================

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');

      .vg * { margin: 0; padding: 0; box-sizing: border-box; }
      .vg {
        background: #F8F4EA;
        color: #2B2B28;
        font-family: 'Inter', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .vg h1, .vg h2, .vg h3 { font-family: 'Fraunces', Georgia, serif; color: #14213A; }
      .vg a { color: inherit; text-decoration: none; }
      .vg button { font-family: 'Inter', sans-serif; cursor: pointer; border: none; background: none; }
      .vg table { border-collapse: collapse; width: 100%; }
      .vg ::-webkit-scrollbar { width: 8px; height: 8px; }
      .vg ::-webkit-scrollbar-thumb { background: #E4DCC8; border-radius: 8px; }

      .vg-app-shell { display: flex; min-height: 100vh; }

      @media (max-width: 980px) {
        .vg-content-grid { grid-template-columns: 1fr !important; }
        .vg-stat-row { grid-template-columns: 1fr 1fr !important; }
        .vg-table-scroll { overflow-x: auto; }
      }
      @media (max-width: 860px) {
        .vg-sidebar { position: fixed !important; left: -260px; transition: left 0.2s ease; z-index: 100; }
        .vg-sidebar.is-open { left: 0 !important; }
        .vg-main { margin-left: 0 !important; }
        .vg-mobile-toggle { display: flex !important; }
      }
      @media (max-width: 700px) {
        .vg-messages-shell { grid-template-columns: 1fr !important; height: auto !important; }
      }
      @media (max-width: 640px) {
        .vg-stat-row { grid-template-columns: 1fr !important; }
        .vg-topbar-search { display: none !important; }
        .vg-field-row-2 { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

// ============================================================
// ICONS
// ============================================================

export function HomeIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>); }
export function InterviewIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /><circle cx="12" cy="15" r="2" /></svg>); }
export function MonitorIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>); }
export function MailIcon({ small }: { small?: boolean }) { const sz = small ? 16 : 19; return (<svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>); }
export function SettingsIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.51.99.9 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>); }
export function ProfileIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" /></svg>); }
export function CheckCircleIcon({ small }: { small?: boolean }) { const sz = small ? 16 : 19; return (<svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.2 2.2 5-5.4" /></svg>); }
export function XCircleIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>); }
export function BellIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2"><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" /><path d="M9.5 18a2.5 2.5 0 0 0 5 0" /></svg>); }
export function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a7a74" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>); }
export function MenuIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>); }
export function LogoutIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>); }
export function ArrowRightIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>); }
export function GradCapIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3z" fill="white" /><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" /></svg>); }
export function SendIcon() { return (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>); }
export function CameraIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>); }
export function DownloadIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 11l5 5 5-5M5 21h14" /></svg>); }
export function TrendUpIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>); }
export function TrendDownIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l6 6 4-4 8 8" /><path d="M17 17h4v-4" /></svg>); }
export function ReportsIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 17v-5M12 17V9M16 17v-3" /></svg>); }
export function BarChartIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 17v-5M12 17V9M16 17v-3" /></svg>); }
export function PaymentsIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="13" rx="2.2" /><path d="M2 10.5h20" /><circle cx="7" cy="15" r="1.2" fill="currentColor" stroke="none" /></svg>); }
export function BuildingIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01" /></svg>); }
export function ClockIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>); }
export function ToggleIcon({ on }: { on: boolean }) {
  return (
    <span style={{ width: 42, height: 24, borderRadius: 999, background: on ? AMBER : LINE, display: "inline-flex", alignItems: "center", padding: 3 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "white", transform: on ? "translateX(18px)" : "translateX(0)", transition: "transform 0.15s" }} />
    </span>
  );
}

// ============================================================
// NAV_ITEMS — built here because icons are JSX (client-only)
// ============================================================

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = NAV_KEYS.map((item) => ({
  ...item,
  icon: item.key === "dashboard" ? <HomeIcon />
    : item.key === "meeting" ? <InterviewIcon />
    : item.key === "monitor" ? <MonitorIcon />
    : item.key === "reports" ? <ReportsIcon />
    : item.key === "message" ? <MailIcon />
    : item.key === "payments" ? <PaymentsIcon />
    : item.key === "settings" ? <SettingsIcon />
    : <ProfileIcon />,
}));

// ============================================================
// ACTIVITY_FEED — contains JSX, stays client-side
// ============================================================

export const ACTIVITY_FEED = [
  { icon: <CheckCircleIcon small />, text: "Q3 disbursement schedule confirmed by the coordinator office.", time: "20 minutes ago" },
  { icon: <MonitorIcon />, text: "Carlo Bautista's GWA dropped below the retention threshold — flagged for review.", time: "1 hour ago" },
  { icon: <InterviewIcon />, text: "Meeting confirmed with Engr. Paolo R. for Jul 8, 3:00 PM.", time: "3 hours ago" },
  { icon: <MailIcon small />, text: "Coordinator replied to your question about the Q3 payment batch.", time: "5 hours ago" },
  { icon: <CheckCircleIcon small />, text: "Donna Mae Fayloga's grade report was verified successfully.", time: "Yesterday" },
];

// ============================================================
// SHARED SMALL COMPONENTS
// ============================================================

export interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function Field({ label, required, children }: FieldProps) {
  return (
    <div style={s.fieldWrap}>
      <label style={s.fieldLabel}>
        {label} {required && <span style={{ color: AMBER }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button onClick={onClick} style={{ ...s.tabButton, color: active ? NAVY : "#8a8a84", borderBottomColor: active ? AMBER : "transparent" }}>
      {children}
    </button>
  );
}

export interface DrawerInfoRowProps {
  label: string;
  value: string;
}

export function DrawerInfoRow({ label, value }: DrawerInfoRowProps) {
  return (
    <div>
      <p style={s.drawerInfoLabel}>{label}</p>
      <p style={s.drawerInfoValue}>{value}</p>
    </div>
  );
}
