"use client";

import React from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import Link from "next/link";

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
            title: "Total Learners",
            value: "1,240",
            change: "+12% this month",
        },
        {
            title: "Active Modules",
            value: "8",
            change: "0 change",
        },
        {
            title: "Avg Completion Rate",
            value: "84%",
            change: "+3% this week",
        },
        {
            title: "Interaction Time",
            value: "42 min",
            change: "+5m average",
        },
    ];

    return (
        <div className="w-full max-w-[80rem] mx-auto bg-[var(--bg-primary)] min-h-screen text-[var(--text-main)] p-[1.5rem] md:p-[3rem] space-y-[2.5rem] transition-colors duration-200">

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
                        <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold tracking-tight leading-tight text-white">
                            {userSession.fullName}
                        </h1>
                        <p className="text-[0.95rem] md:text-[1.05rem] text-gray-300">
                            @{userSession.handle} &bull; Instructor at {userSession.institution}
                        </p>
                    </div>
                </div>

                {/* quick stats */}
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

            {/* published courses */}
            <section className="space-y-[1.5rem]">
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.5rem] font-bold text-[var(--text-main)]">Published Courses</h2>
                    <a
                        href="#all-courses"
                        onClick={(e) => {
                            e.preventDefault();
                            announce("Redirecting to all courses.");
                        }}
                        className="text-[0.95rem] font-semibold text-[#FF6B35] hover:underline focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 rounded"
                    >
                        View All Courses
                    </a>
                </div>

                {/* grid wrapper */}
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5rem]" role="list">
                    {courses.map((course) => (
                        <li key={course.id}>
                            <article className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-[var(--border-color)] flex flex-col h-full">
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
                                <div className="p-[1.25rem] bg-[var(--bg-secondary)] flex justify-between items-center mt-auto border-t border-[var(--border-color)]">
                                    <div className="space-y-[0.25rem]">
                                        <Link
                                            href={`/TutorStudio/courses/${course.id}/analytics`}
                                            className="text-[0.85rem] font-semibold text-[var(--text-main)] hover:underline block text-left focus-visible:outline-[2px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-1 rounded"
                                        >
                                            View analytics
                                        </Link>
                                        {course.accessibilityCompliant && (
                                            <span className="inline-block text-[0.75rem] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-[0.5rem] py-[0.1rem] rounded">
                                                WCAG Compliant
                                            </span>
                                        )}
                                    </div>

                                    {/* Link arrow button */}
                                    <Link
                                        href={`/TutorStudio/courses/${course.id}/analytics`}
                                        aria-label={`Open ${course.title} analytics`}
                                        className="w-[2.5rem] h-[2.5rem] rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow hover:bg-[#e05825] transition-colors duration-200 focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            className="w-[1.25rem] h-[1.25rem] fill-none stroke-current stroke-2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>

                            </article>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Analytics overview */}
            <section className="space-y-[1rem]">
                <h2 className="text-[1.5rem] font-bold text-[var(--text-main)]">Analytics Overview</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {analyticsData.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm space-y-2"
                        >
                            <p className="text-sm font-medium text-[var(--text-muted)]">{stat.title}</p>
                            <p className="text-2xl font-bold text-[var(--text-main)]">{stat.value}</p>
                            <p className="text-xs text-[#FF6B35] font-semibold">{stat.change}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
