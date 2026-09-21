"use client";

import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { AuthShell } from "../components/AuthShell";
import { CheckboxField } from "../components/CheckboxField";
import { DASHBOARD_MAP, roleLabel } from "../components/data";
import { InputField } from "../components/InputField";
import { ModeTabs } from "../components/ModeTabs";
import { SocialBlock } from "../components/SocialBlock";
import { SuccessPanel } from "../components/SuccessPanel";

function SignInForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isEmailMissing = !email.trim();
    const isPasswordMissing = !password.trim();

    if (isEmailMissing || isPasswordMissing) {
      setEmailError(isEmailMissing);
      setPasswordError(isPasswordMissing);
      if (isEmailMissing && isPasswordMissing) {
        setError("Please enter both your email and password.");
      } else if (isEmailMissing) {
        setError("Please enter your email address.");
      } else {
        setError("Please enter your password.");
      }
      return;
    }

    setEmailError(false);
    setPasswordError(false);
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(email, password, remember);
      const dashboardPath = DASHBOARD_MAP[loggedInUser.role] ?? "/";
      router.push(dashboardPath);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      setEmailError(true);
      setPasswordError(true);
      setLoading(false);
    }
  };

  return (
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
      <InputField
        id="password"
        label="Password"
        icon={Lock}
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
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

      {error && <div className="rounded-lg bg-bad-bg px-3 py-2 text-sm font-medium text-bad">{error}</div>}

      <div className="flex items-center justify-between gap-3">
        <CheckboxField
          id="remember"
          checked={remember}
          onCheckedChange={(v) => setRemember(v === true)}
          label="Keep me signed in"
        />
        <button
          type="button"
          className="text-[0.88rem] font-medium text-muted-foreground underline underline-offset-2 hover:text-navy"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" disabled={loading} className="mt-1 h-11 w-full rounded-full text-[0.96rem] font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Signing in…
          </>
        ) : (
          <>
            Sign in <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function SignedInPanel() {
  const { user } = useAuth();
  const role = user?.role ?? "";
  const dashboardPath = DASHBOARD_MAP[role] ?? "/";

  return (
    <SuccessPanel
      title="You're signed in"
      message={
        <>
          Welcome, <strong>{user?.first_name}</strong>
        </>
      }
      roleLabel={roleLabel(role)}
      continueHref={dashboardPath}
    />
  );
}

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const target = DASHBOARD_MAP[user.role] ?? "/";
      router.replace(target);
    }
  }, [user, loading, router]);

  return (
    <AuthShell mode="signin" title="Welcome back" subtitle="Sign in to your ViaScholar account.">
      {loading ? (
        <div className="grid gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      ) : !user ? (
        <div className="grid gap-6">
          <ModeTabs active="signin" />
          <SignInForm />
          <SocialBlock />
          <p className="text-center text-[0.92rem] text-muted-foreground">
            New to ViaScholar?{" "}
            <Link href="/signup" className="font-semibold text-navy underline underline-offset-2 hover:text-amber">
              Create an account
            </Link>
          </p>
        </div>
      ) : (
        <SignedInPanel />
      )}
    </AuthShell>
  );
}
