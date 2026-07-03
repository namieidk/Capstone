import React, { CSSProperties, ReactNode } from "react";

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap');

      .vd * { margin: 0; padding: 0; box-sizing: border-box; }
      .vd {
        background: #F8F4EA;
        color: #2B2B28;
        font-family: 'Inter', -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .vd h1, .vd h2, .vd h3 { font-family: 'Fraunces', Georgia, serif; color: #14213A; }
      .vd a { color: inherit; text-decoration: none; }
      .vd button { font-family: 'Inter', sans-serif; cursor: pointer; border: none; background: none; }
      .vd ::-webkit-scrollbar { width: 8px; height: 8px; }
      .vd ::-webkit-scrollbar-thumb { background: #E4DCC8; border-radius: 8px; }

      .vd-app-shell { display: flex; min-height: 100vh; }

      @media (max-width: 980px) {
        .vd-content-grid { grid-template-columns: 1fr !important; }
        .vd-stat-row { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 860px) {
        .vd-sidebar { position: fixed !important; left: -260px; transition: left 0.2s ease; z-index: 100; }
        .vd-sidebar.is-open { left: 0 !important; }
        .vd-main { margin-left: 0 !important; }
        .vd-mobile-toggle { display: flex !important; }
      }
      @media (max-width: 640px) {
        .vd-stat-row { grid-template-columns: 1fr !important; }
        .vd-topbar-search { display: none !important; }
        .vd-field-row-2 { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

export const NAVY = "#14213A";
export const CREAM = "#F8F4EA";
export const AMBER = "#C9943D";
export const AMBER_BG = "#F3E6C8";
export const WHITE = "#FFFFFF";
export const GRAY = "#6B6B66";
export const LINE = "#E4DCC8";
export const TINT = "#F4F0E6";

// ============================================================
// MOCK DATA — swap with real data later
// ============================================================

export const SCHOLAR = {
  name: "Donna Mae Fayloga",
  initials: "DF",
  course: "BS Information Technology",
  year: "3rd year",
  bio: "3rd year IT student at University of Mindanao. Into travel vlogging and video editing on the side. Grateful for the push to keep grades up this term.",
  avatarColor: "#F3E6C8",
  bannerGradient: "linear-gradient(120deg, #1B3A34 0%, #14213A 100%)",
};

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Home", icon: <HomeIcon />, href: "/Appdashboard" },
  { key: "application", label: "Application", icon: <ApplicationIcon />, href: "/applicationss" },
  { key: "settings", label: "Settings", icon: <SettingsIcon />, href: "/applicantsettings" },
  { key: "profile", label: "Profile", icon: <ProfileIcon />, href: "/Profile" },
];

export interface ActivityItem {
  icon: ReactNode;
  text: string;
  time: string;
}

export const ACTIVITY_FEED: ActivityItem[] = [
  { icon: <MailIcon small />, text: "Engr. Paolo R. sent you a message about your Q3 disbursement.", time: "12 minutes ago" },
  { icon: <ForumIcon small />, text: 'New reply on your thread "Tips for maintaining 90%+ GWA?"', time: "1 hour ago" },
  { icon: <CalendarIcon small />, text: "Coordinator check-in scheduled for Jul 3, 2:00 PM.", time: "3 hours ago" },
  { icon: <CheckCircleIcon small />, text: "Your Grades / TOR document was verified successfully.", time: "Yesterday" },
  { icon: <MailIcon small />, text: "HR Coordinator confirmed your contract renewal.", time: "2 days ago" },
];

export interface UpcomingItem {
  label: string;
  detail: string;
  urgent?: boolean;
}

export const UPCOMING_ITEMS: UpcomingItem[] = [
  { label: "Coordinator check-in", detail: "Jul 3, 2026 · 2:00 PM", urgent: true },
  { label: "Submit mid-year grade report", detail: "Due Jul 10, 2026" },
  { label: "Forum: Scholar town hall", detail: "Jul 15, 2026 · 6:00 PM" },
];

export interface ApplicationStage {
  key: string;
  title: string;
  date: string;
  desc: string;
}

export const APPLICATION_STAGES: ApplicationStage[] = [
  { key: "submitted", title: "Submitted", date: "Jun 12, 2026", desc: "Your application and documents were received." },
  { key: "review", title: "Under review", date: "Jun 18, 2026", desc: "A coordinator is verifying your documents and eligibility." },
  { key: "interview", title: "Interview", date: "Jun 26, 2026", desc: "Brief call with a ViaScholar coordinator to confirm details." },
  { key: "decision", title: "Decision", date: "Pending", desc: "You'll be notified by email and on this page." },
  { key: "onboarding", title: "Onboarding", date: "Pending", desc: "Contract signing and disbursement setup." },
];

export const CURRENT_STAGE_INDEX = 2; // 0-indexed: currently at "Interview"

export interface ProfileDocument {
  label: string;
  file: string;
  size: string;
  status: "verified" | "pending";
}

export const PROFILE_DOCUMENTS: ProfileDocument[] = [
  { label: "Grades / Transcript of Records", file: "TOR_2026_Q2.pdf", size: "1.2 MB", status: "verified" },
  { label: "Proof of family member's employment", file: "employment_certificate.jpg", size: "780 KB", status: "verified" },
  { label: "Latest report card / Form 138", file: "form138_midyear.png", size: "640 KB", status: "verified" },
  { label: "Valid government ID", file: "national_id.jpg", size: "410 KB", status: "pending" },
];

// ============================================================
// ICONS
// ============================================================

export function HomeIcon() {
  return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>);
}
export function MailIcon({ small }: { small?: boolean }) {
  const sz = small ? 16 : 19;
  return (<svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>);
}
export function CalendarIcon({ small }: { small?: boolean }) {
  const sz = small ? 16 : 19;
  return (<svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>);
}
export function ForumIcon({ small }: { small?: boolean }) {
  const sz = small ? 16 : 19;
  return (<svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
}
export function SettingsIcon() {
  return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.51.99.9 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
}
export function ProfileIcon() {
  return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" /></svg>);
}
export function CheckCircleIcon({ small }: { small?: boolean }) {
  const sz = small ? 16 : 19;
  return (<svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.2 2.2 5-5.4" /></svg>);
}
export function BellIcon() {
  return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2"><path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" /><path d="M9.5 18a2.5 2.5 0 0 0 5 0" /></svg>);
}
export function SearchIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7a7a74" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>);
}
export function MenuIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>);
}
export function LogoutIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>);
}
export function ArrowRightIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
}
export function GradCapIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3z" fill="white" /><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" /></svg>);
}
export function ApplicationIcon() {
  return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M9 12l2 2 4-4" /></svg>);
}
export function CameraIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>);
}
export function DownloadIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 11l5 5 5-5M5 21h14" /></svg>);
}
export function CheckIconSmall() {
  return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5 9-11" /></svg>);
}
export function ToggleIcon({ on }: { on: boolean }) {
  return (
    <span style={{ width: 42, height: 24, borderRadius: 999, background: on ? "#C9943D" : "#E4DCC8", display: "inline-flex", alignItems: "center", padding: 3, transition: "background 0.15s" }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "white", transform: on ? "translateX(18px)" : "translateX(0)", transition: "transform 0.15s" }} />
    </span>
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
  sidebarNav: { display: "flex", flexDirection: "column", gap: 4, flexGrow: 1 },
  sidebarNavItem: { display: "flex", alignItems: "center", gap: 13, padding: "12px 14px", borderRadius: 11, fontSize: "0.95rem", fontWeight: 600, width: "100%", textAlign: "left" },
  sidebarNavIcon: { display: "flex", flexShrink: 0 },
  sidebarNavLabel: { flexGrow: 1 },
  sidebarUserCard: { display: "flex", alignItems: "center", gap: 10, borderTop: `1px solid ${LINE}`, paddingTop: 18, marginTop: 12 },
  sidebarAvatar: { width: 38, height: 38, borderRadius: "50%", background: AMBER_BG, color: "#6b5220", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sidebarUserInfo: { flexGrow: 1, minWidth: 0 },
  sidebarUserName: { fontSize: "0.88rem", fontWeight: 700, color: NAVY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  sidebarUserRole: { fontSize: "0.76rem", color: "#8a8a84" },
  sidebarLogoutBtn: { color: "#9a9a94", display: "flex", flexShrink: 0, padding: 6 },

  main: { flexGrow: 1, minWidth: 0 },
  mainContent: { padding: "0 40px 48px" },

  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "28px 40px", borderBottom: `1px solid ${LINE}` },
  mobileToggle: { display: "none", marginRight: 8 },
  floatingMobileToggle: { display: "none", position: "fixed", top: 18, left: 18, zIndex: 90, width: 42, height: 42, borderRadius: 11, background: WHITE, border: `1px solid ${LINE}`, alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -10px rgba(20,33,58,0.25)" },
  topbarGreeting: { fontSize: "1.5rem", fontWeight: 700, color: NAVY, marginBottom: 4 },
  topbarSub: { fontSize: "0.9rem", color: "#7a7a74" },
  topbarRight: { display: "flex", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: TINT, border: `1px solid ${LINE}`, borderRadius: 999, padding: "9px 16px", width: 220 },
  searchInput: { background: "none", fontSize: "0.88rem", color: "#2B2B28", width: "100%", outline: "none" },
  bellBtn: { position: "relative", width: 40, height: 40, borderRadius: "50%", background: TINT, display: "flex", alignItems: "center", justifyContent: "center" },
  bellDot: { position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: "50%", background: AMBER, border: `2px solid ${TINT}` },

  statRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, margin: "32px 0 28px" },
  statCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "22px 24px", display: "flex", flexDirection: "column", minHeight: 150 },
  statCardLabel: { fontSize: "0.86rem", color: "#7a7a74", marginBottom: 8 },
  statCardValue: { fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color: NAVY, marginBottom: 12 },
  statProgressTrack: { height: 7, background: LINE, borderRadius: 999, overflow: "hidden", marginBottom: 12 },
  statProgressFill: { height: "100%", background: AMBER, borderRadius: 999 },
  statCardCaption: { fontSize: "0.82rem", color: "#6b6b66" },

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

  pageWrap: { maxWidth: 900 },
  pageHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" },
  pageHeading: { fontSize: "1.8rem", fontWeight: 700, color: NAVY, marginBottom: 6 },
  pageSub: { fontSize: "0.96rem", color: "#7a7a74", marginBottom: 28 },

  input: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  continueBtnSmall: { display: "flex", alignItems: "center", gap: 8, background: NAVY, color: WHITE, borderRadius: 999, padding: "10px 18px", fontWeight: 600, fontSize: "0.88rem", flexShrink: 0 },
  reviewEditLink: { background: "none", color: AMBER, fontWeight: 700, fontSize: "0.86rem" },
  tabRow: { display: "flex", gap: 24, borderBottom: `1px solid ${LINE}`, marginBottom: 24 },
  tabButton: { padding: "10px 2px 14px", fontWeight: 600, fontSize: "0.94rem", borderBottom: "2.5px solid transparent" },

  appStatusCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "28px 30px", marginBottom: 20 },
  appStatusHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 28 },
  appStatusBadge: { background: AMBER_BG, color: "#6b5220", fontWeight: 700, fontSize: "0.86rem", padding: "8px 16px", borderRadius: 999 },
  appStatusDate: { fontSize: "0.84rem", color: "#9a9a94" },
  appTimeline: { display: "flex", flexDirection: "column" },
  appTimelineRow: { display: "flex", gap: 18 },
  appTimelineMarkerCol: { display: "flex", flexDirection: "column", alignItems: "center" },
  appTimelineDot: { width: 30, height: 30, borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.84rem", fontWeight: 700, flexShrink: 0 },
  appTimelineLine: { width: 2, flexGrow: 1, minHeight: 30 },
  appTimelineTitle: { fontSize: "1.02rem", fontWeight: 700, marginBottom: 2 },
  appTimelineDate: { fontSize: "0.8rem", color: "#9a9a94", marginBottom: 6 },
  appTimelineDesc: { fontSize: "0.88rem", color: "#6b6b66", lineHeight: 1.5, maxWidth: 480 },
  appNoteCard: { display: "flex", gap: 14, alignItems: "flex-start", background: "#F2ECDC", border: "1px solid #E3CB94", borderRadius: 14, padding: "18px 20px" },
  appNoteIcon: { color: AMBER, display: "flex", flexShrink: 0, marginTop: 2 },
  appNoteText: { fontSize: "0.92rem", color: "#3a3a36", lineHeight: 1.6 },

  settingsSection: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 26px", marginBottom: 18 },
  settingsSectionTitle: { fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 },
  settingsRowList: { display: "flex", flexDirection: "column", gap: 18 },
  settingsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 },
  settingsRowLabel: { fontSize: "0.94rem", fontWeight: 600, color: NAVY, marginBottom: 2 },
  settingsRowDesc: { fontSize: "0.82rem", color: "#8a8a84" },
  settingsActionBtn: { background: TINT, color: NAVY, fontWeight: 600, fontSize: "0.86rem", padding: "9px 16px", borderRadius: 999, whiteSpace: "nowrap" },
  settingsDangerBtn: { background: "#F6E4DF", color: "#8a3a2e", fontWeight: 600, fontSize: "0.86rem", padding: "9px 16px", borderRadius: 999, whiteSpace: "nowrap" },

  profileBanner: { height: 160, borderRadius: 18, position: "relative", marginBottom: 0 },
  profileBannerEditBtn: { position: "absolute", bottom: 14, right: 16, display: "flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,0.35)", color: WHITE, fontSize: "0.82rem", fontWeight: 600, padding: "8px 14px", borderRadius: 999, backdropFilter: "blur(4px)" },
  profileHeaderRow: { display: "flex", alignItems: "flex-end", gap: 18, padding: "0 8px", marginTop: -36, marginBottom: 20 },
  profileAvatarWrap: { position: "relative", flexShrink: 0 },
  profileAvatar: { width: 88, height: 88, borderRadius: "50%", border: `4px solid ${WHITE}`, color: "#6b5220", fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center" },
  profileAvatarEditBtn: { position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${WHITE}` },
  profileHeaderInfo: { flexGrow: 1, paddingBottom: 6 },
  profileName: { fontSize: "1.5rem", fontWeight: 700, color: NAVY, marginBottom: 2 },
  profileMeta: { fontSize: "0.9rem", color: "#7a7a74" },
  profileBioCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px", marginBottom: 24 },
  profileBioHeader: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  profileBioLabel: { fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9a9a94" },
  profileBioText: { fontSize: "0.94rem", color: "#2B2B28", lineHeight: 1.6 },
  profileDocList: { display: "flex", flexDirection: "column", gap: 12 },
  profileDocRow: { display: "flex", alignItems: "center", gap: 16, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 14, padding: "16px 20px" },
  profileDocInfo: { flexGrow: 1, minWidth: 0 },
  profileDocLabel: { fontSize: "0.92rem", fontWeight: 600, color: NAVY, marginBottom: 2 },
  profileDocFile: { fontSize: "0.8rem", color: "#9a9a94" },
  profileDocDownload: { width: 34, height: 34, borderRadius: 9, background: TINT, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statusTag: { fontSize: "0.76rem", fontWeight: 700, padding: "6px 13px", borderRadius: 999, whiteSpace: "nowrap", textTransform: "capitalize" },
};