"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AMBER,
  AMBER_BG,
  ArrowRightIcon,
  BAD,
  BellIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ClockIcon,
  FUNDED_SCHOLARS,
  GOOD,
  LINE,
  MailIcon,
  MenuIcon,
  NAVY,
  PAYMENT_REQUESTS,
  PAYMENT_STATUS_COLORS,
  type PaymentRecord,
  type PaymentRequest,
  PaymentsIcon,
  SearchIcon,
  s,
  TINT,
  WHITE,
  XCircleIcon,
} from "@/components/Grantorshared";
import { useSidebar } from "@/components/SidebarContext";

/* ------------------------------------------------------------------ */
/* Local tokens (same values as the Coordinator Payment page)          */
/* ------------------------------------------------------------------ */

const BORDER_SUBTLE = "1px solid rgba(30, 58, 95, 0.10)";
const SHADOW_SM = "0 4px 18px rgba(30, 58, 95, 0.09)";

// Small initials avatar shown next to the scholar name in table rows.
const AVATAR_STYLE = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: AMBER_BG,
  color: "#6b5220",
  fontWeight: 700,
  fontSize: "0.78rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
} as const;

type RequestStatus = PaymentRequest["status"];
type PaymentFilter = RequestStatus | "All";
type DrawerView = "overview" | "history";

type HistoryEntry = {
  term: string;
  amount: number;
  date: string;
  status: RequestStatus | PaymentRecord["status"];
};

const PAYMENT_FILTERS: PaymentFilter[] = ["All", "Approved", "Pending approval", "On hold"];

// Approx height (px) of a single table row, used to work out how many rows
// fit on screen so the table adapts to the device instead of overflowing.
const ROW_HEIGHT = 72;
// Reserved space below the table card's top edge for its own header row
// (count + filter), the column headings, the pagination row, and page padding.
const RESERVED_HEIGHT = 250;
const MIN_ROWS = 3;

// Status pill inside the drawer hero (same look as the Monitor drawer).
const HERO_PILL: Record<RequestStatus, { bg: string; color: string }> = {
  Approved: { bg: "rgba(221,238,227,0.9)", color: GOOD },
  "Pending approval": { bg: "rgba(252,238,196,0.9)", color: "#8A6410" },
  "On hold": { bg: "rgba(246,228,223,0.9)", color: BAD },
};

function statusNote(r: PaymentRequest): string {
  if (r.status === "Approved")
    return "This disbursement is approved. The coordinator will release the payment on the scheduled date.";
  if (r.status === "Pending approval")
    return "Waiting for your approval. Approve it so the coordinator can release this payment.";
  return "This disbursement is on hold. Approve it once the scholar's requirements are complete.";
}

// Past payments come from the funded scholar's record (matched by name).
function pastPayments(r: PaymentRequest): PaymentRecord[] {
  return FUNDED_SCHOLARS.find((f) => f.name === r.name)?.paymentHistory ?? [];
}

// Current request on top, then the older payments.
function buildHistory(r: PaymentRequest): HistoryEntry[] {
  return [{ term: r.term, amount: r.amount, date: r.requestedDate, status: r.status }, ...pastPayments(r)];
}

export default function GrantorPaymentsPage() {
  const { toggleMobile } = useSidebar();

  const [records, setRecords] = useState<PaymentRequest[]>(PAYMENT_REQUESTS);
  const [selected, setSelected] = useState<PaymentRequest | null>(null);
  const [view, setView] = useState<DrawerView>("overview");
  const [filter, setFilter] = useState<PaymentFilter>("All");
  const [search, setSearch] = useState("");
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

  const approvedCount = records.filter((r) => r.status === "Approved").length;
  const pendingCount = records.filter((r) => r.status === "Pending approval").length;
  const onHoldCount = records.filter((r) => r.status === "On hold").length;
  const totalApproved = records.filter((r) => r.status === "Approved").reduce((sum, r) => sum + r.amount, 0);
  const nextBatch = records.find((r) => r.status === "Pending approval") ?? records[0];
  const pct = (n: number) => (records.length ? Math.round((n / records.length) * 100) : 0);

  const counts: Record<PaymentFilter, number> = {
    All: records.length,
    Approved: approvedCount,
    "Pending approval": pendingCount,
    "On hold": onHoldCount,
  };

  const filtered = useMemo(
    () =>
      records.filter((r) => {
        const matchesQuery =
          !query || r.name.toLowerCase().includes(query) || r.course.toLowerCase().includes(query);
        const matchesFilter = filter === "All" || r.status === filter;
        return matchesQuery && matchesFilter;
      }),
    [records, query, filter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const setStatus = (id: number, status: RequestStatus) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, status } : sel));
  };

  function openPayment(r: PaymentRequest) {
    setSelected(r);
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

  function handleFilterChange(f: PaymentFilter) {
    setFilter(f);
    setPage(1);
  }

  const history = selected ? buildHistory(selected) : [];
  const paidHistory = selected ? pastPayments(selected).filter((p) => p.status === "Paid") : [];
  const totalReceived = paidHistory.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .filter-select:focus { outline: none; }
        .filter-select option { color: ${NAVY}; background: ${WHITE}; }

        @keyframes paymentOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes paymentPanelSlideIn {
          from { opacity: 0; transform: translate3d(32px, 0, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .payment-drawer-overlay { animation: paymentOverlayFadeIn 0.2s ease both; }
        .payment-drawer-panel { animation: paymentPanelSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @media (max-width: 720px) {
          .payment-stat-row { grid-template-columns: repeat(2, 1fr) !important; }
          .payment-table th, .payment-table td { padding-left: 8px !important; padding-right: 8px !important; font-size: 0.78rem !important; }
          .payment-col-term, .payment-col-date { display: none; }
        }
        @media (max-width: 480px) {
          .payment-stat-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button type="button" className="vg-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Payments</h1>
          <p style={s.topbarSub}>Review and approve scholar disbursements.</p>
        </div>
        <div style={s.topbarRight}>
          <div className="vg-topbar-search" style={s.searchBox}>
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
          {/* ---------------- Summary cards ---------------- */}
          <div
            className="vg-stat-row payment-stat-row"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 26 }}
          >
            <StatCard
              label="Approved this term"
              value={`₱${totalApproved.toLocaleString()}`}
              percent={pct(approvedCount)}
              caption={`${approvedCount} of ${records.length} payments approved`}
            />
            <StatCard
              label="Pending approval"
              value={String(pendingCount)}
              percent={pct(pendingCount)}
              caption={`${pendingCount} of ${records.length} payments waiting`}
            />
            <StatCard
              label="On hold"
              value={String(onHoldCount)}
              percent={pct(onHoldCount)}
              caption={`${onHoldCount} of ${records.length} payments on hold`}
            />
            <StatCard
              label="Next batch date"
              value={nextBatch ? nextBatch.requestedDate : "—"}
              caption={nextBatch ? `${nextBatch.term} batch` : "Nothing scheduled"}
              valueSize="1.5rem"
            />
          </div>

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
              <p style={s.tableHeaderCount}>{filtered.length} total payment requests</p>
              <div style={s.tableFilterWrap}>
                <select
                  className="filter-select"
                  value={filter}
                  onChange={(e) => handleFilterChange(e.target.value as PaymentFilter)}
                  style={s.tableFilterSelect}
                  aria-label="Filter by status"
                >
                  {PAYMENT_FILTERS.map((f) => (
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

            <div className="vg-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
              <table className="payment-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                    <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "left" }}>Scholar</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Amount</th>
                    <th className="payment-col-term" style={{ ...s.th, background: "none", textAlign: "center" }}>
                      Term
                    </th>
                    <th className="payment-col-date" style={{ ...s.th, background: "none", textAlign: "center" }}>
                      Requested date
                    </th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Status</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => openPayment(r)}
                      style={{
                        borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`,
                        cursor: "pointer",
                        verticalAlign: "middle",
                      }}
                    >
                      <td style={{ ...s.td, padding: "16px 14px", textAlign: "left" }}>
                        <div style={s.tdNameRow}>
                          <span style={AVATAR_STYLE}>{r.initials}</span>
                          <div style={{ minWidth: 0 }}>
                            <p style={s.tdName}>{r.name}</p>
                            <p style={s.tdSub}>{r.course}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...s.td, color: NAVY, fontWeight: 700, textAlign: "center", whiteSpace: "nowrap" }}>
                        ₱{r.amount.toLocaleString()}
                      </td>
                      <td className="payment-col-term" style={{ ...s.td, textAlign: "center" }}>
                        <span style={{ ...s.stageTag, background: TINT, color: "#55554f", fontWeight: 600 }}>
                          {r.term}
                        </span>
                      </td>
                      <td className="payment-col-date" style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>
                        {r.requestedDate}
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span
                          style={{
                            ...s.stageTag,
                            background: PAYMENT_STATUS_COLORS[r.status].bg,
                            color: PAYMENT_STATUS_COLORS[r.status].text,
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
                              background: PAYMENT_STATUS_COLORS[r.status].text,
                              flexShrink: 0,
                            }}
                          />
                          {r.status}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPayment(r);
                          }}
                          aria-label="View payment"
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
                {query ? `No payment requests match "${search}".` : "No payment requests match this filter."}
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
                      key={num}
                      type="button"
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
          className="payment-drawer-overlay"
          style={s.drawerOverlayBlur}
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
            className="payment-drawer-panel"
            style={s.drawerPanelFlush}
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
                        <PaymentsIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Amount</p>
                      <p style={s.drawerStatValue}>₱{selected.amount.toLocaleString()}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <CalendarIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Requested date</p>
                      <p style={{ ...s.drawerStatValue, fontSize: "0.88rem" }}>{selected.requestedDate}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <CheckCircleIcon small />
                      </div>
                      <p style={s.drawerStatLabel}>Payments made</p>
                      <p style={s.drawerStatValue}>{paidHistory.length}</p>
                    </div>
                    <div style={s.drawerStatCard}>
                      <div style={s.drawerStatIconBox}>
                        <PaymentsIcon />
                      </div>
                      <p style={s.drawerStatLabel}>Total received</p>
                      <p style={{ ...s.drawerStatValue, fontSize: "0.88rem" }}>₱{totalReceived.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* ---------------- Payment card ---------------- */}
                  <p style={s.drawerSectionLabel}>This term&apos;s request</p>
                  <div style={s.drawerPayCardNew}>
                    <div>
                      <p style={s.drawerPayCardTerm}>{selected.term}</p>
                      <p style={s.drawerPayCardAmount}>₱{selected.amount.toLocaleString()}</p>
                    </div>
                    <span
                      style={{
                        ...s.stageTag,
                        background: "rgba(255,255,255,0.18)",
                        color: WHITE,
                        flexShrink: 0,
                      }}
                    >
                      {selected.status}
                    </span>
                  </div>

                  <div style={s.drawerHistoryBtnRow}>
                    <button type="button" onClick={() => setView("history")} style={s.drawerHistoryBtn}>
                      <ClockIcon /> View full history <ArrowRightIcon />
                    </button>
                  </div>

                  {/* ---------------- Status note ---------------- */}
                  <p style={s.drawerSectionLabel}>Status</p>
                  <div style={s.appNoteCardAmber}>
                    <span style={s.appNoteIcon}>
                      <PaymentsIcon />
                    </span>
                    <p style={s.appNoteText}>{statusNote(selected)}</p>
                  </div>

                  <div style={s.drawerStageActions}>
                    {selected.status !== "Approved" && (
                      <button
                        type="button"
                        onClick={() => setStatus(selected.id, "Approved")}
                        style={s.continueBtnSmall}
                      >
                        <CheckCircleIcon small /> Approve disbursement
                      </button>
                    )}
                    {selected.status !== "On hold" && (
                      <button type="button" onClick={() => setStatus(selected.id, "On hold")} style={s.rejectBtn}>
                        Put on hold
                      </button>
                    )}
                    <button
                      type="button"
                      style={{
                        ...s.backBtn,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        padding: "10px 18px",
                        fontSize: "0.88rem",
                      }}
                    >
                      <MailIcon small /> Message coordinator
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setView("overview")} style={s.backToOverviewBtn}>
                    ← Back to overview
                  </button>

                  <div style={s.historySection}>
                    <p style={s.drawerSectionLabel}>Payment history</p>
                    <div>
                      {history.map((p, idx) => (
                        <div key={`${p.term}-${p.date}-${p.amount}`} style={s.historyRowNew}>
                          <div style={s.historyDotCol}>
                            <span
                              style={{
                                ...s.historyDot,
                                background: PAYMENT_STATUS_COLORS[p.status].text,
                              }}
                            />
                            {idx !== history.length - 1 && <span style={s.historyLine} />}
                          </div>
                          <div style={s.historyContentCard}>
                            <div style={s.historyRowFlat}>
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

/* ---------------- Summary card (all four use this same design) ---------------- */

function StatCard({
  label,
  value,
  caption,
  percent,
  valueSize,
}: {
  label: string;
  value: string;
  caption: string;
  percent?: number;
  valueSize?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        padding: "22px 24px",
        background: "linear-gradient(135deg,#0a4f42 0%,#0d6f5c 100%)",
        color: WHITE,
        boxShadow: SHADOW_SM,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 18,
        minWidth: 0,
      }}
    >
      {/* soft decorative circles */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -34,
          right: -34,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -46,
          right: 26,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <div style={{ position: "relative" }}>
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
            marginBottom: 10,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: valueSize ?? "1.9rem",
            fontWeight: 700,
            color: WHITE,
            lineHeight: 1,
            whiteSpace: "nowrap",
            minHeight: "1.9rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {value}
        </p>
      </div>

      <div style={{ position: "relative" }}>
        {percent === undefined ? (
          <div style={{ height: 6, display: "flex", alignItems: "center" }}>
            <div style={{ height: 1, width: "100%", background: "rgba(255,255,255,0.2)" }} />
          </div>
        ) : (
          <div style={{ height: 6, borderRadius: 999, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
            <div
              style={{
                width: `${percent}%`,
                height: "100%",
                borderRadius: 999,
                background: AMBER,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.78)", marginTop: 8 }}>{caption}</p>
      </div>
    </div>
  );
}

/* ---------------- Icons ---------------- */

function CalendarIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}