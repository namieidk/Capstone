"use client";

import { ChevronLeft, ChevronRight, Eye, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DisbursementItem } from "@/lib/api/disbursements";

interface GrantorDisbursementHistoryTableProps {
  items: DisbursementItem[];
  loading: boolean;
  onViewVoucher: (voucherNumber: string) => void;
}

const PAGE_SIZE = 8;

export function GrantorDisbursementHistoryTable({
  items,
  loading,
  onViewVoucher,
}: GrantorDisbursementHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const name = `${item.scholar_profile?.first_name || ""} ${item.scholar_profile?.last_name || ""}`.toLowerCase();
      const school = (item.scholar_profile?.school_name || "").toLowerCase();
      const voucher = (item.voucher_number || "").toLowerCase();
      const check = (item.check_number || "").toLowerCase();
      const orNum = (item.or_number || "").toLowerCase();

      const matchesSearch =
        !q || name.includes(q) || school.includes(q) || voucher.includes(q) || check.includes(q) || orNum.includes(q);

      if (statusFilter === "ALL") return matchesSearch;
      return matchesSearch && item.status === statusFilter;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search scholar, school, voucher, or check #..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 w-full rounded-xl border-line bg-white pl-9 pr-8 text-xs placeholder:text-muted-foreground"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Select
          value={statusFilter}
          onValueChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-9 w-48 rounded-xl border-line bg-white text-xs font-semibold">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Records ({items.length})</SelectItem>
            <SelectItem value="PENDING">Pending Authorization</SelectItem>
            <SelectItem value="AUTHORIZED">Authorized Vouchers</SelectItem>
            <SelectItem value="CHECK_ISSUED">Check Issued</SelectItem>
            <SelectItem value="OR_SUBMITTED">OR Submitted</SelectItem>
            <SelectItem value="SETTLED">Settled & Reconciled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-[18px]! border-line bg-white shadow-va-sm">
        <CardContent className="p-0">
          <Table className="text-xs">
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-b border-line hover:bg-transparent">
                <TableHead className="py-3 pl-6 font-bold text-slate-600">Scholar & Institution</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Academic Term</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Disbursement Amount</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Voucher / Check</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Official Receipt (OR)</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Status</TableHead>
                <TableHead className="py-3 text-center font-bold text-slate-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((skId) => (
                  <TableRow key={skId} className="border-b border-line/60">
                    <TableCell className="py-3 pl-6">
                      <Skeleton className="h-4 w-36 mb-1.5" />
                      <Skeleton className="h-3 w-28" />
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Skeleton className="h-4 w-24 mx-auto" />
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
                      <Skeleton className="h-7 w-16 mx-auto rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No disbursement records found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => {
                  const scholarName = `${item.scholar_profile?.first_name || ""} ${item.scholar_profile?.last_name || ""}`;
                  return (
                    <TableRow key={item.disbursement_id} className="border-b border-line/60 hover:bg-[#faf8f5]">
                      <TableCell className="py-3 pl-6">
                        <p className="font-bold text-navy">{scholarName}</p>
                        <p className="text-[11px] text-muted-foreground">{item.scholar_profile?.school_name}</p>
                      </TableCell>

                      <TableCell className="py-3 text-center font-semibold text-slate-700">
                        AY {item.academic_year} • {item.semester}
                      </TableCell>

                      <TableCell className="py-3 text-center font-black text-[#0a4f42] tabular-nums">
                        {formatCurrency(Number(item.amount))}
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        {item.voucher_number ? (
                          <span className="font-mono text-xs text-navy font-bold">{item.voucher_number}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                        {item.check_number && (
                          <p className="text-[10px] text-slate-500 font-mono">Check #{item.check_number}</p>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        {item.or_number ? (
                          <div>
                            <span className="font-mono text-xs font-semibold text-slate-800">#{item.or_number}</span>
                            {item.or_payment_date && (
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(item.or_payment_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">Awaiting OR</span>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        {item.status === "PENDING" && (
                          <Badge className="bg-amber-50 text-amber-900 border-amber-300 text-[10px] font-semibold">
                            Pending Auth
                          </Badge>
                        )}
                        {(item.status === "AUTHORIZED" || item.status === "RELEASED") && (
                          <Badge className="bg-teal-50 text-teal-800 border-teal-200 text-[10px] font-semibold">
                            Authorized
                          </Badge>
                        )}
                        {item.status === "CHECK_ISSUED" && (
                          <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-semibold">
                            Check Issued
                          </Badge>
                        )}
                        {item.status === "OR_SUBMITTED" && (
                          <Badge className="bg-[#0a4f42]/10 text-[#0a4f42] border-[#0a4f42]/20 text-[10px] font-semibold">
                            OR Submitted
                          </Badge>
                        )}
                        {item.status === "SETTLED" && (
                          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-semibold">
                            Settled
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center">
                        {item.voucher_number ? (
                          <div className="flex items-center justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (item.voucher_number) onViewVoucher(item.voucher_number);
                              }}
                              className="h-7 text-[11px] rounded-lg border-line bg-white hover:bg-tint text-[#0a4f42] font-semibold gap-1 shadow-2xs"
                            >
                              <Eye className="size-3" />
                              <span>Voucher</span>
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
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
                {filtered.length} records
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
