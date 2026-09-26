"use client";

import { CheckCircle2, ChevronDown, ChevronUp, FileCheck2, FileText, GraduationCap, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScholarProspectus } from "@/lib/api/baseline";

interface Step3CreditsReviewProps {
  prospectus?: ScholarProspectus | null;
  currentYearLevel?: number | null;
  onSuccess: () => void;
  onBack: () => void;
}

export function Step3CreditsReview({ prospectus, onSuccess, onBack }: Step3CreditsReviewProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const subjects = prospectus?.subjects || [];
  const totalUnits = subjects.reduce((acc, s) => acc + (Number(s.units) || 0), 0);

  // Group summary by Year Level
  const yearSummaries = useMemo(() => {
    const map: Record<number, { subjectsCount: number; totalUnits: number; semesters: string[] }> = {};

    for (const sub of subjects) {
      const year = sub.year_level || 1;
      const sem = sub.semester || "1st Semester";
      if (!map[year]) {
        map[year] = { subjectsCount: 0, totalUnits: 0, semesters: [] };
      }
      map[year].subjectsCount += 1;
      map[year].totalUnits += Number(sub.units) || 0;
      if (!map[year].semesters.includes(sem)) {
        map[year].semesters.push(sem);
      }
    }

    return Object.keys(map)
      .map(Number)
      .sort((a, b) => a - b)
      .map((year) => ({
        year,
        ...map[year],
      }));
  }, [subjects]);

  const formatYearName = (year: number) => {
    switch (year) {
      case 1:
        return "First Year";
      case 2:
        return "Second Year";
      case 3:
        return "Third Year";
      case 4:
        return "Fourth Year";
      case 5:
        return "Fifth Year";
      default:
        return `Year ${year}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-navy tracking-tight">Confirm Submitted Curriculum Prospectus</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verify your uploaded prospectus document before final baseline submission to your coordinator.
        </p>
      </div>

      {/* Main Document Ingestion Summary Card */}
      <Card className="rounded-2xl border-line bg-white shadow-2xs overflow-hidden">
        <CardHeader className="p-5 border-b border-line bg-slate-50/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-[#0a4f42]/10 text-[#0a4f42] flex items-center justify-center shrink-0">
                <FileText className="size-5" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-navy flex items-center gap-2">
                  <span>{prospectus?.course_name || "Official Program Prospectus"}</span>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-bold"
                  >
                    Ingested Document
                  </Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Curriculum Catalog:{" "}
                  <strong className="text-navy">{prospectus?.curriculum_year || "Current Catalog"}</strong>
                  {prospectus?.course_code ? ` • Code: ${prospectus.course_code}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-[#0a4f42] text-white text-xs font-bold px-3 py-1 shadow-xs">
                {subjects.length} Courses Scanned
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-slate-200/80 bg-[#fdfcfb]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Total Units
              </span>
              <p className="text-lg font-black text-navy mt-0.5">{totalUnits.toFixed(1)}</p>
              <span className="text-[10px] text-muted-foreground">Degree credit requirement</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-[#fdfcfb]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Total Courses
              </span>
              <p className="text-lg font-black text-navy mt-0.5">{subjects.length}</p>
              <span className="text-[10px] text-muted-foreground">Across curriculum years</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-[#fdfcfb] col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Curriculum Structure
              </span>
              <p className="text-lg font-black text-[#0a4f42] mt-0.5">{yearSummaries.length} Academic Years</p>
              <span className="text-[10px] text-muted-foreground">Standard degree progression</span>
            </div>
          </div>

          {/* Submission Readiness Checklist */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-2.5">
            <p className="font-semibold text-navy text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="size-4 text-[#0a4f42]" />
              Prospectus Submission Checklist:
            </p>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#0a4f42]" />
                <span>Document covers all required semesters and academic years of your degree program.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#0a4f42]" />
                <span>Course titles, descriptive codes, and prerequisite linkages are clear and intact.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#0a4f42]" />
                <span>School institution and degree program align with your scholarship grant details.</span>
              </div>
            </div>
          </div>

          {/* Notice to Scholar */}
          <div className="rounded-xl bg-teal-500/10 border border-teal-500/20 p-3.5 text-xs text-teal-950 flex items-start gap-2.5">
            <Sparkles className="size-4 text-[#0a4f42] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Coordinator Verification Notice:</strong> The Scholarship Coordinator will review your uploaded
              curriculum prospectus to establish and freeze your official academic baseline. Each term, your enrolled
              courses (COR) will be automatically audited against this baseline.
            </p>
          </div>

          {/* Optional Collapsible Year Breakdown */}
          {yearSummaries.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-line bg-white hover:bg-slate-50 transition-colors text-xs font-semibold text-navy"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-[#0a4f42]" />
                  <span>View Scanned Year Level Summary ({yearSummaries.length} Years)</span>
                </span>
                {showBreakdown ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {showBreakdown && (
                <div className="mt-2.5 space-y-2 animate-in fade-in duration-150">
                  {yearSummaries.map((yr) => (
                    <div
                      key={yr.year}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy">{formatYearName(yr.year)}</span>
                        <span className="text-muted-foreground text-[11px]">({yr.semesters.join(", ")})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-[11px]">{yr.subjectsCount} courses</span>
                        <Badge variant="outline" className="bg-white border-line text-[11px] font-semibold text-navy">
                          {yr.totalUnits.toFixed(1)} Units
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stepper Footer Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold rounded-xl h-11 px-5 border-border hover:bg-muted"
        >
          ← Re-upload / Back to Prospectus File
        </Button>

        <Button
          type="button"
          onClick={onSuccess}
          className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs gap-1.5"
        >
          <CheckCircle2 className="size-4" />
          <span>Confirm Document & Continue to Final Review →</span>
        </Button>
      </div>
    </div>
  );
}
