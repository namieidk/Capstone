import { AMBER_BG, GOOD, GOOD_BG, TINT, WARN, WARN_BG } from "@/components/Adminshared";
import type { AuditLogEntry as AuditLog } from "@/lib/api/users";

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export function formatActionLabel(action: string): string {
  return action
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getActionVariant(action: string): BadgeVariant {
  if (action === "USER_LOGIN") return "secondary";
  if (action === "STAFF_CREATED" || action === "SCHOLAR_REGISTERED") return "default";
  if (action.startsWith("CONTRACT_")) return "destructive";
  if (
    action.startsWith("DOCUMENT_") ||
    action.startsWith("APPLICATION_") ||
    action === "PROFILE_UPDATED" ||
    action === "AVATAR_UPLOADED" ||
    action === "BANNER_UPLOADED"
  )
    return "outline";
  return "secondary";
}

// Same token-based color approach as EmployeeTable's RoleBadge/StatusBadge —
// explicit { background, color } pairs pulled from Adminshared instead of
// shadcn's generic Badge variant palette, so audit-log badges read as part
// of the same visual system as the rest of the admin dashboard.
export function getActionColors(action: string): { background: string; color: string } {
  if (action === "STAFF_CREATED" || action === "SCHOLAR_REGISTERED") {
    return { background: GOOD_BG, color: GOOD };
  }
  if (action.startsWith("CONTRACT_")) {
    return { background: WARN_BG, color: WARN };
  }
  if (
    action.startsWith("DOCUMENT_") ||
    action.startsWith("APPLICATION_") ||
    action === "PROFILE_UPDATED" ||
    action === "AVATAR_UPLOADED" ||
    action === "BANNER_UPLOADED"
  ) {
    return { background: AMBER_BG, color: "#6b5220" };
  }
  // USER_LOGIN and anything unmapped fall back to the same neutral tint
  // Employee's Coordinator-adjacent badges use.
  return { background: TINT, color: "#55554f" };
}

export function getRoleVariant(role: string): BadgeVariant {
  switch (role) {
    case "ADMIN":
      return "default";
    case "COORDINATOR":
      return "secondary";
    case "GRANTOR":
      return "outline";
    default:
      return "outline";
  }
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getDisplayName(log: AuditLog): string {
  const u = log.user;
  const first = u.first_name ?? u.employee?.first_name ?? "";
  const last = u.last_name ?? u.employee?.last_name ?? "";
  const full = `${first} ${last}`.trim();
  if (full) return full;
  if (u.name?.trim()) return u.name.trim();
  return u.email;
}