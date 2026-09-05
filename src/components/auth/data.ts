export interface BrandStat {
  value: string;
  label: string;
}

export const TRACKS = ["Academic Track", "Financial Need Track", "Returning Scholar"];

export const BRAND_STATS: BrandStat[] = [
  { value: "120+", label: "Open scholarships" },
  { value: "₱42M+", label: "Disbursed to scholars" },
  { value: "3", label: "Application tracks" },
];

export const DASHBOARD_MAP: Record<string, string> = {
  ADMIN: "/AdminDashboard",
  COORDINATOR: "/CoordinatorDashboard",
  GRANTOR: "/grantDashboard",
  SCHOLAR: "/scholardashboard",
  APPLICANT: "/ApplicantsDashboard",
};

export function roleLabel(role: string): string {
  if (!role) return "Student account";
  return `${role.charAt(0)}${role.slice(1).toLowerCase()} account`;
}
