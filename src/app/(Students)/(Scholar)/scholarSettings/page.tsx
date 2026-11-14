"use client";

import { Bell, CheckCircle2, Loader2, Mail, MessageSquare, RefreshCw, Smartphone } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/components/ToastContext";
import { getMe, getMySettings, type UserSettings, updateMySettings } from "@/lib/api/auth";
import { NAVY, s, ToggleIcon } from "../../../../components/ScholarShared";

interface SettingsSectionProps {
  title: string;
  badge?: string;
  children: ReactNode;
  danger?: boolean;
}

function SettingsSection({ title, badge, children, danger }: SettingsSectionProps) {
  return (
    <div
      style={{
        ...s.settingsSection,
        border: danger ? "1px solid #F0C9BC" : s.settingsSection.border,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <h3
          style={{
            ...s.settingsSectionTitle,
            marginBottom: 0,
            color: danger ? "#8a3a2e" : NAVY,
          }}
        >
          {title}
        </h3>
        {badge && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: "0.74rem",
              fontWeight: 600,
              color: "#2E6F40",
              background: "#EDF7F0",
              border: "1px solid #C6E6D0",
              borderRadius: 999,
              padding: "3px 10px",
            }}
          >
            <CheckCircle2 size={12} />
            {badge}
          </span>
        )}
      </div>
      <div style={s.settingsRowList}>{children}</div>
    </div>
  );
}

interface SettingsRowProps {
  icon?: ReactNode;
  label: string;
  desc: string;
  helper?: string;
  on: boolean;
  disabled?: boolean;
  saving?: boolean;
  onToggle: () => void;
}

function SettingsRow({ icon, label, desc, helper, on, disabled, saving, onToggle }: SettingsRowProps) {
  return (
    <div style={s.settingsRow}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
        {icon && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "#F5F2EB",
              color: NAVY,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <p style={s.settingsRowLabel}>{label}</p>
          <p style={s.settingsRowDesc}>{desc}</p>
          {helper && (
            <p style={{ fontSize: "0.76rem", color: "#5f6b7a", marginTop: 4 }}>
              {helper}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {saving && <Loader2 size={15} className="animate-spin text-muted-foreground" />}
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          disabled={disabled || saving}
          onClick={onToggle}
          style={{
            flexShrink: 0,
            cursor: disabled || saving ? "not-allowed" : "pointer",
            opacity: disabled || saving ? 0.55 : 1,
          }}
        >
          <ToggleIcon on={on} />
        </button>
      </div>
    </div>
  );
}

const DEFAULT_SETTINGS: UserSettings = {
  emailNotifs: true,
  smsNotifs: false,
  forumDigest: true,
  twoFactor: false,
  publicProfile: true,
};

type NotificationKey = "emailNotifs" | "smsNotifs" | "forumDigest";

export default function Settings() {
  const { showToast } = useToast();

  const [toggles, setToggles] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingKeys, setSavingKeys] = useState<Partial<Record<NotificationKey, boolean>>>({});

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [settingsResult, meResult] = await Promise.allSettled([getMySettings(), getMe()]);
      if (settingsResult.status === "fulfilled") {
        setToggles(settingsResult.value);
      } else {
        throw settingsResult.reason;
      }

      if (meResult.status === "fulfilled") {
        setPhoneNumber(meResult.value.scholar_profile?.phone_number || null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load notification preferences.";
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const handleNotificationToggle = async (key: NotificationKey, label: string) => {
    if (loading || savingKeys[key]) return;

    const previousValue = toggles[key];
    const nextValue = !previousValue;

    setToggles((prev) => ({ ...prev, [key]: nextValue }));
    setSavingKeys((prev) => ({ ...prev, [key]: true }));

    try {
      const updated = await updateMySettings({ [key]: nextValue });
      setToggles(updated);
      showToast(`${label} ${nextValue ? "enabled" : "disabled"}.`, "success");
    } catch (err) {
      setToggles((prev) => ({ ...prev, [key]: previousValue }));
      const message = err instanceof Error ? err.message : `Failed to update ${label.toLowerCase()}.`;
      showToast(message, "error");
    } finally {
      setSavingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  const flipLocal = (key: "twoFactor" | "publicProfile") => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ---------------- Page-level navbar ---------------- */}
      <PageHeader title="Settings" subtitle="Manage your notifications, security, and privacy." />

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 4px 60px" }}>
          <SettingsSection title="Notifications" badge={loading ? "Loading..." : loadError ? undefined : "Synced"}>
            {loadError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#FDF2F0",
                  border: "1px solid #F0C9BC",
                  color: "#8a3a2e",
                  fontSize: "0.82rem",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Bell size={15} />
                  {loadError}
                </span>
                <button
                  type="button"
                  onClick={() => void fetchSettings()}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <RefreshCw size={13} />
                  Retry
                </button>
              </div>
            )}

            <SettingsRow
              icon={<Mail size={16} />}
              label="Email notifications"
              desc="Get email updates about your application stages, documents, contracts, and grades."
              on={toggles.emailNotifs}
              disabled={loading || Boolean(loadError)}
              saving={Boolean(savingKeys.emailNotifs)}
              onToggle={() => void handleNotificationToggle("emailNotifs", "Email notifications")}
            />
            <SettingsRow
              icon={<Smartphone size={16} />}
              label="SMS notifications"
              desc="Receive a text preference for time-sensitive reminders."
              helper={
                phoneNumber
                  ? `Registered mobile number: ${phoneNumber}`
                  : "No mobile number saved in your profile yet."
              }
              on={toggles.smsNotifs}
              disabled={loading || Boolean(loadError)}
              saving={Boolean(savingKeys.smsNotifs)}
              onToggle={() => void handleNotificationToggle("smsNotifs", "SMS notifications")}
            />
            <SettingsRow
              icon={<MessageSquare size={16} />}
              label="Forum activity & digest"
              desc="Receive notifications when someone replies to your forum posts or sends weekly highlights."
              on={toggles.forumDigest}
              disabled={loading || Boolean(loadError)}
              saving={Boolean(savingKeys.forumDigest)}
              onToggle={() => void handleNotificationToggle("forumDigest", "Forum activity & digest")}
            />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsRow
              label="Two-factor authentication"
              desc="Add an extra layer of protection to your account."
              on={toggles.twoFactor}
              onToggle={() => flipLocal("twoFactor")}
            />
            <div style={s.settingsRow}>
              <div>
                <p style={s.settingsRowLabel}>Password</p>
                <p style={s.settingsRowDesc}>Last changed 3 months ago.</p>
              </div>
              <button type="button" style={s.settingsActionBtn}>
                Change password
              </button>
            </div>
          </SettingsSection>

          <SettingsSection title="Privacy">
            <SettingsRow
              label="Public profile"
              desc="Allow other scholars to view your forum activity and bio."
              on={toggles.publicProfile}
              onToggle={() => flipLocal("publicProfile")}
            />
          </SettingsSection>

          <SettingsSection title="Account" danger>
            <div style={s.settingsRow}>
              <div>
                <p style={s.settingsRowLabel}>Deactivate account</p>
                <p style={s.settingsRowDesc}>Temporarily disable your ViaScholar account.</p>
              </div>
              <button type="button" style={s.settingsDangerBtn}>
                Deactivate
              </button>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
