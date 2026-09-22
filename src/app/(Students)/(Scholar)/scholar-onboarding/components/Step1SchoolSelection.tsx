"use client";

import { Check, Loader2, Plus, School as SchoolIcon, Search, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listSchoolGradings, type SchoolGradingSystem, selectOrProposeSchool } from "@/lib/api/baseline";

interface Step1SchoolSelectionProps {
  currentSchool?: SchoolGradingSystem | null;
  onSuccess: () => void;
}

export function formatGradingScale(scale: string): string {
  switch (scale) {
    case "NUMERIC_4_POINT":
      return "4.00 – 1.00 Point Scale";
    case "NUMERIC_5_POINT":
    case "NUMERIC_1_POINT_PASSING":
      return "1.00 – 5.00 Point Scale";
    case "PERCENTAGE_100":
      return "0 – 100% Percentage Scale";
    case "LETTER_GRADE":
      return "Letter Grade (A–F)";
    default:
      return scale
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export const isHighSchoolGrading = (s?: { school_name?: string; grading_scale?: string } | null): boolean =>
  !s || /high\s*school|senior\s*high|deped/i.test(s.school_name || "") || s.grading_scale === "PERCENTAGE_100";

export function Step1SchoolSelection({ currentSchool, onSuccess }: Step1SchoolSelectionProps) {
  const [schools, setSchools] = useState<SchoolGradingSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(
    currentSchool && !isHighSchoolGrading(currentSchool) ? currentSchool.school_id : null,
  );
  const [isProposing, setIsProposing] = useState(false);

  // Proposal form state
  const [newSchoolName, setNewSchoolName] = useState("");
  const [gradingScale, setGradingScale] = useState("NUMERIC_4_POINT");
  const [passingGrade, setPassingGrade] = useState("2.0");
  const [highestGrade, setHighestGrade] = useState("4.0");
  const [failingGrade, setFailingGrade] = useState("1.0");
  const [notes, setNotes] = useState("");
  const [codes, setCodes] = useState<Array<{ id: string; code: string; status: string }>>([
    { id: "c-1", code: "9.0", status: "DROPPED" },
    { id: "c-2", code: "7.1", status: "LACKING_PAYMENT" },
    { id: "c-3", code: "7.2", status: "LACKING_REQUIREMENTS" },
    { id: "c-4", code: "PSD", status: "PASSED" },
    { id: "c-5", code: "TWE", status: "TOTAL_WITHDRAWAL" },
  ]);

  useEffect(() => {
    async function loadSchools() {
      try {
        setLoading(true);
        const list = await listSchoolGradings();
        const higherEdList = (list || []).filter((s) => !isHighSchoolGrading(s));
        setSchools(higherEdList);

        // If no school selected yet but there's a valid match
        if (currentSchool && !isHighSchoolGrading(currentSchool)) {
          setSelectedId(currentSchool.school_id);
        }
      } catch (err) {
        console.error("Failed to load school grading systems:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSchools();
  }, [currentSchool]);

  const handleScalePresetChange = (type: string) => {
    setGradingScale(type);
    if (type === "NUMERIC_4_POINT") {
      setHighestGrade("4.0");
      setPassingGrade("2.0");
      setFailingGrade("1.0");
      setCodes([
        { id: `c-${Date.now()}-1`, code: "9.0", status: "DROPPED" },
        { id: `c-${Date.now()}-2`, code: "7.1", status: "LACKING_PAYMENT" },
        { id: `c-${Date.now()}-3`, code: "7.2", status: "LACKING_REQUIREMENTS" },
        { id: `c-${Date.now()}-4`, code: "PSD", status: "PASSED" },
        { id: `c-${Date.now()}-5`, code: "TWE", status: "TOTAL_WITHDRAWAL" },
      ]);
    } else if (type === "NUMERIC_5_POINT") {
      setHighestGrade("1.0");
      setPassingGrade("3.0");
      setFailingGrade("5.0");
      setCodes([
        { id: `c-${Date.now()}-1`, code: "5.0", status: "FAILED" },
        { id: `c-${Date.now()}-2`, code: "INC", status: "INCOMPLETE" },
        { id: `c-${Date.now()}-3`, code: "DRP", status: "DROPPED" },
        { id: `c-${Date.now()}-4`, code: "P", status: "PASSED" },
      ]);
    } else if (type === "LETTER_GRADE") {
      setHighestGrade("4.0");
      setPassingGrade("2.0");
      setFailingGrade("0.0");
      setCodes([
        { id: `c-${Date.now()}-1`, code: "W", status: "WITHDRAWN" },
        { id: `c-${Date.now()}-2`, code: "I", status: "INCOMPLETE" },
      ]);
    }
  };

  const filteredSchools = schools.filter((s) => s.school_name.toLowerCase().includes(search.toLowerCase()));

  const handleConfirmExisting = async (id: number) => {
    try {
      setSubmitting(true);
      await selectOrProposeSchool({ school_id: id });
      onSuccess();
    } catch (err) {
      console.error("Failed to select school:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProposeNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    try {
      setSubmitting(true);
      const special_codes: Record<string, string> = {};
      for (const { code, status } of codes) {
        const c = code.trim();
        const s = status.trim();
        if (c && s) {
          special_codes[c] = s;
        }
      }

      await selectOrProposeSchool({
        new_school_name: newSchoolName.trim(),
        grading_scale: gradingScale,
        passing_grade: Number.parseFloat(passingGrade) || 2.0,
        highest_grade: Number.parseFloat(highestGrade) || 4.0,
        failing_grade: Number.parseFloat(failingGrade) || 1.0,
        notes: notes.trim() || undefined,
        special_codes: Object.keys(special_codes).length > 0 ? special_codes : undefined,
      });
      onSuccess();
    } catch (err) {
      console.error("Failed to propose school:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-navy tracking-tight">Select Your University / Institution</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choose your university to apply the standard grading scale (e.g. 4.0 passing at 2.0 or 1.0 passing at 3.0).
        </p>
      </div>

      {!isProposing ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search institution name (e.g. University of Mindanao)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9.5 h-11 text-xs sm:text-sm rounded-xl border-border bg-input-bg"
            />
          </div>

          {/* School list cards */}
          <div className="space-y-2 max-h-85 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-xs text-muted-foreground gap-2">
                <Loader2 className="size-4 animate-spin text-navy" /> Loading registered universities...
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-navy">No matching institution found</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Is your university not in the list? You can propose it below.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProposing(true)}
                  className="mt-3 text-xs gap-1.5 rounded-lg border-amber text-navy hover:bg-amber-bg/40 font-semibold"
                >
                  <Plus className="size-3.5" /> Add New Institution Scale
                </Button>
              </div>
            ) : (
              filteredSchools.map((s) => {
                const isSelected = selectedId === s.school_id;
                return (
                  <button
                    key={s.school_id}
                    type="button"
                    onClick={() => setSelectedId(s.school_id)}
                    className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber bg-amber-bg/25 ring-2 ring-amber/20"
                        : "border-border bg-white hover:border-line"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-navy text-amber" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <SchoolIcon className="size-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-navy">{s.school_name}</span>
                          {s.is_verified && (
                            <Badge className="bg-good-bg text-good border-good/20 text-[10px] py-0 px-1.5 gap-1 font-semibold">
                              <ShieldCheck className="size-3" /> Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Scale:{" "}
                          <span className="font-semibold text-foreground">{formatGradingScale(s.grading_scale)}</span> •
                          Passing: <span className="font-semibold text-foreground">{s.passing_grade}</span> • Highest:{" "}
                          <span className="font-semibold text-foreground">{s.highest_grade}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="size-6 rounded-full bg-navy text-amber flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="size-3.5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsProposing(true)}
              className="text-xs text-muted-foreground hover:text-navy gap-1"
            >
              <Plus className="size-3.5" /> University not listed? Add it
            </Button>

            <Button
              type="button"
              disabled={!selectedId || submitting}
              onClick={() => selectedId && handleConfirmExisting(selectedId)}
              className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Confirming...
                </>
              ) : (
                "Confirm & Proceed to Step 2 →"
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Propose New School Form */
        <form
          onSubmit={handleProposeNew}
          className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">
              <Plus className="size-4 text-amber" /> Propose New Institution Grading Scale
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsProposing(false)}
              className="text-xs text-muted-foreground hover:text-navy h-8"
            >
              Back to List
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-navy">University / College Full Name *</Label>
            <Input
              required
              placeholder="e.g. University of Southeastern Philippines"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              className="h-10 text-xs rounded-xl bg-white border-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-navy">Grading Scale Format</Label>
              <Select value={gradingScale} onValueChange={handleScalePresetChange}>
                <SelectTrigger className="h-10 text-xs rounded-xl bg-white border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NUMERIC_4_POINT">4.00 – 1.00 Point Scale (4.0 Highest, 2.0 Passing)</SelectItem>
                  <SelectItem value="NUMERIC_5_POINT">1.00 – 5.00 Point Scale (1.0 Highest, 3.0 Passing)</SelectItem>
                  <SelectItem value="LETTER_GRADE">Letter Grade (A to F)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-navy">Passing Grade Threshold *</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={passingGrade}
                onChange={(e) => setPassingGrade(e.target.value)}
                className="h-10 text-xs rounded-xl bg-white border-border"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-navy">Highest Attainable Grade</Label>
              <Input
                type="number"
                step="0.01"
                value={highestGrade}
                onChange={(e) => setHighestGrade(e.target.value)}
                className="h-10 text-xs rounded-xl bg-white border-border"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-navy">Lowest / Failing Grade</Label>
              <Input
                type="number"
                step="0.01"
                value={failingGrade}
                onChange={(e) => setFailingGrade(e.target.value)}
                className="h-10 text-xs rounded-xl bg-white border-border"
              />
            </div>
          </div>

          {/* Special Status Codes Configuration */}
          <div className="space-y-2 rounded-xl border border-border bg-tint/40 p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-navy">Special Status Codes</Label>
                <p className="text-[11px] text-muted-foreground">
                  e.g. 9.0 (DROPPED), 7.1 (LACKING_PAYMENT), PSD (PASSED), INC (INCOMPLETE)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-bold text-navy bg-white border-border hover:bg-muted"
                onClick={() => setCodes([...codes, { id: `c-${Date.now()}`, code: "", status: "" }])}
              >
                <Plus className="size-3.5 mr-1" />
                Add Code
              </Button>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {codes.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5">
                  <Input
                    placeholder="Code (e.g. 9.0)"
                    value={c.code}
                    onChange={(e) =>
                      setCodes(codes.map((item) => (item.id === c.id ? { ...item, code: e.target.value } : item)))
                    }
                    className="h-8 w-24 text-xs font-bold border-border bg-white"
                  />
                  <Input
                    placeholder="Status (e.g. DROPPED)"
                    value={c.status}
                    onChange={(e) =>
                      setCodes(codes.map((item) => (item.id === c.id ? { ...item, status: e.target.value } : item)))
                    }
                    className="h-8 flex-1 text-xs font-semibold border-border bg-white"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-bad"
                    onClick={() => setCodes(codes.filter((item) => item.id !== c.id))}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-navy">Notes / Scale Description (Optional)</Label>
            <Input
              placeholder="e.g. 4.0 = 95-100%, 2.0 = 75-79% passing"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-10 text-xs rounded-xl bg-white border-border"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsProposing(false)}
              className="h-11 px-5 text-xs sm:text-sm font-semibold rounded-xl border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newSchoolName.trim() || submitting}
              className="h-11 px-6 rounded-xl bg-navy hover:bg-navy/90 text-white font-semibold text-xs sm:text-sm shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                "Save & Continue to Step 2 →"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
