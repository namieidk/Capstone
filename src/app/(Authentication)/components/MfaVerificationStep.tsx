"use client";

import { Loader2, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { type MfaChallengeResponse, sendMfaChallenge, type TwoFactorMethod, type User } from "@/lib/api/auth";
import { CheckboxField } from "./CheckboxField";
import { InputField } from "./InputField";

interface MfaVerificationStepProps {
  challenge: MfaChallengeResponse;
  purpose: "REGISTER" | "LOGIN";
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

export function MfaVerificationStep({ challenge, purpose, onSuccess, onCancel }: MfaVerificationStepProps) {
  const { completeMfaLogin } = useAuth();
  const [activeMethod, setActiveMethod] = useState<TwoFactorMethod>(challenge.mfaMethod);
  const [destination, setDestination] = useState<string>(challenge.mfaDestination);
  const [code, setCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [sendingMethod, setSendingMethod] = useState<TwoFactorMethod | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const hasSmsOption = challenge.availableMethods.includes("SMS_OTP") && Boolean(challenge.phoneDestination);
  const hasEmailOption = challenge.availableMethods.includes("EMAIL_OTP");

  const handleDispatch = async (method: "EMAIL_OTP" | "SMS_OTP") => {
    setError("");
    setNotice("");
    setSendingMethod(method);
    try {
      const res = await sendMfaChallenge(challenge.mfaToken, method);
      setActiveMethod(res.mfaMethod);
      setDestination(res.mfaDestination);
      setCode("");
      setNotice(`Verification code sent via ${method === "SMS_OTP" ? "SMS" : "email"} to ${res.mfaDestination}.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setSendingMethod(null);
    }
  };

  const handleSwitchMethod = async (method: "EMAIL_OTP" | "SMS_OTP") => {
    if (purpose !== "REGISTER" || method === activeMethod) return;
    await handleDispatch(method);
  };

  const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleaned = code.trim();
    if (!/^\d{6}$/.test(cleaned)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setError("");
    setVerifying(true);
    try {
      const verifiedUser = await completeMfaLogin({
        mfaToken: challenge.mfaToken,
        code: cleaned,
        method: activeMethod,
        rememberDevice,
        remember: challenge.remember,
      });
      onSuccess(verifiedUser);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid verification code. Please try again.");
      setVerifying(false);
    }
  };

  const title = purpose === "REGISTER" ? "Verify your account" : "Two-factor verification";
  const subtitle =
    activeMethod === "AUTHENTICATOR_APP"
      ? "Enter the 6-digit code from your authenticator app."
      : activeMethod === "SMS_OTP"
        ? `Enter the 6-digit code sent via SMS to ${destination || challenge.phoneDestination}.`
        : `Enter the 6-digit code sent to ${destination || challenge.emailDestination}.`;

  return (
    <form onSubmit={handleVerify} className="grid gap-4">
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy">
            <ShieldCheck className="size-5" />
          </div>
          <div className="grid gap-1">
            <h3 className="text-[0.98rem] font-semibold text-navy">{title}</h3>
            <p className="text-[0.84rem] leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {purpose === "REGISTER" && (hasEmailOption || hasSmsOption) && (
          <div className={`mt-3.5 grid gap-2 ${hasEmailOption && hasSmsOption ? "grid-cols-2" : "grid-cols-1"}`}>
            {hasEmailOption && (
              <Button
                type="button"
                variant={activeMethod === "EMAIL_OTP" ? "default" : "outline"}
                size="sm"
                disabled={Boolean(sendingMethod) || verifying}
                onClick={() => handleSwitchMethod("EMAIL_OTP")}
                className="h-9 w-full gap-1.5 rounded-full text-xs font-medium"
              >
                {sendingMethod === "EMAIL_OTP" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Mail className="size-3.5" />
                )}
                Email
              </Button>
            )}

            {hasSmsOption && (
              <Button
                type="button"
                variant={activeMethod === "SMS_OTP" ? "default" : "outline"}
                size="sm"
                disabled={Boolean(sendingMethod) || verifying}
                onClick={() => handleSwitchMethod("SMS_OTP")}
                className="h-9 w-full gap-1.5 rounded-full text-xs font-medium"
              >
                {sendingMethod === "SMS_OTP" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Smartphone className="size-3.5" />
                )}
                Phone SMS
              </Button>
            )}
          </div>
        )}
      </div>

      {notice && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          {notice}
        </div>
      )}

      <InputField
        id="mfaCode"
        label="6-digit verification code"
        icon={ShieldCheck}
        type="text"
        placeholder="Enter 6-digit code"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        hasError={Boolean(error)}
        onChange={(v) => {
          setCode(v.replace(/\D/g, "").slice(0, 6));
          if (error) setError("");
        }}
      />

      {error && <div className="rounded-lg bg-bad-bg px-3 py-2 text-xs font-medium text-bad">{error}</div>}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <CheckboxField
          id="rememberDevice"
          label="Remember this device for 30 days"
          checked={rememberDevice}
          onCheckedChange={(c) => setRememberDevice(c === true)}
        />

        {activeMethod !== "AUTHENTICATOR_APP" && (
          <button
            type="button"
            disabled={Boolean(sendingMethod) || verifying}
            onClick={() => handleDispatch(activeMethod)}
            className="text-[0.82rem] font-semibold text-navy underline underline-offset-2 hover:text-amber disabled:opacity-50 transition-colors"
          >
            {sendingMethod ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>

      <Button type="submit" disabled={verifying} className="h-11 w-full rounded-full text-[0.95rem] font-semibold">
        {verifying ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Verifying…
          </>
        ) : (
          "Verify and continue"
        )}
      </Button>

      <Button
        type="button"
        variant="ghost"
        disabled={verifying}
        onClick={onCancel}
        className="h-9 w-full rounded-full text-xs text-muted-foreground"
      >
        Back
      </Button>
    </form>
  );
}
