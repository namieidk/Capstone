"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  MonitorIcon,
  MailIcon,
  ClockIcon,
  ArrowRightIcon,
  TrendUpIcon,
  TrendDownIcon,
  DrawerInfoRow,
  ACTIVE_SCHOLARS,
  HEALTH_TAG,
  PAYMENT_STATUS_COLORS,
  GRADE_STATUS_COLORS,
  ActiveScholar,
  GOOD,
  BAD,
  NAVY,
  WHITE,
  LINE,
  TINT,
  BORDER_SUBTLE,
  SHADOW_SM,
  s,
} from "@/components/Coordinatorshared";

type DrawerView = "overview" | "history";

export default function MonitorPage() {
  const [selected, setSelected] = useState<ActiveScholar | null>(null);
  const [view, setView] = useState<DrawerView>("overview");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const totalPages = Math.max(1, Math.ceil(ACTIVE_SCHOLARS.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = ACTIVE_SCHOLARS.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openScholar(sch: ActiveScholar) {
    setSelected(sch);
    setView("overview");
  }

  function closeDrawer() {
    setSelected(null);
    setView("overview");
  }

  return (
    <div style={s.pageContentTop}>
      <style>{`
        .filter-select:focus { outline: none; }
      `}</style>

      {/* ---------------- Table card, same shell/header/th/td treatment as Applicants ---------------- */}
      <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "22px 22px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <p style={{ fontSize: "1.15rem", fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif" }}>Active scholars</p>
          <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>
            {ACTIVE_SCHOLARS.length === 0
              ? "0 shown"
              : `${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, ACTIVE_SCHOLARS.length)} of ${ACTIVE_SCHOLARS.length}`}
          </span>
        </div>

        <div className="vc-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "center" }}>Scholar</th>
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
                  style={{ borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`, cursor: "pointer", verticalAlign: "middle" }}
                >
                  <td style={{ ...s.td, padding: "16px 14px", textAlign: "center" }}>
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
                      style={{
                        ...s.stageTag,
                        background: HEALTH_TAG[sch.health].bg,
                        color: HEALTH_TAG[sch.health].text,
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
                          background: HEALTH_TAG[sch.health].text,
                          flexShrink: 0,
                        }}
                      />
                      {HEALTH_TAG[sch.health].label}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); openScholar(sch); }}
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

        {ACTIVE_SCHOLARS.length === 0 && (
          <p style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94", fontSize: "0.9rem" }}>
            No active scholars yet.
          </p>
        )}

        {ACTIVE_SCHOLARS.length > 0 && (
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

      {selected && (
        <div style={s.drawerOverlay} onClick={closeDrawer}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={s.drawerHeader}>
              <span style={s.profileAvatar}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.course}</p>
              </div>
              <button onClick={closeDrawer} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            {view === "overview" ? (
              <>
                <p style={s.drawerSectionLabel}>Current standing</p>
                <div style={s.drawerInfoGrid}>
                  <DrawerInfoRow label="Current GWA" value={`${selected.gwa}%`} />
                  <DrawerInfoRow label="Trend" value={selected.trend === "up" ? "Improving" : "Declining"} />
                  <DrawerInfoRow label="Documents" value={selected.docs} />
                  <DrawerInfoRow label="Disbursement" value={selected.disbursement} />
                </div>

                <p style={s.drawerSectionLabel}>This semesters payment</p>
                <div style={s.drawerCurrentPayCard}>
                  <div style={s.drawerCurrentPayLeft}>
                    <span style={s.drawerCurrentPayTerm}>{selected.currentPayment.term}</span>
                    <span style={s.drawerCurrentPayAmount}>
                      ₱{selected.currentPayment.amount.toLocaleString()}
                    </span>
                  </div>
                  <span
                    style={{
                      ...s.stageTag,
                      background: PAYMENT_STATUS_COLORS[selected.currentPayment.status].bg,
                      color: PAYMENT_STATUS_COLORS[selected.currentPayment.status].text,
                    }}
                  >
                    {selected.currentPayment.status}
                  </span>
                </div>

                <div style={s.drawerHistoryBtnRow}>
                  <button onClick={() => setView("history")} style={s.drawerHistoryBtn}>
                    <ClockIcon /> View full history <ArrowRightIcon />
                  </button>
                </div>

                <p style={s.drawerSectionLabel}>Status</p>
                <div style={s.appNoteCard}>
                  <span style={s.appNoteIcon}>
                    <MonitorIcon />
                  </span>
                  <p style={s.appNoteText}>
                    {selected.health === "good" && "This scholar is meeting all retention requirements. No action needed."}
                    {selected.health === "warn" && "Missing a required document. A reminder message is recommended."}
                    {selected.health === "bad" && "GWA trending down and documents incomplete. Disbursement is on hold pending review."}
                  </p>
                </div>

                <div style={s.drawerStageActions}>
                  <button style={s.continueBtnSmall}>
                    <MailIcon small /> Message scholar
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setView("overview")} style={s.backToOverviewBtn}>
                  ← Back to overview
                </button>

                <div style={s.historySection}>
                  <p style={s.drawerSectionLabel}>Grade history</p>
                  <div style={s.historyList}>
                    {selected.gradeHistory.map((g, i) => (
                      <div key={i} style={s.historyRow}>
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
                    ))}
                  </div>
                </div>

                <div style={s.historySection}>
                  <p style={s.drawerSectionLabel}>Payment history</p>
                  <div style={s.historyList}>
                    {selected.paymentHistory.map((p, i) => (
                      <div key={i} style={s.historyRow}>
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
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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