"use client";

import React, { useState } from "react";
import {
  PaymentIcon,
  CheckCircleIcon,
  PAYMENT_SUMMARY,
  AMBER_BG,
  AMBER,
  NAVY,
  LINE,
  WHITE,
  TINT,
  s,
} from "@/components/ScholarShared";

// ============================================================
// PAYMENT TYPES (paste into ScholarShared.tsx to replace existing)
// ============================================================

interface PaymentRecord {
  id: string;
  term: string;
  amount: string;
  checkNo: string;
  dateIssued: string | null;
  dateClaimed: string | null;
  status: "pending" | "ready_to_claim" | "claimed";
}

// ============================================================
// MOCK DATA (paste into ScholarShared.tsx to replace existing)
// ============================================================

const INITIAL_PAYMENT_HISTORY: PaymentRecord[] = [
  {
    id: "4",
    term: "Q3 2026",
    amount: "₱8,000",
    checkNo: "Pending release",
    dateIssued: null,
    dateClaimed: null,
    status: "pending",
  },
  {
    id: "3",
    term: "Q2 2026",
    amount: "₱8,000",
    checkNo: "CHK-100774",
    dateIssued: "Apr 10, 2026",
    dateClaimed: null,
    status: "ready_to_claim",
  },
  {
    id: "2",
    term: "Q1 2026",
    amount: "₱8,000",
    checkNo: "CHK-100489",
    dateIssued: "Jan 12, 2026",
    dateClaimed: "Jan 15, 2026",
    status: "claimed",
  },
  {
    id: "1",
    term: "Q4 2025",
    amount: "₱8,000",
    checkNo: "CHK-100231",
    dateIssued: "Oct 10, 2025",
    dateClaimed: "Oct 14, 2025",
    status: "claimed",
  },
];

// ============================================================
// STATUS CONFIG
// ============================================================

const STATUS_CONFIG = {
  pending: {
    bg: TINT,
    color: "#6b6b66",
    label: "Pending release",
    desc: "Your check has not been prepared yet. You'll be notified once it's ready.",
  },
  ready_to_claim: {
    bg: AMBER_BG,
    color: "#6b5220",
    label: "Ready to claim",
    desc: "Your check is ready. Claim it at the ViaScholar office in Matina, Davao City. Bring a valid ID.",
  },
  claimed: {
    bg: "#E9F0DC",
    color: "#4d6b2a",
    label: "Claimed",
    desc: "You have received this check.",
  },
};

// ============================================================
// HELPER — today's date in readable format
// ============================================================

function todayReadable(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ScholarPaymentPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENT_HISTORY);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const claimedCount = payments.filter((p) => p.status === "claimed").length;
  const readyCount = payments.filter((p) => p.status === "ready_to_claim").length;

  const handleConfirmClaim = (id: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "claimed" as const, dateClaimed: todayReadable() }
          : p
      )
    );
    setConfirmingId(null);
  };

  return (
    <div style={s.pageWrap}>
      {/* ── summary stat cards ─────────────────────────────────── */}
      <div className="vd-stat-row" style={s.paymentSummaryRow}>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Total disbursed</p>
          <p style={s.statCardValue}>{PAYMENT_SUMMARY.totalDisbursed}</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>
            {claimedCount} check{claimedCount !== 1 ? "s" : ""} claimed
          </p>
        </div>

        <div style={s.statCard}>
          <p style={s.statCardLabel}>Next disbursement</p>
          <p style={s.statCardValue}>{PAYMENT_SUMMARY.nextAmount}</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>
            {PAYMENT_SUMMARY.nextDate}
          </p>
        </div>

        <div style={s.statCard}>
          <p style={s.statCardLabel}>Payment method</p>
          <p style={s.statCardValue}>Check</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>
            Claim at ViaScholar office, Matina
          </p>
        </div>
      </div>

      {/* ── how it works note ──────────────────────────────────── */}
      <div style={styles.noteCard}>
        <span style={{ color: AMBER, display: "flex", flexShrink: 0, marginTop: 2 }}>
          <PaymentIcon />
        </span>
        <p style={styles.noteText}>
          Scholarship allowances are released as <strong>checks</strong> each
          quarter. Once your check is ready, go to the ViaScholar office at{" "}
          <strong>2F Matina Pavilion Bldg, Davao City</strong> with a valid ID.
          After claiming, tap <em>Mark as received</em> below to update your
          record.
        </p>
      </div>

      {/* ── ready-to-claim alert (only when applicable) ────────── */}
      {readyCount > 0 && (
        <div style={styles.alertCard}>
          <span style={{ color: "#6b5220", display: "flex", flexShrink: 0 }}>
            <CheckCircleIcon />
          </span>
          <p style={styles.alertText}>
            You have <strong>{readyCount} check{readyCount !== 1 ? "s" : ""}</strong> ready
            to claim. Visit the office to collect your allowance.
          </p>
        </div>
      )}

      {/* ── disbursement history ───────────────────────────────── */}
      <h3 style={{ ...s.cardHeading, marginBottom: 14, marginTop: 8 }}>
        Disbursement history
      </h3>

      <div style={s.paymentList}>
        {payments.map((p) => {
          const cfg = STATUS_CONFIG[p.status];
          const isConfirming = confirmingId === p.id;

          return (
            <div key={p.id} style={styles.paymentCard}>
              {/* top row */}
              <div style={styles.paymentCardTop}>
                <span style={s.paymentIconBox}>
                  <PaymentIcon />
                </span>

                <div style={s.paymentInfoCol}>
                  <p style={s.paymentTerm}>{p.term}</p>
                  <p style={s.paymentMeta}>
                    {p.checkNo}
                    {p.dateIssued ? ` · Issued ${p.dateIssued}` : ""}
                    {p.dateClaimed ? ` · Claimed ${p.dateClaimed}` : ""}
                  </p>
                </div>

                <div style={styles.paymentRight}>
                  <span
                    style={{
                      ...s.statusTag,
                      background: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span style={s.paymentAmount}>{p.amount}</span>
                </div>
              </div>

              {/* status description */}
              <p style={styles.statusDesc}>{cfg.desc}</p>

              {/* claim action (only for ready_to_claim) */}
              {p.status === "ready_to_claim" && (
                <div style={styles.claimRow}>
                  {isConfirming ? (
                    <>
                      <p style={styles.confirmText}>
                        Confirm that you have physically received check{" "}
                        <strong>{p.checkNo}</strong>?
                      </p>
                      <div style={styles.confirmBtns}>
                        <button
                          onClick={() => setConfirmingId(null)}
                          style={styles.cancelBtn}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirmClaim(p.id)}
                          style={styles.claimBtn}
                        >
                          Yes, I received it
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmingId(p.id)}
                      style={styles.claimBtn}
                    >
                      Mark as received
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// PAGE-LOCAL STYLES (supplement the shared s.* tokens)
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  noteCard: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    background: "#F2ECDC",
    border: "1px solid #E3CB94",
    borderRadius: 14,
    padding: "18px 20px",
    marginBottom: 20,
  },
  noteText: {
    fontSize: "0.92rem",
    color: "#3a3a36",
    lineHeight: 1.6,
  },
  alertCard: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    background: AMBER_BG,
    border: `1px solid #d4a84b`,
    borderRadius: 14,
    padding: "16px 18px",
    marginBottom: 20,
    fontWeight: 600,
  },
  alertText: {
    fontSize: "0.92rem",
    color: "#6b5220",
    lineHeight: 1.5,
  },
  paymentCard: {
    background: WHITE,
    border: `1px solid ${LINE}`,
    borderRadius: 16,
    padding: "20px 22px",
    marginBottom: 12,
  },
  paymentCardTop: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
  },
  paymentRight: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: 6,
    flexShrink: 0,
  },
  statusDesc: {
    fontSize: "0.84rem",
    color: "#7a7a74",
    lineHeight: 1.55,
    paddingLeft: 58, // aligns under the text col, past the icon
  },
  claimRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: `1px solid ${LINE}`,
    paddingLeft: 58,
  },
  confirmText: {
    fontSize: "0.9rem",
    color: NAVY,
    marginBottom: 12,
    lineHeight: 1.5,
  },
  confirmBtns: {
    display: "flex",
    gap: 12,
  },
  claimBtn: {
    background: NAVY,
    color: WHITE,
    borderRadius: 999,
    padding: "11px 22px",
    fontWeight: 600,
    fontSize: "0.9rem",
    border: "none",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  cancelBtn: {
    background: "none",
    color: NAVY,
    borderRadius: 999,
    padding: "11px 22px",
    fontWeight: 600,
    fontSize: "0.9rem",
    border: `1px solid ${LINE}`,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
};