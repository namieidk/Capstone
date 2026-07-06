"use client";

import React, { useState } from "react";
import {
  XCircleIcon,
  MonitorIcon,
  MailIcon,
  TrendUpIcon,
  TrendDownIcon,
  DrawerInfoRow,
  MONITOR_SCHOLARS,
  HEALTH_TAG,
  MonitorScholar,
  GOOD,
  BAD,
  s,
} from "@/components/Adminshared";

export default function AdminMonitorPage() {
  const [selected, setSelected] = useState<MonitorScholar | null>(null);

  return (
    <div>
      <div className="va-table-scroll" style={s.tableWrap}>
        <table>
          <thead>
            <tr>
              <th style={s.th}>Scholar</th>
              <th style={s.th}>Coordinator</th>
              <th style={s.th}>GWA</th>
              <th style={s.th}>Documents</th>
              <th style={s.th}>Disbursement</th>
              <th style={s.th}>Status</th>
              <th style={s.th}></th>
            </tr>
          </thead>
          <tbody>
            {MONITOR_SCHOLARS.map((sch) => (
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
                <td style={s.td}>{sch.coordinator}</td>
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
              <DrawerInfoRow label="Coordinator" value={selected.coordinator} />
              <DrawerInfoRow label="Predicted GWA" value={`${selected.gwa}%`} />
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
                {selected.health === "warn" && "Missing a required document. A reminder message is recommended."}
                {selected.health === "bad" && "GWA trending down and documents incomplete. Disbursement is on hold pending review."}
              </p>
            </div>
            <div style={s.drawerStageActions}>
              <button style={s.continueBtnSmall}>
                <MailIcon small /> Message scholar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}