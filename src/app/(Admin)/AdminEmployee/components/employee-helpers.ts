import type { User } from "@/lib/api/auth";

export const EMPLOYEE_FILTERS = ["All", "Coordinator", "Grantor"] as const;
export type EmployeeFilter = (typeof EMPLOYEE_FILTERS)[number];

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  COORDINATOR: "Coordinator",
  GRANTOR: "Grantor",
};

export interface AddEmployeeFields {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  title: string;
  department: string;
}

export const INITIAL_ADD_FIELDS: AddEmployeeFields = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "COORDINATOR",
  title: "",
  department: "",
};

export interface StaffRow {
  id: number;
  name: string;
  email: string;
  title: string;
  department: string;
  type: string;
  status: "Active" | "Inactive";
  initials: string;
  joined: string;
  user: User;
}

export function toStaffRow(user: User): StaffRow {
  const emp = user.employee;
  const first = emp?.first_name ?? "";
  const last = emp?.last_name ?? "";
  const type = ROLE_LABELS[user.role] ?? user.role;
  return {
    id: user.user_id,
    name: `${first} ${last}`.trim() || user.email,
    email: user.email,
    title: emp?.title ?? type,
    department: emp?.department ?? "—",
    type,
    status: user.is_active ? "Active" : "Inactive",
    initials: ((first[0] ?? "") + (last[0] ?? "")).toUpperCase() || "?",
    joined: user.created_at ? new Date(user.created_at).getFullYear().toString() : "—",
    user,
  };
}
