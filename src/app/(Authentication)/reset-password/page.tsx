"use client";

import { ArrowRight, CheckCircle2, KeyRound, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { executePasswordReset } from "@/lib/api/auth";
import { getPasswordError } from "@/lib/validation";
import { AuthShell } from "../components/AuthShell";
import { InputField } from "../components/InputField";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setError("Missing or invalid password reset token. Please request a new link.");
      return;
    }

    const validationErr = getPasswordError(password);
    if (validationErr) {
      setPasswordError(true);
      setError(validationErr);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError(true);
      setError("Passwords do not match.");
      return;
    }

    setPasswordError(false);
    setConfirmError(false);
    setError("");
    setLoading(true);

    try {
      await executePasswordReset(token, password);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password. The link may have expired.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="grid gap-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-xs">
          <KeyRound className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This password reset link is missing a security token or has already been used.
          </p>
        </div>
        <Button asChild className="h-10 w-full rounded-full text-sm font-semibold">
          <Link href="/forgot-password">Request a new reset link</Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="grid gap-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-xs">
          <CheckCircle2 className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Password Reset Successfully</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your password has been updated. You can now sign in with your new credentials.
          </p>
        </div>
        <Button onClick={() => router.push("/login")} className="h-11 w-full rounded-full text-sm font-semibold">
          Proceed to Sign In <ArrowRight className="size-4 ml-1.5" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <InputField
        id="new-password"
        label="New Password"
        icon={Lock}
        type="password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
        value={password}
        hasError={passwordError}
        onChange={(val) => {
          setPassword(val);
          if (passwordError) setPasswordError(false);
          if (error) setError("");
        }}
        password
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((v) => !v)}
      />

      <InputField
        id="confirm-password"
        label="Confirm New Password"
        icon={Lock}
        type="password"
        placeholder="Re-enter new password"
        autoComplete="new-password"
        value={confirmPassword}
        hasError={confirmError}
        onChange={(val) => {
          setConfirmPassword(val);
          if (confirmError) setConfirmError(false);
          if (error) setError("");
        }}
        password
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((v) => !v)}
      />

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs font-medium text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className="mt-2 h-11 w-full rounded-full text-[0.96rem] font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" /> Updating password…
          </>
        ) : (
          <>
            Set New Password <ArrowRight className="size-4 ml-1.5" />
          </>
        )}
      </Button>

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="text-xs font-semibold text-muted-foreground hover:text-navy underline-offset-2 hover:underline"
        >
          Cancel and return to sign in
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      mode="signin"
      title="Create new password"
      subtitle="Choose a strong password with at least 8 characters."
    >
      <Suspense
        fallback={
          <div className="grid gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </AuthShell>
  );
}
