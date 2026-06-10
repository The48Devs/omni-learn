"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/components/AuthCOntext";
import { title } from "process";

export default function TutorDashboard() {
    const { user } = useAuth();
    const userName = user ? user.split("@")[0].toUpperCase() : "DANIEL";

    // published courses mappings
    const courses = [
        {
            id: "physics-1",
            title: "Advanced Quantum Mechanics",
            tag: "Physics",
            bgClass: "from-blue-800 to-sky-600",
            buttonColor: "bg-orange-700 hover:bg-orange-800",
        },
        {
            id: "biology-1",
            title: "Cellular Biology: Structure & Function",
            tag: "Biology",
            bgClass: "from-teal-600 to-cyan-500",
            buttonColor: "bg-orange-700 /80 hover:bg-orange-800",
        },
        {
            id: "history-1",
            title: "European History: The Renaissance",
            tag: "History",
            bgClass: "ffrom-[#0d5c75] to-[#128a9b]",
            buttonColor: "bg-orange-800 hover:bg-orange-900",
        },
    ];

    //Analytics card mappings
    const anyalyticsData = [
        {
            title: "Completion Rate",
            value: "84.2%",
            comparison: "+2.4% vs last week",
            trend: "up",
            color: "border-bblue-400",
            icon: (
                <svg
                    className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: "AVG. TIME SPENT",
            value: "4h 12m",
            comparison: "Stable vs last week",
            trend: "stable",
            color: "border-indigo-400",
            icon: (
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "STRUGGLING RATE",
            value: "12",
            comparison: "+3 vs last week",
            trend: "down",
            color: "border-orange-400",
            icon: (
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        {
            title: "AVG. QUIZ SCORE",
            value: "78%",
            comparison: "+1.5% vs last week",
            trend: "up",
            color: "border-teal-500",
            icon: (
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4a2 2 0 110 4h-4m0-4h-4a2 2 0 100 4h4" />
                </svg>
            )
        },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome banner */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 p-10 md:p-14 text-white shadow-xl relative overflow-hidden transition-colors duration-200
                   data-[theme=high-contrast]:bg-none data-[theme=high-contrast]:bg-black data-[theme=high-contrast]:border-2 data-[theme=high-contrast]:border-white"
                data-testid="welcome-banner">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Welcome Back, {userName}
                    </h2>
                </div>
                {/*dec bg detail*/}
                <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top-right transition-all duration-300 decorative-glow" />
            </div>
            {/*Published courses*/}

        </div>
        </div >
    )


}