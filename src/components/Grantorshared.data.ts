import { CSSProperties } from "react";

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
// DATA TYPES
// ============================================================

export interface GradeRecord {
  term: string;
  gwa: number;
  status: "Passed" | "Failed" | "Incomplete";
}

export interface PaymentRecord {
  term: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "On hold";
}

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
  currentPayment: {
    term: string;
    amount: number;
    status: "Paid" | "Pending" | "On hold";
  };
  gradeHistory: GradeRecord[];
  paymentHistory: PaymentRecord[];
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
  link?: string;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  badge?: number;
}

export interface BudgetScholarRow {
  name: string;
  initials: string;
  course: string;
  allocated: number;
  disbursed: number;
  remaining: number;
  status: "On track" | "At risk" | "Needs attention";
}

export interface FieldProps {
  label: string;
  required?: boolean;
}

export interface TabButtonProps {
  active: boolean;
}

export interface DrawerInfoRowProps {
  label: string;
  value: string;
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

export const NAV_KEYS: Omit<NavItem, "icon">[] = [
  { key: "dashboard", label: "Dashboard", href: "/grantDashboard" },
  { key: "meeting", label: "Meeting", href: "/grantMeeting", badge: 2 },
  { key: "monitor", label: "Monitor", href: "/grantMonitor" },
  { key: "reports", label: "Reports", href: "/grantReports" },
  { key: "message", label: "Message", href: "/grantMessage", badge: 3 },
  { key: "payments", label: "Payments", href: "/grantPayment", badge: 1 },
  { key: "settings", label: "Settings", href: "/grantSettings" },
  { key: "profile", label: "Profile", href: "/grantProfile" },
];

export const TITLES: Record<string, [string, string]> = {
  "/grantDashboard": ["Welcome back.", "Here's how your funded scholars are doing today."],
  "/grantMeeting": ["Meeting", "Schedule and manage meetings with the coordinator office."],
  "/grantMonitor": ["Monitor", "Scholars funded by your company and their current standing."],
  "/grantReports": ["Reports", "Budget allocation and disbursement analytics for your scholarship fund."],
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

export const UPCOMING_MEETINGS: ScheduledMeeting[] = [
  { id: 1, title: "Quarterly partnership review", date: "Jul 8, 2026", time: "3:00 PM", with: "Engr. Paolo R.", status: "confirmed" },
];

export const FUNDED_SCHOLARS: FundedScholar[] = [
  {
    id: 1, name: "Donna Mae Fayloga", initials: "DF", course: "BS Information Technology, 3rd year",
    gwa: 92.6, trend: "up", docs: "3/3", disbursement: "On schedule", health: "good",
    currentPayment: { term: "Q3 2026", amount: 8000, status: "Paid" },
    gradeHistory: [
      { term: "S.Y. 2025-2026, 1st Sem", gwa: 91.4, status: "Passed" },
      { term: "S.Y. 2024-2025, 2nd Sem", gwa: 90.8, status: "Passed" },
      { term: "S.Y. 2024-2025, 1st Sem", gwa: 90.2, status: "Passed" },
    ],
    paymentHistory: [
      { term: "Q2 2026", amount: 8000, date: "Apr 15, 2026", status: "Paid" },
      { term: "Q1 2026", amount: 8000, date: "Jan 15, 2026", status: "Paid" },
      { term: "Q4 2025", amount: 8000, date: "Oct 15, 2025", status: "Paid" },
    ],
  },
  {
    id: 2, name: "Jonas L.", initials: "JL", course: "BS Computer Science, 2nd year",
    gwa: 90.1, trend: "down", docs: "2/3", disbursement: "Pending document", health: "warn",
    currentPayment: { term: "Q3 2026", amount: 8000, status: "Pending" },
    gradeHistory: [
      { term: "S.Y. 2025-2026, 1st Sem", gwa: 90.9, status: "Passed" },
      { term: "S.Y. 2024-2025, 2nd Sem", gwa: 91.5, status: "Passed" },
    ],
    paymentHistory: [
      { term: "Q2 2026", amount: 8000, date: "Apr 15, 2026", status: "Paid" },
      { term: "Q1 2026", amount: 8000, date: "Jan 15, 2026", status: "Paid" },
    ],
  },
  {
    id: 3, name: "Carlo Bautista", initials: "CB", course: "BS Civil Engineering, 3rd year",
    gwa: 88.9, trend: "down", docs: "1/3", disbursement: "On hold", health: "bad",
    currentPayment: { term: "Q3 2026", amount: 8000, status: "On hold" },
    gradeHistory: [
      { term: "S.Y. 2025-2026, 1st Sem", gwa: 89.6, status: "Passed" },
      { term: "S.Y. 2024-2025, 2nd Sem", gwa: 87.3, status: "Incomplete" },
      { term: "S.Y. 2024-2025, 1st Sem", gwa: 90.0, status: "Passed" },
    ],
    paymentHistory: [
      { term: "Q2 2026", amount: 8000, date: "Apr 15, 2026", status: "Paid" },
      { term: "Q1 2026", amount: 8000, date: "Jan 15, 2026", status: "Paid" },
      { term: "Q4 2025", amount: 8000, date: "Oct 15, 2025", status: "Paid" },
    ],
  },
  {
    id: 4, name: "Mariella S.", initials: "MS", course: "BS Accountancy, 4th year",
    gwa: 94.2, trend: "up", docs: "3/3", disbursement: "On schedule", health: "good",
    currentPayment: { term: "Q3 2026", amount: 8000, status: "Paid" },
    gradeHistory: [
      { term: "S.Y. 2025-2026, 1st Sem", gwa: 93.8, status: "Passed" },
      { term: "S.Y. 2024-2025, 2nd Sem", gwa: 93.1, status: "Passed" },
      { term: "S.Y. 2024-2025, 1st Sem", gwa: 92.9, status: "Passed" },
    ],
    paymentHistory: [
      { term: "Q2 2026", amount: 8000, date: "Apr 15, 2026", status: "Paid" },
      { term: "Q1 2026", amount: 8000, date: "Jan 15, 2026", status: "Paid" },
      { term: "Q4 2025", amount: 8000, date: "Oct 15, 2025", status: "Paid" },
    ],
  },
  {
    id: 5, name: "Patricia Lim", initials: "PL", course: "BS Accountancy, 3rd year",
    gwa: 93.4, trend: "down", docs: "3/3", disbursement: "On schedule", health: "good",
    currentPayment: { term: "Q3 2026", amount: 8000, status: "Paid" },
    gradeHistory: [
      { term: "S.Y. 2025-2026, 1st Sem", gwa: 94.0, status: "Passed" },
      { term: "S.Y. 2024-2025, 2nd Sem", gwa: 93.7, status: "Passed" },
    ],
    paymentHistory: [
      { term: "Q2 2026", amount: 8000, date: "Apr 15, 2026", status: "Paid" },
      { term: "Q1 2026", amount: 8000, date: "Jan 15, 2026", status: "Paid" },
    ],
  },
];

export const HEALTH_TAG: Record<FundedScholar["health"], { bg: string; text: string; label: string }> = {
  good: { bg: GOOD_BG, text: GOOD, label: "On track" },
  warn: { bg: WARN_BG, text: WARN, label: "Needs attention" },
  bad: { bg: BAD_BG, text: BAD, label: "At risk" },
};

export const PAYMENT_STATUS_COLORS: Record<PaymentRequest["status"] | PaymentRecord["status"], { bg: string; text: string }> = {
  Approved: { bg: GOOD_BG, text: GOOD },
  "Pending approval": { bg: WARN_BG, text: WARN },
  "On hold": { bg: BAD_BG, text: BAD },
  Paid: { bg: GOOD_BG, text: GOOD },
  Pending: { bg: WARN_BG, text: WARN },
};

export const GRADE_STATUS_COLORS: Record<GradeRecord["status"], { bg: string; text: string }> = {
  Passed: { bg: GOOD_BG, text: GOOD },
  Incomplete: { bg: WARN_BG, text: WARN },
  Failed: { bg: BAD_BG, text: BAD },
};

export const PAYMENT_REQUESTS: PaymentRequest[] = [
  { id: 1, name: "Donna Mae Fayloga", initials: "DF", course: "BS Information Technology, 3rd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Approved" },
  { id: 2, name: "Jonas L.", initials: "JL", course: "BS Computer Science, 2nd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Pending approval" },
  { id: 3, name: "Carlo Bautista", initials: "CB", course: "BS Civil Engineering, 3rd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "On hold" },
  { id: 4, name: "Mariella S.", initials: "MS", course: "BS Accountancy, 4th year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Approved" },
  { id: 5, name: "Patricia Lim", initials: "PL", course: "BS Accountancy, 3rd year", amount: 8000, term: "Q3 2026", requestedDate: "Jul 15, 2026", status: "Approved" },
];

// ============================================================
// REPORT DATA
// ============================================================

export const GRANT_TOTAL_BUDGET = 1_000_000;
export const GRANT_ALLOCATED = 998_000;
export const GRANT_NON_ALLOCATED = GRANT_TOTAL_BUDGET - GRANT_ALLOCATED;

export const GRANT_REPORT_KPIS = [
  { label: "Total budget", value: "₱1,000,000", kpi: "FY 2026", kpiDirection: "up" as const },
  { label: "Allocated", value: "₱998,000", kpi: "99.8%", kpiDirection: "up" as const },
  { label: "Non-allocated", value: "₱2,000", kpi: "0.2% remaining", kpiDirection: "up" as const },
  { label: "Scholars funded", value: String(FUNDED_SCHOLARS.length), kpi: "+1 this quarter", kpiDirection: "up" as const },
];

export const BUDGET_SCHOLAR_ROWS: BudgetScholarRow[] = FUNDED_SCHOLARS.map((scholar) => {
  const disbursed = scholar.paymentHistory.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const allocated = 200_000;
  return {
    name: scholar.name,
    initials: scholar.initials,
    course: scholar.course,
    allocated,
    disbursed,
    remaining: allocated - disbursed,
    status: scholar.health === "good" ? "On track" : scholar.health === "warn" ? "Needs attention" : "At risk",
  };
});

export const GRANT_DISBURSEMENT_MONTHLY = [
  { month: "Jan", amount: 40000 },
  { month: "Feb", amount: 40000 },
  { month: "Mar", amount: 40000 },
  { month: "Apr", amount: 40000 },
  { month: "May", amount: 40000 },
  { month: "Jun", amount: 40000 },
  { month: "Jul", amount: 32000 },
];

export const BUDGET_STATUS_COLORS: Record<BudgetScholarRow["status"], { bg: string; text: string }> = {
  "On track": { bg: GOOD_BG, text: GOOD },
  "Needs attention": { bg: WARN_BG, text: WARN },
  "At risk": { bg: BAD_BG, text: BAD },
};

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
  pipelineTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 },
  pipelineLabel: { fontSize: "0.84rem", color: "#7a7a74" },
  pipelineValue: { fontFamily: "'Fraunces', serif", fontSize: "2.1rem", fontWeight: 700, color: NAVY, lineHeight: 1, marginBottom: 14 },
  pipelineTag: { fontSize: "0.68rem", fontWeight: 700, padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0, lineHeight: 1.4, display: "inline-block" },
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
  drawerPanel: { width: 460, maxWidth: "92vw", background: WHITE, height: "100%", overflowY: "auto", padding: "32px 30px", boxShadow: "-20px 0 60px -20px rgba(0,0,0,0.2)" },
  drawerHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 22 },
  drawerName: { fontSize: "1.3rem", fontWeight: 700, color: NAVY, marginBottom: 3 },
  drawerMeta: { fontSize: "0.84rem", color: "#8a8a84" },
  drawerCloseBtn: { color: "#9a9a94", flexShrink: 0 },
  drawerInfoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, background: TINT, borderRadius: 14, padding: "18px 20px", marginBottom: 22 },
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
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { display: "block", fontSize: "0.9rem", fontWeight: 600, color: NAVY, marginBottom: 8 },
  fieldRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  input: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  select: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  continueBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 26px", fontWeight: 600, fontSize: "0.95rem" },
  continueBtnSmall: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: NAVY, color: WHITE, borderRadius: 999, padding: "10px 18px", fontWeight: 600, fontSize: "0.88rem", flexShrink: 0 },
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
  drawerCurrentPayCard: { display: "flex", justifyContent: "space-between", alignItems: "center", background: WHITE, border: `1px solid ${LINE}`, borderRadius: 14, padding: "16px 18px", marginBottom: 26 },
  drawerCurrentPayLeft: { display: "flex", flexDirection: "column", gap: 3 },
  drawerCurrentPayTerm: { fontSize: "0.78rem", color: "#9a9a94" },
  drawerCurrentPayAmount: { fontSize: "1.15rem", fontWeight: 700, color: NAVY, fontFamily: "'Fraunces', serif" },
  drawerHistoryBtnRow: { display: "flex", marginBottom: 22 },
  drawerHistoryBtn: { display: "flex", alignItems: "center", gap: 8, background: TINT, color: NAVY, fontWeight: 600, fontSize: "0.86rem", padding: "10px 16px", borderRadius: 999 },
  historySection: { marginBottom: 24 },
  historyList: { display: "flex", flexDirection: "column", gap: 10 },
  historyRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: WHITE, border: `1px solid ${LINE}`, borderRadius: 12, padding: "13px 16px" },
  historyRowLeft: { display: "flex", flexDirection: "column", gap: 3 },
  historyRowTerm: { fontSize: "0.88rem", fontWeight: 700, color: NAVY },
  historyRowSub: { fontSize: "0.76rem", color: "#9a9a94" },
  historyRowRight: { display: "flex", alignItems: "center", gap: 10 },
  historyRowValue: { fontSize: "0.9rem", fontWeight: 700, color: NAVY },
  backToOverviewBtn: { display: "flex", alignItems: "center", gap: 8, color: AMBER, fontWeight: 600, fontSize: "0.86rem", marginBottom: 20 },
  choiceGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 },
  choiceCard: { border: `1.5px solid ${LINE}`, borderRadius: 14, padding: "22px 18px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, textAlign: "left", width: "100%" },
  choiceIconBox: { width: 40, height: 40, borderRadius: 10, background: TINT, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center" },
  choiceCardTitle: { fontSize: "0.98rem", fontWeight: 700, color: NAVY },
  choiceCardDesc: { fontSize: "0.82rem", color: "#8a8a84", lineHeight: 1.5 },
  calendarWrap: { border: `1px solid ${LINE}`, borderRadius: 14, padding: "13px 15px", marginBottom: 14 },
  calendarHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  calendarMonthLabel: { fontSize: "0.9rem", fontWeight: 700, color: NAVY },
  calendarNavBtn: { width: 26, height: 26, borderRadius: "50%", background: TINT, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  calendarWeekRow: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 },
  calendarWeekday: { fontSize: "0.66rem", fontWeight: 700, color: "#9a9a94", textAlign: "center", textTransform: "uppercase" },
  calendarDayGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 },
  calendarDayBtn: { aspectRatio: "1", borderRadius: 8, fontSize: "0.78rem", fontWeight: 600, color: "#3a3a36", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" },
  calendarDayBtnEmpty: { aspectRatio: "1" },
  liveMeetingCard: { background: GOOD_BG, border: "1px solid #cfe0b8", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12, marginTop: 20 },
  liveMeetingLinkRow: { display: "flex", alignItems: "center", gap: 10, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 14px" },
  liveMeetingLinkText: { flexGrow: 1, fontSize: "0.86rem", color: "#2B2B28", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  copyBtn: { background: TINT, color: NAVY, fontWeight: 600, fontSize: "0.8rem", padding: "7px 12px", borderRadius: 999, flexShrink: 0 },
  barChartRow: { display: "flex", alignItems: "flex-end", gap: 8, height: 140 },
  barChartCol: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 },
  barChartTrack: { width: "100%", background: "#F0EAD9", borderRadius: 6, flex: 1, display: "flex", alignItems: "flex-end", overflow: "hidden" },
  barChartFill: { width: "100%", borderRadius: 6, transition: "height 0.4s ease" },
  barChartValue: { fontSize: "0.6rem", color: "#9a9a94", whiteSpace: "nowrap" },
  barChartLabel: { fontSize: "0.72rem", fontWeight: 600, color: "#7a7a74" },
};
