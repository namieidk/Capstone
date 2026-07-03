"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  GlobalStyles,
  BrandPanel,
  RoleToggle,
  Field,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SpinnerIcon,
  ROLES,
  ls,
  AMBER,
  WHITE,
  LINE,
  StaffRoleKey,
  StaffSession,
} from "@/components/StaffAuthShared";

// ============================================================
// LOGIN FORM
// ============================================================

interface LoginFormProps {
  role: StaffRoleKey;
  onSuccess: (session: StaffSession) => void;
}

function LoginForm({ role, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeRoleInfo = ROLES.find((r) => r.key === role)!;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }
    setError("");
    setLoading(true);

    // TODO: replace with a real auth call, e.g.:
    // const res = await fetch("/api/auth/staff-login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password, role, remember }),
    // });
    setTimeout(() => {
      setLoading(false);
      onSuccess({ email, role });
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Email address">
        <div style={ls.inputWrap}>
          <span style={ls.inputIcon}>
            <MailIcon />
          </span>
          <input
            type="email"
            style={ls.input}
            placeholder={role === "admin" ? "admin@viascholar.org" : "paolo.reyes@viascholar.org"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Field>

      <Field label="Password">
        <div style={ls.inputWrap}>
          <span style={ls.inputIcon}>
            <LockIcon />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            style={{ ...ls.input, paddingRight: 44 }}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} style={ls.inputEyeBtn}>
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </Field>

      {error && <div style={ls.errorBox}>{error}</div>}

      <div style={ls.formRow}>
        <label style={ls.checkboxLabel}>
          <span
            onClick={() => setRemember((v) => !v)}
            style={{ ...ls.checkbox, background: remember ? AMBER : WHITE, borderColor: remember ? AMBER : LINE }}
          >
            {remember && <CheckCircleIcon />}
          </span>
          Keep me signed in
        </label>
        <button type="button" style={ls.forgotLink}>
          Forgot password?
        </button>
      </div>

      <button type="submit" disabled={loading} style={{ ...ls.submitBtn, opacity: loading ? 0.85 : 1 }}>
        {loading ? (
          <>
            <SpinnerIcon /> Signing in…
          </>
        ) : (
          <>
            Sign in as {activeRoleInfo.label} <ArrowRightIcon />
          </>
        )}
      </button>

      <p style={ls.securityNote}>Protected by session encryption · account locks after 5 failed attempts</p>
    </form>
  );
}

// ============================================================
// SUCCESS STATE
// ============================================================

interface SignedInPanelProps {
  session: StaffSession;
  onReset: () => void;
}

function SignedInPanel({ session, onReset }: SignedInPanelProps) {
  const router = useRouter();
  const roleInfo = ROLES.find((r) => r.key === session.role)!;

  return (
    <div style={ls.successWrap}>
      <span style={ls.successIcon}>
        <CheckCircleIcon />
      </span>
      <h3 style={ls.successTitle}>You&apos;re signed in</h3>
      <p style={ls.successSub}>
        Signed in as <strong>{session.email}</strong>
      </p>
      <div style={ls.successRoleTag}>
        <span style={{ display: "flex" }}>{roleInfo.icon}</span>
        {roleInfo.label}
      </div>
      <button
        style={ls.continueBtn}
        onClick={() => router.push(session.role === "admin" ? "/admin" : "/coordinator")}
      >
        Continue to {session.role === "admin" ? "admin console" : "coordinator dashboard"} <ArrowRightIcon />
      </button>
      <button onClick={onReset} style={ls.switchUserLink}>
        Sign in as a different user
      </button>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function StaffLoginPage() {
  const [role, setRole] = useState<StaffRoleKey>("coordinator");
  const [session, setSession] = useState<StaffSession | null>(null);

  const activeRole = ROLES.find((r) => r.key === role)!;

  return (
    <div className="vl">
      <GlobalStyles />
      <div className="vl-shell">
        <BrandPanel role={role} />

        <div style={ls.formSide}>
          <div className="vl-form-card" style={ls.formCard}>
            {!session ? (
              <>
                <div style={ls.formHeader}>
                  <h2 style={ls.formTitle}>Welcome back</h2>
                  <p style={ls.formSub}>Sign in to your ViaScholar account.</p>
                </div>

                <RoleToggle role={role} onChange={setRole} />
                <p style={ls.roleDesc}>{activeRole.desc}</p>

                <LoginForm role={role} onSuccess={(s) => setSession(s)} />

                <p style={ls.footerNote}>Need access? Contact your program administrator.</p>
              </>
            ) : (
              <SignedInPanel session={session} onReset={() => setSession(null)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}