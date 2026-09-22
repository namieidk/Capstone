"use client";

import { Award, Building2, RefreshCw, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GrantorDashboardHeaderProps {
  grantorName: string;
  grantorTitle?: string;
  grantorOrg?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function GrantorDashboardHeader({
  grantorName,
  grantorTitle = "Scholarship Grantor & Executive Sponsor",
  grantorOrg = "Scholarship Foundation",
  onRefresh,
  isRefreshing,
}: GrantorDashboardHeaderProps) {
  const initials =
    grantorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GR";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line/80 bg-linear-to-r from-white via-[#FAF8F5] to-white p-5 sm:p-6 shadow-xs">
      {/* Decorative accent top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#0a4f42] via-[#f1b71e] to-[#0a4f42]" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Grantor Info */}
        <div className="flex items-start gap-4">
          <div className="relative flex size-13 sm:size-14 shrink-0 items-center justify-center rounded-2xl bg-[#0a4f42]/10 border border-[#0a4f42]/20 text-[#0a4f42] shadow-inner font-bold text-lg sm:text-xl">
            {initials}
            <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#f1b71e] text-[#14213a] ring-2 ring-white">
              <Award className="size-3 text-[#705009]" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#14213a]">Welcome, {grantorName}!</h1>
              <Badge className="h-5.5 rounded-full border-[#0a4f42]/30 bg-[#ddeee3] px-2.5 text-[11px] font-semibold text-[#0a4f42]">
                <ShieldCheck className="mr-1 size-3" /> Executive Verdict Command
              </Badge>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{grantorTitle}</span>
              <span className="hidden sm:inline text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5 text-muted-foreground" />
                {grantorOrg}
              </span>
              <span className="hidden sm:inline text-muted-foreground/40">•</span>
              <span className="rounded-md bg-[#f1b71e]/15 px-1.5 py-0.5 text-[11px] font-medium text-[#8a6410]">
                Academic Year 2026-2027
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-line bg-white/90 px-3.5 text-xs font-semibold text-navy hover:bg-tint shadow-2xs"
          >
            <Link href="/grantApplicants" className="flex items-center gap-1.5">
              <Users className="size-3.5 text-[#0a4f42]" />
              <span>Review Candidates</span>
            </Link>
          </Button>

          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="size-9 rounded-full border-line bg-white/90 text-muted-foreground hover:text-navy hover:bg-tint shadow-2xs"
              title="Refresh grantor dashboard"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-[#0a4f42]" : ""}`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
