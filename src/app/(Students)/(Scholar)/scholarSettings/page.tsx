"use client";

import {
  Bell,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  MessageSquare,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { type FormEvent, type ReactNode, useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  changeMyPassword,
  getMe,
  getMySettings,
  initiateTwoFactorSetup,
  type TwoFactorMethod,
  type TwoFactorSetupResponse,
  type UserSettings,
  updateMySettings,
  verifyTwoFactorSetup,
} from "@/lib/api/auth";
import { getPasswordError } from "@/lib/validation";
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
  helper?: ReactNode;
  action?: ReactNode;
  on: boolean;
  disabled?: boolean;
  saving?: boolean;
  onToggle: () => void;
}

function SettingsRow({ icon, label, desc, helper, action, on, disabled, saving, onToggle }: SettingsRowProps) {
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
          {helper && <div style={{ fontSize: "0.76rem", color: "#5f6b7a", marginTop: 4 }}>{helper}</div>}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {action}
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

// Default all switches to Off while syncing so every toggle renders uniformly during load.
const DEFAULT_SETTINGS: UserSettings = {
  emailNotifs: false,
  smsNotifs: false,
  forumDigest: false,
  twoFactor: false,
  twoFactorMethod: null,
  publicProfile: false,
  passwordChangedAt: null,
};

const TWO_FACTOR_METHOD_LABELS: Record<TwoFactorMethod, string> = {
  EMAIL_OTP: "Email OTP",
  SMS_OTP: "SMS OTP",
  AUTHENTICATOR_APP: "Authenticator App",
};

function formatPasswordChangedDesc(passwordChangedAt: string | null): string {
  if (!passwordChangedAt) {
    return "Update your account password regularly to keep your account secure.";
  }
  const parsed = new Date(passwordChangedAt);
  if (Number.isNaN(parsed.getTime())) {
    return "Password updated recently.";
  }
  return `Last changed on ${parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}.`;
}

type NotificationKey = "emailNotifs" | "smsNotifs" | "forumDigest";

export default function Settings() {
  const { showToast } = useToast();

  const [toggles, setToggles] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingKeys, setSavingKeys] = useState<Partial<Record<NotificationKey | "twoFactor", boolean>>>({});

  // Two-factor setup dialog state
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>("EMAIL_OTP");
  const [setupData, setSetupData] = useState<TwoFactorSetupResponse | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Change password dialog state
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

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
        setUserEmail(meResult.value.email || null);
        setPhoneNumber(meResult.value.scholar_profile?.phone_number || null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load settings.";
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

  const openTwoFactorDialog = (initialMethod?: TwoFactorMethod) => {
    setSelectedMethod(initialMethod ?? toggles.twoFactorMethod ?? "EMAIL_OTP");
    setSetupData(null);
    setVerifyCode("");
    setTwoFactorError(null);
    setCopiedKey(false);
    setTwoFactorOpen(true);
  };

  const handleTwoFactorToggle = async () => {
    if (loading || savingKeys.twoFactor) return;

    if (!toggles.twoFactor) {
      openTwoFactorDialog();
      return;
    }

    const prevTwoFactor = toggles.twoFactor;
    const prevMethod = toggles.twoFactorMethod;

    setToggles((prev) => ({ ...prev, twoFactor: false, twoFactorMethod: null }));
    setSavingKeys((prev) => ({ ...prev, twoFactor: true }));

    try {
      const updated = await updateMySettings({ twoFactor: false });
      setToggles(updated);
      showToast("Two-factor authentication disabled.", "success");
    } catch (err) {
      setToggles((prev) => ({ ...prev, twoFactor: prevTwoFactor, twoFactorMethod: prevMethod }));
      const message = err instanceof Error ? err.message : "Failed to disable two-factor authentication.";
      showToast(message, "error");
    } finally {
      setSavingKeys((prev) => ({ ...prev, twoFactor: false }));
    }
  };

  const handleStartTwoFactorSetup = async (methodToStart: TwoFactorMethod = selectedMethod) => {
    if (methodToStart === "SMS_OTP" && !phoneNumber) {
      setTwoFactorError("Please add a mobile phone number in your profile before enabling SMS OTP.");
      return;
    }

    setSetupLoading(true);
    setTwoFactorError(null);
    try {
      const data = await initiateTwoFactorSetup(methodToStart);
      setSetupData(data);
      setVerifyCode("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start two-factor setup.";
      setTwoFactorError(message);
    } finally {
      setSetupLoading(false);
    }
  };

  const handleVerifyTwoFactor = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!setupData) return;

    const trimmed = verifyCode.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setTwoFactorError("Please enter the 6-digit verification code.");
      return;
    }

    setVerifying(true);
    setTwoFactorError(null);
    try {
      const updated = await verifyTwoFactorSetup(setupData.method, trimmed);
      setToggles(updated);
      setTwoFactorOpen(false);
      showToast(
        `Two-factor authentication enabled (${TWO_FACTOR_METHOD_LABELS[setupData.method]}).`,
        "success",
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid verification code.";
      setTwoFactorError(message);
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyManualKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch {
      showToast("Unable to copy key to clipboard.", "error");
    }
  };

  const openPasswordDialog = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordError(null);
    setPasswordOpen(true);
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      setPasswordError("Please enter your current password.");
      return;
    }

    const policyError = getPasswordError(newPassword);
    if (policyError) {
      setPasswordError(policyError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from your current password.");
      return;
    }

    setChangingPassword(true);
    setPasswordError(null);
    try {
      const res = await changeMyPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setToggles((prev) => ({ ...prev, passwordChangedAt: res.passwordChangedAt }));
      setPasswordOpen(false);
      showToast(res.message || "Password updated successfully.", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordError(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const flipLocal = (key: "publicProfile") => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const syncBadge = loading ? "Syncing..." : loadError ? undefined : "Synced";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* ---------------- Page-level navbar ---------------- */}
      <PageHeader title="Settings" subtitle="Manage your notifications, security, and privacy." />

      <div style={{ ...s.mainContent, padding: s.mainContent.padding, flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 4px 60px" }}>
          <SettingsSection title="Notifications" badge={syncBadge}>
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

          <SettingsSection title="Security" badge={syncBadge}>
            <SettingsRow
              icon={<ShieldCheck size={16} />}
              label="Two-factor authentication"
              desc="Protect your account with Email OTP, SMS OTP, or an Authenticator App."
              helper={
                toggles.twoFactor && toggles.twoFactorMethod ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      color: NAVY,
                      fontWeight: 600,
                    }}
                  >
                    Active method: {TWO_FACTOR_METHOD_LABELS[toggles.twoFactorMethod]}
                  </span>
                ) : (
                  "Choose Email OTP, SMS OTP, or Authenticator App when enabling."
                )
              }
              action={
                toggles.twoFactor ? (
                  <button
                    type="button"
                    disabled={loading || Boolean(loadError) || Boolean(savingKeys.twoFactor)}
                    onClick={() => openTwoFactorDialog()}
                    style={{
                      ...s.settingsActionBtn,
                      padding: "6px 12px",
                      fontSize: "0.78rem",
                      cursor: loading || loadError ? "not-allowed" : "pointer",
                      opacity: loading || loadError ? 0.55 : 1,
                    }}
                  >
                    Change method
                  </button>
                ) : null
              }
              on={toggles.twoFactor}
              disabled={loading || Boolean(loadError)}
              saving={Boolean(savingKeys.twoFactor)}
              onToggle={() => void handleTwoFactorToggle()}
            />
            <div style={s.settingsRow}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
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
                  <KeyRound size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={s.settingsRowLabel}>Password</p>
                  <p style={s.settingsRowDesc}>
                    {loading ? "Syncing password status..." : formatPasswordChangedDesc(toggles.passwordChangedAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openPasswordDialog}
                disabled={loading || Boolean(loadError)}
                style={{
                  ...s.settingsActionBtn,
                  cursor: loading || loadError ? "not-allowed" : "pointer",
                  opacity: loading || loadError ? 0.55 : 1,
                }}
              >
                Change password
              </button>
            </div>
          </SettingsSection>

          <SettingsSection title="Privacy">
            <SettingsRow
              label="Public profile"
              desc="Allow other scholars to view your forum activity and bio."
              on={toggles.publicProfile}
              disabled={loading}
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

      {/* ---------------- Two-Factor Authentication Setup Dialog ---------------- */}
      <Dialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-navy">
              {toggles.twoFactor ? "Change Two-Factor Method" : "Enable Two-Factor Authentication"}
            </DialogTitle>
            <DialogDescription>
              {setupData
                ? "Enter the 6-digit verification code to confirm your setup."
                : "Choose how you would like to receive your verification codes."}
            </DialogDescription>
          </DialogHeader>

          {!setupData ? (
            <div className="grid gap-3 py-2">
              {(
                [
                  {
                    id: "EMAIL_OTP" as const,
                    title: "Email OTP",
                    desc: userEmail ? `Send a 6-digit code to ${userEmail}` : "Send a 6-digit code to your account email",
                    icon: Mail,
                    disabled: false,
                  },
                  {
                    id: "SMS_OTP" as const,
                    title: "SMS OTP",
                    desc: phoneNumber
                      ? `Send a 6-digit text code to ${phoneNumber}`
                      : "Add a mobile phone number in your profile first",
                    icon: Smartphone,
                    disabled: !phoneNumber,
                  },
                  {
                    id: "AUTHENTICATOR_APP" as const,
                    title: "Authenticator App",
                    desc: "Scan a QR code with Google Authenticator, Authy, or 1Password",
                    icon: QrCode,
                    disabled: false,
                  },
                ] as const
              ).map((option) => {
                const Icon = option.icon;
                const isSelected = selectedMethod === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={option.disabled || setupLoading}
                    onClick={() => {
                      setSelectedMethod(option.id);
                      setTwoFactorError(null);
                    }}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-navy bg-[#F5F7FA] ring-1 ring-navy/20"
                        : "border-border bg-card hover:bg-muted/40"
                    } ${option.disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"}`}
                  >
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F2EB] text-navy">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-navy">{option.title}</span>
                        {toggles.twoFactor && toggles.twoFactorMethod === option.id && (
                          <span className="rounded-full bg-[#EDF7F0] px-2 py-0.5 text-[11px] font-semibold text-[#2E6F40]">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{option.desc}</p>
                    </div>
                  </button>
                );
              })}

              {twoFactorError && (
                <div className="rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">{twoFactorError}</div>
              )}

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setTwoFactorOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={setupLoading || (selectedMethod === "SMS_OTP" && !phoneNumber)}
                  onClick={() => void handleStartTwoFactorSetup()}
                >
                  {setupLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Preparing...
                    </>
                  ) : selectedMethod === "AUTHENTICATOR_APP" ? (
                    "Generate QR Code"
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={(e) => void handleVerifyTwoFactor(e)} className="grid gap-4 py-2">
              {setupData.method === "AUTHENTICATOR_APP" ? (
                <div className="grid gap-3 rounded-xl border border-border bg-muted/20 p-3.5 text-center">
                  {setupData.qrCodeDataUrl && (
                    <div className="mx-auto rounded-lg border border-border bg-white p-2">
                      <Image
                        src={setupData.qrCodeDataUrl}
                        alt="Authenticator App QR Code"
                        width={160}
                        height={160}
                        unoptimized
                        className="size-40 object-contain"
                      />
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Scan the QR code in your authenticator app or copy the setup key below:
                  </p>
                  {setupData.manualKey && (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left">
                      <code className="truncate font-mono text-xs text-navy">{setupData.manualKey}</code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 shrink-0 px-2 text-xs"
                        onClick={() => void handleCopyManualKey(setupData.manualKey ?? "")}
                      >
                        {copiedKey ? <Check className="size-3.5 text-good" /> : <Copy className="size-3.5" />}
                        {copiedKey ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid gap-2 rounded-xl border border-border bg-muted/20 p-3.5 text-xs text-muted-foreground">
                  <p>
                    A 6-digit verification code was prepared for{" "}
                    <strong className="text-foreground">{setupData.destination}</strong> (valid for{" "}
                    {setupData.expiresInMinutes} minutes).
                  </p>
                  {setupData.simulationCode && (
                    <div className="flex items-center justify-between gap-2 rounded-lg border border-amber/30 bg-[#FFF9EB] px-3 py-2 text-xs text-[#8a6116]">
                      <span>
                        Preview code: <strong className="font-mono tracking-wider">{setupData.simulationCode}</strong>
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 border-amber/40 bg-white px-2.5 text-xs"
                        onClick={() => setVerifyCode(setupData.simulationCode ?? "")}
                      >
                        Fill code
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-1.5">
                <Label htmlFor="two-factor-code">6-digit verification code</Label>
                <Input
                  id="two-factor-code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={verifyCode}
                  onChange={(e) => {
                    setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    if (twoFactorError) setTwoFactorError(null);
                  }}
                  className="text-center font-mono text-base tracking-[0.35em]"
                />
              </div>

              {twoFactorError && (
                <div className="rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">{twoFactorError}</div>
              )}

              <DialogFooter className="flex-wrap justify-between gap-2 sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={setupLoading || verifying}
                  onClick={() => {
                    setSetupData(null);
                    setVerifyCode("");
                    setTwoFactorError(null);
                  }}
                >
                  Choose another method
                </Button>
                <div className="flex items-center gap-2">
                  {setupData.method !== "AUTHENTICATOR_APP" && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={setupLoading || verifying}
                      onClick={() => void handleStartTwoFactorSetup(setupData.method)}
                    >
                      Resend
                    </Button>
                  )}
                  <Button type="submit" disabled={verifying || verifyCode.length !== 6}>
                    {verifying ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      "Verify & Enable"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ---------------- Change Password Dialog ---------------- */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-navy">Change Password</DialogTitle>
            <DialogDescription>
              Use at least 8 characters with uppercase, lowercase, a number, and a special character.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => void handlePasswordSubmit(e)} className="grid gap-3.5 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute inset-y-0 right-2.5 inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute inset-y-0 right-2.5 inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-2.5 inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">{passwordError}</div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" disabled={changingPassword} onClick={() => setPasswordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Updating...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
