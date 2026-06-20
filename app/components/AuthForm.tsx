"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthCOntext";
import type { Role } from "./AuthCOntext";

function getFirebaseErrorMessage(code: string): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
    "auth/invalid-email": "Invalid email address. Please check and try again.",
    "auth/user-not-found": "No account found with this email. Please sign up first.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/network-request-failed": "Network error. Please check your internet connection.",
  };
  return map[code] || "Something went wrong. Please try again.";
}

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register, isAuthenticated, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [customId, setCustomId] = useState("");
  const [mobile, setMobile] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(profile?.role === "tutor" ? "/TutorStudio/dashboard" : "/StudentPortal/dashboard");
    }
  }, [authLoading, isAuthenticated, profile, router]);

  if (authLoading) {
    return (
      <main id="main-content" className="auth-page-bg min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Checking authentication...
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }
      setSubmitting(true);
      try {
        await login(email, password);
      } catch (err: unknown) {
        const fbErr = err as { code?: string; message?: string };
        setError(getFirebaseErrorMessage(fbErr.code ?? ""));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!fullName || !email || !customId || !mobile || !institution || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Use before signing up.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email,
        password,
        role,
        fullName,
        studentId: role === "student" ? customId : undefined,
        tutorId: role === "tutor" ? customId : undefined,
        mobileNumber: mobile,
        institution,
      });
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      setError(getFirebaseErrorMessage(fbErr.code ?? ""));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] " +
    "px-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] " +
    "focus:border-[var(--focus-ring-color)] focus:outline-none transition-colors";

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[var(--text-muted)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {visible ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
        </>
      )}
    </svg>
  );

  if (mode === "register") {
    return (
      <main
        id="main-content"
        className="auth-page-bg min-h-screen flex flex-col items-center justify-center py-10 px-4"
      >
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-1 text-center">
          <span className="font-extrabold">Create</span>{" "}
          <span className="font-light text-[#7ecef4]">New Account</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6 text-center">
          {role === "student"
            ? "Join OmniLearn to start your journey."
            : "Join OmniLearn and start shaping minds globally."}
        </p>

        <div className="auth-card w-full max-w-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="role-pill-track" role="group" aria-label="Select account type">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`role-pill${role === "student" ? " active" : ""}`}
                aria-pressed={role === "student"}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("tutor")}
                className={`role-pill${role === "tutor" ? " active" : ""}`}
                aria-pressed={role === "tutor"}
              >
                Tutor
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === "student" ? (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Create Student ID
                  </label>
                  <input
                    id="studentId"
                    type="text"
                    required
                    placeholder="e.g. STU-2024-001"
                    value={customId}
                    onChange={(e) => setCustomId(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Institution
                  </label>
                  <input
                    id="institution"
                    type="text"
                    required
                    placeholder="University or School Name"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <EyeIcon visible={showPassword} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Confirm your Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <EyeIcon visible={showConfirmPassword} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tutorId" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Create Tutor ID
                    </label>
                    <input
                      id="tutorId"
                      type="text"
                      required
                      placeholder="Choose a unique ID"
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="mobile"
                      type="tel"
                      required
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                    Institution
                  </label>
                  <input
                    id="institution"
                    type="text"
                    required
                    placeholder="Current or affiliated institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <EyeIcon visible={showPassword} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                      Confirm your Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <EyeIcon visible={showConfirmPassword} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms((v) => !v)}
                className="mt-0.5 h-4 w-4 rounded border-[var(--border-color)] accent-[var(--focus-ring-color)]"
              />
              <span className="text-sm text-[var(--text-muted)]">
                I have read the{" "}
                <Link href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-[#7ecef4] underline">
                  Terms of Use
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[var(--focus-ring-color)] py-2.5 font-semibold text-white hover:opacity-90 focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color)] transition-opacity disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
            Already Have an Account?{" "}
            <Link href="/auth/signin" className="text-[#7ecef4] font-medium hover:underline">
              Login to your Account
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      id="main-content"
      className="auth-page-bg min-h-screen flex flex-col items-center justify-center py-10 px-4"
    >
      <h1 className="text-3xl font-bold text-[var(--text-main)] mb-1 text-center">
        <span className="font-extrabold">Welcome</span>{" "}
        <span className="font-light text-[#7ecef4]">Back</span>
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-6 text-center">
        Log in to continue your learning journey.
      </p>
      <div className="auth-card w-full max-w-md p-8">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="loginEmail" className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Email Address
            </label>
            <input
              id="loginEmail"
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="loginPassword" className="block text-sm font-medium text-[var(--text-main)] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
            <Link
              href="/auth/forgot"
              className="mt-1 block text-right text-xs text-[#7ecef4] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[var(--focus-ring-color)] py-2.5 font-semibold text-white hover:opacity-90 focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color)] transition-opacity disabled:opacity-60"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Logging in...
              </>
            ) : (
              <>
                Log In
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
          Don't Have an Account?{" "}
          <Link href="/auth/signup" className="text-[#7ecef4] font-medium hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </main>
  );
}
