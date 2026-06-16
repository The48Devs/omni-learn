"use client";

import React, { useState } from "react";
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

    // Nav links helper
    const navItems = [
        { href: "/StudentPortal/dashboard", label: "Dashboard", icon: "⊞" },
        { href: "/StudentPortal/mycourses", label: "My Courses", icon: "📖" },
        { href: "/StudentPortal/explore", label: "Explore", icon: "🧭" },
        { href: "/StudentPortal/community", label: "Community", icon: "👥" },
        { href: "/StudentPortal/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <RequireAuth role="student">
            <div className="min-h-screen bg-[#f8fafc] text-[#0f2942] flex flex-col md:flex-row font-sans">
                {/*Skip to content*/}
                <a href="#student-main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-[1rem] focus:left-[1rem] focus:z-50 focus:px-[1.5rem] focus:py-[0.8rem] focus:bg-[#ff6b35] focus:text-white focus:font-bold focus:rounded-xl focus:outline focus:outline-3 focus:outline-offset-2">
                    Skip to Main Content
                </a>
                {/* Student portal side ball container*/}
                <aside className="w-full md:w-[18rem] bg-white border-r border-[#e2e8f0] flex flex-col justify-between p-[1.5rem] shrink-0">
                    <div className="space-y-[2rem]">
                        {/*Branding space*/}
                        <div className="flex items-center gap-[0.75rem]">
                            <div className="w-[3rem] h-[3rem] rounded-full bg-[#0b1b3d] flex items-center justify-center text-white shrink-0">
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
                                <span className="block text-[0.72rem] font-bold text-gray-500 uppercase tracking-widest">
                                    OmniLearn
                                </span>
                                <span className="block text-[0.72rem] font-bold text-gray-500 uppercase tracking-widest">
                                    Student Portal
                                </span>
                            </div>
                        </div>
                        {/* Nav list grouping*/}
                        <nav ariia-label="Student Portal navigation">
                            <ul className="space-y-[0.74rem]">
                                {navItems.map((items) => {
                                    const isActive = pathname === items.href;
                                    return (
                                        <li key={items.href}>
                                            <Link
                                                href={items.href}
                                                onClick={() => announce(`Navigating to ${items.label}`)}
                                                className={`w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.7rem] rounded-xl text-[0.88rem] font-bold transition-all text-left block focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#2563eb] focus-visible:outline-offset-2 ${isActive
                                                    ? "bg-[#0b1b3d] text-white shadow-md shadow-slate-200"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#0b1b3d]"
                                                    }`}
                                                aria-current={isActive ? "page" : undefined}
                                            >
                                                <span className="text-[1.1rem] opacity-90 leading-none">{items.icon}</span>
                                                <span>{items.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                    <div className="mt-[2rem] space-y-[1.5rem]">
                        {/*util anchors*/}
                        <div className="border-t border-[#e2e8f0] pt-[1rem] space-y-[0.4rem]">
                            <button
                                type="button"
                                className="w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.5rem] rounded-lg text-[0.82rem] font-semibold text-gray-500 hover:text-[#0b1b3d] hover:bg-gray-50 text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#2563eb]">
                                <span aria-hidden="true">❓</span>
                                <span>Support</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    logout();
                                    announce("You have logged out");
                                }}
                                className="w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.5rem] rounded-lg text-[0.82rem] font-semibold text-red-500 hover:bg-red-50 text-left focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#2563eb]">
                                <span aria-hidden="true">↪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>
                {/*scrollable content*/}
                <main id="student-main-content" className="flex-1 p-[1.5rem] md:p-[2.5rem] space-y-[2rem] overflow-y-auto">
                    {children}
                </main>
            </div>
        </RequireAuth>
    );
}
