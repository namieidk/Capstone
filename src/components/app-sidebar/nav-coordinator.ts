import {
  Activity,
  Archive,
  BarChart3,
  Calendar,
  CreditCard,
  GraduationCap,
  Home,
  Mail,
  Settings,
  User,
  Users,
} from "lucide-react";
import type { NavItem, RoleSidebarConfig } from "./types";

export const COORDINATOR_NAV_ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: Home, href: "/CoordinatorDashboard" },
  { key: "applicants", label: "Applicants", icon: Users, href: "/CoordinatorApplicants" },
  { key: "grading-systems", label: "Grading Systems", icon: GraduationCap, href: "/GradingSystems" },
  { key: "meeting", label: "Meeting", icon: Calendar, href: "/CoordinatorMeeting" },
  { key: "monitor", label: "Monitor", icon: Activity, href: "/CoordinatorMonitor" },
  { key: "payment", label: "Payment", icon: CreditCard, href: "/CoordinatorPayment" },
  { key: "archive", label: "Archive", icon: Archive, href: "/CoordinatorArchive" },
  { key: "reports", label: "Reports", icon: BarChart3, href: "/CoordinatorReports" },
  { key: "message", label: "Message", icon: Mail, href: "/CoordinatorMessage" },
  { key: "settings", label: "Settings", icon: Settings, href: "/CoordinatorSettings" },
  { key: "profile", label: "Profile", icon: User, href: "/CoordinatorProfile" },
];

export const COORDINATOR_SIDEBAR_CONFIG: RoleSidebarConfig = {
  homeHref: "/CoordinatorDashboard",
  profileHref: "/CoordinatorProfile",
  roleLabel: "Coordinator",
  items: COORDINATOR_NAV_ITEMS,
};
