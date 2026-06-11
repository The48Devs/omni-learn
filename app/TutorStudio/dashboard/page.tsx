"use client";

import React from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";

interface Course {
    id: string;
    title: string;
    category: string;
    gradientClass: string;
    accessibilityCompliant: boolean;
}

export default function TutorDashboardContent() {
    const { announce } = useAccessibility();

    // use session data 
    const userSession = {
        fullName: "Manuja Samarathunga",
        handle: "T-20043",
        institution: "Nalanda College",
        avatarInitials: "MS",
    };

    // Published Courses Data
    const courses: Course[] = [
        {
            id: "course-1",
            title: "Advanced Quantum Mechanics",
            category: "Physics",
            gradientClass: "from-teal-600 to-emerald-700",
            accessibilityCompliant: true,
        },
        {
            id: "course-2",
            title: "Cellular Biology & Genetics",
            category: "Biology",
            gradientClass: "from-blue-600 to-indigo-800",
            accessibilityCompliant: true,
        },
        {
            id: "course-3",
            title: "Industrial Revolution & Modernity",
            category: "History",
            gradientClass: "from-slate-700 to-gray-900",
            accessibilityCompliant: true,
        },
    ];

    const handleCourseClick = (title: string) => {
        announce(`Navigating to ${title} details.`);
        alert(`Viewing Details for: ${title}`);
    };

    const analyticsData = [
        {
            title: "COMPLETION RATE",
            value: "84.2%",
            comparison: "+2.4% vs last week",
            trend: "up",
            color: "border-blue-400",
            icon: (
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="w-full max-w-[80rem] mx-auto bg-[#F9FAFB] min-h-screen text-gray-900 p-[1.5rem] md:p-[3rem] space-y-[2.5rem]">

            {/* Hero banner */}
            <section
                aria-label="Tutor profile banner"
                className="relative bg-gradient-to-r from-[#041A3E] via-[#092c66] to-[#041A3E] text-white rounded-2xl p-[1.5rem] md:p-[2.5rem] shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-[1.5rem]"
            >
                {/* ID block */}
                <div className="flex items-center gap-[1.25rem]">
                    {/* placeholder */}
                    <div
                        className="w-[4.5rem] h-[4.5rem] rounded-full bg-[#FF6B35] flex items-center justify-center text-[1.5rem] font-bold text-white shadow-inner select-none"
                        aria-hidden="true"
                    >
                        {userSession.avatarInitials}
                    </div>
                    <div className="space-y-[0.25rem]">
                        <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold tracking-tight leading-tight">
                            {userSession.fullName}
                        </h1>
                        <p className="text-[0.95rem] md:text-[1.05rem] text-gray-300">
                            @{userSession.handle} &bull; Instructor at {userSession.institution}
                        </p>
                    </div>
                </div>

                {/*quick stats */}
                <div className="grid grid-cols-3 gap-[1rem] md:gap-[2rem] w-full md:w-auto border-t md:border-t-0 border-blue-900 pt-[1.5rem] md:pt-0">
                    <div className="text-center md:text-right space-y-[0.15rem]">
                        <span className="block text-[0.8rem] md:text-[0.9rem] uppercase tracking-wider text-blue-300">Total Learners</span>
                        <span className="block text-[1.4rem] md:text-[1.8rem] font-bold text-white">1,240</span>
                    </div>
                    <div className="text-center md:text-right space-y-[0.15rem]">
                        <span className="block text-[0.8rem] md:text-[0.9rem] uppercase tracking-wider text-blue-300">Active Modules</span>
                        <span className="block text-[1.4rem] md:text-[1.8rem] font-bold text-white">8</span>
                    </div>
                    <div className="text-center md:text-right space-y-[0.15rem]">
                        <span className="block text-[0.8rem] md:text-[0.9rem] uppercase tracking-wider text-blue-300">Accessibility</span>
                        <span className="block text-[1.4rem] md:text-[1.8rem] font-bold text-[#FF6B35]">98%</span>
                    </div>
                </div>
            </section>

            {/* published courses*/}
            <section className="space-y-[1.5rem]">
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.5rem] font-bold text-[#041A3E]">Published Courses</h2>
                    <a
                        href="#all-courses"
                        onClick={(e) => {
                            e.preventDefault();
                            announce("Redirecting to all courses.");
                        }}
                        className="text-[0.95rem] font-semibold text-[#FF6B35] hover:underline focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 rounded"
                    >
                        View All Courses
                    </a>
                </div>

                {/* grid wrapper */}
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem]" role="list">
                    {courses.map((course) => (
                        <li key={course.id}>
                            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col h-full">
                                {/* bg gradient */}
                                <div className={`p-[1.5rem] bg-gradient-to-br ${course.gradientClass} min-h-[9rem] flex flex-col justify-between`}>
                                    {/* Category */}
                                    <span className="inline-block self-start text-[0.75rem] font-bold tracking-wider text-white uppercase bg-white/20 px-[0.75rem] py-[0.25rem] rounded-full backdrop-blur-sm">
                                        {course.category}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-[1.2rem] font-bold text-white tracking-wide mt-[1rem]">
                                        {course.title}
                                    </h3>
                                </div>

                                {/* Footer */}
                                <div className="p-[1.25rem] bg-white flex justify-between items-center mt-auto border-t border-gray-50">
                                    <div className="space-y-[0.25rem]">
                                        <button
                                            type="button"
                                            onClick={() => handleCourseClick(course.title)}
                                            className="text-[0.85rem] font-semibold text-[#041A3E] hover:underline block text-left focus-visible:outline-[2px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-1 rounded"
                                        >
                                            View analytics
                                        </button>
                                        {course.accessibilityCompliant && (
                                            <span className="inline-block text-[0.75rem] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-[0.5rem] py-[0.1rem] rounded">
                                                WCAG Compliant
                                            </span>
                                        )}
                                    </div>

                                    {/* arrow button */}
                                    <button
                                        type="button"
                                        onClick={() => handleCourseClick(course.title)}
                                        aria-label={`Open ${course.title} settings`}
                                        className="w-[2.5rem] h-[2.5rem] rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow hover:bg-[#e05825] transition-colors duration-200 focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            className="w-[1.25rem] h-[1.25rem] fill-none stroke-current stroke-2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Analytics overview */}
            <section className="space-y-[1rem]">
                <h2 className="text-[1.5rem] font-bold text-[#041A3E]">Analytics Overview</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {analyticsData.map((stat, i) => (
                        <div
                            key={i}
                            className={`bg-[var(--bg-primary)] border-t-4 ${stat.color} p-6 rounded-xl shadow-sm border border-[var(--border-color)] flex flex-col items-center justify-center text-center space-y-4`}
                        >
                            <span className="text-[11px] font-bold tracking-widest text-[var(--text-muted)]">
                                {stat.title}
                            </span>
                            <div className="w-14 h-14 rounded-full bg-slate-100/80 flex items-center justify-center shadow-inner">
                                {stat.icon}
                            </div>
                            <span className="text-3xl font-extrabold text-[var(--text-main)]">
                                {stat.value}
                            </span>
                            <span className={`text-xs font-semibold flex items-center gap-1
                                ${stat.trend === "up"
                                    ? "text-emerald-600"
                                    : stat.trend === "down"
                                        ? "text-rose-500 font-bold"
                                        : "text-[var(--text-muted)]"
                                }`}
                            >
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
