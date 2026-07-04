"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  DrawerInfoRow,
  PAYMENT_REQUESTS,
  PAYMENT_STATUS_COLORS,
  PaymentRequest,
  s,
} from "@/components/Grantorshared";

export default function GrantorPaymentsPage() {
  const [records, setRecords] = useState<PaymentRequest[]>(PAYMENT_REQUESTS);
  const [selected, setSelected] = useState<PaymentRequest | null>(null);

  const totalApproved = records.filter((r) => r.status === "Approved").reduce((sum, r) => sum + r.amount, 0);
  const pendingCount = records.filter((r) => r.status === "Pending approval").length;
  const onHoldCount = records.filter((r) => r.status === "On hold").length;

  const setStatus = (id: number, status: PaymentRequest["status"]) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, status } : sel));
  };

  return (
    <div>
      <div className="vg-stat-row" style={s.statRow}>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Approved this term</p>
            <p style={s.pipelineValue}>₱{totalApproved.toLocaleString()}</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Pending approval</p>
            <p style={s.pipelineValue}>{pendingCount}</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>On hold</p>
            <p style={s.pipelineValue}>{onHoldCount}</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Next batch date</p>
            <p style={{ ...s.pipelineValue, fontSize: "1.3rem" }}>Jul 15, 2026</p>
          </div>
        </div>
      </div>

      <div className="vg-table-scroll" style={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th style={s.th}>Scholar</th>
              <th style={s.th}>Amount</th>
              <th style={s.th}>Term</th>
              <th style={s.th}>Requested date</th>
              <th style={s.th}>Status</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} style={s.tr}>
                <td style={s.td}>
                  <div style={s.tdNameRow}>
                    <span style={s.convoAvatar}>{r.initials}</span>
                    <div>
                      <p style={s.tdName}>{r.name}</p>
                      <p style={s.tdSub}>{r.course}</p>
                    </div>
                  </div>
                </td>
                <td style={s.td}>₱{r.amount.toLocaleString()}</td>
                <td style={s.td}>{r.term}</td>
                <td style={s.td}>{r.requestedDate}</td>
                <td style={s.td}>
                  <span style={{ ...s.stageTag, background: PAYMENT_STATUS_COLORS[r.status].bg, color: PAYMENT_STATUS_COLORS[r.status].text }}>{r.status}</span>
                </td>
                <td style={s.td}>
                  <button onClick={() => setSelected(r)} style={s.tableActionBtn}>
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
                <p style={s.drawerMeta}>{selected.course}</p>
              </div>
              <button onClick={() => setSelected(null)} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            <div style={s.drawerInfoGrid}>
              <DrawerInfoRow label="Amount" value={`₱${selected.amount.toLocaleString()}`} />
              <DrawerInfoRow label="Term" value={selected.term} />
              <DrawerInfoRow label="Requested date" value={selected.requestedDate} />
              <DrawerInfoRow label="Status" value={selected.status} />
            </div>

            <p style={s.drawerSectionLabel}>Actions</p>
            <div style={s.drawerStageActions}>
              {selected.status !== "Approved" && (
                <button onClick={() => setStatus(selected.id, "Approved")} style={s.continueBtnSmall}>
                  Approve disbursement
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