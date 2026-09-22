"use client";

import { Award, CheckCircle2, FileText, School } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/lib/api/auth";

interface ScholarStatsProps {
  user: User;
  documentsCount: number;
}

export function ScholarStats({ user, documentsCount }: ScholarStatsProps) {
  const scholar = user.scholar_profile;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <Card className="rounded-2xl border-line bg-white shadow-2xs">
        <CardContent className="p-4 flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Award className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Standing Status</p>
            <p className="text-sm font-bold text-navy truncate mt-0.5">Good Academic Standing</p>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Retention Cleared
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-line bg-white shadow-2xs">
        <CardContent className="p-4 flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-[#0a4f42] border border-teal-200">
            <School className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Curriculum Level</p>
            <p className="text-sm font-bold text-navy truncate mt-0.5">
              Year {scholar?.current_year_level || 1} Undergraduate
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{scholar?.course_of_study || "Degree Track"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-line bg-white shadow-2xs">
        <CardContent className="p-4 flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Verified Documents</p>
            <p className="text-sm font-bold text-navy truncate mt-0.5">
              {documentsCount} Uploaded Record{documentsCount === 1 ? "" : "s"}
            </p>
            <p className="text-[11px] text-muted-foreground">COR, CCG, SOA & Receipts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
