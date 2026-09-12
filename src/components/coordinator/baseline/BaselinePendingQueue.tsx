"use client";

import { Clock, Eye, FileUp, GraduationCap, History, Lock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PendingBaselineItem } from "@/lib/api/baseline";

interface BaselinePendingQueueProps {
  items: PendingBaselineItem[];
  loading: boolean;
  onSelectScholar: (scholarProfileId: number) => void;
}

type FilterStatus = "ALL" | "PENDING_COORDINATOR_REVIEW" | "PENDING_PROSPECTUS" | "BASELINE_FROZEN";

export function BaselinePendingQueue({ items, loading, onSelectScholar }: BaselinePendingQueueProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const filteredItems = useMemo(() => {
    let result = items;

    if (filter !== "ALL") {
      result = result.filter((item) => item.academic_baseline_status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          `${item.first_name} ${item.last_name}`.toLowerCase().includes(q) ||
          item.student_number?.toLowerCase().includes(q) ||
          item.course_of_study?.toLowerCase().includes(q) ||
          item.school_name?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [items, search, filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BASELINE_FROZEN":
        return (
          <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 gap-1 text-[11px] font-semibold py-0.5">
            <Lock className="w-3 h-3" /> Frozen & Verified
          </Badge>
        );
      case "PENDING_COORDINATOR_REVIEW":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[11px] font-semibold py-0.5">
            <Clock className="w-3 h-3" /> Ready for Audit
          </Badge>
        );
      case "PENDING_HISTORICAL_CCG":
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1 text-[11px] font-semibold py-0.5">
            <History className="w-3 h-3" /> Awaiting CCG
          </Badge>
        );
      case "PENDING_PROSPECTUS":
        return (
          <Badge className="bg-muted text-muted-foreground border-border gap-1 text-[11px] font-medium py-0.5">
            <FileUp className="w-3 h-3" /> Awaiting Prospectus
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px] font-medium py-0.5">
            {status}
          </Badge>
        );
    }
  };

  const pendingCount = items.filter((i) => i.academic_baseline_status === "PENDING_COORDINATOR_REVIEW").length;

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ALL")}
            className="text-xs h-8"
          >
            All Scholars ({items.length})
          </Button>
          <Button
            variant={filter === "PENDING_COORDINATOR_REVIEW" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("PENDING_COORDINATOR_REVIEW")}
            className="text-xs h-8 gap-1.5"
          >
            Pending Audit
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button
            variant={filter === "PENDING_PROSPECTUS" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("PENDING_PROSPECTUS")}
            className="text-xs h-8"
          >
            Draft Ingestion
          </Button>
          <Button
            variant={filter === "BASELINE_FROZEN" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("BASELINE_FROZEN")}
            className="text-xs h-8"
          >
            Locked Baselines
          </Button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search scholar, course, school..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-8"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent text-xs text-muted-foreground">
                <TableHead className="py-3 px-4">Scholar Name</TableHead>
                <TableHead className="py-3 px-3">Institution</TableHead>
                <TableHead className="py-3 px-3">Degree Course</TableHead>
                <TableHead className="py-3 px-2 text-center">Curriculum Units</TableHead>
                <TableHead className="py-3 px-3 text-center">Status</TableHead>
                <TableHead className="py-3 px-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4].map((num) => (
                  <TableRow key={`baseline-pending-skeleton-${num}`}>
                    <TableCell colSpan={6} className="h-14 text-center">
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    {search ? `No scholars match "${search}".` : "No pending academic baseline records found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const fullName = `${item.first_name} ${item.last_name}`;
                  const initials = `${item.first_name[0] || ""}${item.last_name[0] || ""}`.toUpperCase();
                  const totalUnits = item.prospectus?.total_units || 0;

                  return (
                    <TableRow key={item.profile_id} className="text-xs hover:bg-muted/40 transition-colors">
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-xs flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-xs">{fullName}</div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {item.student_number || item.user?.email || "No ID"}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-foreground font-medium truncate max-w-[180px]">
                          <GraduationCap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{item.school_name || "Unassigned"}</span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3 px-3 text-muted-foreground">
                        <div className="truncate max-w-[200px]" title={item.course_of_study || ""}>
                          {item.course_of_study || "—"}
                        </div>
                        {item.current_year_level && (
                          <div className="text-[10px] text-muted-foreground">Year Level {item.current_year_level}</div>
                        )}
                      </TableCell>

                      <TableCell className="py-3 px-2 text-center font-medium text-foreground">
                        {totalUnits > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-muted font-semibold text-[11px]">
                            {totalUnits} units
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 px-3 text-center">
                        {getStatusBadge(item.academic_baseline_status)}
                      </TableCell>

                      <TableCell className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectScholar(item.profile_id)}
                          className="h-7 text-xs gap-1.5 shadow-xs hover:border-primary/50"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          Audit Baseline
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
