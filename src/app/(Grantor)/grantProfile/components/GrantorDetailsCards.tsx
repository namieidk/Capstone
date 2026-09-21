"use client";

import { Award, Building2, Calendar, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/lib/api/auth";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-line/60 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {Icon && <Icon className="size-4 text-navy/70" />}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-sm font-semibold text-navy text-right">{value}</span>
    </div>
  );
}

interface GrantorDetailsCardsProps {
  user: User;
}

export function GrantorDetailsCards({ user }: GrantorDetailsCardsProps) {
  const memberSince = user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear();
  const department = user.employee?.department || "Corporate Social Responsibility";
  const title = user.employee?.title || "Scholarship Grantor";

  return (
    <>
      {/* Account Details */}
      <Card className="rounded-xl border border-line bg-white shadow-xs">
        <CardContent className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <InfoRow icon={Award} label="Role" value={title} />
            <InfoRow icon={Building2} label="Department" value={department} />
            <InfoRow icon={Calendar} label="Since" value={String(memberSince)} />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="rounded-xl border border-line bg-white shadow-xs">
        <CardContent className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <InfoRow icon={Mail} label="Email" value={user.email} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
