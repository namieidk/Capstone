"use client";

import { archiveReasonBadge, archiveReasonLabel } from "@/lib/api/archive";

const BADGE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  good: { bg: "#f0fdf4", text: "#166534", dot: "#16a34a" },
  warn: { bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
  bad: { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  neutral: { bg: "#f5f5f4", text: "#44403c", dot: "#78716c" },
};

export function ArchiveReasonBadge({ reason }: { reason?: string | null }) {
  const variant = archiveReasonBadge(reason);
  const styles = BADGE_STYLES[variant] ?? BADGE_STYLES.neutral;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: styles.bg, color: styles.text, borderColor: `${styles.text}33` }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: styles.dot }} />
      {archiveReasonLabel(reason)}
    </span>
  );
}
