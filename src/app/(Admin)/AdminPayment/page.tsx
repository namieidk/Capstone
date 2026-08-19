"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  DrawerInfoRow,
  ADMIN_PAYMENT_RECORDS,
  PAYMENT_STATUS_COLORS,
  AdminPaymentRecord,
  NAVY,
  WHITE,
  LINE,
  TINT,
  SHADOW_SM,
  BORDER_SUBTLE,
  s,
} from "@/components/Adminshared";

const PAYMENT_FILTERS: (AdminPaymentRecord["status"] | "All")[] = ["All", "Paid", "Scheduled", "On hold"];

export default function AdminPaymentsPage() {
  const [records, setRecords] = useState<AdminPaymentRecord[]>(ADMIN_PAYMENT_RECORDS);
  const [selected, setSelected] = useState<AdminPaymentRecord | null>(null);
  const [filter, setFilter] = useState<AdminPaymentRecord["status"] | "All">("All");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalDisbursed = records.filter((r) => r.status === "Paid").reduce((sum, r) => sum + r.amount, 0);
  const scheduledCount = records.filter((r) => r.status === "Scheduled").length;
  const onHoldCount = records.filter((r) => r.status === "On hold").length;

  const setStatus = (id: number, status: AdminPaymentRecord["status"]) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, status } : sel));
  };

  const filtered = filter === "All" ? records : records.filter((r) => r.status === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (f: AdminPaymentRecord["status"] | "All") => {
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
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 4px 60px" }}>
      <style>{`
        .filter-pill { transition: border-color 0.15s ease, background 0.15s ease; }
        .filter-pill:hover { border-color: rgba(30, 58, 95, 0.35); }
        .filter-select:focus { outline: none; }
        .filter-select option { color: ${NAVY}; background: ${WHITE}; }
      `}</style>

      {/* ---------------- Filter dropdown, above cards ---------------- */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 28 }}>
        <PillFilter>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as AdminPaymentRecord["status"] | "All")}
            style={{ ...pillSelectStyle, minWidth: 180, width: 180 }}
          >
            {PAYMENT_FILTERS.map((f) => (
              <option key={f} value={f}>{`${f} (${counts[f]})`}</option>
            ))}
          </select>
        </PillFilter>
      </div>

      {/* ---------------- Summary cards ---------------- */}
      <div
        className="va-stat-row"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 28 }}
      >
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM }}>
          <p style={{ fontSize: "0.84rem", color: "#7a7a74", marginBottom: 12, fontWeight: 500 }}>Disbursed this term</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "2.15rem", fontWeight: 700, color: NAVY, lineHeight: 1 }}>
            ₱{totalDisbursed.toLocaleString()}
          </p>
        </div>
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM }}>
          <p style={{ fontSize: "0.84rem", color: "#7a7a74", marginBottom: 12, fontWeight: 500 }}>Scheduled</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "2.15rem", fontWeight: 700, color: NAVY, lineHeight: 1 }}>{scheduledCount}</p>
        </div>
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM }}>
          <p style={{ fontSize: "0.84rem", color: "#7a7a74", marginBottom: 12, fontWeight: 500 }}>On hold</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "2.15rem", fontWeight: 700, color: NAVY, lineHeight: 1 }}>{onHoldCount}</p>
        </div>
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, padding: "26px 28px", boxShadow: SHADOW_SM }}>
          <p style={{ fontSize: "0.84rem", color: "#7a7a74", marginBottom: 12, fontWeight: 500 }}>Next batch date</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>Jul 15, 2026</p>
        </div>
      </div>

      {/* ---------------- Table card, same shell/header/th/td treatment as Archive ---------------- */}
      <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "22px 22px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <p style={{ fontSize: "1.15rem", fontWeight: 700, color: NAVY, fontFamily: "'Fraunces', serif" }}>Payment records</p>
          <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>
            {filtered.length === 0
              ? "0 shown"
              : `${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
        </div>

        <div className="va-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "center" }}>Scholar</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Coordinator</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Amount</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Term</th>
                <th style={{ ...s.th, background: "none", textAlign: "center" }}>Scheduled date</th>
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
                  <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{r.coordinator}</td>
                  <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>₱{r.amount.toLocaleString()}</td>
                  <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{r.term}</td>
                  <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{r.scheduledDate}</td>
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

      {/* ---------------- Drawer, same treatment as Archive ---------------- */}
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
              <DrawerInfoRow label="Coordinator" value={selected.coordinator} />
              <DrawerInfoRow label="Amount" value={`₱${selected.amount.toLocaleString()}`} />
              <DrawerInfoRow label="Term" value={selected.term} />
              <DrawerInfoRow label="Scheduled date" value={selected.scheduledDate} />
            </div>

            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Actions</p>
            <div style={{ ...s.drawerStageActions, marginTop: 4 }}>
              {selected.status !== "Paid" && (
                <button onClick={() => setStatus(selected.id, "Paid")} style={s.continueBtnSmall}>
                  Mark as paid
                </button>
              )}
              {selected.status !== "On hold" && (
                <button onClick={() => setStatus(selected.id, "On hold")} style={s.rejectBtn}>
                  Put on hold
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Pill filter (rounded navy dropdown, matches Archive) ---------------- */

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