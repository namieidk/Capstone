"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  CheckCircleIcon,
  DrawerInfoRow,
  PAYMENT_RECORDS,
  PAYMENT_STATUS_COLORS,
  PaymentRecord,
  s,
} from "@/components/Coordinatorshared";

export default function PaymentPage() {
  const [records, setRecords] = useState<PaymentRecord[]>(PAYMENT_RECORDS);
  const [selected, setSelected] = useState<PaymentRecord | null>(null);

  const totalDisbursed = records.filter((r) => r.status === "Paid").reduce((sum, r) => sum + r.amount, 0);
  const scheduledCount = records.filter((r) => r.status === "Scheduled").length;
  const onHoldCount = records.filter((r) => r.status === "On hold").length;

  const markPaid = (id: number) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Paid" } : r)));
    setSelected((sel) => (sel && sel.id === id ? { ...sel, status: "Paid" } : sel));
  };

  return (
    <div>
      <div className="vc-stat-row" style={s.statRow}>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Disbursed this term</p>
            <p style={s.pipelineValue}>₱{totalDisbursed.toLocaleString()}</p>
          </div>
        </div>
        <div style={s.pipelineCard}>
          <div style={s.pipelineTopRow}>
            <p style={s.pipelineLabel}>Scheduled</p>
            <p style={s.pipelineValue}>{scheduledCount}</p>
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
            <p style={s.pipelineLabel}>Next disbursement</p>
            <p style={{ ...s.pipelineValue, fontSize: "1.3rem" }}>Jul 15, 2026</p>
          </div>
        </div>
      </div>

      <div className="vc-table-scroll" style={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th style={s.th}>Scholar</th>
              <th style={s.th}>Amount</th>
              <th style={s.th}>Term</th>
              <th style={s.th}>Scheduled date</th>
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
                <td style={s.td}>{r.scheduledDate}</td>
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
              <DrawerInfoRow label="Scheduled date" value={selected.scheduledDate} />
              <DrawerInfoRow label="Status" value={selected.status} />
            </div>

            <p style={s.drawerSectionLabel}>Payment history</p>
            <div style={s.drawerDocList}>
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

            <div style={s.drawerStageActions}>
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