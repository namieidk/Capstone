"use client";

import { Building2, Check, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listSchoolGradings, type SchoolGradingSystem, selectOrProposeSchool } from "@/lib/api/baseline";

interface SchoolSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSchoolId?: number | null;
  onSuccess: () => void;
}

export function SchoolSelectionModal({ open, onOpenChange, currentSchoolId, onSuccess }: SchoolSelectionModalProps) {
  const [schools, setSchools] = useState<SchoolGradingSystem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(currentSchoolId ? String(currentSchoolId) : "");

  // New school form state
  const [newSchoolName, setNewSchoolName] = useState("");
  const [scaleType, setScaleType] = useState("NUMERIC_4_POINT");
  const [highestGrade, setHighestGrade] = useState("4.0");
  const [passingGrade, setPassingGrade] = useState("2.0");
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
    if (open) {
      setLoading(true);
      listSchoolGradings()
        .then((data) => {
          setSchools(data || []);
          if (currentSchoolId) setSelectedSchoolId(String(currentSchoolId));
        })
        .finally(() => setLoading(false));
    }
  }, [open, currentSchoolId]);

  const handleScalePresetChange = (type: string) => {
    setScaleType(type);
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
    } else if (type === "PERCENTAGE_100") {
      setHighestGrade("100.0");
      setPassingGrade("75.0");
      setFailingGrade("74.0");
      setCodes([]);
    }
  };

  const handleConfirmExisting = async () => {
    if (!selectedSchoolId) return;
    try {
      setSaving(true);
      await selectOrProposeSchool({ school_id: Number(selectedSchoolId) });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to select school:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleProposeNewSchool = async () => {
    if (!newSchoolName.trim()) return;
    try {
      setSaving(true);

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
        grading_scale: scaleType,
        highest_grade: parseFloat(highestGrade),
        passing_grade: parseFloat(passingGrade),
        failing_grade: parseFloat(failingGrade),
        notes: notes.trim() || undefined,
        special_codes: Object.keys(special_codes).length > 0 ? special_codes : undefined,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to propose school:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135 rounded-2xl border-line bg-white p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-navy">
            <span className="flex size-9 items-center justify-center rounded-lg bg-tint text-navy">
              <Building2 className="size-5" />
            </span>
            Institution Grading Scale Configuration
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select your enrolled university or enter its grading scale parameters.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full mt-2">
          <TabsList className="grid grid-cols-2 w-full bg-tint p-1 rounded-xl">
            <TabsTrigger
              value="existing"
              className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:font-bold"
            >
              Registered Institutions
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:text-navy data-[state=active]:font-bold"
            >
              Propose New School
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4 pt-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-navy">Select University / College</Label>
              {loading ? (
                <div className="h-10 rounded-xl bg-muted animate-pulse" />
              ) : (
                <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                  <SelectTrigger className="w-full text-xs h-10 border-line bg-[#f7f9fb]">
                    <SelectValue placeholder="Choose your school..." />
                  </SelectTrigger>
                  <SelectContent className="border-line bg-white">
                    {schools.map((s) => (
                      <SelectItem key={s.school_id} value={String(s.school_id)} className="text-xs">
                        {s.school_name} ({s.grading_scale})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {selectedSchoolId && (
              <div className="p-3.5 bg-tint/60 rounded-xl border border-line text-xs space-y-1.5">
                {(() => {
                  const sc = schools.find((s) => String(s.school_id) === selectedSchoolId);
                  if (!sc) return null;
                  const isInv = Number(sc.highest_grade) < Number(sc.failing_grade);
                  return (
                    <>
                      <div className="font-bold text-navy">{sc.school_name}</div>
                      <div className="text-muted-foreground">
                        Scale:{" "}
                        {isInv ? "1.0 to 5.0 (1.0 Highest)" : `${sc.highest_grade} Max, ${sc.passing_grade} Passing`}
                      </div>
                      <div className="flex gap-4 pt-1 text-[11px]">
                        <span>
                          Highest: <strong className="text-navy">{Number(sc.highest_grade).toFixed(2)}</strong>
                        </span>
                        <span>
                          Passing:{" "}
                          <strong className="text-emerald-800 font-bold">{Number(sc.passing_grade).toFixed(2)}</strong>
                        </span>
                        <span>
                          Failing:{" "}
                          <strong className="text-red-700 font-bold">{Number(sc.failing_grade).toFixed(2)}</strong>
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-10 rounded-lg border-line px-4 text-xs font-semibold text-navy hover:bg-tint"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmExisting}
                disabled={!selectedSchoolId || saving}
                className="h-10 gap-1.5 rounded-lg bg-navy px-5 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
              >
                <Check className="size-4" />
                {saving ? "Confirming..." : "Confirm Institution"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="new" className="space-y-3.5 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-navy">School / University Name</Label>
              <Input
                placeholder="e.g., Holy Cross of Davao College"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                className="text-xs h-10 border-line bg-[#f7f9fb]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-navy">Grading Scale Format</Label>
              <Select value={scaleType} onValueChange={handleScalePresetChange}>
                <SelectTrigger className="w-full text-xs h-10 border-line bg-[#f7f9fb]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-line bg-white">
                  <SelectItem value="NUMERIC_4_POINT" className="text-xs">
                    4.0 Scale (e.g. UM — 4.0 Max, 2.0 Passing, 1.0 Failing)
                  </SelectItem>
                  <SelectItem value="NUMERIC_5_POINT" className="text-xs">
                    5.0 Scale (e.g. UP — 1.0 Highest, 3.0 Passing, 5.0 Failing)
                  </SelectItem>
                  <SelectItem value="PERCENTAGE_100" className="text-xs">
                    Percentage 100% (e.g. 100 Max, 75 Passing, 65 Failing)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-navy">Highest Mark</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={highestGrade}
                  onChange={(e) => setHighestGrade(e.target.value)}
                  className="text-xs h-9 border-line bg-[#f7f9fb]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-navy">Passing Mark</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={passingGrade}
                  onChange={(e) => setPassingGrade(e.target.value)}
                  className="text-xs h-9 border-line bg-[#f7f9fb]"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-navy">Failing Mark</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={failingGrade}
                  onChange={(e) => setFailingGrade(e.target.value)}
                  className="text-xs h-9 border-line bg-[#f7f9fb]"
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-line bg-tint/40 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[11px] font-bold text-navy">Special Status Codes</Label>
                  <p className="text-[10px] text-muted-foreground">
                    e.g. 9.0 (DROPPED), 7.1 (LACKING_PAYMENT), PSD (PASSED)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-[10px] font-bold text-navy bg-white border-line"
                  onClick={() => setCodes([...codes, { id: `c-${Date.now()}`, code: "", status: "" }])}
                >
                  <Plus className="size-3 mr-0.5" />
                  Add
                </Button>
              </div>

              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {codes.map((c) => (
                  <div key={c.id} className="flex items-center gap-1.5">
                    <Input
                      placeholder="e.g. 9.0"
                      value={c.code}
                      onChange={(e) =>
                        setCodes(codes.map((item) => (item.id === c.id ? { ...item, code: e.target.value } : item)))
                      }
                      className="h-7 w-20 text-[11px] font-bold border-line bg-white"
                    />
                    <Input
                      placeholder="e.g. DROPPED"
                      value={c.status}
                      onChange={(e) =>
                        setCodes(codes.map((item) => (item.id === c.id ? { ...item, status: e.target.value } : item)))
                      }
                      className="h-7 flex-1 text-[11px] font-semibold border-line bg-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-red-600"
                      onClick={() => setCodes(codes.filter((item) => item.id !== c.id))}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-bold text-navy">Notes / Scale Description (Optional)</Label>
              <Input
                placeholder="e.g. 4.0 = 95-100%, 2.0 = 75-79% passing"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs h-9 border-line bg-[#f7f9fb]"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-10 rounded-lg border-line px-4 text-xs font-semibold text-navy hover:bg-tint"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleProposeNewSchool}
                disabled={!newSchoolName.trim() || saving}
                className="h-10 gap-1.5 rounded-lg bg-navy px-5 text-xs font-semibold text-white shadow-xs hover:bg-navy/90"
              >
                <Plus className="size-4" />
                {saving ? "Saving..." : "Submit Scale"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
