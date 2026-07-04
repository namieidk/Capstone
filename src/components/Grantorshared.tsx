"use client";

import React, { CSSProperties, ReactNode } from "react";

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
// DESIGN TOKENS
// ============================================================

export const NAVY = "#14213A";
export const CREAM = "#F8F4EA";
export const AMBER = "#C9943D";
export const AMBER_BG = "#F3E6C8";
export const WHITE = "#FFFFFF";
export const GRAY = "#6B6B66";
export const LINE = "#E4DCC8";
export const TINT = "#F4F0E6";
export const GOOD = "#6b8a3e";
export const GOOD_BG = "#E9F0DC";
export const WARN = "#a17a1f";
export const WARN_BG = "#F3E6C8";
export const BAD = "#8a3a2e";
export const BAD_BG = "#F6E4DF";

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
export function PaymentsIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="13" rx="2.2" /><path d="M2 10.5h20" /><circle cx="7" cy="15" r="1.2" fill="currentColor" stroke="none" /></svg>); }
export function BuildingIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01" /></svg>); }
export function ToggleIcon({ on }: { on: boolean }) {
  return (
    <span style={{ width: 42, height: 24, borderRadius: 999, background: on ? AMBER : LINE, display: "inline-flex", alignItems: "center", padding: 3 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "white", transform: on ? "translateX(18px)" : "translateX(0)", transition: "transform 0.15s" }} />
    </span>
  );
}

// ============================================================
// DATA TYPES
// ============================================================

export interface FundedScholar {
  id: number;
  name: string;
  initials: string;
  course: string;
  gwa: number;
  trend: "up" | "down";
  docs: string;
  disbursement: string;
  health: "good" | "warn" | "bad";
}

export interface PaymentRequest {
  id: number;
  name: string;
  initials: string;
  course: string;
  amount: number;
  term: string;
  requestedDate: string;
  status: "Approved" | "Pending approval" | "On hold";
}

export interface Message {
  from: "me" | "them";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

export interface ScheduledMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  with: string;
  status: string;
}

// ============================================================
// MOCK DATA
// ============================================================

export const GRANTOR = {
  name: "Cawayan River Development Corp.",
  initials: "CR",
  title: "Partner Company · Scholarship Grantor",
  email: "grants@cawayanriverdev.com",
  bio: "Funding partner for ViaScholar's Academic and Financial Need tracks since 2021. Supporting the children of our employees and the broader Davao City community through education.",
  bannerGradient: "linear-gradient(120deg, #1B3A34 0%, #14213A 100%)",
  avatarColor: "#F3E6C8",
};

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <HomeIcon />, href: "/grantDashboard" },
  { key: "meeting", label: "Meeting", icon: <InterviewIcon />, href: "/grantMeeting", badge: 2 },
  { key: "monitor", label: "Monitor", icon: <MonitorIcon />, href: "/grantMonitor" },
  { key: "message", label: "Message", icon: <MailIcon />, href: "/grantMessage", badge: 3 },
  { key: "payments", label: "Payments", icon: <PaymentsIcon />, href: "/grantPayment", badge: 1 },
  { key: "settings", label: "Settings", icon: <SettingsIcon />, href: "/grantSettings" },
  { key: "profile", label: "Profile", icon: <ProfileIcon />, href: "/grantProfile" },
];

export const TITLES: Record<string, [string, string]> = {
  "/grantDashboard": ["Welcome back.", "Here's how your funded scholars are doing today."],
  "/grantMeeting": ["Meeting", "Schedule and manage meetings with the coordinator office."],
  "/grantMonitor": ["Monitor", "Scholars funded by your company and their current standing."],
  "/grantMessage": ["Messages", "Conversations with your ViaScholar coordinator."],
  "/grantPayment": ["Payments", "Review and approve scholar disbursements."],
  "/grantSettings": ["Settings", "Manage your notifications, approvals, and security."],
  "/grantProfile": ["Profile", "Your company profile and partnership activity."],
};

export const DASHBOARD_STATS = [
  { label: "Scholars funded", value: "5", tone: "neutral" as const, kpi: "+1", kpiDirection: "up" as const },
  { label: "Disbursed this year", value: "₱160,000", tone: "good" as const, kpi: "+8%", kpiDirection: "up" as const },
  { label: "Pending approval", value: "1", tone: "warn" as const, kpi: "0", kpiDirection: "up" as const },
  { label: "Avg. scholar GWA", value: "91.8%", tone: "amber" as const, kpi: "+0.6", kpiDirection: "up" as const },
];

export const ACTIVITY_FEED = [
  { icon: <CheckCircleIcon small />, text: "Q3 disbursement schedule confirmed by the coordinator office.", time: "20 minutes ago" },
  { icon: <MonitorIcon />, text: "Carlo Bautista's GWA dropped below the retention threshold — flagged for review.", time: "1 hour ago" },
  { icon: <InterviewIcon />, text: "Meeting confirmed with Engr. Paolo R. for Jul 8, 3:00 PM.", time: "3 hours ago" },
  { icon: <MailIcon small />, text: "Coordinator replied to your question about the Q3 payment batch.", time: "5 hours ago" },
  { icon: <CheckCircleIcon small />, text: "Donna Mae Fayloga's grade report was verified successfully.", time: "Yesterday" },
];

export const UPCOMING_MEETINGS: ScheduledMeeting[] = [
  { id: 1, title: "Quarterly partnership review", date: "Jul 8, 2026", time: "3:00 PM", with: "Engr. Paolo R.", status: "confirmed" },
];

export const FUNDED_SCHOLARS: FundedScholar[] = [
  { id: 1, name: "Donna Mae Fayloga", initials: "DF", course: "BS Information Technology, 3rd year", gwa: 92.6, trend: "up", docs: "3/3", disbursement: "On schedule", health: "good" },
  { id: 2, name: "Jonas L.", initials: "JL", course: "BS Computer Science, 2nd year", gwa: 90.1, trend: "down", docs: "2/3", disbursement: "Pending document", health: "warn" },
  { id: 3, name: "Carlo Bautista", initials: "CB", course: "BS Civil Engineering, 3rd year", gwa: 88.9, trend: "down", docs: "1/3", disbursement: "On hold", health: "bad" },
  { id: 4, name: "Mariella S.", initials: "MS", course: "BS Accountancy, 4th year", gwa: 94.2, trend: "up", docs: "3/3", disbursement: "On schedule", health: "good" },
  { id: 5, name: "Patricia Lim", initials: "PL", course: "BS Accountancy, 3rd year", gwa: 93.4, trend: "down", docs: "3/3", disbursement: "On schedule", health: "good" },
];

export const HEALTH_TAG: Record<FundedScholar["health"], { bg: string; text: string; label: string }> = {
  good: { bg: GOOD_BG, text: GOOD, label: "On track" },
  warn: { bg: WARN_BG, text: WARN, label: "Needs attention" },
  bad: { bg: BAD_BG, text: BAD, label: "At risk" },
};

export const PAYMENT_STATUS_COLORS: Record<PaymentRequest["status"], { bg: string; text: string }> = {
  Approved: { bg: GOOD_BG, text: GOOD },
  "Pending approval": { bg: WARN_BG, text: WARN },
  "On hold": { bg: BAD_BG, text: BAD },
};

export const PAYMENT_REQUESTS: PaymentRequest[] = [
  { id: 1, name: "Donna Mae Fayloga", initials: "DF", course: "BS Information Technology, 3rd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Approved" },
  { id: 2, name: "Jonas L.", initials: "JL", course: "BS Computer Science, 2nd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Pending approval" },
  { id: 3, name: "Carlo Bautista", initials: "CB", course: "BS Civil Engineering, 3rd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "On hold" },
  { id: 4, name: "Mariella S.", initials: "MS", course: "BS Accountancy, 4th year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Approved" },
  { id: 5, name: "Patricia Lim", initials: "PL", course: "BS Accountancy, 3rd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Approved" },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "coordinator",
    name: "Engr. Paolo R.", role: "HR Coordinator, ViaScholar", initials: "PR",
    lastMessage: "Sure, I'll send over the Q3 disbursement batch for your approval by Friday.",
    time: "12m ago", unread: 2,
    messages: [
      { from: "them", text: "Hi, just confirming your company's Q3 scholar batch is ready for review.", time: "10:02 AM" },
      { from: "me", text: "Thanks Paolo, please send it over whenever it's ready.", time: "10:05 AM" },
      { from: "them", text: "Sure, I'll send over the Q3 disbursement batch for your approval by Friday.", time: "10:07 AM" },
    ],
  },
  {
    id: "coordinatoroffice",
    name: "Coordinator Office", role: "ViaScholar staff", initials: "CO",
    lastMessage: "Carlo Bautista's GWA has dropped below threshold — flagging for your visibility.",
    time: "1h ago", unread: 1,
    messages: [
      { from: "them", text: "Hi, wanted to flag that one of your funded scholars needs attention.", time: "9:10 AM" },
      { from: "them", text: "Carlo Bautista's GWA has dropped below threshold — flagging for your visibility.", time: "9:12 AM" },
    ],
  },
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

// ============================================================
// STYLES
// ============================================================

export const s: Record<string, CSSProperties> = {
  sidebar: { width: 252, flexShrink: 0, background: WHITE, borderRight: `1px solid ${LINE}`, display: "flex", flexDirection: "column", padding: "26px 18px", height: "100vh", position: "sticky", top: 0 },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 32 },
  sidebarLogoMark: { width: 32, height: 32, borderRadius: 9, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sidebarLogoText: { fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 700, color: NAVY },
  sidebarNav: { display: "flex", flexDirection: "column", gap: 4, flexGrow: 1, overflowY: "auto" },
  sidebarNavItem: { display: "flex", alignItems: "center", gap: 13, padding: "12px 14px", borderRadius: 11, fontSize: "0.95rem", fontWeight: 600, width: "100%", textAlign: "left" },
  sidebarNavIcon: { display: "flex", flexShrink: 0 },
  sidebarNavLabel: { flexGrow: 1 },
  sidebarBadge: { background: AMBER, color: WHITE, fontSize: "0.7rem", fontWeight: 700, borderRadius: 999, minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" },
  sidebarUserCard: { display: "flex", alignItems: "center", gap: 10, borderTop: `1px solid ${LINE}`, paddingTop: 18, marginTop: 12 },
  sidebarAvatar: { width: 38, height: 38, borderRadius: "50%", background: AMBER_BG, color: "#6b5220", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sidebarUserInfo: { flexGrow: 1, minWidth: 0 },
  sidebarUserName: { fontSize: "0.85rem", fontWeight: 700, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  sidebarUserRole: { fontSize: "0.76rem", color: "#8a8a84" },
  sidebarLogoutBtn: { color: "#9a9a94", display: "flex", flexShrink: 0, padding: 6 },

  main: { flexGrow: 1, minWidth: 0 },
  mainContent: { padding: "0 40px 48px" },

  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "28px 40px", borderBottom: `1px solid ${LINE}` },
  mobileToggle: { display: "none", marginRight: 8 },
  topbarGreeting: { fontSize: "1.5rem", fontWeight: 700, color: NAVY, marginBottom: 4 },
  topbarSub: { fontSize: "0.9rem", color: "#7a7a74" },
  topbarRight: { display: "flex", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: TINT, border: `1px solid ${LINE}`, borderRadius: 999, padding: "9px 16px", width: 220 },
  searchInput: { background: "none", fontSize: "0.88rem", color: "#2B2B28", width: "100%", outline: "none" },
  bellBtn: { position: "relative", width: 40, height: 40, borderRadius: "50%", background: TINT, display: "flex", alignItems: "center", justifyContent: "center" },
  bellDot: { position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: "50%", background: AMBER, border: `2px solid ${TINT}` },

  pageWrap: { maxWidth: 900, marginTop: 28 },
  pageContentTop: { marginTop: 28 },
  pageHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap", marginBottom: 4 },
  pageHeading: { fontSize: "1.8rem", fontWeight: 700, color: NAVY, marginBottom: 6 },
  pageSub: { fontSize: "0.96rem", color: "#7a7a74", marginBottom: 24 },

  statRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, margin: "28px 0" },
  pipelineCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px" },
  pipelineTopRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  pipelineLabel: { fontSize: "0.84rem", color: "#7a7a74", marginBottom: 8 },
  pipelineValue: { fontFamily: "'Fraunces', serif", fontSize: "2.1rem", fontWeight: 700, color: NAVY, lineHeight: 1 },
  pipelineTag: { fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: 999 },
  pipelineKpiRow: { display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${LINE}`, paddingTop: 12, fontSize: "0.82rem", fontWeight: 700 },
  pipelineKpiLabel: { color: "#9a9a94", fontWeight: 500 },

  contentGrid: { display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22 },
  feedCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "26px 28px" },
  cardHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  cardHeading: { fontSize: "1.25rem", fontWeight: 700, color: NAVY },
  viewAllBtn: { display: "flex", alignItems: "center", gap: 6, fontSize: "0.86rem", fontWeight: 600, color: AMBER },
  feedList: { display: "flex", flexDirection: "column" },
  feedRow: { display: "flex", gap: 14, padding: "16px 0" },
  feedIconBox: { width: 36, height: 36, borderRadius: 10, background: TINT, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  feedTextCol: { flexGrow: 1 },
  feedText: { fontSize: "0.92rem", color: "#2B2B28", lineHeight: 1.5, marginBottom: 4 },
  feedTime: { fontSize: "0.78rem", color: "#9a9a94" },

  upcomingCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "26px 28px" },
  upcomingList: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 26 },
  upcomingRow: { display: "flex", gap: 12, alignItems: "center" },
  upcomingLabel: { fontSize: "0.9rem", fontWeight: 600, color: NAVY, marginBottom: 2 },
  upcomingDetail: { fontSize: "0.8rem", color: "#8a8a84" },
  quickLinksWrap: { borderTop: `1px solid ${LINE}`, paddingTop: 20, display: "flex", flexDirection: "column", gap: 6 },
  quickLinksHeading: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94", marginBottom: 8 },
  quickLinkBtn: { display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10, fontSize: "0.88rem", color: "#3a3a36", width: "100%" },
  quickLinkIcon: { color: "#8a8a84", display: "flex" },

  filterRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 },
  filterChip: { border: "1px solid", borderRadius: 999, padding: "8px 16px", fontSize: "0.86rem", fontWeight: 600 },
  filterChipCount: { opacity: 0.65, fontWeight: 500 },

  tableWrap: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "8px 8px", marginBottom: 8 },
  th: { textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "#9a9a94", textTransform: "uppercase", letterSpacing: "0.04em", padding: "14px 18px", borderBottom: `1px solid ${LINE}` },
  tr: { borderBottom: `1px solid ${LINE}` },
  td: { padding: "16px 18px", fontSize: "0.9rem", color: "#2B2B28" },
  tdNameRow: { display: "flex", alignItems: "center", gap: 12 },
  tdName: { fontSize: "0.92rem", fontWeight: 700, color: NAVY },
  tdSub: { fontSize: "0.78rem", color: "#9a9a94" },
  stageTag: { fontSize: "0.76rem", fontWeight: 700, padding: "6px 13px", borderRadius: 999, whiteSpace: "nowrap" },
  tableActionBtn: { background: TINT, color: NAVY, fontWeight: 600, fontSize: "0.82rem", padding: "7px 14px", borderRadius: 999 },
  gwaTrendCell: { display: "inline-flex", alignItems: "center", gap: 6 },

  drawerOverlay: { position: "fixed", inset: 0, background: "rgba(20,33,58,0.35)", display: "flex", justifyContent: "flex-end", zIndex: 200 },
  drawerPanel: { width: 440, maxWidth: "92vw", background: WHITE, height: "100%", overflowY: "auto", padding: "32px 30px", boxShadow: "-20px 0 60px -20px rgba(0,0,0,0.2)" },
  drawerHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 26 },
  drawerName: { fontSize: "1.3rem", fontWeight: 700, color: NAVY, marginBottom: 3 },
  drawerMeta: { fontSize: "0.84rem", color: "#8a8a84" },
  drawerCloseBtn: { color: "#9a9a94", flexShrink: 0 },
  drawerInfoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, background: TINT, borderRadius: 14, padding: "18px 20px", marginBottom: 26 },
  drawerInfoLabel: { fontSize: "0.74rem", color: "#9a9a94", marginBottom: 3 },
  drawerInfoValue: { fontSize: "0.94rem", fontWeight: 700, color: NAVY },
  drawerSectionLabel: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94", marginBottom: 12 },
  drawerDocList: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 },
  drawerDocRow: { display: "flex", alignItems: "center", gap: 10, color: GOOD },
  drawerDocText: { flexGrow: 1, fontSize: "0.88rem", color: "#2B2B28" },
  drawerStageActions: { display: "flex", flexDirection: "column", gap: 10 },
  rejectBtn: { background: BAD_BG, color: BAD, fontWeight: 600, fontSize: "0.88rem", padding: "12px 20px", borderRadius: 999, textAlign: "center" },

  modalCard: { background: WHITE, borderRadius: 18, padding: "30px 32px", width: 460, maxWidth: "90vw", alignSelf: "center", margin: "auto" },
  modalActionsRow: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10 },

  fieldWrap: { marginBottom: 18 },
  fieldLabel: { display: "block", fontSize: "0.9rem", fontWeight: 600, color: NAVY, marginBottom: 8 },
  fieldRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  input: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  select: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  continueBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 26px", fontWeight: 600, fontSize: "0.95rem" },
  continueBtnSmall: { display: "flex", alignItems: "center", gap: 8, background: NAVY, color: WHITE, borderRadius: 999, padding: "10px 18px", fontWeight: 600, fontSize: "0.88rem", flexShrink: 0 },
  backBtn: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 999, padding: "12px 22px", fontWeight: 600, fontSize: "0.9rem", color: NAVY },
  reviewEditLink: { background: "none", color: AMBER, fontWeight: 700, fontSize: "0.86rem" },
  tabRow: { display: "flex", gap: 24, borderBottom: `1px solid ${LINE}`, marginBottom: 24 },
  tabButton: { padding: "10px 2px 14px", fontWeight: 600, fontSize: "0.94rem", borderBottom: "2.5px solid transparent" },

  meetingList: { display: "flex", flexDirection: "column", gap: 12 },
  meetingCard: { display: "flex", alignItems: "center", gap: 16, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "16px 20px" },
  meetingDateBox: { display: "flex", flexDirection: "column", alignItems: "center", background: TINT, borderRadius: 12, padding: "10px 14px", minWidth: 64, flexShrink: 0 },
  meetingDateMonth: { fontSize: "0.72rem", fontWeight: 700, color: AMBER, textTransform: "uppercase" },
  meetingDateDay: { fontSize: "1.2rem", fontWeight: 700, color: NAVY },
  meetingInfoCol: { flexGrow: 1, minWidth: 0 },
  meetingTitle: { fontSize: "0.98rem", fontWeight: 700, color: NAVY, marginBottom: 3 },
  meetingMeta: { fontSize: "0.84rem", color: "#7a7a74" },
  meetingStatusTag: { fontSize: "0.76rem", fontWeight: 700, padding: "6px 13px", borderRadius: 999, whiteSpace: "nowrap" },

  messagesShell: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 0, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, overflow: "hidden", height: 600 },
  convoListCol: { borderRight: `1px solid ${LINE}`, overflowY: "auto" },
  convoListItem: { display: "flex", gap: 12, alignItems: "flex-start", width: "100%", padding: "16px 18px", textAlign: "left", position: "relative" },
  convoAvatar: { width: 40, height: 40, borderRadius: "50%", background: AMBER_BG, color: "#6b5220", fontWeight: 700, fontSize: "0.84rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  convoListTextCol: { flexGrow: 1, minWidth: 0 },
  convoListTopRow: { display: "flex", justifyContent: "space-between", marginBottom: 3 },
  convoListName: { fontSize: "0.9rem", fontWeight: 700, color: NAVY },
  convoListTime: { fontSize: "0.74rem", color: "#9a9a94" },
  convoListPreview: { fontSize: "0.82rem", color: "#7a7a74", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  convoUnreadDot: { position: "absolute", top: 16, right: 14, background: AMBER, color: WHITE, fontSize: "0.7rem", fontWeight: 700, borderRadius: 999, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" },
  convoThreadCol: { display: "flex", flexDirection: "column" },
  convoThreadHeader: { display: "flex", gap: 12, alignItems: "center", padding: "16px 22px", borderBottom: `1px solid ${LINE}` },
  convoThreadName: { fontSize: "0.96rem", fontWeight: 700, color: NAVY },
  convoThreadRole: { fontSize: "0.78rem", color: "#9a9a94" },
  convoThreadBody: { flexGrow: 1, padding: "20px 22px", overflowY: "auto" },
  bubbleMine: { background: NAVY, color: WHITE, borderRadius: "14px 14px 4px 14px", padding: "11px 16px", fontSize: "0.9rem", maxWidth: 360, lineHeight: 1.5 },
  bubbleTheirs: { background: TINT, color: "#2B2B28", borderRadius: "14px 14px 14px 4px", padding: "11px 16px", fontSize: "0.9rem", maxWidth: 360, lineHeight: 1.5 },
  bubbleTime: { fontSize: "0.7rem", color: "#9a9a94", marginTop: 4 },
  convoComposer: { display: "flex", gap: 10, padding: "16px 22px", borderTop: `1px solid ${LINE}` },
  convoInput: { flexGrow: 1, background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 999, padding: "12px 18px", fontSize: "0.9rem" },
  convoSendBtn: { width: 42, height: 42, borderRadius: "50%", background: NAVY, color: WHITE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  settingsSection: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 26px", marginBottom: 18 },
  settingsSectionTitle: { fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 },
  settingsRowList: { display: "flex", flexDirection: "column", gap: 18 },
  settingsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 },
  settingsRowLabel: { fontSize: "0.94rem", fontWeight: 600, color: NAVY, marginBottom: 2 },
  settingsRowDesc: { fontSize: "0.82rem", color: "#8a8a84" },
  settingsActionBtn: { background: TINT, color: NAVY, fontWeight: 600, fontSize: "0.86rem", padding: "9px 16px", borderRadius: 999, whiteSpace: "nowrap" },
  settingsDangerBtn: { background: BAD_BG, color: BAD, fontWeight: 600, fontSize: "0.86rem", padding: "9px 16px", borderRadius: 999, whiteSpace: "nowrap" },

  profileBanner: { height: 160, borderRadius: 18, position: "relative" },
  profileBannerEditBtn: { position: "absolute", bottom: 14, right: 16, display: "flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,0.35)", color: WHITE, fontSize: "0.82rem", fontWeight: 600, padding: "8px 14px", borderRadius: 999, backdropFilter: "blur(4px)" },
  profileHeaderRow: { display: "flex", alignItems: "flex-end", gap: 18, padding: "0 8px", marginTop: -36, marginBottom: 20 },
  profileAvatarWrap: { position: "relative", flexShrink: 0 },
  profileAvatar: { width: 88, height: 88, borderRadius: "50%", border: `4px solid ${WHITE}`, color: "#6b5220", fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center", background: AMBER_BG },
  profileAvatarEditBtn: { position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${WHITE}` },
  profileHeaderInfo: { flexGrow: 1, paddingBottom: 6 },
  profileName: { fontSize: "1.5rem", fontWeight: 700, color: NAVY, marginBottom: 2 },
  profileMeta: { fontSize: "0.9rem", color: "#7a7a74" },
  profileBioCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px", marginBottom: 24 },
  profileBioHeader: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  profileBioLabel: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94" },
  profileBioText: { fontSize: "0.94rem", color: "#2B2B28", lineHeight: 1.6 },
  profileDocDownload: { width: 34, height: 34, borderRadius: 9, background: TINT, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  appNoteCard: { display: "flex", gap: 14, alignItems: "flex-start", background: "#F2ECDC", border: "1px solid #E3CB94", borderRadius: 14, padding: "18px 20px", marginBottom: 20 },
  appNoteIcon: { color: AMBER, display: "flex", flexShrink: 0, marginTop: 2 },
  appNoteText: { fontSize: "0.92rem", color: "#3a3a36", lineHeight: 1.6 },
};