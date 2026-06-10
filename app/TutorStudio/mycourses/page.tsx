"use client";
import React, { useState } from "react";
import Link from "next/link";
export default function MyCoursesPage() {
    const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
    const coursesList = [
        {
            id: "biology-1",
            title: "Cellular Biology: Structure & Function",
            description: "Explore the microscopic world of cells and their intricate mechanisms.",
            tag: "Science",
            status: "published",
            bgClass: "from-[#4ca5bf] to-[#128a9b]",
            icon: (
                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
        },
        {
            id: "history-1",
            title: "European History: The Renaissance",
            description: "A deep dive into the cultural rebirth of Europe.",
            tag: "History",
            status: "published",
            bgClass: "from-[#b47a61] to-[#cf987f]",
            icon: (
                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            ),
        },
        {
            id: "tech-1",
            title: "Introduction to Machine Learning",
            description: "Fundamentals of algorithms that learn from data.",
            tag: "Technology",
            status: "draft",
            bgClass: "from-[#5b7887] to-[#7f9ba9]",
            icon: (
                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    const filteredCourses = coursesList.filter((course) => {
        if (activeTab == "all") return true;
        return course.status == activeTab;
    });

    return (
        <div
            className="space-y-8">
            {/* Header & filtering buttons*/}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-[var(--text-main)]">
                        Your Courses
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Track your tutoring progress.
                    </p>
                </div>

                <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 border border-slate-200/40 self-start
                     data-[theme=high-contrast]:bg-black data-[theme=high-contrast]:border-white"
                    role="tablist"
                    aria-label="Filter courses by release status">
                    {(["all", "published", "draft"] as const).map((tab) => {
                        const isSelected = activeTab == tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                role="tab"
                                aria-selected={isSelected}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer outline-none capitalize
                  ${isSelected
                                        ? "bg-[#0b1b3d] text-white shadow-sm"
                                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
                                    }
                  focus-visible:outline-3 focus-visible:outline-yellow-400 
                `}> {tab == "all" ? "All Courses" : tab}</button>
                        );
                    })}
                </div>
            </div>
            {/*Create course */}
            <div className="w-full rounded-2xl bbg-gradient-to-r from blue-900/95 via-blue-800/90 to-cyan-700/85 p-8 md:p-10 text-white shadow-lg relative overflow-hidden transition-all duration-200 data-[theme=high-contrast]:bg-none data-[theme=high-contrast]:bg-black data-[theme=high-contrast]:border-2 data-[theme=high-contrast]:border-white" >
                <div className="relative z-10 max-w-lg space-y-4">
                    <h3 className="text-2xl font-extrabold tracking-tight">
                        Publish a New Course</h3>
                    <p className="text-sm text-slate-200/90 leading-relaxed">
                        Create a new learning materials and help the community grow!</p>
                    <Link
                        href="/TutorStudio/mycourses/newcourse"
                        className="inline-block bg-[#ff5a36] hover:bg-[#e04e2d] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all duration-150 outline-none focus-visible:ring-4 focus-visible:ring-yellow-400">
                        Create Course</Link></div>
                <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 skew-x-12 transform origin-top-right decorative-glow">
                </div>


            </div>

        </div >
    )
}