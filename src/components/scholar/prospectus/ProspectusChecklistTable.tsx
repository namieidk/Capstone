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
      <Card className="border-dashed border-2 border-border bg-card shadow-xs">
        <CardContent className="p-12 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-base">No Prospectus Subjects Uploaded Yet</h3>
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
          <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 text-[11px] font-semibold py-0.5 gap-1">
            <CheckCircle2 className="w-3 h-3" /> Credited
          </Badge>
        );
      case "ENROLLED":
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[11px] font-semibold py-0.5 gap-1">
            <Clock className="w-3 h-3" /> Enrolled
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[11px] font-semibold py-0.5 gap-1">
            <XCircle className="w-3 h-3" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px] text-muted-foreground py-0.5">
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
            <div className="flex items-center gap-2 pb-1 border-b border-border">
              <span className="text-sm font-bold text-foreground uppercase tracking-wider">{formatYearName(year)}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {semesters.map((sem) => {
                const { subjects: semSubjects, totalUnits } = groupedData[year][sem];

                return (
                  <Card key={sem} className="border-border bg-card shadow-xs overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-muted/40 border-b border-border flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-semibold text-foreground">{sem}</CardTitle>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Total: <strong>{totalUnits.toFixed(1)}</strong> units
                      </span>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent text-[11px] text-muted-foreground">
                            <TableHead className="w-[90px] py-2 px-3">Code</TableHead>
                            <TableHead className="py-2 px-3">Descriptive Title</TableHead>
                            <TableHead className="w-[50px] text-center py-2 px-2">Units</TableHead>
                            <TableHead className="w-[85px] text-center py-2 px-2">Status</TableHead>
                            <TableHead className="w-[65px] text-right py-2 px-3">Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {semSubjects.map((sub) => (
                            <TableRow key={sub.subject_id} className="text-xs">
                              <TableCell className="font-mono font-medium text-foreground py-2 px-3">
                                {sub.subject_code}
                              </TableCell>
                              <TableCell className="py-2 px-3 text-muted-foreground font-normal">
                                <div className="text-foreground font-medium line-clamp-1">{sub.descriptive_title}</div>
                                {sub.prerequisites && sub.prerequisites.length > 0 && (
                                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <span>Prereq:</span>
                                    <span className="font-mono">{sub.prerequisites.join(", ")}</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-center font-medium py-2 px-2">
                                {Number(sub.units).toFixed(1)}
                              </TableCell>
                              <TableCell className="text-center py-2 px-2">{getStatusBadge(sub.status)}</TableCell>
                              <TableCell className="text-right py-2 px-3 font-semibold">
                                {sub.grade != null ? (
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[11px] ${
                                      sub.status === "CREDITED" || sub.status === "PASSED"
                                        ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                                        : "bg-destructive/10 text-destructive"
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
