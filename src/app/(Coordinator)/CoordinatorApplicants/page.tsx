"use client";

import { useEffect, useMemo, useState } from "react";
import { APPLICANTS, type Applicant, type Stage } from "@/components/Coordinatorshared";
import { ApplicantDialog } from "./components/ApplicantDialog";
import { ApplicantsHeader } from "./components/ApplicantsHeader";
import { ApplicantsTable } from "./components/ApplicantsTable";
import { matchesQuery, type StageFilter } from "./components/applicant-helpers";

const PAGE_SIZE = 8;

export default function ApplicantsPage() {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [applicants, setApplicants] = useState<Applicant[]>(APPLICANTS);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      if (stageFilter !== "all" && a.stage !== stageFilter) return false;
      return matchesQuery(a, query);
    });
  }, [applicants, query, stageFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const hasActiveFilters = query.trim() !== "" || stageFilter !== "all";

  function resetFilters() {
    setQuery("");
    setStageFilter("all");
    setPage(1);
  }

  function moveStage(id: number, stage: Stage) {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, stage } : a)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, stage } : sel));
  }

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <ApplicantsHeader
        searchQuery={query}
        onSearchChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
      />
      <div className="px-5 pb-24 md:px-10">
        <div className="mt-4 flex h-10 items-center gap-2 rounded-full border border-line bg-tint px-3.5 md:hidden">
          <input
            type="text"
            placeholder="Search name, track, stage..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-[0.82rem] outline-none placeholder:text-[#9a9a94]"
            aria-label="Search applicants"
          />
        </div>
        <ApplicantsTable
          applicants={paginated}
          totalFiltered={filtered.length}
          loading={loading}
          stageFilter={stageFilter}
          onStageChange={(v) => {
            setStageFilter(v);
            setPage(1);
          }}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={resetFilters}
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          onSelect={setSelected}
        />
      </div>
      <ApplicantDialog applicant={selected} onClose={() => setSelected(null)} onMoveStage={moveStage} />
    </div>
  );
}
