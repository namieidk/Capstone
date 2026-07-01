"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GlobalStyles,
  BrandPanel,
  ModeLinkTabs,
  Field,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GoogleIcon,
  SpinnerIcon,
  UserIcon,
  ls,
  AMBER,
  LINE,
  AuthSession,
} from "../../../components/StudentAuth";

const backLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 14,
  fontWeight: 500,
  color: "#6B6355",
  textDecoration: "none",
  marginBottom: 24,
};

function BackToLandingLink() {
  return (
    <Link href="/" style={backLinkStyle}>
      Go back to landing page <ArrowRightIcon />
    </Link>
  );
}

interface SignInFormProps {
  onSuccess: (session: AuthSession) => void;
}

function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      document.cookie = `vls_session=demo; path=/; max-age=${60 * 60 * 24 * 7}`;
      onSuccess({ name: email.split("@")[0], email });
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
            placeholder="you@email.com"
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
            style={{ ...ls.checkbox, background: remember ? AMBER : "#FFFFFF", borderColor: remember ? AMBER : LINE }}
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
            Sign in <ArrowRightIcon />
          </>
        )}
      </button>
    </form>
  );
}

interface SignedInPanelProps {
  session: AuthSession;
  onReset: () => void;
}

function SignedInPanel({ session, onReset }: SignedInPanelProps) {
  const router = useRouter();
  return (
    <div style={ls.successWrap}>
      <span style={ls.successIcon}>
        <CheckCircleIcon />
      </span>
      <h3 style={ls.successTitle}>You&apos;re signed in</h3>
      <p style={ls.successSub}>
        Welcome, <strong>{session.name}</strong>
      </p>
      <div style={ls.successRoleTag}>
        <span style={{ display: "flex" }}>
          <UserIcon />
        </span>
        Student account
      </div>
      <button style={ls.continueBtn} onClick={() => router.push("/dashboard")}>
        Continue to student dashboard <ArrowRightIcon />
      </button>
      <button
        onClick={() => {
          document.cookie = "vls_session=; path=/; max-age=0";
          onReset();
        }}
        style={ls.switchUserLink}
      >
        Sign in as a different user
      </button>
    </div>
  );
}

export default function LoginPage() {
  const [session, setSession] = useState<AuthSession | null>(null);

  return (
    <div className="vls">
      <GlobalStyles />
      <div className="vls-shell">
        <BrandPanel mode="signin" />

        <div style={ls.formSide}>
          <div className="vls-form-card" style={ls.formCard}>
            <BackToLandingLink />

            {!session ? (
              <>
                <div style={ls.formHeader}>
                  <h2 style={ls.formTitle}>Welcome back</h2>
                  <p style={ls.formSub}>Sign in to your ViaScholar student account.</p>
                </div>

                <ModeLinkTabs active="signin" LinkComponent={Link} />

                <SignInForm onSuccess={(s) => setSession(s)} />

                <div style={ls.dividerRow}>
                  <span style={ls.dividerLine} />
                  <span style={ls.dividerText}>or continue with</span>
                  <span style={ls.dividerLine} />
                </div>

                <button type="button" style={ls.googleBtn}>
                  <GoogleIcon /> Continue with Google
                </button>

                <p style={ls.footerNote}>
                  New to ViaScholar?{" "}
                  <Link href="/signup" style={ls.footerLink}>
                    Create an account
                  </Link>
                </p>
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