"use client";

import React, { useState, useEffect } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { useOrganizations } from "@/app/components/organizations/OrganizationContext";
import { useAuth } from "@/app/components/AuthCOntext";
import { Users, BookOpen, Eye } from "lucide-react";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    category: string;
    gradient: string;
    accessibilityCompliant: boolean;
}

export default function TutorDashboardContent() {
    const { announce } = useAccessibility();
    const { user, profile } = useAuth();
    const { getOrganizationsByOwner, getOrganizationsForStudent, getOrgCoursesWithData } = useOrganizations();
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        if (!user?.uid) return;
        Promise.all([
            getOrganizationsByOwner(user.uid),
            getOrganizationsForStudent(user.uid),
        ]).then(async ([owned, memberOf]) => {
            const allOrgs = [...owned, ...memberOf.filter(o => !owned.find(x => x.id === o.id))];
            const allCourses = await Promise.all(allOrgs.map(org => getOrgCoursesWithData(org.id)));
            setCourses(allCourses.flat());
        });
    }, [user, getOrganizationsByOwner, getOrganizationsForStudent, getOrgCoursesWithData]);

    const userSession = {
        fullName: profile?.fullName || user?.displayName || "Tutor",
        handle: profile?.tutorId || user?.uid?.slice(0, 8) || "T-00000",
        institution: profile?.institution || "",
        avatarInitials: (profile?.fullName || "T")?.split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase() || "TU",
    };

    const coursesList: Course[] = courses.map((c, i) => ({
        id: c.id,
        title: c.title,
        category: c.subject || "General",
        gradient: [
            "from-[#4ca5bf] to-[#128a9b]",
            "from-[#b47a61] to-[#cf987f]",
            "from-[#5b7887] to-[#7f9ba9]",
            "from-[#8b6fa0] to-[#b392bc]",
        ][i % 4],
        accessibilityCompliant: true,
    }));

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

    const quickStats = [
        { label: "Total Learners", value: "Active", icon: Users },
        { label: "Active Modules", value: `${courses.reduce((sum, c) => sum + Object.keys(c.modules || {}).length, 0)}`, icon: BookOpen },
        { label: "Accessibility", value: "98%", icon: Eye },
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
                    {quickStats.map((stat, i) => (
                        <div key={i} className="text-center md:text-right space-y-[0.15rem]">
                            <span className="block text-[0.8rem] md:text-[0.9rem] uppercase tracking-wider text-blue-300">{stat.label}</span>
                            <span className={`block text-[1.4rem] md:text-[1.8rem] font-bold ${i === 2 ? 'text-[#FF6B35]' : 'text-white'}`}>{stat.value}</span>
                        </div>
                    ))}
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
                    {coursesList.map((course) => (
                        <li key={course.id}>
                            <article className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-[var(--border-color)] flex flex-col h-full">
                                {/* bg gradient */}
                                <div className={`p-[1.5rem] bg-gradient-to-br ${course.gradient} min-h-[9rem] flex flex-col justify-between`}>
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
