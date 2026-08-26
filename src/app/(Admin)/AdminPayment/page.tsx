"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ListFilter, Check, ChevronLeft, ChevronRight } from "lucide-react";
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
  AMBER,
  SHADOW_SM,
  SHADOW_MD,
  BORDER_SUBTLE,
  MenuIcon,
  BellIcon,
  SearchIcon,
  s,
} from "@/components/Adminshared";
import { useSidebar } from "@/components/SidebarContext";

const PAYMENT_FILTERS: (AdminPaymentRecord["status"] | "All")[] = ["All", "Paid", "Scheduled", "On hold"];

// Approx height (px) of a single table row, used to work out how many rows
// fit on screen so the table adapts to the device instead of overflowing.
const ROW_HEIGHT = 58;
// Reserved space below the table card's top edge for its own header row,
// the pagination row, and page padding.
const RESERVED_HEIGHT = 210;
const MIN_ROWS = 3;

export default function AdminPaymentsPage() {
  const { toggleMobile } = useSidebar();

  const [records, setRecords] = useState<AdminPaymentRecord[]>(ADMIN_PAYMENT_RECORDS);
  const [selected, setSelected] = useState<AdminPaymentRecord | null>(null);
  const [filter, setFilter] = useState<AdminPaymentRecord["status"] | "All">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState("");
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

  const totalDisbursed = records.filter((r) => r.status === "Paid").reduce((sum, r) => sum + r.amount, 0);
  const scheduledCount = records.filter((r) => r.status === "Scheduled").length;
  const onHoldCount = records.filter((r) => r.status === "On hold").length;

  const setStatus = (id: number, status: AdminPaymentRecord["status"]) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, status } : sel));
  };

  const query = searchQuery.trim().toLowerCase();
  const filtered = useMemo(() => {
    let list = filter === "All" ? records : records.filter((r) => r.status === filter);
    if (query) {
      list = list.filter(
        (r) => r.name.toLowerCase().includes(query) || r.coordinator.toLowerCase().includes(query) || r.course.toLowerCase().includes(query)
      );
    }
    return list;
  }, [records, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (f: AdminPaymentRecord["status"] | "All") => {
    setFilter(f);
    setPage(1);
    setFilterOpen(false);
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
        .pay-topbar-actions { flex-wrap: wrap; }
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
        @media (max-width: 720px) {
          .payment-stat-row { grid-template-columns: repeat(2, 1fr) !important; }
          .payment-table th, .payment-table td { padding-left: 8px !important; padding-right: 8px !important; font-size: 0.78rem !important; }
          .payment-col-term, .payment-col-date, .payment-col-coordinator { display: none; }
        }
        @media (max-width: 480px) {
          .payment-stat-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ---------------- Page-level navbar ---------------- */}
      <header style={{ ...s.topbar, flexShrink: 0 }}>
        <button className="va-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Payments</h1>
          <p style={s.topbarSub}>Track disbursements, schedules, and holds across all scholars.</p>
        </div>
        <div className="pay-topbar-actions" style={{ ...s.topbarRight, gap: 10 }}>
          <div className="va-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search payments..."
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

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px 4px 40px" }}>
          {/* ---------------- Summary cards ---------------- */}
          <div
            className="va-stat-row payment-stat-row"
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
              <p style={{ fontSize: "0.84rem", color: "#7a7a74", fontWeight: 500 }}>Next batch date</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: NAVY, lineHeight: 1.2, textAlign: "right", whiteSpace: "nowrap" }}>Jul 15, 2026</p>
            </div>
          </div>

          {/* ---------------- Table card ---------------- */}
          <div ref={tableCardRef} style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "16px 22px 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontSize: "1.15rem", fontWeight: 700, color: NAVY, fontFamily: "'Inter', sans-serif" }}>Payment records</p>
              <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>
                {filtered.length === 0
                  ? "0 shown"
                  : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}`}
              </span>
            </div>

            <div className="va-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
              <table className="payment-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                    <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 34, height: 34 }} />
                        Scholar
                      </div>
                    </th>
                    <th className="payment-col-coordinator" style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 34, height: 34 }} />
                        Coordinator
                      </div>
                    </th>
                    <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 34, height: 34 }} />
                        Amount
                      </div>
                    </th>
                    <th className="payment-col-term" style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 34, height: 34 }} />
                        Term
                      </div>
                    </th>
                    <th className="payment-col-date" style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 34, height: 34 }} />
                        Scheduled date
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
                                {PAYMENT_FILTERS.map((f) => {
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
                      <td className="payment-col-coordinator" style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{r.coordinator}</td>
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

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}