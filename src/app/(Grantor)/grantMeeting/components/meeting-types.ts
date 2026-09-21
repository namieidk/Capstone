export interface UIMeeting {
  id: number;
  applicationId: number | null;
  title: string;
  applicantName: string;
  scheduledAt: Date;
  durationMinutes: number;
  meetingLink: string | null;
  rawStatus: string | null;
  notes: string | null;
  // Who scheduled it — "Paolo R. · Coordinator". Null when unattributed.
  scheduledBy: string | null;
}

export function formatScheduledBy(
  firstName?: string | null,
  lastName?: string | null,
  role?: string | null,
): string | null {
  const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const roleLabel = role ? role.charAt(0) + role.slice(1).toLowerCase() : "";
  if (name && roleLabel) return `${name} · ${roleLabel}`;
  return name || roleLabel || null;
}

export type MeetingStatusLabel = "Live now" | "Rescheduled" | "Scheduled";

export function isMeetingLive(m: UIMeeting, now?: Date): boolean {
  const t = (now ?? new Date()).getTime();
  const start = m.scheduledAt.getTime();
  const end = start + m.durationMinutes * 60_000;
  return t >= start && t <= end;
}

export function getMeetingStatusLabel(m: UIMeeting, now?: Date): MeetingStatusLabel {
  if (isMeetingLive(m, now)) return "Live now";
  if ((m.rawStatus ?? "").toUpperCase() === "RESCHEDULED") return "Rescheduled";
  return "Scheduled";
}

export function getMeetingStatusClass(label: MeetingStatusLabel): string {
  if (label === "Live now") return "border-transparent bg-good-bg text-good";
  if (label === "Rescheduled") return "border-transparent bg-tint text-navy";
  return "border-transparent bg-warn-bg text-warn";
}

export const WEEKDAY_LABELS = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const DURATION_OPTIONS = [15, 30, 45, 60, 90];
