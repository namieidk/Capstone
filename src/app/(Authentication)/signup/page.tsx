"use client";

import { ArrowRight, Loader2, Lock, Mail, School, User } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { CheckboxField } from "@/components/auth/CheckboxField";
import { TRACKS } from "@/components/auth/data";
import { InputField } from "@/components/auth/InputField";
import { ModeTabs } from "@/components/auth/ModeTabs";
import { SocialBlock } from "@/components/auth/SocialBlock";
import { SuccessPanel } from "@/components/auth/SuccessPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

function SignUpForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [track, setTrack] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !school.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms and Privacy Policy to continue.");
      return;
    }
    setError("");
    setLoading(true);

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone_number: "00000000000",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <InputField
        id="fullName"
        label="Full name"
        icon={User}
        placeholder="Juan Dela Cruz"
        autoComplete="name"
        value={name}
        onChange={setName}
      />
      <InputField
        id="signup-email"
        label="Email address"
        icon={Mail}
        type="email"
        placeholder="you@email.com"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <InputField
        id="school"
        label="School / university"
        icon={School}
        placeholder="University of Mindanao"
        autoComplete="organization"
        value={school}
        onChange={setSchool}
      />

      <div className="grid gap-1.5">
        <Label htmlFor="track" className="text-[0.94rem] font-medium text-navy">
          Scholarship track
        </Label>
        <Select value={track} onValueChange={setTrack} required>
          <SelectTrigger id="track" className="h-10 w-full rounded-lg text-foreground">
            <SelectValue placeholder="Select your track" />
          </SelectTrigger>
          <SelectContent>
            {TRACKS.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <InputField
        id="signup-password"
        label="Password"
        icon={Lock}
        type="password"
        placeholder="Create password"
        autoComplete="new-password"
        hint="At least 8 characters."
        value={password}
        onChange={setPassword}
        password
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((v) => !v)}
      />
      <InputField
        id="confirm-password"
        label="Confirm password"
        icon={Lock}
        type="password"
        placeholder="Re-enter password"
        autoComplete="new-password"
        value={confirm}
        onChange={setConfirm}
        password
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((v) => !v)}
      />

      {error && <div className="rounded-lg bg-bad-bg px-3 py-2 text-sm font-medium text-bad">{error}</div>}

      <CheckboxField
        id="agree"
        checked={agree}
        onCheckedChange={(v) => setAgree(v === true)}
        label="I agree to the Terms and Privacy Policy"
        className="mb-1"
      />

      <Button type="submit" disabled={loading} className="h-11 w-full rounded-full text-[0.96rem] font-semibold">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Creating account…
          </>
        ) : (
          <>
            Create account <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}

function SignedUpPanel() {
  const { user } = useAuth();
  const continuePath = user?.role === "SCHOLAR" ? "/scholardashboard" : "/ApplicantsDashboard";

  return (
    <SuccessPanel
      title="Account created"
      message={
        <>
          Welcome, <strong>{user?.first_name}</strong>
        </>
      }
      roleLabel="Student account"
      continueHref={continuePath}
    />
  );
}

export default function SignupPage() {
  const { user, loading } = useAuth();

  return (
    <AuthShell mode="signup" title="Create your account" subtitle="Start your scholarship application in minutes.">
      {loading ? (
        <div className="grid gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      ) : !user ? (
        <div className="grid gap-6">
          <ModeTabs active="signup" />
          <SignUpForm />
          <SocialBlock />
          <p className="text-center text-[0.92rem] text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-navy underline underline-offset-2 hover:text-amber">
              Sign in
            </Link>
          </p>
        </div>
      ) : (
        <SignedUpPanel />
      )}
    </AuthShell>
  );
}
