"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GlobalStyles,
  BrandPanel,
  ModeLinkTabs,
  Field,
  UserIcon,
  MailIcon,
  SchoolIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GoogleIcon,
  SpinnerIcon,
  TRACKS,
  ls,
  AMBER,
  LINE,
  AuthSession,
} from "../../../components/StudentAuth";

// ============================================================
// SIGN UP FORM
// ============================================================

interface SignUpFormState {
  name: string;
  email: string;
  school: string;
  track: string;
  password: string;
  confirm: string;
}

interface SignUpFormProps {
  onSuccess: (session: AuthSession) => void;
}

function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [form, setForm] = useState<SignUpFormState>({
    name: "",
    email: "",
    school: "",
    track: TRACKS[0],
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update =
    (key: keyof SignUpFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.school.trim() || !form.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms and Privacy Policy to continue.");
      return;
    }
    setError("");
    setLoading(true);

    // TODO: replace with a real signup call, e.g.:
    // const res = await fetch("/api/auth/signup", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });
    setTimeout(() => {
      setLoading(false);
      // Demo only: set a client-readable cookie so middleware.ts can see
      // the session. Replace with a real httpOnly cookie set by your
      // /api/auth/signup route once you wire up actual auth.
      document.cookie = `vls_session=demo; path=/; max-age=${60 * 60 * 24 * 7}`;
      onSuccess({ name: form.name, email: form.email });
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Full name">
        <div style={ls.inputWrap}>
          <span style={ls.inputIcon}>
            <UserIcon />
          </span>
          <input style={ls.input} placeholder="Juan Dela Cruz" value={form.name} onChange={update("name")} />
        </div>
      </Field>

      <Field label="Email address">
        <div style={ls.inputWrap}>
          <span style={ls.inputIcon}>
            <MailIcon />
          </span>
          <input type="email" style={ls.input} placeholder="you@email.com" value={form.email} onChange={update("email")} />
        </div>
      </Field>

      <Field label="School / university">
        <div style={ls.inputWrap}>
          <span style={ls.inputIcon}>
            <SchoolIcon />
          </span>
          <input style={ls.input} placeholder="University of Mindanao" value={form.school} onChange={update("school")} />
        </div>
      </Field>

      <Field label="Scholarship track">
        <select style={ls.select} value={form.track} onChange={update("track")}>
          {TRACKS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <div className="vls-name-row" style={ls.nameRow}>
        <Field label="Password">
          <div style={ls.inputWrap}>
            <span style={ls.inputIcon}>
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              style={{ ...ls.input, paddingRight: 44 }}
              placeholder="Create password"
              value={form.password}
              onChange={update("password")}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} style={ls.inputEyeBtn}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password">
          <div style={ls.inputWrap}>
            <span style={ls.inputIcon}>
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              style={ls.input}
              placeholder="Re-enter password"
              value={form.confirm}
              onChange={update("confirm")}
            />
          </div>
        </Field>
      </div>

      {error && <div style={ls.errorBox}>{error}</div>}

      <div style={{ ...ls.formRow, marginBottom: 20 }}>
        <label style={ls.checkboxLabel}>
          <span
            onClick={() => setAgree((v) => !v)}
            style={{ ...ls.checkbox, background: agree ? AMBER : "#FFFFFF", borderColor: agree ? AMBER : LINE }}
          >
            {agree && <CheckCircleIcon />}
          </span>
          I agree to the Terms and Privacy Policy
        </label>
      </div>

      <button type="submit" disabled={loading} style={{ ...ls.submitBtn, opacity: loading ? 0.85 : 1 }}>
        {loading ? (
          <>
            <SpinnerIcon /> Creating account…
          </>
        ) : (
          <>
            Create account <ArrowRightIcon />
          </>
        )}
      </button>
    </form>
  );
}

// ============================================================
// SUCCESS STATE
// ============================================================

interface SignedUpPanelProps {
  session: AuthSession;
  onReset: () => void;
}

function SignedUpPanel({ session, onReset }: SignedUpPanelProps) {
  const router = useRouter();
  return (
    <div style={ls.successWrap}>
      <span style={ls.successIcon}>
        <CheckCircleIcon />
      </span>
      <h3 style={ls.successTitle}>Account created</h3>
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

// ============================================================
// PAGE
// ============================================================

export default function SignupPage() {
  const [session, setSession] = useState<AuthSession | null>(null);

  return (
    <div className="vls">
      <GlobalStyles />
      <div className="vls-shell">
        <BrandPanel mode="signup" />

        <div style={ls.formSide}>
          <div className="vls-form-card" style={ls.formCard}>
            {!session ? (
              <>
                <div style={ls.formHeader}>
                  <h2 style={ls.formTitle}>Create your account</h2>
                  <p style={ls.formSub}>Start your scholarship application in minutes.</p>
                </div>

                <ModeLinkTabs active="signup" LinkComponent={Link} />

                <SignUpForm onSuccess={(s) => setSession(s)} />

                <div style={ls.dividerRow}>
                  <span style={ls.dividerLine} />
                  <span style={ls.dividerText}>or continue with</span>
                  <span style={ls.dividerLine} />
                </div>

                <button type="button" style={ls.googleBtn}>
                  <GoogleIcon /> Continue with Google
                </button>

                <p style={ls.footerNote}>
                  Already have an account?{" "}
                  <Link href="/login" style={ls.footerLink}>
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <SignedUpPanel session={session} onReset={() => setSession(null)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}