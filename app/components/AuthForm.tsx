"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthCOntext";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();

  // form vars
  const [role, setRole] = useState<"student" | "tutor">("student");
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

  // submit functionality
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login(email, password);
    } else {
      if (!agreedToTerms) {
        alert("Please agree to the Terms of Use before signing up.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      register(email, password, role);
    }
  };

  // reusable styles
  const inputClass =
    "w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] " +
    "px-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] " +
    "focus:border-[var(--focus-ring-color)] focus:outline-none transition-colors";

  // eye toggle
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

  //Registration view
  if (mode === "register") {
    return (
      <main
        id="main-content"
        className="auth-page-bg min-h-screen flex flex-col items-center justify-center py-10 px-4"
      >
        {/* Page heading */}
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-1 text-center">
          <span className="font-extrabold">Create</span>{" "}
          <span className="font-light text-[#7ecef4]">New Account</span>
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-6 text-center">
          {role === "student"
            ? "Join OmniLearn to start your journey."
            : "Join OmniLearn and start shaping minds globally."}
        </p>

        {/* Card */}
        <div className="auth-card w-full max-w-lg p-8">

          {/* Role pill toggle */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* student view*/}
            {role === "student" ? (
              <>
                {/* Full Name */}
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

                {/* Email Address */}
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

                {/* Student ID */}
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

                {/* Mobile Number */}
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

                {/* Institution */}
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

                {/* Passwords row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Create Password */}
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

                  {/* Confirm Password */}
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
              /* tutor view */
              <>
                {/*Full Name + Email */}
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

                {/*Tutor ID + Mobile */}
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

                {/* Institution */}
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

                {/*Passwords */}
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

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms((v) => !v)}
                className="mt-0.5 h-4 w-4 rounded border-[var(--border-color)] accent-[var(--focus-ring-color)]"
              />
              <span className="text-sm text-[var(--text-muted)]">
                I have read the{" "}
                <Link href="/terms" className="text-[#7ecef4] underline">
                  Terms of Use
                </Link>
              </span>
            </label>

            {/* Sign Up*/}
            <button
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-full bg-[var(--focus-ring-color)] py-2.5 font-semibold text-white hover:opacity-90 focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color)] transition-opacity"
            >
              Sign Up
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
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


}
