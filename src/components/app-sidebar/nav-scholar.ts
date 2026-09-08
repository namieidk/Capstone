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
  { key: "dashboard", label: "Home", icon: Home, href: "/scholardashboard" },
  { key: "grade", label: "Grades", icon: GraduationCap, href: "/ScholarGrade" },
  { key: "reports", label: "Reports", icon: BarChart3, href: "/scholarReports" },
  { key: "message", label: "Messages", icon: Mail, href: "/scholarMessage" },
  { key: "meeting", label: "Meetings", icon: Calendar, href: "/scholarMeeting" },
  { key: "forum", label: "Forum", icon: MessageSquare, href: "/SchoForum" },
  { key: "payment", label: "Payment", icon: CreditCard, href: "/ScholarPayment" },
  { key: "settings", label: "Settings", icon: Settings, href: "/scholarSettings" },
  { key: "profile", label: "Profile", icon: User, href: "/schoProfile" },
];

export const SCHOLAR_SIDEBAR_CONFIG: RoleSidebarConfig = {
  homeHref: "/scholardashboard",
  profileHref: "/schoProfile",
  roleLabel: "Scholar",
  items: SCHOLAR_NAV_ITEMS,
};
