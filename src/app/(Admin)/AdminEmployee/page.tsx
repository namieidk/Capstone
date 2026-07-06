"use client";

import React, { useState, FormEvent } from "react";
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
  TINT,
  NAVY,
  WHITE,
  LINE,
  s,
} from "@/components/AdminShared";

const EMPLOYEE_FILTERS: ("All" | EmployeeRecord["type"])[] = ["All", "Coordinator", "Partner Employee"];

export default function AdminEmployeePage() {
  const [filter, setFilter] = useState<"All" | EmployeeRecord["type"]>("All");
  const [selected, setSelected] = useState<EmployeeRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = filter === "All" ? EMPLOYEES : EMPLOYEES.filter((e) => e.type === filter);

  return (
    <div>
      <div style={s.pageHeaderRow}>
        <div />
        <button onClick={() => setShowAddModal(true)} style={s.continueBtnSmall}>
          <PeopleIcon /> Add employee
        </button>
      </div>

      <div style={s.filterRow}>
        {EMPLOYEE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...s.filterChip, background: filter === f ? NAVY : WHITE, color: filter === f ? WHITE : "#55554f", borderColor: filter === f ? NAVY : LINE }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="va-table-scroll" style={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th style={s.th}>Employee</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Department / Company</th>
              <th style={s.th}>Type</th>
              <th style={s.th}>Status</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} style={s.tr}>
                <td style={s.td}>
                  <div style={s.tdNameRow}>
                    <span style={s.convoAvatar}>{emp.initials}</span>
                    <div>
                      <p style={s.tdName}>{emp.name}</p>
                      <p style={s.tdSub}>{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td style={s.td}>{emp.role}</td>
                <td style={s.td}>{emp.department}</td>
                <td style={s.td}>
                  <span style={{ ...s.stageTag, background: emp.type === "Coordinator" ? AMBER_BG : TINT, color: emp.type === "Coordinator" ? "#6b5220" : "#55554f" }}>
                    {emp.type}
                  </span>
                </td>
                <td style={s.td}>
                  <span style={{ ...s.stageTag, background: emp.status === "Active" ? GOOD_BG : WARN_BG, color: emp.status === "Active" ? GOOD : WARN }}>
                    {emp.status}
                  </span>
                </td>
                <td style={s.td}>
                  <button onClick={() => setSelected(emp)} style={s.tableActionBtn}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={s.drawerOverlay} onClick={() => setSelected(null)}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={s.drawerHeader}>
              <span style={s.profileAvatar}>{selected.initials}</span>
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