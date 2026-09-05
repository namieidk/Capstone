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
  SchoolIcon,
  SpinnerIcon,
  TRACKS,
  UserIcon,
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

function SignUpForm() {
  const { register } = useAuth();
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

  const update = (key: keyof SignUpFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

    const nameParts = form.name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    try {
      await register({
        email: form.email,
        password: form.password,
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
          <input
            type="email"
            style={ls.input}
            placeholder="you@email.com"
            value={form.email}
            onChange={update("email")}
          />
        </div>
      </Field>

      <Field label="School / university">
        <div style={ls.inputWrap}>
          <span style={ls.inputIcon}>
            <SchoolIcon />
          </span>
          <input
            style={ls.input}
            placeholder="University of Mindanao"
            value={form.school}
            onChange={update("school")}
          />
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
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree((v) => !v)}
            style={{ position: "absolute", opacity: 0, width: 1, height: 1, overflow: "hidden" }}
          />
          <span
            aria-hidden="true"
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

function SignedUpPanel() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleContinue = () => {
    const path = user?.role === "SCHOLAR" ? "/scholardashboard" : "/ApplicantsDashboard";
    router.push(path);
  };

  return (
    <div style={ls.successWrap}>
      <span style={ls.successIcon}>
        <CheckCircleIcon />
      </span>
      <h3 style={ls.successTitle}>Account created</h3>
      <p style={ls.successSub}>
        Welcome, <strong>{user?.first_name}</strong>
      </p>
      <div style={ls.successRoleTag}>Student account</div>
      <button type="button" style={ls.continueBtn} onClick={handleContinue}>
        Continue to dashboard <ArrowRightIcon />
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

export default function SignupPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="vls">
        <GlobalStyles />
        <div className="vls-shell">
          <BrandPanel mode="signup" />
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
        <BrandPanel mode="signup" />

        <div className="vls-form-side" style={ls.formSide}>
          <div className="vls-form-card" style={ls.formCard}>
            {!user ? (
              <>
                <div style={ls.formHeader}>
                  <h2 style={ls.formTitle}>Create your account</h2>
                  <p style={ls.formSub}>Start your scholarship application in minutes.</p>
                </div>

                <ModeLinkTabs active="signup" LinkComponent={Link} />

                <SignUpForm />

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
              <SignedUpPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
