"use client";

import {
  Activity,
  Archive,
  BarChart3,
  Calendar,
  CreditCard,
  GraduationCap,
  Home,
  LogOut,
  Mail,
  MessageSquare,
  ScrollText,
  Settings,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { ADMIN } from "@/components/Adminshared";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  /**
   * When true, the item is hidden from the sidebar but kept in the
   * config so its route stays reachable and it can be re-enabled later.
   */
  hidden?: boolean;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
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
  {
    key: "monitor",
    label: "Monitor",
    icon: Activity,
    href: "/Adminmonitor",
    hidden: true,
  },
  {
    key: "archive",
    label: "Archive",
    icon: Archive,
    href: "/AdminArchive",
    hidden: true,
  },
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

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0] ?? "";
  const l = lastName?.[0] ?? "";
  return (f + l).toUpperCase() || ADMIN.initials || "RC";
}

export type SidebarRole =
  | "admin"
  | "coordinator"
  | "grantor"
  | "scholar"
  | "student";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: SidebarRole;
}

export function AdminSidebar({ role = "admin", ...props }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const displayName = user
    ? `${user.first_name} ${user.last_name}`
    : ADMIN.name;
  const displayInitials = user
    ? getInitials(user.first_name, user.last_name)
    : ADMIN.initials;
  const displayRole =
    role === "admin"
      ? "Main Admin"
      : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-navy text-white [--sidebar:var(--navy)] [--sidebar-foreground:#ffffff] [--sidebar-border:rgba(255,255,255,0.1)] **:data-[slot=sidebar-inner]:bg-navy **:data-[slot=sidebar-container]:bg-navy **:data-[mobile=true]:bg-navy"
      {...props}
    >
      {/* Sidebar Header: Logo & Branding */}
      <SidebarHeader className="border-b border-white/10 p-4">
        <Link
          href="/AdminDashboard"
          className="flex items-center gap-2.5 overflow-hidden rounded-lg p-1 transition-colors hover:bg-white/10"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Image
              src="/logo_cropped_2656.png"
              alt="ViaScholar logo"
              width={32}
              height={32}
              unoptimized
              className="size-6 object-contain drop-shadow"
            />
          </span>
          <div className="flex flex-col overflow-hidden text-left group-data-[collapsible=icon]:hidden">
            <span className="text-[1.05rem] font-bold tracking-tight text-white leading-tight">
              ViaScholar
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content: Navigation Items */}
      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {ADMIN_NAV_ITEMS.filter((item) => !item.hidden).map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/AdminDashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`h-9.5 rounded-lg px-2.5 text-[0.92rem] font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-amber! text-navy! data-[active=true]:bg-amber! data-[active=true]:text-white! hover:bg-amber! hover:text-navy! [--sidebar-accent:var(--amber)] [--sidebar-accent-foreground:var(--navy)] font-semibold shadow-xs"
                          : "text-white/80 hover:bg-white/10! hover:text-white!"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <Icon
                          className={`size-4.5 shrink-0 transition-colors ${isActive ? "text-white!" : "text-white/80"}`}
                        />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge !== undefined && (
                      <SidebarMenuBadge
                        className={`font-bold text-[0.7rem] px-1.5 py-0.5 rounded-full group-data-[collapsible=icon]:hidden transition-colors ${
                          isActive
                            ? "bg-navy! text-white/80!"
                            : "bg-amber text-navy"
                        }`}
                      >
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer: User Card & Logout */}
      <SidebarFooter className="border-t border-white/10 p-2.5">
        <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-2 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
          <Link
            href="/AdminProfile"
            className="flex min-w-0 flex-1 items-center gap-2.5 group-data-[collapsible=icon]:justify-center"
            title="View Profile"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white shadow-inner">
              {displayInitials}
            </span>
            <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-[0.84rem] font-semibold text-white leading-snug">
                {displayName}
              </span>
              <span className="truncate text-[0.72rem] text-white/60 leading-tight">
                {displayRole}
              </span>
            </div>
          </Link>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={logout}
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/15 hover:text-white group-data-[collapsible=icon]:hidden"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>

      {/* Expand/Collapse Rail on Desktop */}
      <SidebarRail className="hover:bg-white/10" />
    </Sidebar>
  );
}
