"use client";

import { ChevronLeft, ChevronRight, Eye, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { ACTIVE_SCHOLARS, type ActiveScholar, HEALTH_TAG } from "@/components/Coordinatorshared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ActiveScholarsTableProps {
  onSelectScholar: (scholar: ActiveScholar) => void;
}

export function ActiveScholarsTable({ onSelectScholar }: ActiveScholarsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const query = search.trim().toLowerCase();

  const filteredScholars = useMemo(
    () =>
      query
        ? ACTIVE_SCHOLARS.filter(
            (sch) => sch.name.toLowerCase().includes(query) || sch.course.toLowerCase().includes(query),
          )
        : ACTIVE_SCHOLARS,
    [query],
  );

  const totalPages = Math.max(1, Math.ceil(filteredScholars.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredScholars.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search scholar name or course..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8 text-xs h-8"
          />
        </div>
      </div>

      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent text-xs text-muted-foreground">
                <TableHead className="py-3 px-4">Scholar</TableHead>
                <TableHead className="py-3 px-3 text-center">GWA</TableHead>
                <TableHead className="py-3 px-3 text-center">Documents</TableHead>
                <TableHead className="py-3 px-3 text-center">Disbursement</TableHead>
                <TableHead className="py-3 px-3 text-center">Status</TableHead>
                <TableHead className="py-3 px-4 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                    {query ? `No scholars match "${search}".` : "No active scholars found."}
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((sch) => (
                  <TableRow
                    key={sch.id}
                    onClick={() => onSelectScholar(sch)}
                    className="cursor-pointer text-xs hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="py-3 px-4">
                      <div className="font-semibold text-foreground text-xs">{sch.name}</div>
                      <div className="text-[11px] text-muted-foreground">{sch.course}</div>
                    </TableCell>

                    <TableCell className="py-3 px-3 text-center font-medium">
                      <span className="inline-flex items-center gap-1">
                        {sch.gwa}%
                        {sch.trend === "up" ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </span>
                    </TableCell>

                    <TableCell className="py-3 px-3 text-center text-muted-foreground">{sch.docs}</TableCell>

                    <TableCell className="py-3 px-3 text-center text-muted-foreground">{sch.disbursement}</TableCell>

                    <TableCell className="py-3 px-3 text-center">
                      <Badge
                        variant="secondary"
                        className="text-[11px] py-0.5 gap-1 font-semibold"
                        style={{
                          backgroundColor: HEALTH_TAG[sch.health].bg,
                          color: HEALTH_TAG[sch.health].text,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: HEALTH_TAG[sch.health].text }}
                        />
                        {HEALTH_TAG[sch.health].label}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectScholar(sch);
                        }}
                        className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredScholars.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
              <span>
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, filteredScholars.length)} of {filteredScholars.length} scholars
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                  <Button
                    key={num}
                    variant={num === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(num)}
                    className="h-7 w-7 p-0 text-xs"
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
