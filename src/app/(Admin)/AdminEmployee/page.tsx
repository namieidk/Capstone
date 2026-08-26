"use client";

import React, { useState, FormEvent, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, ChevronLeft, ChevronRight, ListFilter, Check } from "lucide-react";
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
  SHADOW_MD,
  MenuIcon,
  BellIcon,
  SearchIcon,
  s,
} from "@/components/Adminshared";
import { useSidebar } from "@/components/SidebarContext";

const EMPLOYEE_FILTERS: ("All" | EmployeeRecord["type"])[] = ["All", "Coordinator", "Partner Employee"];

export default function AdminEmployeePage() {
  const { toggleMobile } = useSidebar();
  const [filter, setFilter] = useState<"All" | EmployeeRecord["type"]>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selected, setSelected] = useState<EmployeeRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
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

  const filtered = EMPLOYEES.filter((e) => {
    const matchesType = filter === "All" || e.type === filter;
    const matchesSearch = searchQuery.trim() === "" || e.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesType && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (f: "All" | EmployeeRecord["type"]) => {
    setFilter(f);
    setPage(1);
    setFilterOpen(false);
  };

  const counts: Record<string, number> = {
    All: EMPLOYEES.length,
    Coordinator: EMPLOYEES.filter((e) => e.type === "Coordinator").length,
    "Partner Employee": EMPLOYEES.filter((e) => e.type === "Partner Employee").length,
  };

  return (
    <div>
      <style>{`
        .filter-trigger { transition: background-color 0.15s ease, transform 0.1s ease; }
        .filter-trigger:hover { background-color: #d9a316 !important; }
        .filter-option { transition: background-color 0.12s ease; }
        .filter-option:hover { background-color: ${TINT}; }
        .add-employee-btn { transition: background-color 0.15s ease, transform 0.1s ease; }
        .add-employee-btn:hover { background-color: #145c3a !important; }
        .filter-trigger-wrap { position: relative; }
        .add-employee-wrap { position: relative; }
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
        .filter-trigger-wrap:hover .filter-tooltip,
        .add-employee-wrap:hover .filter-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

      {/* ---------------- Page-level navbar (search + Add employee — filter lives in the page body) ---------------- */}
      <header style={s.topbar}>
        <button className="va-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Employee</h1>
          <p style={s.topbarSub}>Coordinators, HR staff, and partner-company employees on file.</p>
        </div>
        <div style={{ ...s.topbarRight, gap: 10 }}>
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
          <button style={s.bellBtn}>
            <BellIcon />
            <span style={{ ...s.bellDot, background: AMBER }} />
          </button>
        </div>
      </header>

      <div style={{ ...s.mainContent, padding: s.mainContent.padding }}>
        {/* ---------------- Table card, same shell/header/th/td treatment as Archive ---------------- */}
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "10px 22px 8px", marginTop: 20 }}>
          {/* Type filter now lives inside the "View" column header, directly above the eye icons.
              Every header gets the same-height slot above its label (spacer or button) so all six stay aligned. */}

          <div className="va-table-scroll" style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${LINE}` }}>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Employee
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Role
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Department / Company
                    </div>
                  </th>
                  <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <span style={{ width: 34, height: 34 }} />
                      Type
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
                        {/* Add employee — sits beside the dropdown, absolutely positioned so it
                            doesn't affect the centering of the "View" label under the dropdown. */}
                        <div className="add-employee-wrap" style={{ position: "absolute", top: 0, right: "calc(100% + 10px)" }}>
                          <button
                            onClick={() => setShowAddModal(true)}
                            aria-label="Add employee"
                            className="add-employee-btn"
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: GOOD,
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: SHADOW_SM,
                              flexShrink: 0,
                              cursor: "pointer",
                              color: WHITE,
                            }}
                          >
                            <PeopleIcon />
                          </button>
                          <span className="filter-tooltip" style={{ color: GOOD }}>Add employee</span>
                        </div>

                        <div className="filter-trigger-wrap">
                          <button
                            ref={filterBtnRef}
                            onClick={handleFilterToggle}
                            aria-label="Filter by type"
                            aria-expanded={filterOpen}
                            className="filter-trigger"
                            style={{
                              position: "relative",
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: filterOpen ? "#d9a316" : AMBER,
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
                              {EMPLOYEE_FILTERS.map((f) => {
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
                {paginated.map((emp, i) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelected(emp)}
                    style={{ borderBottom: i === paginated.length - 1 ? "none" : `1px solid ${TINT}`, cursor: "pointer", verticalAlign: "middle" }}
                  >
                    <td style={{ ...s.td, padding: "16px 14px", textAlign: "center" }}>
                      <p style={s.tdName}>{emp.name}</p>
                      <p style={s.tdSub}>{emp.email}</p>
                    </td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{emp.role}</td>
                    <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{emp.department}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
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
                        onClick={(e) => { e.stopPropagation(); setSelected(emp); }}
                        aria-label="View employee"
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
              No employees match this filter.
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
              <span style={{ ...s.profileAvatar, animation: "none", boxShadow: "none", transition: "none" }}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.role}</p>
              </div>
              <button onClick={() => setSelected(null)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            <div style={{ ...s.drawerInfoGrid, marginBottom: 22, rowGap: 20 }}>
              <DrawerInfoRow label="Type" value={selected.type} />
              <DrawerInfoRow label="Status" value={selected.status} />
              <DrawerInfoRow label="Department" value={selected.department} />
              <DrawerInfoRow label="Joined" value={selected.joined} />
            </div>

            <p style={{ ...s.drawerSectionLabel, marginBottom: 10 }}>Contact</p>
            <div style={s.drawerDocList}>
              <p style={s.drawerContactLine}>
                <strong>Email:</strong> {selected.email}
              </p>
            </div>

            <div style={{ ...s.drawerStageActions, marginTop: 4 }}>
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