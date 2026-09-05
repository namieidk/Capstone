"use client";

import React, { useState, FormEvent, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Eye, ChevronLeft, ChevronRight, ListFilter, Check, Plus } from "lucide-react";
import {
  XCircleIcon,
  DrawerInfoRow,
  Field,
  GOOD,
  GOOD_BG,
  WARN,
  WARN_BG,
  AMBER,
  AMBER_BG,
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
import { useToast } from "@/components/ToastContext";
import { ApiError } from "@/lib/api";
import {
  createStaff,
  listUsers,
  resetPassword,
  updateUserStatus,
} from "@/lib/api/users";
import type { User } from "@/lib/api/auth";

const EMPLOYEE_FILTERS = ["All", "Coordinator", "Grantor"] as const;
type EmployeeFilter = (typeof EMPLOYEE_FILTERS)[number];

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  COORDINATOR: "Coordinator",
  GRANTOR: "Grantor",
};

const INITIAL_ADD_FIELDS = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "COORDINATOR",
  title: "",
  department: "",
};

interface StaffRow {
  id: number;
  name: string;
  email: string;
  title: string;
  department: string;
  type: string;
  status: "Active" | "Inactive";
  initials: string;
  joined: string;
  user: User;
}

function toStaffRow(user: User): StaffRow {
  const emp = user.employee;
  const first = emp?.first_name ?? "";
  const last = emp?.last_name ?? "";
  const type = ROLE_LABELS[user.role] ?? user.role;
  return {
    id: user.user_id,
    name: `${first} ${last}`.trim() || user.email,
    email: user.email,
    title: emp?.title ?? type,
    department: emp?.department ?? "—",
    type,
    status: user.is_active ? "Active" : "Inactive",
    initials: ((first[0] ?? "") + (last[0] ?? "")).toUpperCase() || "?",
    joined: user.created_at
      ? new Date(user.created_at).getFullYear().toString()
      : "—",
    user,
  };
}

export default function AdminEmployeePage() {
  const { toggleMobile } = useSidebar();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<EmployeeFilter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selected, setSelected] = useState<StaffRow | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [addFields, setAddFields] = useState(INITIAL_ADD_FIELDS);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const users = await listUsers();
      setStaff(users.filter((u) => u.employee).map(toStaffRow));
      setPage(1);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setLoadError(
        err instanceof ApiError ? err.message : "Failed to load employees.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

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

  const filtered = staff.filter((e) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesType = filter === "All" || e.type === filter;
    const matchesSearch =
      q === "" ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = (f: EmployeeFilter) => {
    setFilter(f);
    setPage(1);
    setFilterOpen(false);
  };

  const counts: Record<string, number> = {
    All: staff.length,
    Coordinator: staff.filter((e) => e.type === "Coordinator").length,
    Grantor: staff.filter((e) => e.type === "Grantor").length,
  };

  const handleAddEmployee = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdding(true);
    setAddError("");
    try {
      await createStaff(addFields);
      showToast("Employee added.");
      setShowAddModal(false);
      setAddFields(INITIAL_ADD_FIELDS);
      await fetchStaff();
    } catch (err) {
      console.error("Failed to add employee:", err);
      setAddError(
        err instanceof ApiError ? err.message : "Failed to add employee.",
      );
    } finally {
      setAdding(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selected) return;
    setActing(true);
    setActionError("");
    try {
      await resetPassword(selected.id, newPassword);
      showToast("Password reset for " + selected.name + ".");
      setSelected(null);
    } catch (err) {
      console.error("Failed to reset password:", err);
      setActionError(
        err instanceof ApiError ? err.message : "Failed to reset password.",
      );
    } finally {
      setActing(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selected) return;
    const target = !selected.user.is_active;
    setActing(true);
    setActionError("");
    try {
      await updateUserStatus(selected.id, target);
      showToast(target ? "Employee activated." : "Employee deactivated.");
      setSelected(null);
      await fetchStaff();
    } catch (err) {
      console.error("Failed to update employee status:", err);
      setActionError(
        err instanceof ApiError ? err.message : "Failed to update employee status.",
      );
    } finally {
      setActing(false);
    }
  };

  const closeDrawer = () => {
    setSelected(null);
    setResetOpen(false);
    setNewPassword("");
    setActionError("");
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
        <div style={{ background: WHITE, border: BORDER_SUBTLE, borderRadius: 18, boxShadow: SHADOW_SM, padding: "10px 22px 8px", marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "6px 4px 14px" }}>
            <p style={{ fontSize: "0.88rem", color: "#7a7a74" }}>
              {!loading && !loadError && (
                <>
                  {filtered.length} {filtered.length === 1 ? "employee" : "employees"}
                </>
              )}
            </p>
            <div ref={filterRef} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="filter-trigger-wrap">
                <button
                  ref={filterBtnRef}
                  onClick={handleFilterToggle}
                  aria-label="Filter by role"
                  aria-expanded={filterOpen}
                  className="filter-trigger"
                  style={{
                    position: "relative",
                    width: 38,
                    height: 38,
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
                  <ListFilter size={16} color={NAVY} />
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
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="add-employee-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  background: GOOD,
                  color: WHITE,
                  borderRadius: 999,
                  padding: "10px 18px",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  boxShadow: SHADOW_SM,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                <Plus size={15} strokeWidth={2.5} />
                Add Employee
              </button>
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

          {loading ? (
            <div style={{ padding: "6px 0 14px" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "16px 6px",
                    borderBottom: i === 5 ? "none" : `1px solid ${TINT}`,
                  }}
                >
                  <div style={{ width: 160, flexShrink: 0 }}>
                    <div className="va-skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8 }} />
                    <div className="va-skeleton" style={{ height: 11, borderRadius: 5, width: "75%" }} />
                  </div>
                  <div className="va-skeleton" style={{ height: 13, borderRadius: 6, width: 120, flexShrink: 0 }} />
                  <div className="va-skeleton" style={{ height: 13, borderRadius: 6, width: 140, flexShrink: 0 }} />
                  <div className="va-skeleton" style={{ height: 24, borderRadius: 999, width: 96, flexShrink: 0 }} />
                  <div className="va-skeleton" style={{ height: 24, borderRadius: 999, width: 96, flexShrink: 0 }} />
                  <div className="va-skeleton" style={{ height: 34, width: 34, borderRadius: "50%", flexShrink: 0 }} />
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#8a3a2e", fontSize: "0.92rem", marginBottom: 14 }}>{loadError}</p>
              <button onClick={fetchStaff} style={s.continueBtnSmall}>
                Try again
              </button>
            </div>
          ) : (
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
                        Title
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
                        Role
                      </div>
                    </th>
                    <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 34, height: 34 }} />
                        Status
                      </div>
                    </th>
                    <th style={{ ...s.th, background: "none", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                        <span style={{ width: 34, height: 34 }} />
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
                      <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{emp.title}</td>
                      <td style={{ ...s.td, color: "#4a4a45", textAlign: "center" }}>{emp.department}</td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span style={{ ...s.stageTag, width: 96, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "6px 0", background: emp.type === "Coordinator" ? AMBER_BG : TINT, color: emp.type === "Coordinator" ? "#6b5220" : "#55554f" }}>
                          {emp.type}
                        </span>
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span
                          style={{
                            ...s.stageTag,
                            width: 96,
                            padding: "6px 0",
                            justifyContent: "center",
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
          )}

          {!loading && !loadError && filtered.length === 0 && (
            <p style={{ textAlign: "center", padding: "40px 0", color: "#9a9a94", fontSize: "0.9rem" }}>
              No employees match this filter.
            </p>
          )}

          {!loading && !loadError && filtered.length > 0 && (
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
        <div style={s.drawerOverlay} onClick={closeDrawer}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={{ ...s.drawerHeader, marginBottom: 22 }}>
              <span style={{ ...s.profileAvatar, animation: "none", boxShadow: "none", transition: "none" }}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.title}</p>
              </div>
              <button onClick={closeDrawer} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            <div style={{ ...s.drawerInfoGrid, marginBottom: 22, rowGap: 20 }}>
              <DrawerInfoRow label="Role" value={selected.type} />
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

            {actionError && (
              <div style={actionErrorStyle}>
                {actionError}
              </div>
            )}

            {resetOpen ? (
              <div style={{ marginTop: 18 }}>
                <p style={{ ...s.drawerSectionLabel, marginBottom: 8 }}>New password</p>
                <input
                  type="password"
                  style={s.input}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
                <div style={{ ...s.drawerStageActions, marginTop: 14 }}>
                  <button
                    onClick={handleResetPassword}
                    disabled={acting || newPassword.trim().length < 8}
                    style={{ ...s.continueBtn, opacity: acting || newPassword.trim().length < 8 ? 0.6 : 1 }}
                  >
                    {acting ? "Resetting..." : "Confirm reset"}
                  </button>
                  <button
                    onClick={() => { setResetOpen(false); setNewPassword(""); }}
                    disabled={acting}
                    style={s.backBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ ...s.drawerStageActions, marginTop: 4 }}>
                <button style={s.continueBtnSmall} onClick={() => setResetOpen(true)}>
                  Reset password
                </button>
                <button
                  style={selected.user.is_active ? s.rejectBtn : s.continueBtnSmall}
                  onClick={handleToggleStatus}
                  disabled={acting}
                >
                  {acting ? "Updating..." : selected.user.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div style={s.drawerOverlay} onClick={() => setShowAddModal(false)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.drawerName}>Add employee</h3>
            <p style={s.drawerMeta}>Add a coordinator or grantor account.</p>
            <form onSubmit={handleAddEmployee} style={{ marginTop: 20 }}>
              <div className="va-field-row-2" style={s.fieldRow2}>
                <Field label="First name" required>
                  <input
                    style={s.input}
                    value={addFields.first_name}
                    onChange={(e) => setAddFields({ ...addFields, first_name: e.target.value })}
                  />
                </Field>
                <Field label="Last name" required>
                  <input
                    style={s.input}
                    value={addFields.last_name}
                    onChange={(e) => setAddFields({ ...addFields, last_name: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Email" required>
                <input
                  type="email"
                  style={s.input}
                  value={addFields.email}
                  onChange={(e) => setAddFields({ ...addFields, email: e.target.value })}
                />
              </Field>
              <Field label="Password" required>
                <input
                  type="password"
                  style={s.input}
                  placeholder="At least 8 characters"
                  value={addFields.password}
                  onChange={(e) => setAddFields({ ...addFields, password: e.target.value })}
                />
              </Field>
              <div className="va-field-row-2" style={s.fieldRow2}>
                <Field label="Role" required>
                  <select
                    style={s.select}
                    value={addFields.role}
                    onChange={(e) => setAddFields({ ...addFields, role: e.target.value })}
                  >
                    <option value="COORDINATOR">Coordinator</option>
                    <option value="GRANTOR">Grantor</option>
                  </select>
                </Field>
                <Field label="Department">
                  <input
                    style={s.input}
                    value={addFields.department}
                    onChange={(e) => setAddFields({ ...addFields, department: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Title">
                <input
                  style={s.input}
                  placeholder="e.g. Scholarship Coordinator"
                  value={addFields.title}
                  onChange={(e) => setAddFields({ ...addFields, title: e.target.value })}
                />
              </Field>

              {addError && <div style={actionErrorStyle}>{addError}</div>}

              <div style={s.modalActionsRow}>
                <button type="button" onClick={() => setShowAddModal(false)} style={s.backBtn}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...s.continueBtn, opacity: adding ? 0.6 : 1 }}
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const actionErrorStyle: React.CSSProperties = {
  background: "#FDEBEC",
  color: "#B3261E",
  border: "1px solid #F5C2C0",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: "0.88rem",
  lineHeight: 1.5,
  marginTop: 16,
};