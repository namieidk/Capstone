"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  AMBER,
  ArrowRightIcon,
  BrandPanel,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Field,
  GlobalStyles,
  GoogleIcon,
  LINE,
  LockIcon,
  ls,
  MailIcon,
  ModeLinkTabs,
  SpinnerIcon,
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

const DASHBOARD_MAP: Record<string, string> = {
  ADMIN: "/AdminDashboard",
  COORDINATOR: "/CoordinatorDashboard",
  GRANTOR: "/grantDashboard",
  SCHOLAR: "/scholardashboard",
  APPLICANT: "/ApplicantsDashboard",
};

function SignInForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
      setLoading(false);
    }
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
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember((v) => !v)}
            style={{ position: "absolute", opacity: 0, width: 1, height: 1, overflow: "hidden" }}
          />
          <span
            aria-hidden="true"
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

function SignedInPanel() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const role = user?.role ?? "";
  const dashboardPath = DASHBOARD_MAP[role];
  const roleLabel = role.charAt(0) + role.slice(1).toLowerCase();

  const handleContinue = () => {
    if (dashboardPath) {
      router.push(dashboardPath);
    }
  };

  return (
    <div style={ls.successWrap}>
      <span style={ls.successIcon}>
        <CheckCircleIcon />
      </span>
      <h3 style={ls.successTitle}>You&apos;re signed in</h3>
      <p style={ls.successSub}>
        Welcome, <strong>{user?.first_name}</strong>
      </p>
      <div style={ls.successRoleTag}>{roleLabel} account</div>
      <button type="button" style={ls.continueBtn} onClick={handleContinue}>
        Continue to dashboard <ArrowRightIcon />
      </button>
      <button type="button" onClick={logout} style={ls.switchUserLink}>
        Sign in as a different user
      </button>
    </div>
  );
}

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="vls">
        <GlobalStyles />
        <div className="vls-shell">
          <BrandPanel mode="signin" />
          <div className="vls-form-side" style={ls.formSide}>
            <div className="vls-form-card" style={ls.formCard}>
              <div style={{ ...ls.successWrap, minHeight: 300 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vls">
      <GlobalStyles />
      <div className="vls-shell">
        <BrandPanel mode="signin" />

        <div className="vls-form-side" style={ls.formSide}>
          <div className="vls-form-card" style={ls.formCard}>
            <BackToLandingLink />

            {!user ? (
              <>
                <div style={ls.formHeader}>
                  <h2 style={ls.formTitle}>Welcome back</h2>
                  <p style={ls.formSub}>Sign in to your ViaScholar account.</p>
                </div>

                <ModeLinkTabs active="signin" LinkComponent={Link} />

                <SignInForm />

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
              <SignedInPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
