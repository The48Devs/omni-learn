"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../components/AuthCOntext";
import RequireAuth from "../components/RequireAuth";

export default function TutorStudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    //side bar structure
    const navItems = [
        {
            name: "Dashboard", href: "/TutorStudio/dashboard", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
            ),
        },
        {
            name: "My Courses", href: "/TutorStudio/mycourses", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            name: "Analytics", href: "/TutorStudio/analytics", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
        },
        {
            name: "Settings", href: "/TutorStudio/settings", icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ];
    return (
        <RequireAuth role="tutor">
            <div className="flex min-h-[calc(100vh-4rem)] bg-[var(--bg-secondary)] font-sans transition-colors duration-200">
                <aside className="w-64 bg-[#0b1b3d] text-slate-200 flex flex-col justify-between shrink-0 border-r border-slate-800 transition-colors duration-200
                     data-[theme=high-contrast]:bg-black data-[theme=high-contrast]:border-white data-[theme=high-contrast]:text-white">
                    <div className="p-5">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-xl font-bold tracking-wider text-white">
                                Tutor Studio
                            </span>
                        </div>
                        <nav className="space-y-1.5" aria-label="Tutor Studio Navigation">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 outline-none
                                                ${isActive ? "bg-blue-600/30 text-white border-l-4 border-blue-500" : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"}
                                                focus-visible:outline-3 focus-visible:outline-yellow-400
                                                `}>
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        {/*Sign Out*/}
                    </div>
                    <div className="p-4 border-t border-slate-800 data-[theme=high-contrast]:border-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sx text-slate-400 truncate max-w-[150px]">
                                {user?.email ?? "daniel@gmail.com"}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
                            aria-label="Sign out from Tutor Studio">
                            <svg className="w-4 h-4"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>

                    </div>
                </aside>
                {/*content wrapper*/}
                <div className="flex-1 flex flex-col min-2-8">
                    <main id="main-content"
                        className="flex-1 p-8 overflow-y-auto"
                        tabIndex={-1}>
                        {children}
                    </main>
                </div>
            </div>
        </RequireAuth>
    )
}