"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  MonitorIcon,
  MailIcon,
  ClockIcon,
  ArrowRightIcon,
  TrendUpIcon,
  TrendDownIcon,
  DrawerInfoRow,
  FUNDED_SCHOLARS,
  HEALTH_TAG,
  PAYMENT_STATUS_COLORS,
  GRADE_STATUS_COLORS,
  FundedScholar,
  GOOD,
  BAD,
  s,
} from "@/components/Grantorshared";

type DrawerView = "overview" | "history";

export default function GrantorMonitorPage() {
  const [selected, setSelected] = useState<FundedScholar | null>(null);
  const [view, setView] = useState<DrawerView>("overview");

  function openScholar(sch: FundedScholar) {
    setSelected(sch);
    setView("overview");
  }

  function closeDrawer() {
    setSelected(null);
    setView("overview");
  }

  return (
    <div style={s.pageContentTop}>
      <div className="vg-table-scroll" style={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th style={s.th}>Scholar</th>
              <th style={s.th}>GWA</th>
              <th style={s.th}>Documents</th>
              <th style={s.th}>Disbursement</th>
              <th style={s.th}>Status</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {FUNDED_SCHOLARS.map((sch) => (
              <tr key={sch.id} style={s.tr}>
                <td style={s.td}>
                  <div style={s.tdNameRow}>
                    <span style={s.convoAvatar}>{sch.initials}</span>
                    <div>
                      <p style={s.tdName}>{sch.name}</p>
                      <p style={s.tdSub}>{sch.course}</p>
                    </div>
                  </div>
                </td>
                <td style={s.td}>
                  <span style={s.gwaTrendCell}>
                    {sch.gwa}%{" "}
                    {sch.trend === "up" ? (
                      <span style={{ color: GOOD }}>
                        <TrendUpIcon />
                      </span>
                    ) : (
                      <span style={{ color: BAD }}>
                        <TrendDownIcon />
                      </span>
                    )}
                  </span>
                </td>
                <td style={s.td}>{sch.docs}</td>
                <td style={s.td}>{sch.disbursement}</td>
                <td style={s.td}>
                  <span style={{ ...s.stageTag, background: HEALTH_TAG[sch.health].bg, color: HEALTH_TAG[sch.health].text }}>
                    {HEALTH_TAG[sch.health].label}
                  </span>
                </td>
                <td style={s.td}>
                  <button onClick={() => openScholar(sch)} style={s.tableActionBtn}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={s.drawerOverlay} onClick={closeDrawer}>
          <div style={s.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div style={s.drawerHeader}>
              <span style={s.profileAvatar}>{selected.initials}</span>
              <div style={{ flexGrow: 1 }}>
                <h3 style={s.drawerName}>{selected.name}</h3>
                <p style={s.drawerMeta}>{selected.course}</p>
              </div>
              <button onClick={closeDrawer} style={s.drawerCloseBtn}>
                <XCircleIcon />
              </button>
            </div>

            {view === "overview" ? (
              <>
                <p style={s.drawerSectionLabel}>Current standing</p>
                <div style={s.drawerInfoGrid}>
                  <DrawerInfoRow label="Current GWA" value={`${selected.gwa}%`} />
                  <DrawerInfoRow label="Trend" value={selected.trend === "up" ? "Improving" : "Declining"} />
                  <DrawerInfoRow label="Documents" value={selected.docs} />
                  <DrawerInfoRow label="Disbursement" value={selected.disbursement} />
                </div>

                <p style={s.drawerSectionLabel}>This semesters payment</p>
                <div style={s.drawerCurrentPayCard}>
                  <div style={s.drawerCurrentPayLeft}>
                    <span style={s.drawerCurrentPayTerm}>{selected.currentPayment.term}</span>
                    <span style={s.drawerCurrentPayAmount}>
                      ₱{selected.currentPayment.amount.toLocaleString()}
                    </span>
                  </div>
                  <span
                    style={{
                      ...s.stageTag,
                      background: PAYMENT_STATUS_COLORS[selected.currentPayment.status].bg,
                      color: PAYMENT_STATUS_COLORS[selected.currentPayment.status].text,
                    }}
                  >
                    {selected.currentPayment.status}
                  </span>
                </div>

                <div style={s.drawerHistoryBtnRow}>
                  <button onClick={() => setView("history")} style={s.drawerHistoryBtn}>
                    <ClockIcon /> View full history <ArrowRightIcon />
                  </button>
                </div>

                <p style={s.drawerSectionLabel}>Status</p>
                <div style={s.appNoteCard}>
                  <span style={s.appNoteIcon}>
                    <MonitorIcon />
                  </span>
                  <p style={s.appNoteText}>
                    {selected.health === "good" && "This scholar is meeting all retention requirements. No action needed."}
                    {selected.health === "warn" && "Missing a required document. Consider following up with the coordinator."}
                    {selected.health === "bad" && "GWA trending down and documents incomplete. Disbursement is on hold pending review."}
                  </p>
                </div>

                <div style={s.drawerStageActions}>
                  <button style={s.continueBtnSmall}>
                    <MailIcon small /> Message coordinator
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setView("overview")} style={s.backToOverviewBtn}>
                  ← Back to overview
                </button>

                <div style={s.historySection}>
                  <p style={s.drawerSectionLabel}>Grade history</p>
                  <div style={s.historyList}>
                    {selected.gradeHistory.map((g, i) => (
                      <div key={i} style={s.historyRow}>
                        <div style={s.historyRowLeft}>
                          <span style={s.historyRowTerm}>{g.term}</span>
                          <span style={s.historyRowSub}>GWA {g.gwa}%</span>
                        </div>
                        <div style={s.historyRowRight}>
                          <span
                            style={{
                              ...s.stageTag,
                              background: GRADE_STATUS_COLORS[g.status].bg,
                              color: GRADE_STATUS_COLORS[g.status].text,
                            }}
                          >
                            {g.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={s.historySection}>
                  <p style={s.drawerSectionLabel}>Payment history</p>
                  <div style={s.historyList}>
                    {selected.paymentHistory.map((p, i) => (
                      <div key={i} style={s.historyRow}>
                        <div style={s.historyRowLeft}>
                          <span style={s.historyRowTerm}>{p.term}</span>
                          <span style={s.historyRowSub}>{p.date}</span>
                        </div>
                        <div style={s.historyRowRight}>
                          <span style={s.historyRowValue}>₱{p.amount.toLocaleString()}</span>
                          <span
                            style={{
                              ...s.stageTag,
                              background: PAYMENT_STATUS_COLORS[p.status].bg,
                              color: PAYMENT_STATUS_COLORS[p.status].text,
                            }}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}