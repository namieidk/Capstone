import {
  BarChart3,
  Calendar,
  CreditCard,
  GraduationCap,
  Home,
  Mail,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import type { NavItem, RoleSidebarConfig } from "./types";

export const SCHOLAR_NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Home", icon: Home, href: "/ScholarDashboard" },
  { key: "grade", label: "Grades", icon: GraduationCap, href: "/ScholarGrade" },
  { key: "reports", label: "Reports", icon: BarChart3, href: "/ScholarReports" },
  { key: "message", label: "Messages", icon: Mail, href: "/ScholarMessage" },
  { key: "meeting", label: "Meetings", icon: Calendar, href: "/ScholarMeeting" },
  { key: "forum", label: "Forum", icon: MessageSquare, href: "/ScholarForum" },
  { key: "payment", label: "Payment", icon: CreditCard, href: "/ScholarPayment" },
  { key: "settings", label: "Settings", icon: Settings, href: "/ScholarSettings" },
  { key: "profile", label: "Profile", icon: User, href: "/ScholarProfile" },
];

export const SCHOLAR_SIDEBAR_CONFIG: RoleSidebarConfig = {
  homeHref: "/ScholarDashboard",
  profileHref: "/ScholarProfile",
  roleLabel: "Scholar",
  items: SCHOLAR_NAV_ITEMS,
};
