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
            {/* Create course section removed - courses can only be created within Organizations */}

            {/*Card grid*/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm flex flex-col justify-between h-[420px] transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    >
                        {/* Frame */}
                        <div className={`p-6 bg-gradient-to-br ${course.bgClass} flex-1 flex flex-col justify-between relative`}>
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white/15 border border-white/10 backdrop-blur-md text-slate-100">
                                    {course.tag}
                                </span>
                                {course.status === "draft" && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/90 text-white">
                                        Draft
                                    </span>
                                )}
                            </div>
                            {/* Icon */}
                            <div className="flex justify-center items-center py-4">
                                <div className="p-4 rounded-full bg-white/10 border border-white/5 backdrop-blur-xs shadow-inner">
                                    {course.icon}
                                </div>
                            </div>
                            <div />
                        </div>
                        {/* Bottom Frame */}
                        <div className="p-6 bg-[var(--bg-primary)] flex-1 flex flex-col justify-between border-t border-[var(--border-color)]">
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-[var(--text-main)] line-clamp-1">
                                    {course.title}
                                </h4>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                                    {course.description}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 mt-3">
                                <span className="w-full text-center border border-[var(--border-color)] text-[var(--text-muted)] bg-[var(--bg-secondary)] font-semibold text-xs py-3 rounded-xl block cursor-default">
                                    View Course
                                </span>
                                <Link
                                    href={`/TutorStudio/courses/${course.id}/analytics`}
                                    className="w-full text-center bg-[#0b1b3d] hover:bg-[#FF6B35] text-white font-bold text-xs py-3 rounded-xl transition-colors outline-none focus-visible:outline-3 focus-visible:outline-yellow-400 block"
                                >
                                    📊 View Analytics
                                </Link>
                            </div>
                        </div>

                    </div>
                ))}
                {filteredCourses.length == 0 && (
                    <div className="col-span-full text-center py-12 text-[var(--text-muted)] text-sm font-semibold">
                        No courses found under this category.
                    </div>
                )}
            </div>

        </div>
    );
}