import {
  Activity,
  Archive,
  BarChart3,
  Calendar,
  CreditCard,
  GraduationCap,
  Home,
  Mail,
  MessageSquare,
  ScrollText,
  Settings,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import type { NavItem, RoleSidebarConfig } from "./types";

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Home, href: "/AdminDashboard" },
  { key: "employee", label: "Employee", icon: Users, href: "/AdminEmployee" },
  {
    key: "audit-logs",
    label: "Audit Logs",
    icon: ScrollText,
    href: "/AuditLogs",
  },
  {
    key: "grading-systems",
    label: "Grading Systems",
    icon: GraduationCap,
    href: "/GradingSystems",
  },
  // Hidden (not removed): kept so routes stay reachable and can be re-enabled.
  { key: "monitor", label: "Monitor", icon: Activity, href: "/Adminmonitor", hidden: true },
  { key: "archive", label: "Archive", icon: Archive, href: "/AdminArchive", hidden: true },
  {
    key: "meeting",
    label: "Meeting",
    icon: Calendar,
    href: "/AdminMeeting",
    badge: 2,
    hidden: true,
  },
  {
    key: "forum",
    label: "Forum",
    icon: MessageSquare,
    href: "/AdminForum",
    badge: 5,
    hidden: true,
  },
  {
    key: "payments",
    label: "Payments",
    icon: CreditCard,
    href: "/AdminPayment",
    badge: 3,
    hidden: true,
  },
  {
    key: "reports",
    label: "Overall reports",
    icon: BarChart3,
    href: "/AdminReports",
    hidden: true,
  },
  {
    key: "message",
    label: "Message",
    icon: Mail,
    href: "/AdminMessage",
    badge: 4,
    hidden: true,
  },
  {
    key: "global-settings",
    label: "Global Settings",
    icon: SlidersHorizontal,
    href: "/GlobalSettings",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    href: "/AdminSettings",
  },
  { key: "profile", label: "Profile", icon: User, href: "/AdminProfile" },
];

export const ADMIN_SIDEBAR_CONFIG: RoleSidebarConfig = {
  homeHref: "/AdminDashboard",
  profileHref: "/AdminProfile",
  roleLabel: "Main Admin",
  items: ADMIN_NAV_ITEMS,
};
