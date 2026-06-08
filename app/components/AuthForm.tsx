"use client";

import { useState } from "react";
import { useAuth } from "./AuthCOntext";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
    const { login, register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"student" | "tutor">("student");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "login") {
            login(email, password);
        } else {
            register(email, password, role);
        }
    };

    return (
        <section className="max-w-md max-auto py-12">
            <h2 className="text-2xl font-bold mb-6 text =[var(--text-main)]">
                {mode == "login" ? "Log In" : "Create Account"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/*Email*/}
                <label htmlFor="block">
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                        Email
                    </span>

                    <input type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-[bar(--border-color)] bg-[var--bg-secondary)] text=[var(--text.main)] focus:border-[var(--focus-ring-color)] focus:outline-none " />
                </label>

                {/*Password*/}
                <label htmlFor="block">
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                        Password
                    </span>

                    <input type="password"
                        required
                        value={password}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-[bar(--border-color)] bg-[var--bg-secondary)] text=[var(--text.main)] focus:border-[var(--focus-ring-color)] focus:outline-none " />
                </label>

                {/* Role Selector - only for registration */}
                {mode === "register" && (
                    <fieldset className="flex gap-4">
                        <legend className="sr-only"> Account type</legend>

                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="role"
                                value="student"
                                checked={role === "student"}
                                onChange={(e) => setRole("student")}
                                className="form-radio text-[var(--focus-ring-color)]"
                            />
                            <span className="ml-2 text-sm text-[var(--text-muted)]">
                                student</span>

                        </label>

                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="role"
                                value="tutor"
                                checked={role === "tutor"}
                                onChange={(e) => setRole("tutor")}
                                className="form-radio text-[var(--focus-ring-color)]"
                            />
                            <span className="ml-2 text-sm text-[var(--text-muted)]">
                                Tutor</span>
                        </label>
                    </fieldset>
                    {/*Submit button*/}
                )}
            </form>

        </section>
    );
}