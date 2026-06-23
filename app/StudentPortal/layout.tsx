"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../components/AuthCOntext";
import RequireAuth from "../components/RequireAuth";
import { useAccessibility } from "../components/AccessibilityContext";

export default function StudentPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout } = useAuth();
    const { announce } = useAccessibility();
    const pathname = usePathname();

    const navItems = [
        { href: "/StudentPortal/dashboard", label: "Dashboard", icon: "⊞" },
        { href: "/StudentPortal/mycourses", label: "My Courses", icon: "📖" },
        { href: "/StudentPortal/explore", label: "Explore", icon: "🧭" },
        { href: "/StudentPortal/community", label: "Community", icon: "👥" },
    ];

    return (
        <RequireAuth role="student">
            <div className="h-screen overflow-hidden bg-[var(--bg-secondary)] text-[var(--text-main)] flex flex-col md:flex-row font-sans">
                {/* Skip to Main Content Link */}
                <a
                    href="#student-main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-[1rem] focus:left-[1rem] focus:z-50 focus:px-[1.5rem] focus:py-[0.8rem] focus:bg-[#ff6b35] focus:text-white focus:font-bold focus:rounded-xl focus:outline focus:outline-3 focus:outline-offset-2"
                >
                    Skip to Main Content
                </a>

                {/* Left Navigation Panel */}
                <aside className="w-full md:w-[18rem] bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col p-[1.5rem] shrink-0">
                    {/* Branding space */}
                    <div className="flex items-center gap-[0.75rem] shrink-0">
                        <div className="w-[3rem] h-[3rem] rounded-full bg-[var(--button-primary,var(--text-main))] flex items-center justify-center text-[var(--bg-primary)] shrink-0">
                            <svg
                                className="w-[1.6rem] h-[1.6rem]"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                <path d="M22 9L12 15 2 9" className="opacity-70" />
                                <path d="M17 14v3.5c0 1.38-2.24 2.5-5 2.5s-5-1.12-5-2.5V14l5 2.73L17 14z" />
                            </svg>
                        </div>
                        <div>
                            <span className="block text-[1.15rem] font-extrabold tracking-tight text-[var(--text-main)]">
                                OmniLearn
                            </span>
                            <span className="block text-[0.72rem] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                Student Portal
                            </span>
                        </div>
                    </div>

                    {/* Navigation Options */}
                    <div className="flex-1 overflow-y-auto mt-[2rem] pr-2">
                        <nav aria-label="Student Portal navigation">
                            <ul className="space-y-[0.74rem]">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/StudentPortal/dashboard' && pathname.startsWith(item.href));
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={() => announce(`Navigating to ${item.label}`)}
                                                className={`w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.7rem] rounded-xl text-[0.88rem] font-bold transition-all text-left block border border-transparent focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 ${isActive
                                                    ? "bg-[var(--text-main)] text-[var(--bg-primary)] border-[var(--border-color)] shadow-md"
                                                    : "text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-main)]"
                                                    }`}
                                                aria-current={isActive ? "page" : undefined}
                                            >
                                                <span className="text-[1.1rem] opacity-90 leading-none">{item.icon}</span>
                                                <span>{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>

                    <div className="shrink-0 mt-[1rem]">
                        {/* Utility actions footnote */}
                        <div className="border-t border-[var(--border-color)] pt-[1rem] space-y-[0.4rem]">
                            <button
                                type="button"
                                className="w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.5rem] rounded-lg text-[0.82rem] font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)] text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                            >
                                <span aria-hidden="true">❓</span>
                                <span>Support</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    announce("You have logged out");
                                }}
                                className="w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.5rem] rounded-lg text-[0.82rem] font-semibold text-[var(--error-accent,#ef4444)] hover:bg-[var(--bg-tertiary)] text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                            >
                                <span aria-hidden="true">↪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Right Scrollable Main Frame */}
                <main id="student-main-content" className="flex-1 p-[1.5rem] md:p-[2.5rem] space-y-[2rem] overflow-y-auto">
                    {children}
                </main>
            </div >
        </RequireAuth >
    );
}
