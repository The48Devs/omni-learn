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
            <section aria-labelledby="published-courses-heading"
                className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 id="published-courses-heading"
                        className="text-2xl font-bold text-[var(--text-main)]">
                        Published Courses
                    </h3>
                    <Link href="/tutorstudio/mycourses"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline outline-none focus-visible:outline-3 focus-visible:outline-yellow-400">
                        View All Courses
                    </Link>
                </div>
                {/*Cards grdi*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((courses) => (
                        <div
                            key={courses.id}
                            className="g-[var(--bg-primary)] rounded-2xl shadow-md border border-[var(--border-color)] overflow-hidden flex flex-col justify-between h-72 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                            {/*Bg Gradient*/}
                            <div className="`p-6 bg-gradient-to-br ${course.bgClass} text-white flex-1 flex flex-col justify-between`">
                                <span className="self-start text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                                    {courses.tag}</span>
                                <h4 className="text-xl font-bold leading-snug">
                                    {courses.title}
                                </h4>
                            </div>

                            {/*Meta data*/}
                            <div className="p-5 flex items-center justify-between bg-[var(--bg-primary)]">
                                <span className="text-xs text-[var(--text-muted)] font-medium">
                                    View Analytics
                                </span>
                                <Link href={`/TutorStudio/analytics?courseId=${courses.id}`}
                                    className={`w-9 h-9 rounded-full ${courses.buttonColor} flex items-center justify-center text-white transition-colors duration-150 outline-none focus-visible:ring-4 focus-visible:ring-yellow-400`}
                                    aria-label={`View detailed analytics for ${courses.title}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/*Analytics cards*/}
            <section aria-labelledby="analytics-heading"
                className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 id="analytics-headings" className="text-2xl font-bold text-[var(--text-main)]">
                        Analytics Overview
                    </h3>
                    <Link href={"/TutorStudio/analytics"} className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline outline-none focus-visible:outline-3 focus-visible:outline-yellow-400">
                        View more
                    </Link>
                </div>
                {/*Grid*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {anyalyticsData.map((stat, i) => (
                        <div
                            key={i}
                            className={`g-[var(--bg-primary)] border-t-4 ${stat.color} p-6 rounded-xl shadow-sm border border-[var(--border-color)] flex flex-col items-center justify-center text-center space-y-4`}>
                            <div className="w-14 h-14 rounded-full bg-slate-100/80 flex items-center justify-center shadow-inner">
                                {stat.icon}
                            </div>
                            <span className="text-3xl font-extrabold text-[var(--text-main)]">
                                {stat.value}
                            </span>

                            {/* Trend info*/}
                            <span className={`text-xs font-semibold flex items-center gap-1
                ${stat.trend === "up"
                                    ? "text-emerald-600"
                                    : stat.trend === "down"
                                        ? "text-rose-500 font-bold"
                                        : "text-[var(--text-muted)]"
                                }`}>
                                {stat.trend === "up" && "↗ "}
                                {stat.trend === "down" && "⚠ "}
                                {stat.comparison}
                            </span>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    );


}