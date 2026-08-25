"use client";

import React, { useState, FormEvent, useRef, useEffect, useCallback } from "react";
import {
  PeopleIcon,
  XCircleIcon,
  MailIcon,
  TrashIcon,
  DrawerInfoRow,
  Field,
  EMPLOYEES,
  EmployeeRecord,
  GOOD,
  GOOD_BG,
  WARN,
  WARN_BG,
  AMBER_BG,
  AMBER,
  TINT,
  NAVY,
  WHITE,
  LINE,
  BORDER_SUBTLE,
  SHADOW_SM,
  MenuIcon,
  BellIcon,
  SearchIcon,
  s,
} from "@/components/Adminshared";
import { useSidebar } from "@/components/SidebarContext";

const EMPLOYEE_FILTERS: ("All" | EmployeeRecord["type"])[] = ["All", "Coordinator", "Partner Employee"];

const ROW_HEIGHT = 62;       // approx rendered height of one table row
const HEADER_ROW_HEIGHT = 48; // thead height
const LABEL_ROW_HEIGHT = 28;  // "X of Y shown" line
const PAGINATION_HEIGHT = 66; // pagination controls row
const CARD_PADDING = 30;      // top+bottom padding of the card
const MIN_PAGE_SIZE = 3;

export default function AdminEmployeePage() {
  const { toggleMobile } = useSidebar();
  const [filter, setFilter] = useState<"All" | EmployeeRecord["type"]>("All");
  const [selected, setSelected] = useState<EmployeeRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(MIN_PAGE_SIZE);

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Measure the table card's actual rendered height and derive how many
  // full rows fit alongside the header row, label row, and pagination bar —
  // so nothing inside the card ever needs to scroll. Extra rows roll onto
  // the next pagination page instead.
  const recalcPageSize = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const cardHeight = card.getBoundingClientRect().height;
    const reserved = HEADER_ROW_HEIGHT + LABEL_ROW_HEIGHT + PAGINATION_HEIGHT + CARD_PADDING;
    const rows = Math.floor((cardHeight - reserved) / ROW_HEIGHT);
    setPageSize(Math.max(MIN_PAGE_SIZE, rows));
  }, []);

  useEffect(() => {
    recalcPageSize();
    const card = cardRef.current;
    if (!card) return;
    const observer = new ResizeObserver(() => recalcPageSize());
    observer.observe(card);
    window.addEventListener("resize", recalcPageSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalcPageSize);
    };
  }, [recalcPageSize]);

  const filtered = EMPLOYEES.filter((e) => {
    const matchesType = filter === "All" || e.type === filter;
    const matchesSearch = searchQuery.trim() === "" || e.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesType && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .filter-pill { transition: border-color 0.15s ease, background 0.15s ease; }
        .filter-pill:hover { border-color: rgba(30, 58, 95, 0.35); }
        .filter-select:focus { outline: none; }
        .filter-select option { color: ${NAVY}; background: ${WHITE}; }

        /* ---- Responsive table: collapse columns instead of scrolling horizontally ---- */
        .emp-table { table-layout: fixed; width: 100%; }
        @media (max-width: 980px) {
          .emp-col-dept { display: none !important; }
        }
        @media (max-width: 760px) {
          .emp-col-type { display: none !important; }
        }
        @media (max-width: 640px) {
          .emp-table td, .emp-table th { padding-left: 8px !important; padding-right: 8px !important; font-size: 0.8rem !important; }
          .emp-topbar-actions { flex-wrap: wrap; }
        }
      `}</style>

      {/* ---------------- Page-level navbar (search + filter pill + Add employee) ---------------- */}
      <header style={s.topbar}>
        <button className="va-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Employee</h1>
          <p style={s.topbarSub}>Coordinators, HR staff, and partner-company employees on file.</p>
        </div>
        <div className="emp-topbar-actions" style={{ ...s.topbarRight, gap: 10 }}>
          <PillFilter>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as "All" | EmployeeRecord["type"]);
                setPage(1);
              }}
              style={pillSelectStyle}
            >
              {EMPLOYEE_FILTERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </PillFilter>
          <div className="va-topbar-search" style={s.searchBox}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              style={s.searchInput}
            />
          </div>
          <button onClick={() => setShowAddModal(true)} style={{ ...s.continueBtnSmall, whiteSpace: "nowrap" }}>
            <PeopleIcon /> Add employee
          </button>
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      {/* flexGrow + minHeight:0 + overflow:hidden — this area never scrolls */}
      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div
          ref={cardRef}
          style={{
            background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM,
            padding: "22px 22px 16px", marginTop: 20, flexGrow: 1, minHeight: 0,
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6, flexShrink: 0 }}>
            <span style={{ fontSize: "0.8rem", color: "#9a9a94" }}>
              {filtered.length === 0
                ? "0 shown"
                : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length}`}
            </span>
          </div>

          <div style={{ width: "100%", overflow: "hidden", flexGrow: 1, minHeight: 0 }}>
            <table className="emp-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                  <th style={{ ...s.th, background: "none", padding: "14px 14px", textAlign: "center" }}>Employee</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Role</th>
                  <th className="emp-col-dept" style={{ ...s.th, background: "none", textAlign: "center" }}>Department / Company</th>
                  <th className="emp-col-type" style={{ ...s.th, background: "none", textAlign: "center" }}>Type</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>Status</th>
                  <th style={{ ...s.th, background: "none", textAlign: "center" }}>View</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((emp, i) => (
                  <tr
                    key={emp.id}
                    style={{ borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`, verticalAlign: "middle" }}
                  >
                    <td style={{ ...s.td, padding: "16px 14px", textAlign: "center" }}>
                      <p style={s.tdName}>{emp.name}</p>
                      <p style={s.tdSub}>{emp.email}</p>
                    </td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{emp.role}</td>
                    <td className="emp-col-dept" style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{emp.department}</td>
                    <td className="emp-col-type" style={{ ...s.td, textAlign: "center" }}>
                      <span style={{ ...s.stageTag, background: emp.type === "Coordinator" ? AMBER_BG : TINT, color: emp.type === "Coordinator" ? "#6b5220" : "#55554f" }}>
                        {emp.type}
                      </span>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span
                        style={{
                          ...s.stageTag,
                          background: emp.status === "Active" ? GOOD_BG : WARN_BG,
                          color: emp.status === "Active" ? GOOD : WARN,
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
                            background: "currentColor",
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <button
                        onClick={() => setSelected(emp)}
                        aria-label="View employee"
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
              No employees match this filter.
            </p>
          )}

          {filtered.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, paddingTop: 14, flexShrink: 0 }}>
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
            <div style={s.drawerHeader}>
              <span style={{ ...s.profileAvatar, animation: "none", boxShadow: "none", transition: "none" }}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.role}</p>
              </div>
              <button onClick={() => setSelected(null)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            <div style={s.drawerInfoGrid}>
              <DrawerInfoRow label="Type" value={selected.type} />
              <DrawerInfoRow label="Status" value={selected.status} />
              <DrawerInfoRow label="Department" value={selected.department} />
              <DrawerInfoRow label="Joined" value={selected.joined} />
            </div>

            <p style={s.drawerSectionLabel}>Contact</p>
            <div style={s.drawerDocList}>
              <p style={s.drawerContactLine}>
                <strong>Email:</strong> {selected.email}
              </p>
            </div>

            <div style={s.drawerStageActions}>
              <button style={s.continueBtnSmall}>
                <MailIcon small /> Message employee
              </button>
              <button style={s.rejectBtn}>
                <TrashIcon /> Remove employee
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={s.drawerOverlay} onClick={() => setShowAddModal(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.drawerName}>Add employee</h3>
            <p style={s.drawerMeta}>Add a coordinator, HR staff, or partner-company employee.</p>
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setShowAddModal(false);
              }}
              style={{ marginTop: 20 }}
            >
              <Field label="Full name" required>
                <input style={s.input} />
              </Field>
              <div className="va-field-row-2" style={s.fieldRow2}>
                <Field label="Role" required>
                  <input style={s.input} placeholder="e.g. Scholarship Coordinator" />
                </Field>
                <Field label="Type" required>
                  <select style={s.select}>
                    <option>Coordinator</option>
                    <option>Partner Employee</option>
                  </select>
                </Field>
              </div>
              <Field label="Department / Company" required>
                <input style={s.input} />
              </Field>
              <Field label="Email" required>
                <input type="email" style={s.input} />
              </Field>
              <div style={s.modalActionsRow}>
                <button type="button" onClick={() => setShowAddModal(false)} style={s.backBtn}>
                  Cancel
                </button>
                <button type="submit" style={s.continueBtn}>
                  Add employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Pill filter (rounded navy dropdown, matches Admin Monitor) ---------------- */

const pillSelectStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "8px 28px 8px 14px",
  fontSize: "0.8rem",
  color: WHITE,
  width: 168,
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

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}