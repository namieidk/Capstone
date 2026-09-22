"use client";

import { ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GrantorEndorsedApplicantItem } from "@/lib/api/grantor-dashboard";

interface GrantorEndorsedApplicantsCardProps {
  applicants: GrantorEndorsedApplicantItem[];
}

export function GrantorEndorsedApplicantsCard({ applicants }: GrantorEndorsedApplicantsCardProps) {
  return (
    <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <UserCheck className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Endorsed Applicant Verdict Queue</h2>
            <p className="text-xs text-muted-foreground">
              Coordinator-vetted candidates ready for final Grantor decision
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/grantApplicants" className="flex items-center gap-1">
            <span>Process Verdicts</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {applicants.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 p-6 text-center text-xs text-muted-foreground">
            No endorsed applicants currently pending Grantor decision.
          </div>
        ) : (
          applicants.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-xs shadow-2xs hover:border-blue-300 hover:bg-white transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                  {app.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "AP"}
                </div>
                <div>
                  <p className="font-bold text-[#14213a]">{app.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {app.track} • {app.school}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="h-5.5 w-28 justify-center rounded-full border-blue-300 bg-blue-50 px-2 text-[10px] font-bold text-blue-800">
                  <UserCheck className="mr-1 size-3 shrink-0" /> Endorsed
                </Badge>
                <Button
                  asChild
                  size="sm"
                  className="h-7 rounded-full bg-[#0a4f42] px-2.5 text-[10px] font-semibold text-white! hover:bg-[#083c32]"
                >
                  <Link href={`/grantApplicants?id=${app.id}`}>
                    <span className="text-white!">Decide</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
