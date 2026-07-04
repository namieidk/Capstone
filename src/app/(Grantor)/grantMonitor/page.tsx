"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  MonitorIcon,
  MailIcon,
  TrendUpIcon,
  TrendDownIcon,
  DrawerInfoRow,
  FUNDED_SCHOLARS,
  HEALTH_TAG,
  FundedScholar,
  GOOD,
  BAD,
  s,
} from "@/components/Grantorshared";

export default function GrantorMonitorPage() {
  const [selected, setSelected] = useState<FundedScholar | null>(null);

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
                  <button onClick={() => setSelected(sch)} style={s.tableActionBtn}>
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
              <DrawerInfoRow label="Predicted GWA" value={`${selected.gwa}%`} />
              <DrawerInfoRow label="Trend" value={selected.trend === "up" ? "Improving" : "Declining"} />
              <DrawerInfoRow label="Documents" value={selected.docs} />
              <DrawerInfoRow label="Disbursement" value={selected.disbursement} />
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
          </div>
        </div>
      )}
    </div>
  );
}