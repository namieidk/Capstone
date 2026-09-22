"use client";

import { CheckCircle2, ChevronLeft, ChevronRight, CreditCard, Eye, FileCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DisbursementItem } from "@/lib/api/disbursements";

interface CoordinatorDisbursementsTableProps {
  items: DisbursementItem[];
  loading: boolean;
  onRecordCheck: (disbursement: DisbursementItem) => void;
  onVerifyOR: (disbursement: DisbursementItem) => void;
  searchQuery?: string;
  filter?: string;
}

const PAGE_SIZE = 8;

export function CoordinatorDisbursementsTable({
  items,
  loading,
  onRecordCheck,
  onVerifyOR,
  searchQuery = "",
  filter = "ALL",
}: CoordinatorDisbursementsTableProps) {
  const [page, setPage] = useState(1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(val || 0);
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const name = `${item.scholar_profile?.first_name || ""} ${item.scholar_profile?.last_name || ""}`.toLowerCase();
      const school = (item.scholar_profile?.school_name || "").toLowerCase();
      const check = (item.check_number || "").toLowerCase();
      const orNum = (item.or_number || "").toLowerCase();

      const matchesSearch = !q || name.includes(q) || school.includes(q) || check.includes(q) || orNum.includes(q);

      if (filter === "ALL") return matchesSearch;
      if (filter === "READY_FOR_CHECK") {
        return matchesSearch && (item.status === "AUTHORIZED" || item.status === "RELEASED");
      }
      return matchesSearch && item.status === filter;
    });
  }, [items, searchQuery, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
        <CardContent className="p-0">
          <Table className="text-xs">
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-b border-line hover:bg-transparent">
                <TableHead className="py-3 pl-6 font-bold text-slate-600">Scholar & University Payee</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Term</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Tuition Balance</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Check Number</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Official Receipt (OR)</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Status</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                ["csk-1", "csk-2", "csk-3", "csk-4", "csk-5"].map((skId) => (
                  <TableRow key={skId} className="border-b border-line/60">
                    <TableCell className="py-3 pl-6">
                      <Skeleton className="h-4 w-36 mb-1.5" />
                      <Skeleton className="h-3 w-28" />
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Skeleton className="h-5 w-24 mx-auto rounded-full" />
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Skeleton className="h-7 w-20 mx-auto rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No disbursement transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => {
                  const scholarName = `${item.scholar_profile?.first_name || ""} ${item.scholar_profile?.last_name || ""}`;
                  return (
                    <TableRow key={item.disbursement_id} className="border-b border-line/60 hover:bg-[#faf8f5]">
                      <TableCell className="py-3 pl-6">
                        <p className="font-bold text-navy">{scholarName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Payee:{" "}
                          <span className="font-semibold text-slate-700">
                            {item.check_payee || item.scholar_profile?.school_name}
                          </span>
                        </p>
                      </TableCell>

                      <TableCell className="py-3 text-center font-semibold text-slate-700">
                        {item.academic_year} {item.semester}
                      </TableCell>

                      <TableCell className="py-3 text-center font-black text-[#0a4f42] tabular-nums">
                        {formatCurrency(Number(item.amount))}
                      </TableCell>

                      <TableCell className="py-3 text-center font-mono">
                        {item.check_number ? (
                          <div>
                            <span className="font-bold text-navy">#{item.check_number}</span>
                            {item.bank_name && <p className="text-[10px] text-slate-500">{item.bank_name}</p>}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Not Issued</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        {item.or_number ? (
                          <div>
                            <span className="font-mono font-bold text-navy">OR #{item.or_number}</span>
                            {item.or_payment_date && (
                              <p className="text-[10px] text-slate-500">
                                {new Date(item.or_payment_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Pending Remittance</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        {item.status === "PENDING" && (
                          <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-semibold">
                            Awaiting Grantor
                          </Badge>
                        )}
                        {(item.status === "AUTHORIZED" || item.status === "RELEASED") && (
                          <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-[10px] font-semibold">
                            Ready for Check
                          </Badge>
                        )}
                        {item.status === "CHECK_ISSUED" && (
                          <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-semibold">
                            Check Issued (Awaiting OR)
                          </Badge>
                        )}
                        {item.status === "OR_SUBMITTED" && (
                          <Badge className="bg-[#0a4f42]/10 text-[#0a4f42] border-[#0a4f42]/20 text-[10px] font-semibold">
                            OR Audit Queue
                          </Badge>
                        )}
                        {item.status === "SETTLED" && (
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-semibold">
                            Settled
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {(item.status === "AUTHORIZED" || item.status === "RELEASED") && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => onRecordCheck(item)}
                              className="h-7.5 rounded-lg bg-[#0a4f42] hover:bg-[#083c32] text-white text-[11px] font-bold px-3 gap-1 shadow-xs"
                            >
                              <CreditCard className="size-3" />
                              <span>Issue Check</span>
                            </Button>
                          )}
                          {item.status === "OR_SUBMITTED" && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => onVerifyOR(item)}
                              className="h-7.5 rounded-lg bg-[#0a4f42] hover:bg-[#083c32] text-white text-[11px] font-bold px-3 gap-1 shadow-xs"
                            >
                              <FileCheck className="size-3" />
                              <span>Verify OR</span>
                            </Button>
                          )}
                          {item.status === "CHECK_ISSUED" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => onRecordCheck(item)}
                              className="h-7 text-[11px] rounded-lg border-line bg-white hover:bg-tint text-slate-700 font-semibold gap-1"
                            >
                              <Eye className="size-3" />
                              <span>Edit Check</span>
                            </Button>
                          )}
                          {item.status === "SETTLED" && (
                            <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-bold">
                              <CheckCircle2 className="size-4" />
                              <span>Settled</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-line text-xs text-muted-foreground bg-[#fdfcfb]">
              <p>
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} disbursements
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="size-7 rounded-lg"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="text-xs font-semibold text-slate-700 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="size-7 rounded-lg"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}