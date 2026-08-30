"use client";

import React, { useState } from "react";
import { useSidebar } from "@/components/SidebarContext";
import {
  PaymentIcon,
  CheckCircleIcon,
  MenuIcon,
  AMBER_BG,
  AMBER,
  NAVY,
  LINE,
  WHITE,
  TINT,
  s,
} from "@/components/ScholarShared";

interface TuitionRecord {
  id: string;
  term: string;
  amount: string;
  checkNo: string;
  dateIssued: string | null;
  dateClaimed: string | null;
  status: "pending" | "ready_to_claim" | "claimed";
}

const INITIAL_TUITION_HISTORY: TuitionRecord[] = [
  {
    id: "3",
    term: "Mid-year, 2025–2026",
    amount: "₱18,500",
    checkNo: "Pending release",
    dateIssued: null,
    dateClaimed: null,
    status: "pending",
  },
  {
    id: "2",
    term: "1st Sem, 2025–2026",
    amount: "₱18,500",
    checkNo: "CHK-100774",
    dateIssued: "Jan 12, 2026",
    dateClaimed: "Jan 15, 2026",
    status: "claimed",
  },
  {
    id: "1",
    term: "2nd Sem, 2024–2025",
    amount: "₱17,800",
    checkNo: "CHK-100489",
    dateIssued: "Jun 10, 2025",
    dateClaimed: "Jun 14, 2025",
    status: "claimed",
  },
];

const TUITION_SUMMARY = {
  totalDisbursed: "₱36,300",
  nextAmount: "₱18,500",
  nextDate: "Jul 15, 2026",
};

const STATUS_CONFIG = {
  pending: {
    bg: TINT,
    color: "#6b6b66",
    label: "Pending release",
    desc: "Your check for this semester's tuition has not been prepared yet. You'll be notified once it's ready.",
  },
  ready_to_claim: {
    bg: AMBER_BG,
    color: "#6b5220",
    label: "Ready to claim",
    desc: "Your tuition check is ready. Claim it at the ViaScholar office in Matina, Davao City. Bring a valid ID.",
  },
  claimed: {
    bg: "#E9F0DC",
    color: "#4d6b2a",
    label: "Claimed",
    desc: "This semester's tuition disbursement has been received.",
  },
};

function todayReadable(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ScholarPaymentPage() {
  const { toggleMobile } = useSidebar();
  const [payments, setPayments] = useState<TuitionRecord[]>(INITIAL_TUITION_HISTORY);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const claimedCount = payments.filter((p) => p.status === "claimed").length;
  const readyCount = payments.filter((p) => p.status === "ready_to_claim").length;

  const handleConfirmClaim = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "claimed" as const, dateClaimed: todayReadable() } : p))
    );
    setConfirmingId(null);
  };

  return (
    <div>
      <header style={s.topbar}>
        <button className="vd-mobile-toggle" onClick={toggleMobile} style={s.mobileToggle}>
          <MenuIcon />
        </button>
        <div>
          <h1 style={s.topbarGreeting}>Payments</h1>
          <p style={s.topbarSub}>Track your tuition disbursement each semester.</p>
        </div>
      </header>

      <div style={s.mainContent}>
        <div style={s.pageWrap}>
          <div className="vd-stat-row" style={{ ...s.paymentSummaryRow, marginTop: 16 }}>
            <div style={s.statCard}>
              <p style={s.statCardLabel}>Total disbursed</p>
              <p style={s.statCardValue}>{TUITION_SUMMARY.totalDisbursed}</p>
              <p style={{ ...s.statCardCaption, marginTop: "auto" }}>
                {claimedCount} check{claimedCount !== 1 ? "s" : ""} claimed
              </p>
            </div>

            <div style={s.statCard}>
              <p style={s.statCardLabel}>Next semester tuition</p>
              <p style={s.statCardValue}>{TUITION_SUMMARY.nextAmount}</p>
              <p style={{ ...s.statCardCaption, marginTop: "auto" }}>{TUITION_SUMMARY.nextDate}</p>
            </div>

            <div style={s.statCard}>
              <p style={s.statCardLabel}>Payment method</p>
              <p style={s.statCardValue}>Check</p>
              <p style={{ ...s.statCardCaption, marginTop: "auto" }}>Claim at ViaScholar office, Matina</p>
            </div>
          </div>

          <div style={styles.noteCard}>
            <span style={{ color: AMBER, display: "flex", flexShrink: 0, marginTop: 2 }}>
              <PaymentIcon />
            </span>
            <p style={styles.noteText}>
              Tuition support is released as a <strong>check per semester</strong>. Once your check is ready, go to the
              ViaScholar office at <strong>2F Matina Pavilion Bldg, Davao City</strong> with a valid ID. After claiming,
              tap <em>Mark as received</em> below to update your record.
            </p>
          </div>

          {readyCount > 0 && (
            <div style={styles.alertCard}>
              <span style={{ color: "#6b5220", display: "flex", flexShrink: 0 }}>
                <CheckCircleIcon />
              </span>
              <p style={styles.alertText}>
                You have <strong>{readyCount} check{readyCount !== 1 ? "s" : ""}</strong> ready to claim. Visit the office
                to collect your tuition disbursement.
              </p>
            </div>
          )}

          <h3 style={{ ...s.cardHeading, marginBottom: 14, marginTop: 8 }}>Disbursement history</h3>

          <div style={s.paymentList}>
            {payments.map((p) => {
              const cfg = STATUS_CONFIG[p.status];
              const isConfirming = confirmingId === p.id;

              return (
                <div key={p.id} style={styles.paymentCard}>
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
                      <span style={{ ...s.statusTag, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                      <span style={s.paymentAmount}>{p.amount}</span>
                    </div>
                  </div>

                  <p style={styles.statusDesc}>{cfg.desc}</p>

                  {p.status === "ready_to_claim" && (
                    <div style={styles.claimRow}>
                      {isConfirming ? (
                        <>
                          <p style={styles.confirmText}>
                            Confirm that you have physically received check <strong>{p.checkNo}</strong>?
                          </p>
                          <div style={styles.confirmBtns}>
                            <button onClick={() => setConfirmingId(null)} style={styles.cancelBtn}>
                              Cancel
                            </button>
                            <button onClick={() => handleConfirmClaim(p.id)} style={styles.claimBtn}>
                              Yes, I received it
                            </button>
                          </div>
                        </>
                      ) : (
                        <button onClick={() => setConfirmingId(p.id)} style={styles.claimBtn}>
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
      </div>
    </div>
  );
}

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
  noteText: { fontSize: "0.92rem", color: "#3a3a36", lineHeight: 1.6 },
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
  alertText: { fontSize: "0.92rem", color: "#6b5220", lineHeight: 1.5 },
  paymentCard: { background: WHITE, border: `1px solid ${LINE}`, borderRadius: 16, padding: "20px 22px", marginBottom: 12 },
  paymentCardTop: { display: "flex", alignItems: "center", gap: 16, marginBottom: 10, flexWrap: "wrap" },
  paymentRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, marginLeft: "auto" },
  statusDesc: { fontSize: "0.84rem", color: "#7a7a74", lineHeight: 1.55, paddingLeft: 58 },
  claimRow: { marginTop: 16, paddingTop: 14, borderTop: `1px solid ${LINE}`, paddingLeft: 58 },
  confirmText: { fontSize: "0.9rem", color: NAVY, marginBottom: 12, lineHeight: 1.5 },
  confirmBtns: { display: "flex", gap: 12, flexWrap: "wrap" },
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