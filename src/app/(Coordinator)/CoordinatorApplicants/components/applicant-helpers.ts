import type { Applicant, Stage } from "@/components/Coordinatorshared";

export type StageFilter = Stage | "all";

export type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

export const STAGE_FILTERS: { value: StageFilter; label: string }[] = [
  { value: "all", label: "All stages" },
  { value: "Submitted", label: "Submitted" },
  { value: "Under review", label: "Under review" },
  { value: "Interview", label: "Interview" },
  { value: "Accepted", label: "Accepted" },
  { value: "Rejected", label: "Rejected" },
];

export function getStageVariant(stage: Stage): BadgeVariant {
  switch (stage) {
    case "Accepted":
      return "default";
    case "Interview":
      return "secondary";
    case "Under review":
      return "outline";
    case "Rejected":
      return "destructive";
    default:
      return "outline";
  }
}

export function matchesQuery(a: Applicant, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  return (
    a.name.toLowerCase().includes(q) ||
    a.course.toLowerCase().includes(q) ||
    a.track.toLowerCase().includes(q) ||
    a.stage.toLowerCase().includes(q) ||
    a.year.toLowerCase().includes(q) ||
    a.applied.toLowerCase().includes(q) ||
    String(a.gwa).includes(q)
  );
}

export function getStageCount(list: Applicant[], filter: StageFilter): number {
  if (filter === "all") return list.length;
  return list.filter((a) => a.stage === filter).length;
}
