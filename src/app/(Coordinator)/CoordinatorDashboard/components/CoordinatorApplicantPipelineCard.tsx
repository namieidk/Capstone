"use client";

import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CoordinatorApplicantItem } from "@/lib/api/coordinator-dashboard";

interface CoordinatorApplicantPipelineCardProps {
  applicantStages: Record<string, number>;
  recentApplicants: CoordinatorApplicantItem[];
}

export function CoordinatorApplicantPipelineCard({
  applicantStages,
  recentApplicants,
}: CoordinatorApplicantPipelineCardProps) {
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "ENDORSED_TO_GRANTOR":
        return (
          <Badge className="h-5.5 w-32 justify-center rounded-full border-emerald-300 bg-emerald-50 px-2 text-[10px] font-bold text-emerald-800">
            Endorsed
          </Badge>
        );
      case "INTERVIEW_SCHEDULED":
      case "FOR_INTERVIEW":
        return (
          <Badge className="h-5.5 w-32 justify-center rounded-full border-indigo-200 bg-indigo-50 px-2 text-[10px] font-bold text-indigo-800">
            Interview Stage
          </Badge>
        );
      case "DOCUMENT_VERIFICATION":
        return (
          <Badge className="h-5.5 w-32 justify-center rounded-full border-blue-200 bg-blue-50 px-2 text-[10px] font-bold text-blue-800">
            Doc Review
          </Badge>
        );
      default:
        return (
          <Badge className="h-5.5 w-32 justify-center rounded-full border-amber-300 bg-amber-50 px-2 text-[10px] font-bold text-amber-800">
            Pre-Screening
          </Badge>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-start rounded-2xl border-line/80 bg-white shadow-2xs hover:shadow-xs transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8.5 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Users className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#14213a]">Applicant Intake & Vetting Funnel</h2>
            <p className="text-xs text-muted-foreground">Screening, interviews & grantor endorsement</p>
          </div>
        </div>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-semibold text-[#0a4f42] hover:bg-[#0a4f42]/10"
        >
          <Link href="/CoordinatorApplicants" className="flex items-center gap-1">
            <span>All Applicants</span>
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Funnel breakdown mini badges */}
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-line/60 bg-[#FAF8F5] p-3 text-center">
          <div className="rounded-lg bg-white p-2 border border-line/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Pre-Screening</p>
            <p className="text-sm font-bold text-[#14213a]">
              {(applicantStages.PRE_SCREENING || 0) + (applicantStages.DOCUMENT_VERIFICATION || 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-2 border border-line/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Interviewing</p>
            <p className="text-sm font-bold text-indigo-700">
              {(applicantStages.FOR_INTERVIEW || 0) + (applicantStages.INTERVIEW_SCHEDULED || 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-2 border border-line/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Endorsed</p>
            <p className="text-sm font-bold text-[#0a4f42]">{applicantStages.ENDORSED_TO_GRANTOR || 0}</p>
          </div>
        </div>

        {/* Recent applicant list */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Recent Submissions</p>
          {recentApplicants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line/70 p-4 text-center text-xs text-muted-foreground">
              No recent applicant submissions found.
            </div>
          ) : (
            recentApplicants.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-xl border border-line/60 bg-white p-3 text-xs shadow-2xs hover:border-[#0a4f42]/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7.5 items-center justify-center rounded-lg bg-tint text-navy font-bold text-xs">
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

                <div className="flex items-center gap-2">{getStageBadge(app.stage)}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
