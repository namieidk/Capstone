"use client";

import { useMemo, useState } from "react";
import {
  ACTIVE_SCHOLARS,
  type ActiveScholar,
  AMBER,
  ArrowRightIcon,
  BAD,
  BellIcon,
  BORDER_SUBTLE,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  GOOD,
  GRADE_STATUS_COLORS,
  HEALTH_TAG,
  LINE,
  MailIcon,
  MenuIcon,
  MonitorIcon,
  NAVY,
  PAYMENT_STATUS_COLORS,
  PaymentsIcon,
  s,
  SearchIcon,
  SHADOW_SM,
  TINT,
  TrendDownIcon,
  TrendUpIcon,
  WHITE,
  XCircleIcon,
} from "@/components/Coordinatorshared";
import { useSidebar } from "@/components/SidebarContext";

type DrawerView = "overview" | "history";
type HealthFilter = "all" | ActiveScholar["health"];

export default function MonitorPage() {
  const { toggleMobile } = useSidebar();

  const [selected, setSelected] = useState<ActiveScholar | null>(null);
  const [view, setView] = useState<DrawerView>("overview");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const PAGE_SIZE = 10;

  const query = search.trim().toLowerCase();

  const filteredScholars = useMemo(
    () =>
      ACTIVE_SCHOLARS.filter((sch) => {
        const matchesQuery =
          !query || sch.name.toLowerCase().includes(query) || sch.course.toLowerCase().includes(query);
        const matchesHealth = healthFilter === "all" || sch.health === healthFilter;
        return matchesQuery && matchesHealth;
      }),
    [query, healthFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredScholars.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredScholars.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openScholar(sch: ActiveScholar) {
    setSelected(sch);
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

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .filter-select:focus { outline: none; }

        @keyframes monitorOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes monitorPanelSlideIn {
          from { opacity: 0; transform: translate3d(32px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .monitor-drawer-overlay { animation: monitorOverlayFadeIn 0.2s ease both; }
        .monitor-drawer-panel { animation: monitorPanelSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button type="button" className="vc-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Monitor</h1>
          <p style={s.topbarSub}>Track scholar standing, documents, and disbursement status.</p>
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
          <button type="button" style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={s.pageContentTop}>
          {/* ---------------- Table card, same shell/header/th/td treatment as Applicants ---------------- */}
          <div
            style={{
              background: WHITE,
              border: BORDER_SUBTLE,
              borderRadius: 18,
              boxShadow: SHADOW_SM,
              padding: "22px 22px 8px",
            }}
          >
            <div style={s.tableHeaderRow}>
              <p style={s.tableHeaderCount}>{filteredScholars.length} total scholars</p>
              <div style={s.tableFilterWrap}>
                <select
                  className="filter-select"
                  value={healthFilter}
                  onChange={(e) => {
                    setHealthFilter(e.target.value as HealthFilter);
                    setPage(1);
                  }}
                  style={s.tableFilterSelect}
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  <option value="good">On track</option>
                  <option value="warn">Needs attention</option>
                  <option value="bad">At risk</option>
                </select>
                <span style={s.tableFilterChevron}>
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            <div className="vc-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                    <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "left" }}>Scholar</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>GWA</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Documents</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Disbursement</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Status</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((sch, i) => (
                    <tr
                      key={sch.id}
                      onClick={() => openScholar(sch)}
                      style={{
                        borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`,
                        cursor: "pointer",
                        verticalAlign: "middle",
                      }}
                    >
                      <td style={{ ...s.td, padding: "16px 14px", textAlign: "left" }}>
                        <p style={s.tdName}>{sch.name}</p>
                        <p style={s.tdSub}>{sch.course}</p>
                      </td>
                      <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>
                        <span style={{ ...s.gwaTrendCell, justifyContent: "center" }}>
                          {sch.gwa}%{" "}
                          {sch.trend === "up" ? (
                            <span style={{ color: GOOD }}>
                              <TrendUpIcon />
                            </span>
                          ) : (
                            <span style={{ color: BAD }}>
                              <TrendDownIcon />
                            </span>
                          )}
                        </span>
                      </td>
                      <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{sch.docs}</td>
                      <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{sch.disbursement}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span
                          style={
                            sch.health === "good"
                              ? s.statusPillSolid
                              : sch.health === "warn"
                                ? s.statusPillOutlineWarn
                                : s.statusPillOutlineBad
                          }
                        >
                          {HEALTH_TAG[sch.health].label}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openScholar(sch);
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

            {filteredScholars.length === 0 && (
              <p style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94", fontSize: "0.9rem" }}>
                {query ? `No scholars match "${search}".` : "No active scholars yet."}
              </p>
            )}

            {filteredScholars.length > 0 && (
              <div
                style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: "18px 0" }}
              >
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
            )}
          </div>
        </div>
      </div>

      {selected && (
        // biome-ignore lint/a11y/useSemanticElements: overlay backdrop acts as a dismiss button; div cannot be a real button (contains block content)
        <div
          className="monitor-drawer-overlay"
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
            className="monitor-drawer-panel"
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
                  background:
                    selected.health === "good"
                      ? "rgba(221,238,227,0.9)"
                      : selected.health === "warn"
                        ? "rgba(252,238,196,0.9)"
                        : "rgba(246,228,223,0.9)",
                  color:
                    selected.health === "good" ? GOOD : selected.health === "warn" ? "#8A6410" : BAD,
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
                {HEALTH_TAG[selected.health].label}
              </span>
            </div>

            <div style={s.drawerBody}>
              {view === "overview" ? (
                <>
                  {/* ---------------- Stat cards ---------------- */}
                  <div style={s.drawerStatGrid}>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        {selected.trend === "up" ? (
                          <span style={{ color: GOOD, display: "flex" }}>
                            <TrendUpIcon />
                          </span>
                        ) : (
                          <span style={{ color: BAD, display: "flex" }}>
                            <TrendDownIcon />
                          </span>
                        )}
                      </div>
                      <p style={s.drawerStatLabel}>Current GWA</p>
                      <p style={s.drawerStatValue}>{selected.gwa}%</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <CheckCircleIcon small />
                      </div>
                      <p style={s.drawerStatLabel}>Documents</p>
                      <p style={s.drawerStatValue}>{selected.docs}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <PaymentsIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Disbursement</p>
                      <p style={{ ...s.drawerStatValue, fontSize: "0.88rem" }}>{selected.disbursement}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <MonitorIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Trend</p>
                      <p style={{ ...s.drawerStatValue, fontSize: "0.88rem" }}>
                        {selected.trend === "up" ? "Improving" : "Declining"}
                      </p>
                    </div>
                  </div>

                  {/* ---------------- Payment card ---------------- */}
                  <p style={s.drawerSectionLabel}>This semester&apos;s payment</p>
                  <div style={s.drawerPayCardNew}>
                    <div>
                      <p style={s.drawerPayCardTerm}>{selected.currentPayment.term}</p>
                      <p style={s.drawerPayCardAmount}>₱{selected.currentPayment.amount.toLocaleString()}</p>
                    </div>
                    <span
                      style={{
                        ...s.stageTag,
                        background: "rgba(255,255,255,0.18)",
                        color: WHITE,
                        flexShrink: 0,
                      }}
                    >
                      {selected.currentPayment.status}
                    </span>
                  </div>

                  <div style={s.drawerHistoryBtnRow}>
                    <button type="button" onClick={() => setView("history")} style={s.drawerHistoryBtn}>
                      <ClockIcon /> View full history <ArrowRightIcon />
                    </button>
                  </div>

                  {/* ---------------- Status note ---------------- */}
                  <p style={s.drawerSectionLabel}>Status</p>
                  <div style={s.appNoteCard}>
                    <span style={s.appNoteIcon}>
                      <MonitorIcon />
                    </span>
                    <p style={s.appNoteText}>
                      {selected.health === "good" &&
                        "This scholar is meeting all retention requirements. No action needed."}
                      {selected.health === "warn" && "Missing a required document. A reminder message is recommended."}
                      {selected.health === "bad" &&
                        "GWA trending down and documents incomplete. Disbursement is on hold pending review."}
                    </p>
                  </div>

                  <div style={s.drawerStageActions}>
                    <button type="button" style={s.continueBtnSmall}>
                      <MailIcon small /> Message scholar
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