"use client";

import { CheckCircle2, Clock, FileQuestion, XCircle } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProspectusSubject } from "@/lib/api/baseline";

interface ProspectusChecklistTableProps {
  subjects: ProspectusSubject[];
}

export function ProspectusChecklistTable({ subjects }: ProspectusChecklistTableProps) {
  // Group subjects by Year Level and Semester
  const groupedData = useMemo(() => {
    const groups: Record<number, Record<string, { subjects: ProspectusSubject[]; totalUnits: number }>> = {};

    for (const sub of subjects) {
      const year = sub.year_level || 1;
      const sem = sub.semester || "1st Semester";

      if (!groups[year]) groups[year] = {};
      if (!groups[year][sem]) {
        groups[year][sem] = { subjects: [], totalUnits: 0 };
      }

      groups[year][sem].subjects.push(sub);
      groups[year][sem].totalUnits += Number(sub.units) || 0;
    }

    return groups;
  }, [subjects]);

  const yearLevels = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => a - b);

  if (subjects.length === 0) {
    return (
      <Card className="rounded-xl border-dashed border-2 border-line bg-white shadow-xs">
        <CardContent className="p-12 text-center space-y-3">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-tint text-muted-foreground">
            <FileQuestion className="size-6 text-navy" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-navy text-base">No Prospectus Subjects Uploaded Yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Upload your official curriculum evaluation sheet or program checklist PDF to automatically extract and
              populate your active academic checklist.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CREDITED":
      case "PASSED":
        return (
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[11px] font-semibold py-0.5 gap-1">
            <CheckCircle2 className="size-3 text-emerald-700" /> Credited
          </Badge>
        );
      case "ENROLLED":
        return (
          <Badge className="bg-blue-50 text-blue-800 border-blue-300 text-[11px] font-semibold py-0.5 gap-1">
            <Clock className="size-3 text-blue-700" /> Enrolled
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200 text-[11px] font-semibold py-0.5 gap-1">
            <XCircle className="size-3 text-red-700" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-line text-[11px] text-muted-foreground py-0.5">
            Untaken
          </Badge>
        );
    }
  };

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
      default:
        return `Year ${year}`;
    }
  };

  return (
    <div className="space-y-6">
      {yearLevels.map((year) => {
        const semesters = Object.keys(groupedData[year]);

        return (
          <div key={year} className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-line">
              <span className="text-sm font-bold text-navy uppercase tracking-wider">{formatYearName(year)}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {semesters.map((sem) => {
                const { subjects: semSubjects, totalUnits } = groupedData[year][sem];

                return (
                  <Card key={sem} className="rounded-xl border border-line bg-white shadow-xs overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-[#FAF9F7] border-b border-line flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold text-navy">{sem}</CardTitle>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Total: <strong className="text-navy">{totalUnits.toFixed(1)}</strong> units
                      </span>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent text-[11px] text-muted-foreground bg-tint/20">
                            <TableHead className="w-22.5 py-2 px-3 text-navy font-bold">Code</TableHead>
                            <TableHead className="py-2 px-3 text-navy font-bold">Descriptive Title</TableHead>
                            <TableHead className="w-12.5 text-center py-2 px-2 text-navy font-bold">Units</TableHead>
                            <TableHead className="w-21.25 text-center py-2 px-2 text-navy font-bold">Status</TableHead>
                            <TableHead className="w-16.25 text-right py-2 px-3 text-navy font-bold">Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {semSubjects.map((sub) => (
                            <TableRow key={sub.subject_id} className="text-xs border-b border-line/60 last:border-0">
                              <TableCell className="font-mono font-bold text-navy py-2 px-3">
                                {sub.subject_code}
                              </TableCell>
                              <TableCell className="py-2 px-3 text-muted-foreground font-normal">
                                <div className="text-navy font-medium line-clamp-1">{sub.descriptive_title}</div>
                                {sub.prerequisites && sub.prerequisites.length > 0 && (
                                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <span>Prereq:</span>
                                    <span className="font-mono text-navy font-semibold">
                                      {sub.prerequisites.join(", ")}
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-center font-semibold text-navy py-2 px-2">
                                {Number(sub.units).toFixed(1)}
                              </TableCell>
                              <TableCell className="text-center py-2 px-2">{getStatusBadge(sub.status)}</TableCell>
                              <TableCell className="text-right py-2 px-3 font-semibold">
                                {sub.grade != null ? (
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                      sub.status === "CREDITED" || sub.status === "PASSED"
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                                  >
                                    {Number(sub.grade).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/50">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
