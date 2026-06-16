"use client";

import React, { useState } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";

//interface for course meta data
interface Course {
    id: string;
    title: string;
    description: string;
    category: "Science" | "History" | "Technology" | "Design";
    currentModule: string;
    progress: number;
    timeRemaining: string;
    status: "in-progress" | "completed";
    themeColor: {
        bg: string;
        text: string;
        border: string;
        gradient: string;
    };
    iconGlyph: React.ReactNode;
}

export default function MyCoursesPage() {
    const { announce } = useAccessibility();
    const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");

    // mock database state for later firestore integration

    const coursesData: Course[] = [
        {
            id: "quantum-mech",
            title: "Advanced Quantum Mechanics",
            description: "Study quantum wave functions, operators, quantum tunnels, and particle superposition theory.",
            category: "Science",
            currentModule: "Module 4: Wave-Particle Duality and the Double-Slit Experiment",
            progress: 65,
            timeRemaining: "2h 15m remaining",
            status: "in-progress",
            themeColor: {
                bg: "bg-blue-100/10",
                text: "text-blue-400",
                border: "border-blue-400/20",
                gradient: "from-[#204068] to-[#3a7590]",
            },
            iconGlyph: (
                <svg className="w-[3rem] h-[3rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            id: "cellular-bio",
            title: "Cellular Biology: Structure & Function",
            description: "Explore the microscopic world of cells and their intricate organelle mechanisms.",
            category: "Science",
            currentModule: "Module 2: Membrane Transport & Active Channels",
            progress: 30,
            timeRemaining: "4h 10m remaining",
            status: "in-progress",
            themeColor: {
                bg: "bg-blue-100/10",
                text: "text-blue-400",
                border: "border-blue-400/20",
                gradient: "from-sky-950 to-blue-900",
            },
            iconGlyph: (
                <svg className="w-[2.5rem] h-[2.5rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v17.792m0-17.792a9.002 9.002 0 017.5 8.896 9.002 9.002 0 01-7.5 8.896m0-17.792a9.002 9.002 0 00-7.5 8.896 9.002 9.002 0 007.5 8.896" />
                </svg>
            ),
        },
        {
            id: "euro-history",
            title: "European History: The Renaissance",
            description: "A deep dive into the cultural rebirth of Europe, painting masterpieces, and engineering feats.",
            category: "History",
            currentModule: "Module 6: Humanism and the Printing Press",
            progress: 89,
            timeRemaining: "45m remaining",
            status: "in-progress",
            themeColor: {
                bg: "bg-orange-100/10",
                text: "text-orange-400",
                border: "border-orange-400/20",
                gradient: "from-orange-950 to-amber-900",
            },
            iconGlyph: (
                <svg className="w-[2.5rem] h-[2.5rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            id: "intro-ml",
            title: "Introduction to Machine Learning",
            description: "Fundamentals of predictive algorithms, gradient descent, and training neural net graphs.",
            category: "Technology",
            currentModule: "Module 1: Regression Analysis & Feature Fitting",
            progress: 5,
            timeRemaining: "12h left",
            status: "in-progress",
            themeColor: {
                bg: "bg-purple-100/10",
                text: "text-purple-400",
                border: "border-purple-400/20",
                gradient: "from-slate-900 to-sky-950",
            },
            iconGlyph: (
                <svg className="w-[2.5rem] h-[2.5rem]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
            ),
        },
    ];

    // filter logic for courses
    const filteredCourses = coursesData.filter((c) => {
        if (filter === "all") return true;
        return c.status === filter;
    });
    const handleFilterChange = (newFilter: typeof filter, label: string) => {
        setFilter(newFilter);
        announce(`Filtered courses by ${label}`);
    };

    return (
        <div className="space-y-[2.5rem]">
            {/* Title & Filter Options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem] pb-[1rem] border-b border-[var(--border-color)]">
                <div>
                    <h1 className="text-[1.8rem] font-extrabold text-[var(--text-main)] tracking-tight">
                        My Courses
                    </h1>
                    <p className="text-[0.88rem] text-[var(--text-muted)] mt-[0.15rem]">
                        Track your progress and continue learning.
                    </p>
                </div>
                {/* filter buttons*/}
                <div role="tablist" aria-label="Filter courses list" className="flex items-center gap-[0.5rem] self-start sm:self-auto">
                    {[
                        { id: "all", label: "All Courses" },
                        { id: "in-progress", label: "In Progress" },
                        { id: "completed", label: "Completed" },
                    ].map((tab) => {
                        const isActive = filter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={isActive}
                                type="button"
                                onClick={() => handleFilterChange(tab.id as typeof filter, tab.label)}
                                className={`px-[1rem] py-[0.45rem] rounded-full text-[0.78rem] font-bold transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 ${isActive
                                    ? "bg-[var(--text-main)] text-[var(--bg-primary)] border border-[var(--border-color)] shadow-xs"
                                    : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:bg-[var(--border-color)] hover:text-[var(--text-main)]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            {/*Hero card*/}
            {coursesData.length > 0 && (
                <section aria-labelledby="continue-learning-hero-title">
                    <div className="bg-gradient-to-br from-[#2a5c8f] to-[#4585ab] rounded-2xl p-[1.8rem] text-white relative overflow-hidden shadow-xl flex flex-col justify-between gap-[1.5rem] min-h-[14rem]">
                        <div className="space-y-[0.6rem] z-10">
                            <span className="inline-block px-[0.6rem] py-[0.25rem] bg-white/10 rounded-full text-[0.68rem] font-extrabold uppercase tracking-widest border border-white/10">
                                Continue Learning
                            </span>
                            <h2 id="continue-learning-hero-title" className="text-[1.6rem] font-extrabold tracking-tight">
                                {coursesData[0].title}
                            </h2>
                            <p className="text-[0.85rem] opacity-90 font-semibold tracking-wide">
                                {coursesData[0].currentModule}
                            </p>
                        </div>
                        {/* Progress bar and run button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1.2rem] z-10 border-t border-white/10 pt-[1.2rem]">
                            <div className="flex-1 space-y-[0.35rem] max-w-[28rem]">
                                <div className="flex justify-between text-[0.75rem] font-bold tracking-wide">
                                    <span>{coursesData[0].progress}% Completed</span>
                                    <span>{coursesData[0].timeRemaining}</span>
                                </div>
                                <div className="w-full h-[0.5rem] bg-black/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#ff6b35] rounded-full transition-all duration-500"
                                        style={{ width: `${coursesData[0].progress}%` }}
                                        role="progressbar"
                                        aria-valuenow={coursesData[0].progress}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-[3rem] h-[3rem] rounded-full bg-[#ff6b35] hover:bg-[#e05621] text-white flex items-center justify-center text-[0.95rem] shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#ff6b35] focus-visible:outline-offset-2 shrink-0 self-start sm:self-auto"
                                aria-label={`Resume playing course module for ${coursesData[0].title}`}
                            >
                                ▶
                            </button>
                        </div>

                    </div>
                </section>
            )}
        </div>
    );
}