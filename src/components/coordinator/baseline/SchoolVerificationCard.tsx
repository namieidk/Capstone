"use client";

import { Building2, CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listSchoolGradings, type SchoolGradingSystem, verifySchoolGrading } from "@/lib/api/baseline";

interface SchoolVerificationCardProps {
  onScaleUpdated?: () => void;
}

export function SchoolVerificationCard({ onScaleUpdated }: SchoolVerificationCardProps) {
  const [schools, setSchools] = useState<SchoolGradingSystem[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const fetchSchools = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listSchoolGradings();
      setSchools(res || []);
    } catch (err) {
      console.error("Failed to load school gradings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleVerify = async (schoolId: number) => {
    try {
      setVerifyingId(schoolId);
      await verifySchoolGrading(schoolId);
      await fetchSchools();
      onScaleUpdated?.();
    } catch (err) {
      console.error("Failed to verify school grading:", err);
    } finally {
      setVerifyingId(null);
    }
  };

  const pendingSchools = schools.filter((s) => !s.is_verified);

  return (
    <Card className="border-border bg-card shadow-xs overflow-hidden">
      <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <CardTitle className="text-xs font-semibold text-foreground">
            University & College Grading Scale Configurations
          </CardTitle>
        </div>
        {pendingSchools.length > 0 && (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] py-0.5">
            {pendingSchools.length} Pending Verification
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent text-xs text-muted-foreground">
              <TableHead className="py-2.5 px-4">Institution Name</TableHead>
              <TableHead className="py-2.5 px-3">Scale Format</TableHead>
              <TableHead className="py-2.5 px-2 text-center">Max Grade</TableHead>
              <TableHead className="py-2.5 px-2 text-center">Passing</TableHead>
              <TableHead className="py-2.5 px-2 text-center">Failing</TableHead>
              <TableHead className="py-2.5 px-3 text-center">Status</TableHead>
              <TableHead className="py-2.5 px-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map((num) => (
                <TableRow key={`school-skeleton-${num}`}>
                  <TableCell colSpan={7} className="h-10 text-center">
                    <div className="h-3.5 bg-muted rounded w-3/4 mx-auto animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-20 text-center text-muted-foreground text-xs">
                  No institution grading systems configured.
                </TableCell>
              </TableRow>
            ) : (
              schools.map((s) => (
                <TableRow key={s.school_id} className="text-xs hover:bg-muted/30">
                  <TableCell className="py-2.5 px-4 font-medium text-foreground">
                    <p className="font-bold text-navy">{s.school_name}</p>
                    {s.special_codes && Object.keys(s.special_codes).length > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {Object.keys(s.special_codes).length} special code
                        {Object.keys(s.special_codes).length === 1 ? "" : "s"} (
                        {Object.keys(s.special_codes).slice(0, 3).join(", ")}
                        {Object.keys(s.special_codes).length > 3 ? "..." : ""})
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="py-2.5 px-3 text-muted-foreground">
                    <Badge variant="outline" className="text-[11px] font-semibold border-line bg-white text-navy">
                      {s.grading_scale === "NUMERIC_4_POINT"
                        ? "4.0 Scale (UM)"
                        : s.grading_scale === "NUMERIC_5_POINT"
                          ? "5.0 Scale (USEP/UP)"
                          : s.grading_scale === "PERCENTAGE_100"
                            ? "100% (SHS/DepEd)"
                            : s.grading_scale}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-2.5 px-2 text-center font-semibold text-foreground">
                    {Number(s.highest_grade).toFixed(2)}
                  </TableCell>

                  <TableCell className="py-2.5 px-2 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                    {Number(s.passing_grade).toFixed(2)}
                  </TableCell>

                  <TableCell className="py-2.5 px-2 text-center font-semibold text-destructive">
                    {Number(s.failing_grade).toFixed(2)}
                  </TableCell>

                  <TableCell className="py-2.5 px-3 text-center">
                    {s.is_verified ? (
                      <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20 text-[10px] py-0 gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 text-[10px] py-0 gap-1">
                        <HelpCircle className="w-3 h-3" /> Unverified
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="py-2.5 px-4 text-right">
                    {!s.is_verified ? (
                      <Button
                        size="sm"
                        onClick={() => handleVerify(s.school_id)}
                        disabled={verifyingId === s.school_id}
                        className="h-6 text-[11px] px-2.5 bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {verifyingId === s.school_id ? "Verifying..." : "Verify Scale"}
                      </Button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground/60">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
