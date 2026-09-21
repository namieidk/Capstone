"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AMBER,
  ARCHIVE_STATUS_STYLE,
  ARCHIVED_SCHOLARS,
  type ArchivedScholar,
  ArchiveIcon,
  ArrowRightIcon,
  BAD,
  BellIcon,
  BORDER_SUBTLE,
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  DownloadIcon,
  GOOD,
  GRADE_STATUS_COLORS,
  LINE,
  MenuIcon,
  MonitorIcon,
  NAVY,
  PAYMENT_STATUS_COLORS,
  PeopleIcon,
  s,
  SearchIcon,
  SHADOW_SM,
  TINT,
  WHITE,
  XCircleIcon,
} from "@/components/Coordinatorshared";
import { useSidebar } from "@/components/SidebarContext";

type ArchiveStatus = ArchivedScholar["status"];
type ArchiveFilter = ArchiveStatus | "All";
type DrawerView = "overview" | "history";

const ARCHIVE_FILTERS: ArchiveFilter[] = ["All", "Graduated", "Terminated", "Withdrawn"];

// Approx height (px) of a single table row, used to work out how many rows
// fit on screen so the table adapts to the device instead of overflowing.
const ROW_HEIGHT = 72;
// Reserved space below the table card's top edge for its own header row
// (count + filter), the column headings, the pagination row, and page padding.
const RESERVED_HEIGHT = 250;
const MIN_ROWS = 3;

// Status pill inside the drawer hero (same look as the Monitor drawer).
const HERO_PILL: Record<ArchiveStatus, { bg: string; color: string }> = {
  Graduated: { bg: "rgba(221,238,227,0.9)", color: GOOD },
  Terminated: { bg: "rgba(246,228,223,0.9)", color: BAD },
  Withdrawn: { bg: "rgba(252,238,196,0.9)", color: "#8A6410" },
};

export default function ArchivePage() {
  const { toggleMobile } = useSidebar();

  const [filter, setFilter] = useState<ArchiveFilter>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ArchivedScholar | null>(null);
  const [view, setView] = useState<DrawerView>("overview");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const tableCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function recalcPageSize() {
      if (!tableCardRef.current) return;
      const top = tableCardRef.current.getBoundingClientRect().top;
      const available = window.innerHeight - top - RESERVED_HEIGHT;
      const rows = Math.max(MIN_ROWS, Math.floor(available / ROW_HEIGHT));
      setPageSize(rows);
    }
    recalcPageSize();
    window.addEventListener("resize", recalcPageSize);
    return () => window.removeEventListener("resize", recalcPageSize);
  }, []);

  const query = search.trim().toLowerCase();

  const counts: Record<ArchiveFilter, number> = {
    All: ARCHIVED_SCHOLARS.length,
    Graduated: ARCHIVED_SCHOLARS.filter((a) => a.status === "Graduated").length,
    Terminated: ARCHIVED_SCHOLARS.filter((a) => a.status === "Terminated").length,
    Withdrawn: ARCHIVED_SCHOLARS.filter((a) => a.status === "Withdrawn").length,
  };

  const filtered = useMemo(
    () =>
      ARCHIVED_SCHOLARS.filter((a) => {
        const matchesQuery =
          !query ||
          a.name.toLowerCase().includes(query) ||
          a.course.toLowerCase().includes(query) ||
          a.track.toLowerCase().includes(query);
        const matchesFilter = filter === "All" || a.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [query, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function openScholar(a: ArchivedScholar) {
    setSelected(a);
    setView("overview");
  }

  function closeDrawer() {
    setSelected(null);
    setView("overview");
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleFilterChange(f: ArchiveFilter) {
    setFilter(f);
    setPage(1);
  }

  const paidPayments = selected ? selected.paymentHistory.filter((p) => p.status === "Paid") : [];
  const totalDisbursed = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const finalGwa = selected?.gradeHistory[0]?.gwa;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .filter-select:focus { outline: none; }
        .filter-select option { color: ${NAVY}; background: ${WHITE}; }

        @keyframes archiveOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes archivePanelSlideIn {
          from { opacity: 0; transform: translate3d(32px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .archive-drawer-overlay { animation: archiveOverlayFadeIn 0.2s ease both; }
        .archive-drawer-panel { animation: archivePanelSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @media (max-width: 720px) {
          .archive-table th, .archive-table td { padding-left: 8px !important; padding-right: 8px !important; font-size: 0.78rem !important; }
          .archive-col-track, .archive-col-joined { display: none; }
        }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button type="button" className="vc-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Archive</h1>
          <p style={s.topbarSub}>Review scholars who have graduated, withdrawn, or been terminated.</p>
        </div>
        <div style={s.topbarRight}>
          <div className="vc-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              placeholder="Search scholar name or course..."
              style={s.searchInput}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <button type="button" style={s.bellBtn} aria-label="Notifications">
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 4px 40px" }}>
          {/* ---------------- Table card ---------------- */}
          <div
            ref={tableCardRef}
            style={{
              background: WHITE,
              border: BORDER_SUBTLE,
              borderRadius: 18,
              boxShadow: SHADOW_SM,
              padding: "22px 22px 8px",
            }}
          >
            <div style={s.tableHeaderRow}>
              <p style={s.tableHeaderCount}>{filtered.length} total scholars</p>
              <div style={s.tableFilterWrap}>
                <select
                  className="filter-select"
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value as ArchiveFilter)}
                  style={s.tableFilterSelect}
                  aria-label="Filter by status"
                >
                  {ARCHIVE_FILTERS.map((f) => (
                    <option key={f} value={f}>
                      {f === "All" ? `All statuses (${counts[f]})` : `${f} (${counts[f]})`}
                    </option>
                  ))}
                </select>
                <span style={s.tableFilterChevron}>
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            <div className="vc-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
              <table className="archive-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                    <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "left" }}>Scholar</th>
                    <th className="archive-col-track" style={{ ...s.th, background: "none", textAlign: "center" }}>
                      Track
                    </th>
                    <th className="archive-col-joined" style={{ ...s.th, background: "none", textAlign: "center" }}>
                      Joined
                    </th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Exited</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Status</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((a, i) => (
                    <tr
                      key={a.id}
                      onClick={() => openScholar(a)}
                      style={{
                        borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`,
                        cursor: "pointer",
                        verticalAlign: "middle",
                      }}
                    >
                      <td style={{ ...s.td, padding: "16px 14px", textAlign: "left" }}>
                        <div style={s.tdNameRow}>
                          <span style={s.tdAvatar}>{a.initials}</span>
                          <div style={{ minWidth: 0 }}>
                            <p style={s.tdName}>{a.name}</p>
                            <p style={s.tdSub}>{a.course}</p>
                          </div>
                        </div>
                      </td>
                      <td className="archive-col-track" style={{ ...s.td, textAlign: "center" }}>
                        <span style={{ ...s.stageTag, background: TINT, color: "#55554f", fontWeight: 600 }}>
                          {a.track}
                        </span>
                      </td>
                      <td className="archive-col-joined" style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>
                        {a.joined}
                      </td>
                      <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{a.exited}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span
                          style={{
                            ...s.stageTag,
                            background: ARCHIVE_STATUS_STYLE[a.status].bg,
                            color: ARCHIVE_STATUS_STYLE[a.status].text,
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
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openScholar(a);
                          }}
                          aria-label="View scholar"
                          style={s.viewIconBtn}
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
                {query ? `No scholars match "${search}".` : "No scholars match this filter."}
              </p>
            )}

            {filtered.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                  padding: "18px 0",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>
                  {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}`}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: `1px solid ${LINE}`,
                      background: WHITE,
                      color: currentPage === 1 ? "#c7c7c2" : "#55554f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: currentPage === 1 ? "default" : "pointer",
                    }}
                    aria-label="Previous page"
                  >
                    <ChevronLeftIcon />
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setPage(num)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: `1px solid ${num === currentPage ? NAVY : LINE}`,
                        background: num === currentPage ? NAVY : WHITE,
                        color: num === currentPage ? WHITE : "#55554f",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: `1px solid ${LINE}`,
                      background: WHITE,
                      color: currentPage === totalPages ? "#c7c7c2" : "#55554f",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: currentPage === totalPages ? "default" : "pointer",
                    }}
                    aria-label="Next page"
                  >
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- Drawer (same design as Monitor) ---------------- */}
      {selected && (
        // biome-ignore lint/a11y/useSemanticElements: overlay backdrop acts as a dismiss button; div cannot be a real button (contains block content)
        <div
          className="archive-drawer-overlay"
          style={s.drawerOverlay}
          onClick={closeDrawer}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              closeDrawer();
            }
          }}
        >
          <div
            className="archive-drawer-panel"
            style={s.drawerPanel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
              }
            }}
          >
            {/* ---------------- Hero header ---------------- */}
            <div style={s.drawerHero}>
              <div style={s.drawerHeroTopRow}>
                <button type="button" onClick={closeDrawer} style={s.drawerHeroCloseBtn} aria-label="Close">
                  <XCircleIcon />
                </button>
              </div>
              <div style={s.drawerHeroAvatar}>{selected.initials}</div>
              <h3 style={s.drawerHeroName}>{selected.name}</h3>
              <p style={s.drawerHeroMeta}>{selected.course}</p>
              <span
                style={{
                  ...s.drawerHeroStatusPill,
                  background: HERO_PILL[selected.status].bg,
                  color: HERO_PILL[selected.status].color,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "currentColor",
                    flexShrink: 0,
                  }}
                />
                {selected.status}
              </span>
            </div>

            <div style={s.drawerBody}>
              {view === "overview" ? (
                <>
                  {/* ---------------- Stat cards ---------------- */}
                  <div style={s.drawerStatGrid}>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <PeopleIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Track</p>
                      <p style={{ ...s.drawerStatValue, fontSize: "0.88rem" }}>{selected.track}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <MonitorIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Final GWA</p>
                      <p style={s.drawerStatValue}>{finalGwa !== undefined ? `${finalGwa}%` : "—"}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <CalendarIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Joined</p>
                      <p style={{ ...s.drawerStatValue, fontSize: "0.88rem" }}>{selected.joined}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <ArchiveIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Exited</p>
                      <p style={{ ...s.drawerStatValue, fontSize: "0.88rem" }}>{selected.exited}</p>
                    </div>
                  </div>

                  {/* ---------------- Payment card ---------------- */}
                  <p style={s.drawerSectionLabel}>Total disbursed</p>
                  <div style={s.drawerPayCardNew}>
                    <div>
                      <p style={s.drawerPayCardTerm}>All paid scholarship payments</p>
                      <p style={s.drawerPayCardAmount}>₱{totalDisbursed.toLocaleString()}</p>
                    </div>
                    <span
                      style={{
                        ...s.stageTag,
                        background: "rgba(255,255,255,0.18)",
                        color: WHITE,
                        flexShrink: 0,
                      }}
                    >
                      {paidPayments.length} {paidPayments.length === 1 ? "payment" : "payments"}
                    </span>
                  </div>

                  <div style={s.drawerHistoryBtnRow}>
                    <button type="button" onClick={() => setView("history")} style={s.drawerHistoryBtn}>
                      <ClockIcon /> View full history <ArrowRightIcon />
                    </button>
                  </div>

                  {/* ---------------- Exit note ---------------- */}
                  <p style={s.drawerSectionLabel}>Exit note</p>
                  <div style={s.appNoteCard}>
                    <span style={s.appNoteIcon}>
                      <ArchiveIcon />
                    </span>
                    <p style={s.appNoteText}>{selected.note}</p>
                  </div>

                  <div style={s.drawerStageActions}>
                    <button type="button" style={s.continueBtnSmall}>
                      <DownloadIcon /> Download scholar record
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setView("overview")} style={s.backToOverviewBtn}>
                    ← Back to overview
                  </button>

                  <div style={s.historySection}>
                    <p style={s.drawerSectionLabel}>Grade history</p>
                    <div>
                      {selected.gradeHistory.map((g, idx) => (
                        <div key={`${g.term}-${g.gwa}`} style={s.historyRowNew}>
                          <div style={s.historyDotCol}>
                            <span
                              style={{
                                ...s.historyDot,
                                background: GRADE_STATUS_COLORS[g.status].text,
                              }}
                            />
                            {idx !== selected.gradeHistory.length - 1 && <span style={s.historyLine} />}
                          </div>
                          <div style={s.historyContentCard}>
                            <div style={s.historyRow}>
                              <div style={s.historyRowLeft}>
                                <span style={s.historyRowTerm}>{g.term}</span>
                                <span style={s.historyRowSub}>GWA {g.gwa}%</span>
                              </div>
                              <div style={s.historyRowRight}>
                                <span
                                  style={{
                                    ...s.stageTag,
                                    background: GRADE_STATUS_COLORS[g.status].bg,
                                    color: GRADE_STATUS_COLORS[g.status].text,
                                  }}
                                >
                                  {g.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={s.historySection}>
                    <p style={s.drawerSectionLabel}>Payment history</p>
                    <div>
                      {selected.paymentHistory.map((p, idx) => (
                        <div key={`${p.term}-${p.date}-${p.amount}`} style={s.historyRowNew}>
                          <div style={s.historyDotCol}>
                            <span
                              style={{
                                ...s.historyDot,
                                background: PAYMENT_STATUS_COLORS[p.status].text,
                              }}
                            />
                            {idx !== selected.paymentHistory.length - 1 && <span style={s.historyLine} />}
                          </div>
                          <div style={s.historyContentCard}>
                            <div style={s.historyRow}>
                              <div style={s.historyRowLeft}>
                                <span style={s.historyRowTerm}>{p.term}</span>
                                <span style={s.historyRowSub}>{p.date}</span>
                              </div>
                              <div style={s.historyRowRight}>
                                <span style={s.historyRowValue}>₱{p.amount.toLocaleString()}</span>
                                <span
                                  style={{
                                    ...s.stageTag,
                                    background: PAYMENT_STATUS_COLORS[p.status].bg,
                                    color: PAYMENT_STATUS_COLORS[p.status].text,
                                  }}
                                >
                                  {p.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Icons ---------------- */

function EyeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}