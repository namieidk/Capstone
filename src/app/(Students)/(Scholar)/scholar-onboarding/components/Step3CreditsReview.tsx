"use client";

import { AlertCircle, BookOpen, CheckCircle2, ChevronDown, ChevronUp, GraduationCap, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ProspectusSubject, type ScholarProspectus, uploadHistoricalCcg } from "@/lib/api/baseline";

interface Step3CreditsReviewProps {
  prospectus?: ScholarProspectus | null;
  currentYearLevel?: number | null;
  onSuccess: () => void;
  onBack: () => void;
}

export function Step3CreditsReview({ prospectus, currentYearLevel = 1, onSuccess, onBack }: Step3CreditsReviewProps) {
  const [showOptionalTorUpload, setShowOptionalTorUpload] = useState(false);
  const [torFiles, setTorFiles] = useState<File[]>([]);
  const [torUploading, setTorUploading] = useState(false);
  const [torError, setTorError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"ALL" | "CREDITED" | "UNTAKEN">("ALL");

  const subjects = prospectus?.subjects || [];
  const creditedSubjects = subjects.filter((s) => s.status === "CREDITED" || s.status === "PASSED");
  const untakenSubjects = subjects.filter((s) => s.status !== "CREDITED" && s.status !== "PASSED");
  const creditedUnits = creditedSubjects.reduce((acc, s) => acc + (Number(s.units) || 0), 0);
  const totalUnits = subjects.reduce((acc, s) => acc + (Number(s.units) || 0), 0);

  const hasAutoCredits = creditedSubjects.length > 0;
  const isFreshman = (currentYearLevel || 1) === 1 && !hasAutoCredits;

  // Group subjects by Year Level and Semester
  const groupedData = useMemo(() => {
    const filtered =
      filterMode === "CREDITED" ? creditedSubjects : filterMode === "UNTAKEN" ? untakenSubjects : subjects;

    const groups: Record<
      number,
      Record<
        string,
        {
          subjects: ProspectusSubject[];
          totalUnits: number;
          creditedUnits: number;
          creditedCount: number;
        }
      >
    > = {};

    for (const sub of filtered) {
      const year = sub.year_level || 1;
      const sem = sub.semester || "1st Semester";

      if (!groups[year]) groups[year] = {};
      if (!groups[year][sem]) {
        groups[year][sem] = {
          subjects: [],
          totalUnits: 0,
          creditedUnits: 0,
          creditedCount: 0,
        };
      }

      groups[year][sem].subjects.push(sub);
      const u = Number(sub.units) || 0;
      groups[year][sem].totalUnits += u;
      if (sub.status === "CREDITED" || sub.status === "PASSED") {
        groups[year][sem].creditedUnits += u;
        groups[year][sem].creditedCount += 1;
      }
    }

    return groups;
  }, [subjects, creditedSubjects, untakenSubjects, filterMode]);

  const yearLevels = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => a - b);

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

  const handleTorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTorFiles(Array.from(e.target.files));
      setTorError(null);
    }
  };

  const handleUploadTor = async () => {
    if (torFiles.length === 0) {
      setTorError("Please select at least one transcript file.");
      return;
    }

    try {
      setTorUploading(true);
      setTorError(null);
      const formData = new FormData();
      for (const f of torFiles) {
        formData.append("files", f);
      }

      await uploadHistoricalCcg(formData);
      onSuccess();
    } catch (err) {
      console.error("Historical transcript upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to process transcript.";
      setTorError(msg);
    } finally {
      setTorUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-navy tracking-tight">Review Completed Courses & Credits</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verify curriculum subjects organized by academic semester and credit status before finalizing your baseline.
        </p>
      </div>

      {/* Credit Status Overview Banner */}
      {hasAutoCredits ? (
        <div className="rounded-2xl border border-good/20 bg-good-bg/30 p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl bg-good text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-good">
                  {creditedSubjects.length} Completed Courses Recognized ({creditedUnits.toFixed(1)} /{" "}
                  {totalUnits.toFixed(1)} Units)
                </h3>
                <p className="text-xs text-foreground/80">
                  Grades were automatically extracted from your evaluation sheet and mapped to your semester courses.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <Badge variant="outline" className="border-good/30 bg-white text-good text-xs font-semibold px-2.5 py-1">
                {((creditedUnits / (totalUnits || 1)) * 100).toFixed(0)}% Completed
              </Badge>
            </div>
          </div>
        </div>
      ) : isFreshman ? (
        <div className="rounded-2xl border border-good/20 bg-good-bg/30 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-good text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="size-5 text-amber" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-good">Incoming 1st-Year Freshman Student</h3>
              <p className="text-xs text-foreground/80">
                You are entering your 1st year of college. All curriculum subjects are set to <strong>UNTAKEN</strong>.
                You will record semester grades at the end of each academic term.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber/30 bg-amber-bg/30 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-xl bg-amber text-navy flex items-center justify-center shrink-0 shadow-2xs">
              <AlertCircle className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-navy">No Completed Grades Found on Sheet</h3>
              <p className="text-xs text-muted-foreground">
                If you are a continuing 2nd, 3rd, or 4th-year student, you can upload your Transcript (TOR) / Grade Slip
                below to auto-credit your completed courses.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "ALL" ? "bg-white text-navy shadow-2xs font-bold" : "text-muted-foreground hover:text-navy"
            }`}
          >
            All Courses ({subjects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("CREDITED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "CREDITED"
                ? "bg-white text-good shadow-2xs font-bold"
                : "text-muted-foreground hover:text-navy"
            }`}
          >
            Credited ({creditedSubjects.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("UNTAKEN")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterMode === "UNTAKEN"
                ? "bg-white text-navy shadow-2xs font-bold"
                : "text-muted-foreground hover:text-navy"
            }`}
          >
            Untaken ({untakenSubjects.length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" />
          <span>Organized by Academic Year & Semester</span>
        </div>
      </div>

      {/* Curriculum Subjects Grouped by Semester inside ScrollArea */}
      {subjects.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-2 border-border bg-white shadow-2xs">
          <CardContent className="p-8 text-center text-xs text-muted-foreground">
            No prospectus subjects loaded yet.
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-107.5 w-full rounded-2xl border border-border bg-white p-4 shadow-xs">
          <div className="space-y-6 pr-3">
            {yearLevels.map((year) => {
              const semesters = Object.keys(groupedData[year]);

              return (
                <div key={year} className="space-y-3.5">
                  {/* Year Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/80">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-md bg-navy/10 text-navy flex items-center justify-center text-xs font-bold">
                        <GraduationCap className="size-3.5" />
                      </div>
                      <span className="text-xs font-bold text-navy uppercase tracking-wider">
                        {formatYearName(year)}
                      </span>
                    </div>
                  </div>

                  {/* Semesters Grid */}
                  <div className="grid grid-cols-1 gap-3.5">
                    {semesters.map((sem) => {
                      const { subjects: semSubjects, totalUnits: semTotal, creditedCount } = groupedData[year][sem];

                      return (
                        <Card
                          key={sem}
                          className="rounded-xl border border-border/80 bg-white shadow-2xs overflow-hidden"
                        >
                          <CardHeader className="py-2.5 px-4 bg-muted/30 border-b border-border/70 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xs font-bold text-navy">{sem}</CardTitle>
                              {creditedCount > 0 && (
                                <Badge
                                  variant="outline"
                                  className="border-good/30 bg-good-bg text-good text-[10px] font-semibold py-0 px-1.5"
                                >
                                  {creditedCount} of {semSubjects.length} Credited
                                </Badge>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-medium">
                              Total: <strong className="text-navy">{semTotal.toFixed(1)}</strong> Units
                            </span>
                          </CardHeader>
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow className="hover:bg-transparent text-[11px] text-muted-foreground bg-muted/10">
                                  <TableHead className="w-24 py-1.5 px-3 text-navy font-bold text-[11px]">
                                    Code
                                  </TableHead>
                                  <TableHead className="py-1.5 px-3 text-navy font-bold text-[11px]">
                                    Descriptive Title
                                  </TableHead>
                                  <TableHead className="w-14 text-center py-1.5 px-2 text-navy font-bold text-[11px]">
                                    Units
                                  </TableHead>
                                  <TableHead className="w-24 text-center py-1.5 px-2 text-navy font-bold text-[11px]">
                                    Status
                                  </TableHead>
                                  <TableHead className="w-20 text-right py-1.5 px-3 text-navy font-bold text-[11px]">
                                    Grade
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {semSubjects.map((sub) => {
                                  const isCredited = sub.status === "CREDITED" || sub.status === "PASSED";

                                  return (
                                    <TableRow
                                      key={sub.subject_id}
                                      className="text-xs border-b border-border/50 last:border-0 hover:bg-muted/20"
                                    >
                                      <TableCell className="font-mono font-bold text-navy py-2 px-3 text-xs">
                                        {sub.subject_code}
                                      </TableCell>
                                      <TableCell className="py-2 px-3 text-muted-foreground font-normal">
                                        <div className="text-navy font-medium text-xs line-clamp-1">
                                          {sub.descriptive_title}
                                        </div>
                                        {sub.prerequisites && sub.prerequisites.length > 0 && (
                                          <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <span>Prereq:</span>
                                            <span className="font-mono text-navy font-semibold">
                                              {sub.prerequisites.join(", ")}
                                            </span>
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-center font-semibold text-navy py-2 px-2 text-xs">
                                        {Number(sub.units).toFixed(1)}
                                      </TableCell>
                                      <TableCell className="text-center py-2 px-2">
                                        <Badge
                                          variant="outline"
                                          className={`text-[10px] font-semibold py-0.5 px-2 ${
                                            isCredited
                                              ? "border-good/30 bg-good-bg text-good"
                                              : "border-border text-muted-foreground"
                                          }`}
                                        >
                                          {isCredited ? "Credited" : "Untaken"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right py-2 px-3 font-semibold">
                                        {sub.grade != null ? (
                                          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-good-bg text-good border border-good/20">
                                            {Number(sub.grade).toFixed(2)}
                                          </span>
                                        ) : (
                                          <span className="text-muted-foreground/40">—</span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
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
        </ScrollArea>
      )}

      {/* Optional Transfer Courses / TOR Upload Accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowOptionalTorUpload(!showOptionalTorUpload)}
          className="text-xs text-muted-foreground hover:text-navy font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        >
          {showOptionalTorUpload ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          Have additional transfer courses from another institution? (Optional)
        </button>

        {showOptionalTorUpload && (
          <div className="mt-3 p-4 rounded-xl border border-dashed border-border bg-card space-y-3">
            <p className="text-[11px] text-muted-foreground">
              Upload an official Transcript of Records (TOR) or Grade Slip to match additional courses.
            </p>
            <input type="file" multiple accept=".pdf,.jpg,.png" onChange={handleTorFileChange} className="text-xs" />
            {torFiles.length > 0 && (
              <div className="space-y-2">
                {torFiles.map((f, i) => (
                  <div
                    key={`${f.name}-${f.lastModified}-${f.size}`}
                    className="p-2.5 rounded-lg bg-white border border-border flex items-center justify-between text-xs shadow-2xs"
                  >
                    <span className="font-semibold text-navy truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setTorFiles(torFiles.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  disabled={torUploading}
                  onClick={handleUploadTor}
                  className="text-xs h-9 bg-navy hover:bg-navy/90 text-white rounded-lg px-4"
                >
                  {torUploading ? "Processing TOR..." : "Upload & Reconcile TOR"}
                </Button>
              </div>
            )}
            {torError && (
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {torError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step Navigation Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="text-xs sm:text-sm font-semibold rounded-xl h-11 px-5 border-border hover:bg-muted"
        >
          ← Back to Prospectus
        </Button>

        <Button
          type="button"
          onClick={onSuccess}
          className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs"
        >
          Proceed to Step 4: Final Summary →
        </Button>
      </div>
    </div>
  );
}
