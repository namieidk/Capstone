import { FileSignature, FileText, Home, Settings, User } from "lucide-react";
import type { NavItem, RoleSidebarConfig } from "./types";

export const APPLICANT_NAV_ITEMS: NavItem[] = [
  // Hidden (not removed): kept so the route stays reachable and can be re-enabled.
  { key: "home", label: "Home", icon: Home, href: "/ApplicantsDashboard", hidden: true },
  { key: "application", label: "Application", icon: FileText, href: "/ApplicantsApplication" },
  { key: "contract", label: "Contract", icon: FileSignature, href: "/ApplicantsContract" },
  { key: "settings", label: "Settings", icon: Settings, href: "/ApplicantsSettings" },
  { key: "profile", label: "Profile", icon: User, href: "/ApplicantsProfile" },
];

export const APPLICANT_SIDEBAR_CONFIG: RoleSidebarConfig = {
  homeHref: "/ApplicantsApplication",
  profileHref: "/ApplicantsProfile",
  roleLabel: "Applicant",
  items: APPLICANT_NAV_ITEMS,
};
