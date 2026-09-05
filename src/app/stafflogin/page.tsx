"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  AMBER,
  ArrowRightIcon,
  BrandPanel,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Field,
  GlobalStyles,
  LINE,
  LockIcon,
  ls,
  MailIcon,
  ROLES,
  RoleToggle,
  SpinnerIcon,
  type StaffRoleKey,
  WHITE,
} from "@/components/StaffAuthShared";
import { useAuth } from "@/contexts/AuthContext";

// ============================================================
// LOGIN FORM
// ============================================================

interface LoginFormProps {
  role: StaffRoleKey;
}

function LoginForm({ role }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeRoleInfo = ROLES.find((r) => r.key === role) ?? ROLES[0];

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
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember((v) => !v)}
            style={{ position: "absolute", opacity: 0, width: 1, height: 1, overflow: "hidden" }}
          />
          <span
            aria-hidden="true"
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

function SignedInPanel() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const role = user?.role?.toLowerCase() ?? "";
  const roleInfo = ROLES.find((r) => r.key === role);

  const dashboardMap: Record<string, string> = {
    admin: "/AdminDashboard",
    coordinator: "/CoordinatorDashboard",
    grantor: "/grantDashboard",
  };

  const handleContinue = () => {
    const path = dashboardMap[role];
    if (path) {
      router.push(path);
    }
  };

  return (
    <div style={ls.successWrap}>
      <span style={ls.successIcon}>
        <CheckCircleIcon />
      </span>
      <h3 style={ls.successTitle}>You&apos;re signed in</h3>
      <p style={ls.successSub}>
        Signed in as <strong>{user?.email}</strong>
      </p>
      <div style={ls.successRoleTag}>
        <span style={{ display: "flex" }}>{roleInfo?.icon}</span>
        {roleInfo?.label}
      </div>
      <button type="button" style={ls.continueBtn} onClick={handleContinue}>
        Continue to {roleInfo?.label ? roleInfo.label.toLowerCase() : "dashboard"} dashboard <ArrowRightIcon />
      </button>
      <button type="button" onClick={logout} style={ls.switchUserLink}>
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
  const { user, loading } = useAuth();

  const activeRole = ROLES.find((r) => r.key === role) ?? ROLES[0];

  if (loading) {
    return (
      <div className="vl">
        <GlobalStyles />
        <div className="vl-shell">
          <BrandPanel role={role} />
          <div style={ls.formSide}>
            <div className="vl-form-card" style={ls.formCard}>
              <div style={{ ...ls.successWrap, minHeight: 300 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vl">
      <GlobalStyles />
      <div className="vl-shell">
        <BrandPanel role={role} />

        <div style={ls.formSide}>
          <div className="vl-form-card" style={ls.formCard}>
            {!user ? (
              <>
                <div style={ls.formHeader}>
                  <h2 style={ls.formTitle}>Welcome back</h2>
                  <p style={ls.formSub}>Sign in to your ViaScholar account.</p>
                </div>

                <RoleToggle role={role} onChange={setRole} />
                <p style={ls.roleDesc}>{activeRole.desc}</p>

                <LoginForm role={role} />

                <p style={ls.footerNote}>Need access? Contact your program administrator.</p>
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
