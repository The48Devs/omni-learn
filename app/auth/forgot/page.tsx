"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <main
      id="main-content"
      className="auth-page-bg min-h-screen flex flex-col items-center justify-center py-10 px-4"
    >
      <div className="auth-card w-full max-w-md p-8">
        {submitted ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-main)]">Check Your Email</h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              We&apos;ve sent a password reset link to <strong className="text-[var(--text-main)]">{email}</strong>.
              Click the link to create a new password. The link expires in 1 hour.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button onClick={() => setSubmitted(false)} className="text-[#7ecef4] hover:underline cursor-pointer">
                try again
              </button>.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-1.5 text-sm text-[#7ecef4] hover:underline mt-4"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[var(--focus-ring-color)]/10 rounded-xl flex items-center justify-center">
                <Mail size={20} className="text-[var(--focus-ring-color)]" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[var(--text-main)]">Forgot Password?</h1>
                <p className="text-xs text-[var(--text-muted)]">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-[var(--text-main)] mb-1">
                  Email Address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:border-[var(--focus-ring-color)] focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[var(--focus-ring-color)] py-2.5 font-semibold text-white hover:opacity-90 focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color)] transition-opacity"
              >
                Send Reset Link
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              Remember your password?{" "}
              <Link href="/auth/signin" className="text-[#7ecef4] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
