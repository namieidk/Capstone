import type { User as ApiUser } from "@/lib/api/auth";

export type StudentFilter = "All" | "Scholars" | "Applicants";

export const STUDENT_FILTERS: readonly StudentFilter[] = ["All", "Scholars", "Applicants"] as const;

export interface StudentRow {
  id: number;
  name: string;
  email: string;
  role: "SCHOLAR" | "APPLICANT";
  type: "Scholar" | "Applicant";
  status: "Active" | "Inactive";
  joined: string;
  initials: string;
  phone?: string;
  university?: string;
  degree?: string;
  yearLevel?: string;
  gpa?: string;
  avatarUrl?: string;
  user: ApiUser;
}

export function toStudentRow(u: ApiUser): StudentRow {
  const profile = u.scholar_profile;
  const firstName = profile?.first_name || u.first_name || "";
  const lastName = profile?.last_name || u.last_name || "";
  const name = `${firstName} ${lastName}`.trim() || u.email;

  const initials = (firstName[0] || "") + (lastName[0] || "") || u.email.substring(0, 2).toUpperCase();

  const joined = u.created_at
    ? new Date(u.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return {
    id: u.user_id,
    name,
    email: u.email,
    role: u.role as "SCHOLAR" | "APPLICANT",
    type: u.role === "SCHOLAR" ? "Scholar" : "Applicant",
    status: u.is_active ? "Active" : "Inactive",
    joined,
    initials: initials.toUpperCase(),
    phone: profile?.phone_number || undefined,
    university: profile?.school_name || undefined,
    degree: profile?.course_of_study || undefined,
    yearLevel:
      profile?.year_level || profile?.current_year_level
        ? `Year ${profile?.year_level ?? profile?.current_year_level}`
        : undefined,
    gpa: (() => {
      const rawGpa = profile?.grade_reports?.[0]?.gpa ?? profile?.gpa;
      if (rawGpa != null && rawGpa !== "" && !Number.isNaN(Number(rawGpa))) {
        return Number(rawGpa).toFixed(2);
      }
      return undefined;
    })(),
    avatarUrl: u.avatar_url || undefined,
    user: u,
  };
}
