/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  XCircleIcon,
  CheckCircleIcon,
  DownloadIcon,
  ArrowRightIcon,
  DrawerInfoRow,
  APPLICANTS,
  STAGE_COLORS,
  Applicant,
  Stage,
  NAVY,
  WHITE,
  LINE,
  TINT,
  BORDER_SUBTLE,
  SHADOW_SM,
  s,
  MenuIcon,
  SearchIcon,
  BellIcon,
  AMBER,
} from "@/components/Coordinatorshared";
import { useSidebar } from "@/components/SidebarContext";

const STAGE_FILTERS: (Stage | "All")[] = ["All", "Submitted", "Under review", "Interview", "Accepted", "Rejected"];

const ROW_HEIGHT = 57; // approx rendered height of a table row (16px+16px padding + text)
const MIN_PAGE_SIZE = 3;

export default function ApplicantsPage() {
  const { toggleMobile } = useSidebar();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Stage | "All">("All");
  const [applicants, setApplicants] = useState<Applicant[]>(APPLICANTS);
  const [selected, setSelected] = useState<Applicant | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const tableWrapRef = useRef<HTMLDivElement>(null);

  // Recalculate how many rows fit in the available table area, no scrolling needed
  useLayoutEffect(() => {
    function recalcPageSize() {
      const el = tableWrapRef.current;
      if (!el) return;
      const available = el.clientHeight;
      const rows = Math.max(MIN_PAGE_SIZE, Math.floor(available / ROW_HEIGHT));
      setPageSize(rows);
    }

    recalcPageSize();

    const observer = new ResizeObserver(() => recalcPageSize());
    if (tableWrapRef.current) observer.observe(tableWrapRef.current);
    window.addEventListener("resize", recalcPageSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalcPageSize);
    };
  }, []);

  const query = search.trim().toLowerCase();

  const stageFiltered = filter === "All" ? applicants : applicants.filter((a) => a.stage === filter);

  const filtered = query
    ? stageFiltered.filter((a) =>
        a.name.toLowerCase().includes(query) ||
        a.course.toLowerCase().includes(query) ||
        a.track.toLowerCase().includes(query) ||
        a.stage.toLowerCase().includes(query) ||
        a.year.toLowerCase().includes(query) ||
        a.applied.toLowerCase().includes(query) ||
        String(a.gwa).includes(query)
      )
    : stageFiltered;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (f: Stage | "All") => {
    setFilter(f);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const counts: Record<string, number> = {
    All: applicants.length,
    Submitted: applicants.filter((a) => a.stage === "Submitted").length,
    "Under review": applicants.filter((a) => a.stage === "Under review").length,
    Interview: applicants.filter((a) => a.stage === "Interview").length,
    Accepted: applicants.filter((a) => a.stage === "Accepted").length,
    Rejected: applicants.filter((a) => a.stage === "Rejected").length,
  };

  const moveStage = (id: number, stage: Stage) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, stage } : a)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, stage } : sel));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <style>{`
        .filter-pill { transition: border-color 0.15s ease, background 0.15s ease; }
        .filter-pill:hover { border-color: rgba(30, 58, 95, 0.35); }
        .filter-select:focus { outline: none; }
        .filter-select option { color: ${NAVY}; background: ${WHITE}; }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button className="vc-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Applicants</h1>
          <p style={s.topbarSub}>Everyone who has applied to ViaScholar.</p>
        </div>
        <div style={s.topbarRight}>
          <PillFilter>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value as Stage | "All")}
              style={{ ...pillSelectStyle, minWidth: 170, width: 170 }}
            >
              {STAGE_FILTERS.map((f) => (
                <option key={f} value={f}>{`${f} (${counts[f]})`}</option>
              ))}
            </select>
          </PillFilter>
          <div className="vc-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              placeholder="Search name, track, stage..."
              style={s.searchInput}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      {/* ---------------- Content area fills remaining viewport height, no page scroll ---------------- */}
      <div
        style={{
          ...s.mainContent,
          padding: s.mainContent.padding,
          flexGrow: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: WHITE,
            border: BORDER_SUBTLE,
            borderRadius: 18,
            boxShadow: SHADOW_SM,
            padding: "22px 22px 8px",
            marginTop: 16,
            flexGrow: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 6, flexShrink: 0 }}>
            <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>
              {filtered.length === 0
                ? "0 shown"
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}`}
            </span>
          </div>

          {/* Measured area — determines how many rows fit without scrolling */}
          <div ref={tableWrapRef} style={{ flexGrow: 1, minHeight: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                  <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "center" }}>Applicant</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Track</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>GWA</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Applied</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Stage</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>View</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((a, i) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    style={{ borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`, cursor: "pointer", verticalAlign: "middle" }}
                  >
                    <td style={{ ...s.td, padding: "16px 14px", textAlign: "center" }}>
                      <p style={s.tdName}>{a.name}</p>
                      <p style={s.tdSub}>
                        {a.course} · {a.year}
                      </p>
                    </td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{a.track}</td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{a.gwa}%</td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{a.applied}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span
                        style={{
                          ...s.stageTag,
                          background: STAGE_COLORS[a.stage].bg,
                          color: STAGE_COLORS[a.stage].text,
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: STAGE_COLORS[a.stage].text,
                            flexShrink: 0,
                          }}
                        />
                        {a.stage}
                      </span>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(a); }}
                        aria-label="View applicant"
                        style={{
                          width: 34, height: 34, borderRadius: "50%", border: `1.5px solid ${LINE}`,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          background: WHITE, color: "#7a7a74", cursor: "pointer",
                        }}
                      >
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <p style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94", fontSize: "0.9rem" }}>
                No applicants match this search or filter.
              </p>
            )}
          </div>

          {filtered.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: "18px 0", flexShrink: 0 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, background: WHITE,
                  color: currentPage === 1 ? "#c7c7c2" : "#55554f", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: currentPage === 1 ? "default" : "pointer",
                }}
                aria-label="Previous page"
              >
                <ChevronLeftIcon />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: `1px solid ${num === currentPage ? NAVY : LINE}`,
                    background: num === currentPage ? NAVY : WHITE, color: num === currentPage ? WHITE : "#55554f",
                    fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: `1px solid ${LINE}`, background: WHITE,
                  color: currentPage === totalPages ? "#c7c7c2" : "#55554f", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: currentPage === totalPages ? "default" : "pointer",
                }}
                aria-label="Next page"
              >
                <ChevronRightIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      {selected && <ApplicantDrawer applicant={selected} onClose={() => setSelected(null)} onMoveStage={moveStage} />}
    </div>
  );
}

interface ApplicantDrawerProps {
  applicant: Applicant;
  onClose: () => void;
  onMoveStage: (id: number, stage: Stage) => void;
}

function ApplicantDrawer({ applicant, onClose, onMoveStage }: ApplicantDrawerProps) {
  return (
    <div style={s.drawerOverlay} onClick={onClose}>
      <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
        <div style={s.drawerHeader}>
          <span style={s.profileAvatar}>{applicant.initials}</span>
          <div style={{ flexGrow: 1 }}>
            <h3 style={s.drawerName}>{applicant.name}</h3>
            <p style={s.drawerMeta}>
              {applicant.course} · {applicant.year}
            </p>
          </div>
          <button onClick={onClose} style={s.drawerCloseBtn}>
            <XCircleIcon />
          </button>
        </div>

        <div style={s.drawerInfoGrid}>
          <DrawerInfoRow label="Track" value={applicant.track} />
          <DrawerInfoRow label="GWA" value={`${applicant.gwa}%`} />
          <DrawerInfoRow label="Applied" value={applicant.applied} />
          <DrawerInfoRow label="Current stage" value={applicant.stage} />
        </div>

        <p style={s.drawerSectionLabel}>Documents on file</p>
        <div style={s.drawerDocList}>
          {["Grades / TOR", "Proof of employment", "Report card / Form 138"].map((d) => (
            <div key={d} style={s.drawerDocRow}>
              <span>
                <CheckCircleIcon small />
              </span>
              <span style={s.drawerDocText}>{d}</span>
              <button style={s.profileDocDownload}>
                <DownloadIcon />
              </button>
            </div>
          ))}
        </div>

        <p style={s.drawerSectionLabel}>Move to stage</p>
        <div style={s.drawerStageActions}>
          {applicant.stage !== "Interview" && applicant.stage !== "Accepted" && (
            <button onClick={() => onMoveStage(applicant.id, "Interview")} style={s.continueBtnSmall}>
              Pass to Interview <ArrowRightIcon />
            </button>
          )}
          {applicant.stage === "Interview" && (
            <button onClick={() => onMoveStage(applicant.id, "Accepted")} style={s.continueBtnSmall}>
              Accept applicant <ArrowRightIcon />
            </button>
          )}
          {applicant.stage !== "Rejected" && applicant.stage !== "Accepted" && (
            <button onClick={() => onMoveStage(applicant.id, "Rejected")} style={s.rejectBtn}>
              Reject application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Pill filter (rounded navy dropdown, matches Admin Archive) ---------------- */

const pillSelectStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "8px 28px 8px 14px",
  fontSize: "0.8rem",
  color: WHITE,
  width: 170,
  minWidth: 170,
  height: 38,
  background: "transparent",
  outline: "none",
  fontFamily: "'Inter', sans-serif",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
  fontWeight: 500,
  textAlign: "center",
  textAlignLast: "center",
};

function ChevronIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PillFilter({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="filter-pill"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        background: NAVY,
        border: `1.5px solid ${NAVY}`,
        borderRadius: 999,
        boxShadow: SHADOW_SM,
        flexShrink: 0,
      }}
    >
      {children}
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <ChevronIcon />
      </span>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}