import React from "react";
import { PaymentIcon, PAYMENT_HISTORY, PAYMENT_SUMMARY, AMBER_BG, s } from "@/components/ScholarShared";

export default function ScholarPaymentPage() {
  return (
    <div style={s.pageWrap}>
      <h2 style={s.pageHeading}>Payment</h2>
      <p style={s.pageSub}>Track your scholarship disbursements.</p>

      <div className="vd-stat-row" style={s.paymentSummaryRow}>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Total disbursed</p>
          <p style={s.statCardValue}>{PAYMENT_SUMMARY.totalDisbursed}</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>Since scholarship start</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Next disbursement</p>
          <p style={s.statCardValue}>{PAYMENT_SUMMARY.nextAmount}</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>{PAYMENT_SUMMARY.nextDate}</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statCardLabel}>Payment method</p>
          <p style={s.statCardValue}>Bank</p>
          <p style={{ ...s.statCardCaption, marginTop: "auto" }}>Transfer to account on file</p>
        </div>
      </div>

      <h3 style={{ ...s.cardHeading, marginBottom: 14 }}>Disbursement history</h3>
      <div style={s.paymentList}>
        {PAYMENT_HISTORY.map((p) => (
          <div key={p.term} style={s.paymentRow}>
            <span style={s.paymentIconBox}>
              <PaymentIcon />
            </span>
            <div style={s.paymentInfoCol}>
              <p style={s.paymentTerm}>{p.term}</p>
              <p style={s.paymentMeta}>
                {p.date} · {p.method}
              </p>
            </div>
            <span
              style={{
                ...s.statusTag,
                background: p.status === "paid" ? "#E9F0DC" : p.status === "processing" ? "#F3E6C8" : AMBER_BG,
                color: p.status === "paid" ? "#4d6b2a" : "#6b5220",
              }}
            >
              {p.status}
            </span>
            <span style={s.paymentAmount}>{p.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}