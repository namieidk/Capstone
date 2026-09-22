"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "@/lib/api/auth";
import { AuthShell } from "../components/AuthShell";
import { InputField } from "../components/InputField";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError(true);
      setError("Please enter your email address.");
      return;
    }

    setEmailError(false);
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email.trim());
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="signin" title="Reset password" subtitle="Enter your email to receive a password recovery link.">
      {submitted ? (
        <div className="grid gap-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 shadow-xs">
            <CheckCircle2 className="size-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If an account matches <strong>{email}</strong>, we have sent instructions to reset your password.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground text-left space-y-1.5">
            <p className="font-semibold text-foreground">Didn&apos;t receive an email?</p>
            <p>• Check your spam or junk folder.</p>
            <p>• Make sure the email was registered with ViaScholar.</p>
            <p>• Links expire after 30 minutes for security.</p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="h-10 w-full rounded-full text-sm font-semibold"
            >
              Try another email
            </Button>
            <Button asChild variant="ghost" className="h-10 w-full rounded-full text-sm">
              <Link href="/login" className="flex items-center justify-center gap-1.5">
                <ArrowLeft className="size-4" /> Back to sign in
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <InputField
            id="email"
            label="Email address"
            icon={Mail}
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            value={email}
            hasError={emailError}
            onChange={(val) => {
              setEmail(val);
              if (emailError) setEmailError(false);
              if (error) setError("");
            }}
          />

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-1 h-11 w-full rounded-full text-[0.96rem] font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" /> Sending link…
              </>
            ) : (
              <>
                Send reset link <ArrowRight className="size-4 ml-1.5" />
              </>
            )}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-navy underline-offset-2 hover:underline"
            >
              <ArrowLeft className="size-3.5" /> Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}
