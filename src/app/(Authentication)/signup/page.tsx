"use client";

import { cn } from "cn";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [track, setTrack] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};

    if (!firstName.trim()) newErrors.firstName = true;
    if (!lastName.trim()) newErrors.lastName = true;
    if (!email.trim()) newErrors.email = true;
    if (!school.trim()) newErrors.school = true;
    if (!track.trim()) newErrors.track = true;
    if (!password.trim()) newErrors.password = true;
    if (!confirm.trim()) newErrors.confirm = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirm) {
      setErrors({ password: true, confirm: true });
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setErrors({ agree: true });
      setError("Please agree to the Terms and Privacy Policy to continue.");
      return;
    }

    setErrors({});
    setError("");
    setLoading(true);

    try {
      await register({
        email,
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
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
      <div className="grid grid-cols-2 gap-3">
        <InputField
          id="firstName"
          label="First name"
          icon={User}
          placeholder="Juan"
          autoComplete="given-name"
          value={firstName}
          hasError={!!errors.firstName}
          onChange={(val) => {
            setFirstName(val);
            clearError("firstName");
          }}
        />
        <InputField
          id="lastName"
          label="Last name"
          icon={User}
          placeholder="Dela Cruz"
          autoComplete="family-name"
          value={lastName}
          hasError={!!errors.lastName}
          onChange={(val) => {
            setLastName(val);
            clearError("lastName");
          }}
        />
      </div>
      <InputField
        id="signup-email"
        label="Email address"
        icon={Mail}
        type="email"
        placeholder="you@email.com"
        autoComplete="email"
        value={email}
        hasError={!!errors.email}
        onChange={(val) => {
          setEmail(val);
          clearError("email");
        }}
      />
      <InputField
        id="school"
        label="School / university"
        icon={School}
        placeholder="University of Mindanao"
        autoComplete="organization"
        value={school}
        hasError={!!errors.school}
        onChange={(val) => {
          setSchool(val);
          clearError("school");
        }}
      />

      <div className="grid gap-1.5">
        <Label
          htmlFor="track"
          className={cn("text-[0.94rem] font-medium transition-colors", errors.track ? "text-bad" : "text-navy")}
        >
          Scholarship track
        </Label>
        <Select
          value={track}
          onValueChange={(val) => {
            setTrack(val);
            clearError("track");
          }}
          required
        >
          <SelectTrigger
            id="track"
            className={cn(
              "h-10 w-full rounded-md text-foreground transition-colors",
              errors.track &&
                "border-bad/80 text-bad focus-visible:border-bad focus-visible:ring-bad/30 dark:border-bad",
            )}
          >
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
        hasError={!!errors.password}
        onChange={(val) => {
          setPassword(val);
          clearError("password");
        }}
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
        hasError={!!errors.confirm}
        onChange={(val) => {
          setConfirm(val);
          clearError("confirm");
        }}
        password
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((v) => !v)}
      />

      {error && <div className="rounded-lg bg-bad-bg px-3 py-2 text-sm font-medium text-bad">{error}</div>}

      <CheckboxField
        id="agree"
        checked={agree}
        onCheckedChange={(v) => {
          setAgree(v === true);
          clearError("agree");
        }}
        label="I agree to the Terms and Privacy Policy"
        className={cn("mb-1", errors.agree && "text-bad")}
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
