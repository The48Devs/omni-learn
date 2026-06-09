"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthCOntext";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();

  //state vars
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [customId, setCustomId] = useState("");

  //tutor or student ID
  const [mobile, setMobile] = useState("");
  const [institution, setInstitution] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  //submit handlign logic

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login(email, password);
    } else {
      register(email, password, role);
    }
  };

  return (
    <section className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)]">
        {mode === "login" ? "Log In" : "Create Account"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <label className="block">
          <span className="text-sm font-medium text-[var(--text-muted)]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] focus:border-[var(--focus-ring-color)] focus:outline-none"
          />
        </label>

        {/* Password */}
        <label className="block">
          <span className="text-sm font-medium text-[var(--text-muted)]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] focus:border-[var(--focus-ring-color)] focus:outline-none"
          />
        </label>

        {/* Role selector – only for registration */}
        {mode === "register" && (
          <fieldset className="flex gap-4">
            <legend className="sr-only">Account type</legend>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="form-radio text-[var(--focus-ring-color)]"
              />
              <span className="ml-2 text-sm text-[var(--text-muted)]">Student</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="tutor"
                checked={role === "tutor"}
                onChange={() => setRole("tutor")}
                className="form-radio text-[var(--focus-ring-color)]"
              />
              <span className="ml-2 text-sm text-[var(--text-muted)]">Tutor</span>
            </label>
          </fieldset>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-2 rounded-full font-bold bg-[#0b1b3d] text-white hover:bg-[#152c5a] focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color)] transition-colors"
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        {/* Switch link */}
        <p className="text-sm text-[var(--text-muted)]">
          {mode === "register" ? (
            <>
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-[var(--focus-ring-color)] underline">
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <Link href="/auth/signup" className="text-[var(--focus-ring-color)] underline">
                Sign Up
              </Link>
            </>
          )}
        </p>
      </form>
    </section>
  );
}