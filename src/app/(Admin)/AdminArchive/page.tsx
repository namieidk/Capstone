"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  ArchiveIcon,
  DownloadIcon,
  DrawerInfoRow,
  ARCHIVED_SCHOLARS,
  ARCHIVE_STATUS_STYLE,
  ArchivedScholar,
  NAVY,
  WHITE,
  LINE,
  TINT,
  GRAY,
  AMBER,
  BORDER_SUBTLE,
  SHADOW_SM,
  MenuIcon,
  BellIcon,
  SearchIcon,
  s,
} from "@/components/Adminshared";
import { useSidebar } from "@/components/SidebarContext";

const ARCHIVE_FILTERS: (ArchivedScholar["status"] | "All")[] = ["All", "Graduated", "Terminated", "Withdrawn"];

export default function AdminArchivePage() {
  const { toggleMobile } = useSidebar();
  const [filter, setFilter] = useState<ArchivedScholar["status"] | "All">("All");
  const [selected, setSelected] = useState<ArchivedScholar | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = ARCHIVED_SCHOLARS.filter((a) => {
    const matchesStatus = filter === "All" || a.status === filter;
    const matchesSearch = searchQuery.trim() === "" || a.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (f: ArchivedScholar["status"] | "All") => {
    setFilter(f);
    setPage(1);
  };

  const counts: Record<string, number> = {
    All: ARCHIVED_SCHOLARS.length,
    Graduated: ARCHIVED_SCHOLARS.filter((a) => a.status === "Graduated").length,
    Terminated: ARCHIVED_SCHOLARS.filter((a) => a.status === "Terminated").length,
    Withdrawn: ARCHIVED_SCHOLARS.filter((a) => a.status === "Withdrawn").length,
  };

  return (
    <div>
      <style>{`
        .filter-pill { transition: border-color 0.15s ease, background 0.15s ease; }
        .filter-pill:hover { border-color: rgba(30, 58, 95, 0.35); }
        .filter-select:focus { outline: none; }
        .filter-select option { color: ${NAVY}; background: ${WHITE}; }
      `}</style>

      {/* ---------------- Page-level navbar (search + filter pill) ---------------- */}
      <header style={s.topbar}>
        <button className="va-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Archive</h1>
          <p style={s.topbarSub}>Scholars who are no longer active, across all coordinators.</p>
        </div>
        <div style={{ ...s.topbarRight, gap: 10 }}>
          <PillFilter>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value as ArchivedScholar["status"] | "All")}
              style={{ ...pillSelectStyle, minWidth: 180, width: 180 }}
            >
              {ARCHIVE_FILTERS.map((f) => (
                <option key={f} value={f}>{`${f} (${counts[f]})`}</option>
              ))}
            </select>
          </PillFilter>
          <div className="va-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search scholars..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              style={s.searchInput}
            />
          </div>
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding }}>
        {/* ---------------- Table card, same shell/header/th/td treatment as Monitor ---------------- */}
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "22px 22px 8px", marginTop: 20 }}>
          

          <div className="va-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                  <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "center" }}>Scholar</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Track</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Coordinator</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Exited</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Status</th>
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
                      <p style={s.tdSub}>{a.course}</p>
                    </td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{a.track}</td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{a.coordinator}</td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{a.exited}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span
                        style={{
                          ...s.stageTag,
                          background: ARCHIVE_STATUS_STYLE[a.status].bg,
                          color: ARCHIVE_STATUS_STYLE[a.status].text,
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
                            background: ARCHIVE_STATUS_STYLE[a.status].text,
                            flexShrink: 0,
                          }}
                        />
                        {a.status}
                      </span>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(a); }}
                        aria-label="View scholar"
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
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94", fontSize: "0.9rem" }}>
              No scholars match this filter.
            </p>
          )}

          {filtered.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: "18px 0" }}>
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

      {selected && (
        <div style={s.drawerOverlay} onClick={() => setSelected(null)}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.drawerHeader, marginBottom: 22 }}>
              <span style={s.profileAvatar}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.course}</p>
              </div>
              <button onClick={() => setSelected(null)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>
            <div style={{ ...s.drawerInfoGrid, marginBottom: 22, rowGap: 20 }}>
              <DrawerInfoRow label="Track" value={selected.track} />
              <DrawerInfoRow label="Status" value={selected.status} />
              <DrawerInfoRow label="Coordinator" value={selected.coordinator} />
              <DrawerInfoRow label="Exited" value={selected.exited} />
            </div>
            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Exit note</p>
            <div style={{ ...s.appNoteCard, marginBottom: 18, boxShadow: "none" }}>
              <span style={s.appNoteIcon}>
                <ArchiveIcon />
              </span>
              <p style={s.appNoteText}>{selected.note}</p>
            </div>
            <div style={{ ...s.drawerStageActions, marginTop: 4 }}>
              <button
                style={{
                  ...s.continueBtnSmall,
                  width: "100%",
                  justifyContent: "center",
                  padding: "15px 20px",
                  fontSize: "0.94rem",
                  gap: 10,
                }}
              >
                <DownloadIcon /> Download scholar record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Pill filter (rounded navy dropdown, matches Admin Monitor / Employee) ---------------- */

const pillSelectStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "8px 28px 8px 14px",
  fontSize: "0.8rem",
  color: WHITE,
  width: 180,
  minWidth: 180,
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
        background: "#1E3A5F",
        border: "1.5px solid #1E3A5F",
        borderRadius: 999,
        boxShadow: SHADOW_SM,
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