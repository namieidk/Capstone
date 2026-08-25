"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  XCircleIcon,
  CheckCircleIcon,
  DrawerInfoRow,
  PAYMENT_RECORDS,
  PAYMENT_STATUS_COLORS,
  PaymentRecord,
  NAVY,
  WHITE,
  LINE,
  TINT,
  SHADOW_SM,
  BORDER_SUBTLE,
  s,
  MenuIcon,
} from "@/components/Coordinatorshared";
import { useSidebar } from "@/components/SidebarContext";

const PAYMENT_FILTERS: (PaymentRecord["status"] | "All")[] = ["All", "Paid", "Scheduled", "On hold"];

// Approx height (px) of a single table row, used to work out how many rows
// fit on screen so the table adapts to the device instead of overflowing.
const ROW_HEIGHT = 58;
// Reserved space below the table card's top edge for its own header row,
// the pagination row, and page padding.
const RESERVED_HEIGHT = 210;
const MIN_ROWS = 3;

export default function PaymentPage() {
  const { toggleMobile } = useSidebar();

  const [records, setRecords] = useState<PaymentRecord[]>(PAYMENT_RECORDS);
  const [selected, setSelected] = useState<PaymentRecord | null>(null);
  const [filter, setFilter] = useState<PaymentRecord["status"] | "All">("All");
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

  const totalDisbursed = records.filter((r) => r.status === "Paid").reduce((sum, r) => sum + r.amount, 0);
  const scheduledCount = records.filter((r) => r.status === "Scheduled").length;
  const onHoldCount = records.filter((r) => r.status === "On hold").length;

  const markPaid = (id: number) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Paid" } : r)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, status: "Paid" } : sel));
  };

  const filtered = filter === "All" ? records : records.filter((r) => r.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (f: PaymentRecord["status"] | "All") => {
    setFilter(f);
    setPage(1);
  };

  const counts: Record<string, number> = {
    All: records.length,
    Paid: records.filter((r) => r.status === "Paid").length,
    Scheduled: records.filter((r) => r.status === "Scheduled").length,
    "On hold": records.filter((r) => r.status === "On hold").length,
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .filter-pill { transition: border-color 0.15s ease, background 0.15s ease; }
        .filter-pill:hover { border-color: rgba(30, 58, 95, 0.35); }
        .filter-select:focus { outline: none; }
        .filter-select option { color: ${NAVY}; background: ${WHITE}; }
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
        <button className="vc-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Payments</h1>
          <p style={s.topbarSub}>Track disbursements, schedules, and payment status.</p>
        </div>
        <div style={{ ...s.topbarRight, marginLeft: "auto" }}>
          <PillFilter>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value as PaymentRecord["status"] | "All")}
              style={{ ...pillSelectStyle, minWidth: 180, width: 180 }}
            >
              {PAYMENT_FILTERS.map((f) => (
                <option key={f} value={f}>{`${f} (${counts[f]})`}</option>
              ))}
            </select>
          </PillFilter>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 4px 40px" }}>
          {/* ---------------- Summary cards ---------------- */}
          <div
            className="vc-stat-row payment-stat-row"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 28 }}
          >
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 500 }}>Disbursed this term</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.9rem", fontWeight: 700, color: NAVY, lineHeight: 1, textAlign: "right", whiteSpace: "nowrap" }}>
                ₱{totalDisbursed.toLocaleString()}
              </p>
            </div>
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 500 }}>Scheduled</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.9rem", fontWeight: 700, color: NAVY, lineHeight: 1, textAlign: "right" }}>{scheduledCount}</p>
            </div>
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 500 }}>On hold</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.9rem", fontWeight: 700, color: NAVY, lineHeight: 1, textAlign: "right" }}>{onHoldCount}</p>
            </div>
            <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 500 }}>Next disbursement</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: NAVY, lineHeight: 1.2, textAlign: "right", whiteSpace: "nowrap" }}>Jul 15, 2026</p>
            </div>
          </div>

          {/* ---------------- Table card ---------------- */}
          <div ref={tableCardRef} style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "16px 22px 8px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>
                {filtered.length === 0
                  ? "0 shown"
                  : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}`}
              </span>
            </div>

            <div className="vc-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
              <table className="payment-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                    <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "center" }}>Scholar</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Amount</th>
                    <th className="payment-col-term" style={{ ...s.th, background: "none", textAlign: "center" }}>Term</th>
                    <th className="payment-col-date" style={{ ...s.th, background: "none", textAlign: "center" }}>Scheduled date</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>Status</th>
                    <th style={{ ...s.th, background: "none", textAlign: "center" }}>View</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      style={{ borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`, cursor: "pointer", verticalAlign: "middle" }}
                    >
                      <td style={{ ...s.td, padding: "16px 14px", textAlign: "center" }}>
                        <p style={s.tdName}>{r.name}</p>
                        <p style={s.tdSub}>{r.course}</p>
                      </td>
                      <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>₱{r.amount.toLocaleString()}</td>
                      <td className="payment-col-term" style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{r.term}</td>
                      <td className="payment-col-date" style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{r.scheduledDate}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span
                          style={{
                            ...s.stageTag,
                            background: PAYMENT_STATUS_COLORS[r.status].bg,
                            color: PAYMENT_STATUS_COLORS[r.status].text,
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
                              background: PAYMENT_STATUS_COLORS[r.status].text,
                              flexShrink: 0,
                            }}
                          />
                          {r.status}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(r); }}
                          aria-label="View payment"
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
                No payments match this filter.
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
      </div>

      {/* ---------------- Drawer ---------------- */}
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
              <DrawerInfoRow label="Amount" value={`₱${selected.amount.toLocaleString()}`} />
              <DrawerInfoRow label="Term" value={selected.term} />
              <DrawerInfoRow label="Scheduled date" value={selected.scheduledDate} />
              <DrawerInfoRow label="Status" value={selected.status} />
            </div>

            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Payment history</p>
            <div style={{ ...s.drawerDocList, marginBottom: 26 }}>
              <div style={s.drawerDocRow}>
                <span>
                  <CheckCircleIcon small />
                </span>
                <span style={s.drawerDocText}>Q2 2026 — ₱8,000 paid Apr 15, 2026</span>
              </div>
              <div style={s.drawerDocRow}>
                <span>
                  <CheckCircleIcon small />
                </span>
                <span style={s.drawerDocText}>Q1 2026 — ₱8,000 paid Jan 15, 2026</span>
              </div>
            </div>

            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Actions</p>
            <div style={{ ...s.drawerStageActions, marginTop: 4 }}>
              {selected.status !== "Paid" && (
                <button onClick={() => markPaid(selected.id)} style={s.continueBtnSmall}>
                  Mark as paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Pill filter (rounded navy dropdown, matches Admin) ---------------- */

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