"use client";

import { AlertTriangle, Banknote, BookOpen, Calendar, CheckCircle2, Clock, Eye, FileCheck, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { TermEnrollment } from "@/lib/api/enrollment";

interface EnrollmentAuditsTabProps {
  items: TermEnrollment[];
  loading: boolean;
  onSelectAudit: (enrollmentId: number) => void;
}

export function EnrollmentAuditsTab({ items, loading, onSelectAudit }: EnrollmentAuditsTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const name = `${item.scholar_profile?.first_name || ""} ${item.scholar_profile?.last_name || ""}`.toLowerCase();
      const school = (item.scholar_profile?.school_name || "").toLowerCase();
      const studentNum = (item.scholar_profile?.student_number || "").toLowerCase();
      const q = search.toLowerCase();

      const matchesSearch = !search || name.includes(q) || school.includes(q) || studentNum.includes(q);

      if (filter === "PENDING") return matchesSearch && item.status === "PENDING_REVIEW";
      if (filter === "CHANGES_REQUESTED") return matchesSearch && item.status === "CHANGES_REQUESTED";
      if (filter === "APPROVED") return matchesSearch && item.status === "APPROVED";
      return matchesSearch;
    });
  }, [items, search, filter]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(val || 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </Badge>
        );
      case "CHANGES_REQUESTED":
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-[11px] gap-1 font-medium">
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            Changes Requested
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] gap-1 font-medium animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Audit
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by scholar, ID, or school..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0a4f42] bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL", label: `All (${items.length})` },
            { id: "PENDING", label: `Pending (${items.filter((i) => i.status === "PENDING_REVIEW").length})` },
            {
              id: "CHANGES_REQUESTED",
              label: `Changes (${items.filter((i) => i.status === "CHANGES_REQUESTED").length})`,
            },
            { id: "APPROVED", label: `Approved (${items.filter((i) => i.status === "APPROVED").length})` },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setFilter(pill.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === pill.id ? "bg-[#0a4f42] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50/50">
          <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No Start-of-Term Audits Found</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Scholars' start-of-term enrollment submissions will appear here for 60-second review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const hasFlags = item.audit_flags && item.audit_flags.length > 0;
            return (
              <div
                key={item.enrollment_id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-teal-500/40 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.scholar_profile?.first_name} {item.scholar_profile?.last_name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        ID: {item.scholar_profile?.student_number || "—"} • {item.scholar_profile?.school_name}
                      </p>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Term:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {item.academic_year} • {item.semester}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Units:
                      </span>
                      <span className="font-bold text-slate-800">{Number(item.total_units).toFixed(1)} Units</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" /> Tuition Due:
                      </span>
                      <span className="font-black text-[#0a4f42]">{formatCurrency(Number(item.total_assessment))}</span>
                    </div>
                  </div>

                  {hasFlags && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.audit_flags?.length} advisory flag(s) detected</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectAudit(item.enrollment_id)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0a4f42] bg-teal-50 hover:bg-teal-100/70 border border-teal-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Quick-Audit Drawer</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
