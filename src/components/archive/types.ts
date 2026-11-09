export type ArchivedItemKind = "scholar" | "applicant" | "school" | "program";

import type {
  ArchivedApplicantProfile,
  ArchivedProgram,
  ArchivedScholarProfile,
  ArchivedSchool,
} from "@/lib/api/archive";

export type ArchivedItem =
  | { kind: "scholar"; row: ArchivedScholarProfile }
  | { kind: "applicant"; row: ArchivedApplicantProfile }
  | { kind: "school"; row: ArchivedSchool }
  | { kind: "program"; row: ArchivedProgram };

export function formatArchiveDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
