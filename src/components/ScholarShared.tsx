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
      @media (max-width: 700px) {
        .vd-messages-shell { grid-template-columns: 1fr !important; height: auto !important; }
        .vd-convo-list-col { max-height: 260px; }
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
  { key: "dashboard", label: "Home", icon: <HomeIcon />, href: "/scholardashboard" },
  { key: "grade", label: "Grades", icon: <GradeIcon />, href: "/ScholarGrade" },
  { key: "message", label: "Messages", icon: <MailIcon />, href: "/scholarMessage" },
  { key: "meeting", label: "Meetings", icon: <CalendarIcon />, href: "/scholarMeeting" },
  { key: "forum", label: "Forum", icon: <ForumIcon />, href: "/SchoForum" },
  { key: "payment", label: "Payment", icon: <PaymentIcon />, href: "/ScholarPayment" },
  { key: "settings", label: "Settings", icon: <SettingsIcon />, href: "/scholarSettings" },
  { key: "profile", label: "Profile", icon: <ProfileIcon />, href: "/schoProfile" },
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

// ---------- Grades ----------

export interface GradeTerm {
  term: string;
  gwa: number;
  status: "passed" | "pending";
  note: string;
}

export const GRADE_HISTORY: GradeTerm[] = [
  { term: "2nd Sem, 2024–2025", gwa: 91.8, status: "passed", note: "All subjects passed, above threshold." },
  { term: "1st Sem, 2025–2026", gwa: 92.1, status: "passed", note: "Improved from previous term." },
  { term: "Mid-year, 2025–2026", gwa: 92.6, status: "pending", note: "Current standing — official report due Jul 10." },
];

export const PREDICTED_GWA = 92.6;
export const GWA_THRESHOLD = 90;

export const GRADE_DOCUMENTS = [
  { label: "Grades / Transcript of Records", file: "TOR_2026_Q2.pdf", size: "1.2 MB", status: "verified" as const },
  { label: "Latest report card / Form 138", file: "form138_midyear.png", size: "640 KB", status: "verified" as const },
  { label: "Mid-year grade report", file: "not yet submitted", size: "—", status: "pending" as const },
];

// ---------- Submissions (Statement of Account + Grade reports) ----------

export interface Submission {
  id: string;
  term: string;
  type: "Statement of Account" | "Grade Report";
  file: string;
  size: string;
  submittedDate: string;
  status: "verified" | "pending" | "rejected";
}

export const SUBMISSION_HISTORY: Submission[] = [
  { id: "5", term: "Mid-year, 2025–2026", type: "Statement of Account", file: "SOA_midyear2026.pdf", size: "480 KB", submittedDate: "Jun 28, 2026", status: "pending" },
  { id: "4", term: "1st Sem, 2025–2026", type: "Grade Report", file: "grades_1stsem_2025.pdf", size: "1.1 MB", submittedDate: "Jan 20, 2026", status: "verified" },
  { id: "3", term: "1st Sem, 2025–2026", type: "Statement of Account", file: "SOA_1stsem_2025.pdf", size: "410 KB", submittedDate: "Jan 20, 2026", status: "verified" },
  { id: "2", term: "2nd Sem, 2024–2025", type: "Grade Report", file: "grades_2ndsem_2024.pdf", size: "980 KB", submittedDate: "Jun 15, 2025", status: "verified" },
  { id: "1", term: "2nd Sem, 2024–2025", type: "Statement of Account", file: "SOA_2ndsem_2024.pdf", size: "365 KB", submittedDate: "Jun 15, 2025", status: "verified" },
];

// ---------- Messages ----------

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

export const CONVERSATIONS: Conversation[] = [
  {
    id: "paolo",
    name: "Engr. Paolo R.",
    role: "HR Coordinator, partner company",
    initials: "PR",
    lastMessage: "Sure, I'll check the disbursement schedule and confirm by Friday.",
    time: "12m ago",
    unread: 2,
    messages: [
      { from: "them", text: "Hi Donna! Just confirming — your Q3 allowance is set for Jul 15.", time: "10:02 AM" },
      { from: "me", text: "Hi sir Paolo, thank you for confirming! Is that the same amount as last quarter?", time: "10:05 AM" },
      { from: "them", text: "Yes, same amount, ₱8,000. It should reflect in your registered bank account.", time: "10:07 AM" },
      { from: "me", text: "Noted po, thank you! One more thing — can I still update my address on file?", time: "10:09 AM" },
      { from: "them", text: "Sure, I'll check the disbursement schedule and confirm by Friday.", time: "10:14 AM" },
    ],
  },
  {
    id: "coordinator",
    name: "Coordinator Office",
    role: "ViaScholar staff",
    initials: "CO",
    lastMessage: "Your Grades / TOR document was verified successfully.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { from: "them", text: "Hi Donna, we've reviewed your latest submission.", time: "Yesterday, 3:14 PM" },
      { from: "them", text: "Your Grades / TOR document was verified successfully.", time: "Yesterday, 3:15 PM" },
      { from: "me", text: "Thank you so much! Is there anything else needed from my end?", time: "Yesterday, 4:02 PM" },
      { from: "them", text: "Not for now — we'll reach out if anything else is needed before the interview.", time: "Yesterday, 4:10 PM" },
    ],
  },
  {
    id: "mariella",
    name: "Mariella S.",
    role: "Fellow scholar, BS Accountancy",
    initials: "MS",
    lastMessage: "Good luck sa interview mo! You'll do great 🎉",
    time: "2 days ago",
    unread: 1,
    messages: [
      { from: "them", text: "Hey Donna! Saw your post sa forum, kumusta na application mo?", time: "Mon, 1:20 PM" },
      { from: "me", text: "Hi Mariella! Onti na lang, currently sa interview stage na ako.", time: "Mon, 1:32 PM" },
      { from: "them", text: "Good luck sa interview mo! You'll do great 🎉", time: "Mon, 1:35 PM" },
    ],
  },
];

// ---------- Meetings ----------

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

export const MEETINGS_HOSTING: HostedMeeting[] = [
  { id: 1, title: "Study plan check-in", date: "Jul 8, 2026", time: "3:00 PM", invitee: "Engr. Paolo R.", status: "confirmed" },
];

export const MEETINGS_INVITED: InvitedMeeting[] = [
  { id: 2, title: "Coordinator check-in", date: "Jul 3, 2026", time: "2:00 PM", host: "Coordinator Office", status: "confirmed" },
  { id: 3, title: "Scholarship interview", date: "Jun 26, 2026", time: "10:30 AM", host: "Engr. Paolo R.", status: "completed" },
];

// ---------- Forum ----------

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

export const FORUM_POSTS: ForumPost[] = [
  {
    id: 1,
    author: "Mariella S.", initials: "MS", role: "BS Accountancy, 4th year",
    time: "2h ago",
    text: "Finally submitted my mid-year grade report! 😅 Reminder to fellow scholars — the portal accepts PDF and JPG, no need to overthink the format.",
    likes: 14, comments: 3, liked: false,
  },
  {
    id: 2,
    author: "Jonas L.", initials: "JL", role: "BS Computer Science, 2nd year",
    time: "5h ago",
    text: "Tips for maintaining 90%+ GWA? Struggling a bit balancing my thesis prep with regular coursework this term. Open to advice from upperclassmen!",
    likes: 22, comments: 9, liked: true,
  },
  {
    id: 3,
    author: "Donna Mae Fayloga", initials: "DF", role: "BS Information Technology, 3rd year",
    time: "1d ago",
    text: "Currently editing my travel vlog from Samal Island while waiting for my interview schedule 🎬 Anyone else juggling a side project while being a scholar?",
    likes: 31, comments: 6, liked: false,
  },
  {
    id: 4,
    author: "Engr. Paolo R.", initials: "PR", role: "HR Coordinator, partner company",
    time: "2d ago",
    text: "Reminder to all scholars under the Academic track: Q3 disbursements go out Jul 15. Please make sure your bank details on file are up to date!",
    likes: 45, comments: 4, liked: false,
  },
];

// ---------- Payment ----------

export interface PaymentRecord {
  term: string;
  amount: string;
  date: string;
  status: "paid" | "upcoming" | "processing";
  method: string;
}

export const PAYMENT_HISTORY: PaymentRecord[] = [
  { term: "Q3 2026", amount: "₱8,000", date: "Jul 15, 2026", status: "upcoming", method: "Bank transfer" },
  { term: "Q2 2026", amount: "₱8,000", date: "Apr 15, 2026", status: "paid", method: "Bank transfer" },
  { term: "Q1 2026", amount: "₱8,000", date: "Jan 15, 2026", status: "paid", method: "Bank transfer" },
  { term: "Q4 2025", amount: "₱8,000", date: "Oct 15, 2025", status: "paid", method: "Bank transfer" },
];

export const PAYMENT_SUMMARY = {
  totalDisbursed: "₱24,000",
  nextAmount: "₱8,000",
  nextDate: "Jul 15, 2026",
};

// ---------- Profile ----------

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
export function GradeIcon() {
  return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18M7 14l4-4 3 3 5-6" /></svg>);
}
export function PaymentIcon() {
  return (<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M6 15h4" /></svg>);
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
export function SendIcon() {
  return (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>);
}
export function PlusIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" /></svg>);
}
export function HeartIcon({ filled }: { filled?: boolean }) {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#C9943D" : "none"} stroke={filled ? "#C9943D" : "currentColor"} strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>);
}
export function CommentIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
}
export function CameraIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>);
}
export function ImageIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></svg>);
}
export function DownloadIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 11l5 5 5-5M5 21h14" /></svg>);
}
export function VideoIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-4v12l-6-4" /></svg>);
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
// SHARED FIELD HELPER
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
  sidebarBadge: { background: AMBER, color: WHITE, fontSize: "0.7rem", fontWeight: 700, borderRadius: 999, minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" },
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
  dashboardTwoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 22 },

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

  fieldWrap: { marginBottom: 18 },
  fieldLabel: { display: "block", fontSize: "0.9rem", fontWeight: 600, color: NAVY, marginBottom: 8 },
  fieldRow2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  input: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  select: { width: "100%", background: "#FAF7EF", border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 15px", fontSize: "0.94rem", color: "#2B2B28", fontFamily: "'Inter', sans-serif" },
  continueBtn: { background: NAVY, color: WHITE, borderRadius: 999, padding: "14px 26px", fontWeight: 600, fontSize: "0.95rem" },
  continueBtnSmall: { display: "flex", alignItems: "center", gap: 8, background: NAVY, color: WHITE, borderRadius: 999, padding: "10px 18px", fontWeight: 600, fontSize: "0.88rem", flexShrink: 0 },
  reviewEditLink: { background: "none", color: AMBER, fontWeight: 700, fontSize: "0.86rem" },
  tabRow: { display: "flex", gap: 24, borderBottom: `1px solid ${LINE}`, marginBottom: 24 },
  tabButton: { padding: "10px 2px 14px", fontWeight: 600, fontSize: "0.94rem", borderBottom: "2.5px solid transparent" },
  statusTag: { fontSize: "0.76rem", fontWeight: 700, padding: "6px 13px", borderRadius: 999, whiteSpace: "nowrap", textTransform: "capitalize" },

  // GRADE PAGE
  gradeTable: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden" },
  gradeRow: { display: "flex", alignItems: "center", gap: 16, padding: "18px 22px" },
  gradeTermCol: { flexGrow: 1, minWidth: 0 },
  gradeTerm: { fontSize: "0.96rem", fontWeight: 700, color: NAVY, marginBottom: 2 },
  gradeNote: { fontSize: "0.82rem", color: "#8a8a84" },
  gradeValue: { fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 700, color: NAVY, flexShrink: 0 },

  uploadSectionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  uploadBox: { display: "flex", alignItems: "center", gap: 14, border: `1.5px dashed ${LINE}`, borderRadius: 12, padding: "16px 18px", background: "#FAF7EF", cursor: "pointer" },
  uploadIconBox: { width: 38, height: 38, borderRadius: 10, background: AMBER_BG, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  uploadTextCol: { flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  uploadMainText: { fontSize: "0.92rem", color: "#2B2B28", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  uploadHintText: { fontSize: "0.78rem", color: "#8a8a84" },
  browseBtn: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 999, padding: "9px 16px", fontSize: "0.82rem", fontWeight: 600, color: NAVY, flexShrink: 0 },
  submissionRow: { display: "flex", alignItems: "center", gap: 16, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 14, padding: "16px 20px" },
  submissionMeta: { fontSize: "0.78rem", color: "#9a9a94", marginTop: 2 },
  sentBanner: { display: "flex", alignItems: "center", gap: 10, background: AMBER_BG, border: "1px solid #E3CB94", borderRadius: 12, padding: "14px 18px", fontSize: "0.92rem", color: "#3a3a36", fontWeight: 600, marginTop: 14 },

  // MESSAGES PAGE
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

  // MEETINGS PAGE
  meetingList: { display: "flex", flexDirection: "column", gap: 12 },
  meetingCard: { display: "flex", alignItems: "center", gap: 18, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "18px 22px" },
  meetingDateBox: { display: "flex", flexDirection: "column", alignItems: "center", background: TINT, borderRadius: 12, padding: "10px 14px", minWidth: 64, flexShrink: 0 },
  meetingDateMonth: { fontSize: "0.72rem", fontWeight: 700, color: AMBER, textTransform: "uppercase" },
  meetingDateDay: { fontSize: "1.2rem", fontWeight: 700, color: NAVY },
  meetingInfoCol: { flexGrow: 1, minWidth: 0 },
  meetingTitle: { fontSize: "0.98rem", fontWeight: 700, color: NAVY, marginBottom: 3 },
  meetingMeta: { fontSize: "0.84rem", color: "#7a7a74" },
  meetingForm: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 18, padding: "28px 30px", maxWidth: 520 },

  // FORUM PAGE
  composerCard: { display: "flex", gap: 14, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px", marginBottom: 24 },
  composerInput: { width: "100%", background: "none", border: "none", fontSize: "0.94rem", fontFamily: "'Inter', sans-serif", resize: "none", minHeight: 50, outline: "none" },
  composerActionsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${LINE}`, paddingTop: 12, marginTop: 8 },
  composerIconRow: { display: "flex", gap: 8 },
  composerIconBtn: { width: 34, height: 34, borderRadius: 9, background: TINT, color: "#7a7a74", display: "flex", alignItems: "center", justifyContent: "center" },
  forumFeed: { display: "flex", flexDirection: "column", gap: 16 },
  forumPostCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px" },
  forumPostHeader: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14 },
  forumPostAuthor: { fontSize: "0.94rem", fontWeight: 700, color: NAVY },
  forumPostMeta: { fontSize: "0.78rem", color: "#9a9a94" },
  forumPostText: { fontSize: "0.94rem", color: "#2B2B28", lineHeight: 1.6, marginBottom: 16 },
  forumPostActions: { display: "flex", gap: 20, borderTop: `1px solid ${LINE}`, paddingTop: 12 },
  forumActionBtn: { display: "flex", alignItems: "center", gap: 7, fontSize: "0.86rem", fontWeight: 600, color: "#7a7a74" },

  // PAYMENT PAGE
  paymentSummaryRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 },
  paymentList: { display: "flex", flexDirection: "column", gap: 12 },
  paymentRow: { display: "flex", alignItems: "center", gap: 16, background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "18px 22px" },
  paymentIconBox: { width: 42, height: 42, borderRadius: 11, background: TINT, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  paymentInfoCol: { flexGrow: 1, minWidth: 0 },
  paymentTerm: { fontSize: "0.96rem", fontWeight: 700, color: NAVY, marginBottom: 2 },
  paymentMeta: { fontSize: "0.82rem", color: "#8a8a84" },
  paymentAmount: { fontFamily: "'Fraunces', serif", fontSize: "1.15rem", fontWeight: 700, color: NAVY, flexShrink: 0 },

  // SETTINGS PAGE
  settingsSection: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 26px", marginBottom: 18 },
  settingsSectionTitle: { fontSize: "1.1rem", fontWeight: 700, marginBottom: 16 },
  settingsRowList: { display: "flex", flexDirection: "column", gap: 18 },
  settingsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 },
  settingsRowLabel: { fontSize: "0.94rem", fontWeight: 600, color: NAVY, marginBottom: 2 },
  settingsRowDesc: { fontSize: "0.82rem", color: "#8a8a84" },
  settingsActionBtn: { background: TINT, color: NAVY, fontWeight: 600, fontSize: "0.86rem", padding: "9px 16px", borderRadius: 999, whiteSpace: "nowrap" },
  settingsDangerBtn: { background: "#F6E4DF", color: "#8a3a2e", fontWeight: 600, fontSize: "0.86rem", padding: "9px 16px", borderRadius: 999, whiteSpace: "nowrap" },

  // PROFILE PAGE
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
};