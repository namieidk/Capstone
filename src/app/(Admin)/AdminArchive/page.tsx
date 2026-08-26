"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, ChevronLeft, ChevronRight, ListFilter, Check } from "lucide-react";
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
  SHADOW_MD,
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
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selected, setSelected] = useState<ArchivedScholar | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = filterRef.current && filterRef.current.contains(target);
      const insideMenu = filterMenuRef.current && filterMenuRef.current.contains(target);
      if (!insideTrigger && !insideMenu) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterToggle = () => {
    if (!filterOpen && filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    }
    setFilterOpen((o) => !o);
  };

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
    setFilterOpen(false);
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
        .filter-trigger { transition: background-color 0.15s ease, transform 0.1s ease; }
        .filter-trigger:hover { filter: brightness(0.9); }
        .filter-option { transition: background-color 0.12s ease; }
        .filter-option:hover { background-color: ${TINT}; }
        .filter-trigger-wrap { position: relative; }
        .filter-tooltip {
          position: absolute;
          bottom: -26px;
          left: 50%;
          transform: translateX(-50%) translateY(-4px);
          background: transparent;
          color: #F1B71E;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease, transform 0.15s ease;
          z-index: 1001;
        }
        .filter-trigger-wrap:hover .filter-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

      {/* ---------------- Page-level navbar (search only — filter lives in the page body) ---------------- */}
      <header style={s.topbar}>
        <button className="va-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Archive</h1>
          <p style={s.topbarSub}>Scholars who are no longer active, across all coordinators.</p>
        </div>
        <div style={{ ...s.topbarRight, gap: 10 }}>
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
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "10px 22px 8px", marginTop: 20 }}>
          {/* Status filter now lives inside the "View" column header, directly above the eye icons.
              Every header gets the same-height slot above its label (spacer or button) so all six stay aligned.
              gap bumped 10 -> 16 and header padding loosened so the icon row doesn't feel cramped against the label. */}

          <div className="va-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Scholar
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Track
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Coordinator
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Exited
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Status
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center", position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <div style={{ position: "relative" }} ref={filterRef}>
                        <div className="filter-trigger-wrap">
                          <button
                            ref={filterBtnRef}
                            onClick={handleFilterToggle}
                            aria-label="Filter by status"
                            aria-expanded={filterOpen}
                            className="filter-trigger"
                            style={{
                              position: "relative",
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: AMBER,
                              filter: filterOpen ? "brightness(0.9)" : "none",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: SHADOW_SM,
                              flexShrink: 0,
                              cursor: "pointer",
                            }}
                          >
                            <ListFilter size={15} color={NAVY} />
                            {filter !== "All" && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: -2,
                                  right: -2,
                                  width: 9,
                                  height: 9,
                                  borderRadius: "50%",
                                  background: NAVY,
                                  border: `2px solid ${WHITE}`,
                                }}
                              />
                            )}
                          </button>
                          <span className="filter-tooltip">Filter</span>
                        </div>

                        {filterOpen &&
                          typeof document !== "undefined" &&
                          createPortal(
                            <div
                              ref={filterMenuRef}
                              role="listbox"
                              style={{
                                position: "fixed",
                                top: menuPos.top,
                                left: menuPos.left,
                                transform: "translateX(-50%)",
                                width: 200,
                                background: WHITE,
                                borderRadius: 14,
                                border: BORDER_SUBTLE,
                                boxShadow: SHADOW_MD,
                                padding: 6,
                                zIndex: 1000,
                                textAlign: "left",
                              }}
                            >
                              {ARCHIVE_FILTERS.map((f) => {
                                const isActive = filter === f;
                                return (
                                  <button
                                    key={f}
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => handleFilterChange(f)}
                                    className="filter-option"
                                    style={{
                                      width: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: 10,
                                      padding: "10px 12px",
                                      borderRadius: 9,
                                      background: isActive ? TINT : "transparent",
                                      fontSize: "0.86rem",
                                      fontWeight: isActive ? 700 : 500,
                                      color: isActive ? NAVY : "#4a4a45",
                                      textAlign: "left",
                                      cursor: "pointer",
                                      textTransform: "none",
                                      letterSpacing: "normal",
                                    }}
                                  >
                                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      {f}
                                      <span style={{ fontSize: "0.76rem", fontWeight: 500, color: "#9a9a94" }}>({counts[f]})</span>
                                    </span>
                                    {isActive && <Check size={14} color={NAVY} strokeWidth={2.5} />}
                                  </button>
                                );
                              })}
                            </div>,
                            document.body
                          )}
                      </div>
                      View
                    </div>
                  </th>
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
                        <Eye size={15} />
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
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: `1px solid ${num === currentPage ? AMBER : LINE}`,
                    background: num === currentPage ? AMBER : WHITE, color: num === currentPage ? NAVY : "#55554f",
                    fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
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
                <ChevronRight size={14} />
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

/* ---------------- (icon-only status filter dropdown lives inline in the component above) ---------------- */