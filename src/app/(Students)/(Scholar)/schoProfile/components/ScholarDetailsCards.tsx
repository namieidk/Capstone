"use client";

import { Building2, GraduationCap, Mail, MapPin, Phone, School, UserCheck } from "lucide-react";
import type React from "react";
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
      <div className="flex items-center gap-2 text-muted-foreground shrink-0">
        {Icon && <Icon className="size-4 text-navy/70" />}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-xs sm:text-sm font-semibold text-navy text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}

interface ScholarDetailsCardsProps {
  user: User;
}

export function ScholarDetailsCards({ user }: ScholarDetailsCardsProps) {
  const scholar = user.scholar_profile;

  return (
    <div className="space-y-4">
      {/* Academic Information Card */}
      <Card className="rounded-xl border border-line bg-white shadow-xs">
        <CardContent className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            <InfoRow icon={School} label="Enrolled University" value={scholar?.school_name || "Not specified"} />
            <InfoRow icon={GraduationCap} label="Degree Program" value={scholar?.course_of_study || "Not specified"} />
            <InfoRow
              icon={UserCheck}
              label="Year Level"
              value={scholar?.current_year_level ? `Year ${scholar.current_year_level} Undergraduate` : "Not specified"}
            />
            <InfoRow icon={Building2} label="Student ID Number" value={scholar?.student_number || "Not specified"} />
          </div>
        </CardContent>
      </Card>

      {/* Contact & Address Details Card */}
      <Card className="rounded-xl border border-line bg-white shadow-xs">
        <CardContent className="p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact & Address Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            <InfoRow icon={Mail} label="Institutional Email" value={user.email} />
            <InfoRow icon={Phone} label="Contact Phone" value={scholar?.phone_number || "Not provided"} />
            <InfoRow
              icon={MapPin}
              label="Permanent Address"
              value={scholar?.student_address || scholar?.home_address || "Not provided"}
            />
            <InfoRow
              icon={Building2}
              label="University Address"
              value={scholar?.school_address || "Davao City, Philippines"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
