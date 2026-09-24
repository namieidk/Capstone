"use client";

import { Award, Building2, CalendarDays, type LucideIcon, Mail } from "lucide-react";
import type { User } from "@/lib/api/auth";
import { LINE, SECTION_HEADING } from "./profile-styles";

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-good-bg text-good">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium [overflow-wrap:anywhere]">
          {href ? (
            <a href={href} className="hover:underline">
              {value}
            </a>
          ) : (
            value
          )}
        </dd>
      </div>
    </div>
  );
}

interface CoordinatorDetailsCardsProps {
  user: User;
}

export function CoordinatorDetailsCards({ user }: CoordinatorDetailsCardsProps) {
  const memberSince = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();
  const department = user.employee?.department || "Scholarship Administration";
  const title = user.employee?.title || "Scholarship Coordinator";

  return (
    <section aria-labelledby="profile-details" className={`self-start rounded-2xl border bg-cream p-6 ${LINE}`}>
      <h2 id="profile-details" className={SECTION_HEADING}>
        Details
      </h2>
      <dl className="mt-4 space-y-4">
        <DetailRow icon={Award} label="Role" value={title} />
        <DetailRow icon={Building2} label="Department" value={department} />
        <DetailRow icon={CalendarDays} label="Member since" value={String(memberSince)} />
        <DetailRow icon={Mail} label="Email" value={user.email} href={`mailto:${user.email}`} />
      </dl>
    </section>
  );
}
