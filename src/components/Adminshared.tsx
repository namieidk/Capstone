

import React, { CSSProperties, ReactNode } from "react";

// ============================================================
// GLOBAL STYLES
// ============================================================

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');

      .va * { margin: 0; padding: 0; box-sizing: border-box; }
      .va {
        background: #F8F4EA;
        color: #2B2B28;
        font-family: 'Inter', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .va h1, .va h2, .va h3 { font-family: 'Fraunces', Georgia, serif; color: #14213A; }
      .va a { color: inherit; text-decoration: none; }
      .va button { font-family: 'Inter', sans-serif; cursor: pointer; border: none; background: none; }
      .va table { border-collapse: collapse; width: 100%; }
      .va ::-webkit-scrollbar { width: 8px; height: 8px; }
      .va ::-webkit-scrollbar-thumb { background: #E4DCC8; border-radius: 8px; }

      .va-app-shell { display: flex; min-height: 100vh; }

      @media (max-width: 980px) {
        .va-content-grid { grid-template-columns: 1fr !important; }
        .va-stat-row { grid-template-columns: 1fr 1fr !important; }
        .va-table-scroll { overflow-x: auto; }
      }
      @media (max-width: 860px) {
        .va-sidebar { position: fixed !important; left: -260px; transition: left 0.2s ease; z-index: 100; }
        .va-sidebar.is-open { left: 0 !important; }
        .va-main { margin-left: 0 !important; }
        .va-mobile-toggle { display: flex !important; }
      }
      @media (max-width: 700px) {
        .va-messages-shell { grid-template-columns: 1fr !important; height: auto !important; }
      }
      @media (max-width: 640px) {
        .va-stat-row { grid-template-columns: 1fr !important; }
        .va-topbar-search { display: none !important; }
        .va-field-row-2 { grid-template-columns: 1fr !important; }
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
export function PeopleIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="8" r="3.2" /><path d="M3 19c0-3.2 2.7-5.6 6-5.6s6 2.4 6 5.6" /><circle cx="17" cy="8.5" r="2.6" /><path d="M21 19c0-2.6-1.7-4.7-4-5.3" /></svg>); }
export function MonitorIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>); }
export function ReportsIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 16v-4M12 16V8M16 16v-7" /></svg>); }
export function ArchiveIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="5" rx="1.5" /><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" /><path d="M10 13h4" /></svg>); }
export function MailIcon({ small }: { small?: boolean }) { const sz = small ? 16 : 19; return (<svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>); }
export function SettingsIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.51.99.9 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>); }
export function ProfileIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" /></svg>); }
export function ForumIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>); }
export function BriefcaseIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></svg>); }
export function CalendarIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>); }
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
export function HeartIcon({ filled }: { filled?: boolean }) { return (<svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? AMBER : "none"} stroke={filled ? AMBER : "currentColor"} strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>); }
export function CommentIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>); }
export function TrashIcon() { return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" /></svg>); }
export function PaymentsIcon() { return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="13" rx="2.2" /><path d="M2 10.5h20" /><circle cx="7" cy="15" r="1.2" fill="currentColor" stroke="none" /></svg>); }
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

export type ScholarHealth = "good" | "warn" | "bad";

export interface ScholarRecord {
  id: number;
  name: string;
  initials: string;
  course: string;
  year: string;
  track: string;
  gwa: number;
  coordinator: string;
  joined: string;
  email: string;
  phone: string;
  address: string;
  health: ScholarHealth;
}

export interface EmployeeRecord {
  id: number;
  name: string;
  initials: string;
  role: string;
  department: string;
  type: "Coordinator" | "Partner Employee";
  status: "Active" | "On leave";
  joined: string;
  email: string;
}

export interface MonitorScholar {
  id: number;
  name: string;
  initials: string;
  course: string;
  gwa: number;
  trend: "up" | "down";
  docs: string;
  disbursement: string;
  health: ScholarHealth;
  coordinator: string;
}

export interface ArchivedScholar {
  id: number;
  name: string;
  initials: string;
  course: string;
  track: string;
  coordinator: string;
  joined: string;
  exited: string;
  status: "Graduated" | "Terminated" | "Withdrawn";
  note: string;
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

export interface ForumPost {
  id: number;
  author: string;
  initials: string;
  role: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export interface HostedMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  invitee: string;
  status: string;
}

export interface InvitedMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  host: string;
  status: string;
}

export interface AdminPaymentRecord {
  id: number;
  name: string;
  initials: string;
  course: string;
  coordinator: string;
  amount: number;
  term: string;
  scheduledDate: string;
  status: "Paid" | "Scheduled" | "On hold";
}

// ============================================================
// MOCK DATA
// ============================================================

export const ADMIN = {
  name: "Atty. Ramon Castillo",
  initials: "RC",
  title: "Main Administrator, ViaScholar",
  email: "ramon.castillo@viascholar.org",
  bio: "Overseeing ViaScholar's scholarship operations across all coordinators and partner companies in Davao City since 2019. Final approval on policy, budget, and staffing.",
  bannerGradient: "linear-gradient(120deg, #1B3A34 0%, #14213A 100%)",
  avatarColor: AMBER_BG,
};

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <HomeIcon />, href: "/AdminDashboard" },
  { key: "monitor", label: "Monitor", icon: <MonitorIcon />, href: "/Adminmonitor" },
  { key: "archive", label: "Archive", icon: <ArchiveIcon />, href: "/AdminArchive" },
  { key: "employee", label: "Employee", icon: <BriefcaseIcon />, href: "/AdminEmployee" },
  { key: "meeting", label: "Meeting", icon: <CalendarIcon />, href: "/AdminMeeting", badge: 2 },
  { key: "forum", label: "Forum", icon: <ForumIcon />, href: "/AdminForum", badge: 5 },
  { key: "payments", label: "Payments", icon: <PaymentsIcon />, href: "/AdminPayment", badge: 3 },
  { key: "reports", label: "Overall reports", icon: <ReportsIcon />, href: "/AdminReports" },
  { key: "message", label: "Message", icon: <MailIcon />, href: "/AdminMessage", badge: 4 },
  { key: "settings", label: "Settings", icon: <SettingsIcon />, href: "/AdminSettings" },
  { key: "profile", label: "Profile", icon: <ProfileIcon />, href: "/AdminProfile" },
];

export const TITLES: Record<string, [string, string]> = {
  "/AdminDashboard": ["Good morning, Atty. Castillo.", "Here's the org-wide snapshot for today."],
  "/Adminmonitor": ["Monitor", "Active scholars across all coordinators and their current standing."],
  "/AdminArchive": ["Archive", "Scholars who are no longer active, across all coordinators."],
  "/AdminEmployee": ["Employee", "Coordinators, HR staff, and partner-company employees on file."],
  "/AdminMeeting": ["Meeting", "Book a meeting or check what's scheduled for you."],
  "/AdminForum": ["Forum", "Monitor scholar discussions and post announcements."],
  "/AdminPayments": ["Payments", "Org-wide scholar disbursements across every coordinator."],
  "/AdminReports": ["Overall reports", "Pipeline performance and analytics across the organization."],
  "/AdminMessage": ["Messages", "Conversations with coordinators and partner companies."],
  "/AdminSettings": ["Settings", "System-wide preferences, security, and access control."],
  "/AdminProfile": ["Profile", "Your administrator profile and activity."],
};

export const SCHOLARS_DIRECTORY: ScholarRecord[] = [
  { id: 1, name: "Donna Mae Fayloga", initials: "DF", course: "BS Information Technology", year: "3rd year", track: "Academic", gwa: 92.6, coordinator: "Engr. Paolo Reyes", joined: "Jun 2024", email: "d.fayloga.543617@umindanao.edu.ph", phone: "0986 543 216", address: "Kabacan St, Ecoland, Davao City", health: "good" },
  { id: 2, name: "Mariella S.", initials: "MS", course: "BS Accountancy", year: "4th year", track: "Returning Scholar", gwa: 94.2, coordinator: "Engr. Paolo Reyes", joined: "Jun 2022", email: "mariella.s@umindanao.edu.ph", phone: "0917 220 4471", address: "Bajada, Davao City", health: "good" },
  { id: 3, name: "Jonas L.", initials: "JL", course: "BS Computer Science", year: "2nd year", track: "Academic", gwa: 90.1, coordinator: "Engr. Paolo Reyes", joined: "Jul 2025", email: "jonas.l@addu.edu.ph", phone: "0928 871 0023", address: "Matina, Davao City", health: "warn" },
  { id: 4, name: "Patricia Lim", initials: "PL", course: "BS Accountancy", year: "3rd year", track: "Returning Scholar", gwa: 93.4, coordinator: "Jenny Avila", joined: "Jun 2023", email: "patricia.lim@usep.edu.ph", phone: "0915 442 8810", address: "Toril, Davao City", health: "good" },
  { id: 5, name: "Carlo Bautista", initials: "CB", course: "BS Civil Engineering", year: "3rd year", track: "Academic", gwa: 88.9, coordinator: "Jenny Avila", joined: "Jul 2024", email: "carlo.b@addu.edu.ph", phone: "0922 109 7762", address: "Buhangin, Davao City", health: "bad" },
  { id: 6, name: "Reign P.", initials: "RP", course: "BS Nursing", year: "1st year", track: "Financial Need", gwa: 88.5, coordinator: "Jenny Avila", joined: "Jun 2026", email: "reign.p@umindanao.edu.ph", phone: "0933 671 4420", address: "Talomo, Davao City", health: "good" },
  { id: 7, name: "Bea Hernandez", initials: "BH", course: "BS Nursing", year: "2nd year", track: "Financial Need", gwa: 90.7, coordinator: "Engr. Paolo Reyes", joined: "Jun 2025", email: "bea.h@usep.edu.ph", phone: "0945 332 1190", address: "Agdao, Davao City", health: "good" },
];

export const EMPLOYEES: EmployeeRecord[] = [
  { id: 1, name: "Engr. Paolo Reyes", initials: "PR", role: "HR Coordinator", department: "ViaScholar Operations", type: "Coordinator", status: "Active", joined: "Mar 2022", email: "paolo.reyes@viascholar.org" },
  { id: 2, name: "Jenny Avila", initials: "JA", role: "Scholarship Coordinator", department: "ViaScholar Operations", type: "Coordinator", status: "Active", joined: "Jan 2024", email: "jenny.avila@viascholar.org" },
  { id: 3, name: "Mark Villaroel", initials: "MV", role: "Documents Reviewer", department: "ViaScholar Operations", type: "Coordinator", status: "On leave", joined: "Aug 2023", email: "mark.villaroel@viascholar.org" },
  { id: 4, name: "Liza Tan", initials: "LT", role: "Senior Software Engineer", department: "Cawayan River Dev. Corp.", type: "Partner Employee", status: "Active", joined: "Feb 2019", email: "liza.tan@crdc.com.ph" },
  { id: 5, name: "Roberto Cruz", initials: "RC", role: "Finance Manager", department: "Cawayan River Dev. Corp.", type: "Partner Employee", status: "Active", joined: "Nov 2020", email: "roberto.cruz@crdc.com.ph" },
  { id: 6, name: "Engr. Paolo R.", initials: "PR", role: "HR Coordinator", department: "Partner Company A", type: "Partner Employee", status: "Active", joined: "May 2021", email: "p.r@partnerco-a.com" },
  { id: 7, name: "Samantha Reyes", initials: "SR", role: "Office Administrator", department: "ViaScholar Operations", type: "Coordinator", status: "Active", joined: "Jun 2025", email: "samantha.reyes@viascholar.org" },
];

export interface OrgKpi {
  label: string;
  value: number;
  kpi: string;
  kpiDirection: "up" | "down";
}

export const ORG_KPIS: OrgKpi[] = [
  { label: "Total applicants", value: 87, kpi: "+18%", kpiDirection: "up" },
  { label: "Active scholars", value: SCHOLARS_DIRECTORY.length, kpi: "+2", kpiDirection: "up" },
  { label: "Coordinators", value: EMPLOYEES.filter((e) => e.type === "Coordinator").length, kpi: "+1", kpiDirection: "up" },
  { label: "Partner companies", value: 3, kpi: "0", kpiDirection: "up" },
];

export interface PipelineCount {
  label: string;
  value: number;
  tone: "neutral" | "warn" | "amber" | "good";
  kpi: string;
  kpiDirection: "up" | "down";
}

export const PIPELINE_COUNTS: PipelineCount[] = [
  { label: "Submitted", value: 21, tone: "neutral", kpi: "+12%", kpiDirection: "up" },
  { label: "Under review", value: 14, tone: "warn", kpi: "+5%", kpiDirection: "up" },
  { label: "Interview", value: 9, tone: "amber", kpi: "-8%", kpiDirection: "down" },
  { label: "Accepted", value: 6, tone: "good", kpi: "+20%", kpiDirection: "up" },
];

export const TONE_MAP: Record<PipelineCount["tone"], { bg: string; text: string }> = {
  neutral: { bg: TINT, text: "#6b6b66" },
  warn: { bg: WARN_BG, text: WARN },
  amber: { bg: AMBER_BG, text: "#6b5220" },
  good: { bg: GOOD_BG, text: GOOD },
};

export const ADMIN_ACTIVITY_FEED = [
  { icon: <CheckCircleIcon small />, text: "Jenny Avila accepted Reign P. into the Financial Need track.", time: "18 minutes ago" },
  { icon: <PeopleIcon />, text: "5 new applications submitted across all coordinators today.", time: "1 hour ago" },
  { icon: <BriefcaseIcon />, text: "Samantha Reyes was added as a new Office Administrator.", time: "3 hours ago" },
  { icon: <MonitorIcon />, text: "Carlo Bautista flagged 'At risk' — missing 2 of 3 documents.", time: "5 hours ago" },
  { icon: <ArchiveIcon />, text: "Grace Tolentino's scholarship was terminated and archived.", time: "Yesterday" },
];

export interface UpcomingItem {
  label: string;
  detail: string;
  urgent?: boolean;
}

export const UPCOMING_FOR_ADMIN: UpcomingItem[] = [
  { label: "Quarterly budget review", detail: "Jul 2, 2026 · 9:00 AM", urgent: true },
  { label: "Partner company onboarding call", detail: "Jul 5, 2026 · 2:00 PM" },
  { label: "Coordinator performance review", detail: "Jul 10, 2026" },
];

export const MONITOR_SCHOLARS: MonitorScholar[] = SCHOLARS_DIRECTORY.map((s2) => ({
  id: s2.id,
  name: s2.name,
  initials: s2.initials,
  course: `${s2.course}, ${s2.year}`,
  gwa: s2.gwa,
  trend: s2.health === "good" ? "up" : "down",
  docs: s2.health === "bad" ? "1/3" : s2.health === "warn" ? "2/3" : "3/3",
  disbursement: s2.health === "bad" ? "On hold" : s2.health === "warn" ? "Pending document" : "On schedule",
  health: s2.health,
  coordinator: s2.coordinator,
}));

export const HEALTH_TAG: Record<ScholarHealth, { bg: string; text: string; label: string }> = {
  good: { bg: GOOD_BG, text: GOOD, label: "On track" },
  warn: { bg: WARN_BG, text: WARN, label: "Needs attention" },
  bad: { bg: BAD_BG, text: BAD, label: "At risk" },
};

export const ARCHIVED_SCHOLARS: ArchivedScholar[] = [
  { id: 1, name: "Therese Aguilar", initials: "TA", course: "BS Accountancy", track: "Academic", coordinator: "Engr. Paolo Reyes", joined: "Jun 2022", exited: "May 2026", status: "Graduated", note: "Completed degree with honors. Eligible for alumni mentorship program." },
  { id: 2, name: "Marco Villanueva", initials: "MV", course: "BS Civil Engineering", track: "Academic", coordinator: "Jenny Avila", joined: "Aug 2023", exited: "Feb 2026", status: "Terminated", note: "Failed to maintain minimum GWA for two consecutive semesters." },
  { id: 3, name: "Kristine Ong", initials: "KO", course: "BS Nursing", track: "Financial Need", coordinator: "Jenny Avila", joined: "Jul 2021", exited: "Apr 2026", status: "Graduated", note: "Completed degree. Now employed at Davao Medical Center." },
  { id: 4, name: "Allan Mercado", initials: "AM", course: "BS Information Technology", track: "Returning Scholar", coordinator: "Engr. Paolo Reyes", joined: "Jan 2024", exited: "Mar 2026", status: "Withdrawn", note: "Voluntarily withdrew due to transfer to another university." },
  { id: 5, name: "Grace Tolentino", initials: "GT", course: "BS Education", track: "Academic", coordinator: "Mark Villaroel", joined: "Jun 2022", exited: "Jan 2026", status: "Terminated", note: "Found to have submitted falsified income documents." },
  { id: 6, name: "Paolo Diaz", initials: "PD", course: "BS Computer Science", track: "Academic", coordinator: "Engr. Paolo Reyes", joined: "Jul 2020", exited: "Jun 2025", status: "Graduated", note: "Completed degree, cum laude. Sponsored thesis on scholarship matching algorithms." },
];

export const ARCHIVE_STATUS_STYLE: Record<ArchivedScholar["status"], { bg: string; text: string }> = {
  Graduated: { bg: GOOD_BG, text: GOOD },
  Terminated: { bg: BAD_BG, text: BAD },
  Withdrawn: { bg: WARN_BG, text: WARN },
};

export const MONTHLY_APPLICATIONS = [
  { month: "Feb", count: 32 },
  { month: "Mar", count: 41 },
  { month: "Apr", count: 38 },
  { month: "May", count: 52 },
  { month: "Jun", count: 61 },
];

export const STAGE_FUNNEL = [
  { stage: "Submitted", count: 87 },
  { stage: "Under review", count: 64 },
  { stage: "Interview", count: 29 },
  { stage: "Accepted", count: 18 },
];

export const TRACK_BREAKDOWN = [
  { track: "Academic", count: 41, color: NAVY },
  { track: "Financial Need", count: 28, color: AMBER },
  { track: "Returning Scholar", count: 18, color: "#4A6B63" },
];

export const COORDINATOR_PERFORMANCE = [
  { name: "Engr. Paolo Reyes", reviewed: 52, accepted: 19, avgDays: 5.4 },
  { name: "Jenny Avila", reviewed: 38, accepted: 14, avgDays: 6.8 },
  { name: "Mark Villaroel", reviewed: 21, accepted: 7, avgDays: 7.9 },
];

export const MEETINGS_HOSTING: HostedMeeting[] = [
  { id: 1, title: "Quarterly budget review", date: "Jul 2, 2026", time: "9:00 AM", invitee: "All coordinators", status: "confirmed" },
  { id: 2, title: "Partner company onboarding call", date: "Jul 5, 2026", time: "2:00 PM", invitee: "Cawayan River Dev. Corp.", status: "confirmed" },
];

export const MEETINGS_INVITED: InvitedMeeting[] = [
  { id: 3, title: "Coordinator performance review", date: "Jul 10, 2026", time: "11:00 AM", host: "Board of Trustees", status: "pending" },
];

export const FORUM_POSTS: ForumPost[] = [
  { id: 1, author: "Mariella S.", initials: "MS", role: "BS Accountancy, 4th year", time: "2h ago", text: "Finally submitted my mid-year grade report! Reminder to fellow scholars — the portal accepts PDF and JPG, no need to overthink the format.", likes: 14, comments: 3, liked: false },
  { id: 2, author: "Jonas L.", initials: "JL", role: "BS Computer Science, 2nd year", time: "5h ago", text: "Tips for maintaining 90%+ GWA? Struggling a bit balancing my thesis prep with regular coursework this term.", likes: 22, comments: 9, liked: true },
  { id: 3, author: "Donna Mae Fayloga", initials: "DF", role: "BS Information Technology, 3rd year", time: "1d ago", text: "Currently editing my travel vlog from Samal Island while waiting for my interview schedule. Anyone else juggling a side project while being a scholar?", likes: 31, comments: 6, liked: false },
  { id: 4, author: "Engr. Paolo Reyes", initials: "PR", role: "HR Coordinator", time: "2d ago", text: "Reminder to all scholars under the Academic track: Q3 disbursements go out Jul 15. Please make sure your bank details on file are up to date!", likes: 45, comments: 4, liked: false },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "paolo",
    name: "Engr. Paolo Reyes", role: "HR Coordinator", initials: "PR",
    lastMessage: "Will do, I'll send the updated pipeline numbers by end of day.",
    time: "10m ago", unread: 1,
    messages: [
      { from: "me", text: "Hi Paolo, can you send me this week's applicant numbers before the budget review?", time: "9:40 AM" },
      { from: "them", text: "Will do, I'll send the updated pipeline numbers by end of day.", time: "9:52 AM" },
    ],
  },
  {
    id: "jenny",
    name: "Jenny Avila", role: "Scholarship Coordinator", initials: "JA",
    lastMessage: "Reign P. has been accepted into the Financial Need track.",
    time: "1h ago", unread: 2,
    messages: [
      { from: "them", text: "Good morning! Just an update — Reign P. has been accepted into the Financial Need track.", time: "8:15 AM" },
      { from: "me", text: "Great, thank you for the update. How's the rest of her batch looking?", time: "8:30 AM" },
      { from: "them", text: "Two more pending document review, should clear by Friday.", time: "8:34 AM" },
    ],
  },
  {
    id: "crdc",
    name: "Cawayan River Dev. Corp.", role: "Partner company HR", initials: "CR",
    lastMessage: "We'd like to discuss increasing our scholarship slots for next year.",
    time: "Yesterday", unread: 0,
    messages: [
      { from: "them", text: "Hi Atty. Castillo, we'd like to discuss increasing our scholarship slots for next year.", time: "Yesterday, 3:00 PM" },
      { from: "me", text: "Happy to. Let's set up a call — I've proposed Jul 5 at 2:00 PM on the calendar.", time: "Yesterday, 3:20 PM" },
    ],
  },
];

// ---------- Payments (org-wide, new for Admin) ----------

export const PAYMENT_STATUS_COLORS: Record<AdminPaymentRecord["status"], { bg: string; text: string }> = {
  Paid: { bg: GOOD_BG, text: GOOD },
  Scheduled: { bg: AMBER_BG, text: "#6b5220" },
  "On hold": { bg: BAD_BG, text: BAD },
};

export const ADMIN_PAYMENT_RECORDS: AdminPaymentRecord[] = [
  { id: 1, name: "Donna Mae Fayloga", initials: "DF", course: "BS Information Technology, 3rd year", coordinator: "Engr. Paolo Reyes", amount: 8000, term: "Q3 2026", scheduledDate: "Jul 15, 2026", status: "Paid" },
  { id: 2, name: "Mariella S.", initials: "MS", course: "BS Accountancy, 4th year", coordinator: "Engr. Paolo Reyes", amount: 8000, term: "Q3 2026", scheduledDate: "Jul 15, 2026", status: "Scheduled" },
  { id: 3, name: "Jonas L.", initials: "JL", course: "BS Computer Science, 2nd year", coordinator: "Engr. Paolo Reyes", amount: 8000, term: "Q3 2026", scheduledDate: "Jul 15, 2026", status: "On hold" },
  { id: 4, name: "Patricia Lim", initials: "PL", course: "BS Accountancy, 3rd year", coordinator: "Jenny Avila", amount: 8000, term: "Q3 2026", scheduledDate: "Jul 15, 2026", status: "Scheduled" },
  { id: 5, name: "Carlo Bautista", initials: "CB", course: "BS Civil Engineering, 3rd year", coordinator: "Jenny Avila", amount: 8000, term: "Q3 2026", scheduledDate: "Jul 15, 2026", status: "On hold" },
  { id: 6, name: "Reign P.", initials: "RP", course: "BS Nursing, 1st year", coordinator: "Jenny Avila", amount: 8000, term: "Q3 2026", scheduledDate: "Jul 15, 2026", status: "Scheduled" },
  { id: 7, name: "Bea Hernandez", initials: "BH", course: "BS Nursing, 2nd year", coordinator: "Engr. Paolo Reyes", amount: 8000, term: "Q3 2026", scheduledDate: "Jul 15, 2026", status: "Paid" },
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
  sidebar: { width: 252, flexShrink: 0, background: WHITE, borderRight: `1px solid ${LINE}`, display: "flex", flexDirection: "column", padding: "26px 18px", height: "100vh", position: "sticky", top: 0, overflowY: "auto" },
  sidebarLogo: { display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 },
  sidebarLogoMark: { width: 32, height: 32, borderRadius: 9, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sidebarLogoText: { fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 700, color: NAVY },
  sidebarNav: { display: "flex", flexDirection: "column", gap: 3, flexGrow: 1 },
  sidebarNavItem: { display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", borderRadius: 11, fontSize: "0.92rem", fontWeight: 600, width: "100%", textAlign: "left" },
  sidebarNavIcon: { display: "flex", flexShrink: 0 },
  sidebarNavLabel: { flexGrow: 1 },
  sidebarBadge: { background: AMBER, color: WHITE, fontSize: "0.7rem", fontWeight: 700, borderRadius: 999, minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" },
  sidebarUserCard: { display: "flex", alignItems: "center", gap: 10, borderTop: `1px solid ${LINE}`, paddingTop: 18, marginTop: 12 },
  sidebarAvatar: { width: 38, height: 38, borderRadius: "50%", background: AMBER_BG, color: "#6b5220", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sidebarUserInfo: { flexGrow: 1, minWidth: 0 },
  sidebarUserName: { fontSize: "0.82rem", fontWeight: 700, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
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

  pageWrap: { maxWidth: 900 },
  pageHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap", marginBottom: 4 },
  pageHeading: { fontSize: "1.8rem", fontWeight: 700, color: NAVY, marginBottom: 6 },
  pageSub: { fontSize: "0.96rem", color: "#7a7a74", marginBottom: 24 },
  subSectionLabel: { fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "#9a9a94", margin: "8px 0 -4px" },

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
  upcomingRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  upcomingDot: { width: 9, height: 9, borderRadius: "50%", marginTop: 6, flexShrink: 0 },
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
  drawerContactLine: { fontSize: "0.9rem", color: "#2B2B28", lineHeight: 1.7 },
  drawerStageActions: { display: "flex", flexDirection: "column", gap: 10 },
  rejectBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: BAD_BG, color: BAD, fontWeight: 600, fontSize: "0.88rem", padding: "12px 20px", borderRadius: 999, textAlign: "center" },

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
  meetingForm: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "28px 30px", maxWidth: 520 },

  composerCard: { display: "flex", gap: 14, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px", marginBottom: 24 },
  composerInput: { width: "100%", background: "none", border: "none", fontSize: "0.94rem", fontFamily: "'Inter', sans-serif", resize: "none", minHeight: 50, outline: "none" },
  composerActionsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${LINE}`, paddingTop: 12, marginTop: 8 },
  composerHint: { fontSize: "0.8rem", color: "#9a9a94" },
  forumFeed: { display: "flex", flexDirection: "column", gap: 16 },
  forumPostCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px" },
  forumPostHeader: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14 },
  forumPostAuthor: { fontSize: "0.94rem", fontWeight: 700, color: NAVY },
  forumPostMeta: { fontSize: "0.78rem", color: "#9a9a94" },
  forumPostText: { fontSize: "0.94rem", color: "#2B2B28", lineHeight: 1.6, marginBottom: 16 },
  forumPostActions: { display: "flex", gap: 20, borderTop: `1px solid ${LINE}`, paddingTop: 12 },
  forumActionBtn: { display: "flex", alignItems: "center", gap: 7, fontSize: "0.86rem", fontWeight: 600, color: "#7a7a74" },
  forumModerateBtn: { color: "#c0817a", flexShrink: 0 },

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

  appNoteCard: { display: "flex", gap: 14, alignItems: "flex-start", background: "#F2ECDC", border: "1px solid #E3CB94", borderRadius: 14, padding: "18px 20px", marginBottom: 20 },
  appNoteIcon: { color: AMBER, display: "flex", flexShrink: 0, marginTop: 2 },
  appNoteText: { fontSize: "0.92rem", color: "#3a3a36", lineHeight: 1.6 },

  barChartRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 14, height: 160, padding: "10px 4px 0" },
  barChartCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexGrow: 1, height: "100%" },
  barChartValue: { fontSize: "0.78rem", fontWeight: 700, color: NAVY },
  barChartTrack: { width: "100%", maxWidth: 36, flexGrow: 1, display: "flex", alignItems: "flex-end" },
  barChartFill: { width: "100%", background: AMBER, borderRadius: "6px 6px 0 0", minHeight: 4 },
  barChartLabel: { fontSize: "0.78rem", color: "#9a9a94" },

  funnelList: { display: "flex", flexDirection: "column", gap: 14 },
  funnelRow: { display: "flex", alignItems: "center", gap: 14 },
  funnelLabel: { fontSize: "0.84rem", color: "#55554f", width: 100, flexShrink: 0 },
  funnelTrack: { flexGrow: 1, height: 10, background: TINT, borderRadius: 999, overflow: "hidden" },
  funnelFill: { height: "100%", background: NAVY, borderRadius: 999 },
  funnelValue: { fontSize: "0.84rem", fontWeight: 700, color: NAVY, width: 28, textAlign: "right", flexShrink: 0 },

  trackList: { display: "flex", flexDirection: "column", gap: 18, marginBottom: 26 },
  trackRow: { display: "flex", flexDirection: "column", gap: 8 },
  trackTopRow: { display: "flex", justifyContent: "space-between" },
  trackLabel: { fontSize: "0.88rem", fontWeight: 600, color: NAVY },
  trackCount: { fontSize: "0.88rem", fontWeight: 700, color: NAVY },
  trackTrack: { height: 8, background: TINT, borderRadius: 999, overflow: "hidden" },
  trackFill: { height: "100%", borderRadius: 999 },

  coordPerfList: { display: "flex", flexDirection: "column", gap: 12 },
  coordPerfRow: { display: "flex", alignItems: "center", gap: 14, background: TINT, borderRadius: 12, padding: "12px 16px" },
  coordPerfInfo: { flexGrow: 1, minWidth: 0 },
  coordPerfRate: { fontSize: "0.8rem", fontWeight: 700, color: NAVY, whiteSpace: "nowrap" },

  paymentSummaryRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 26 },
};