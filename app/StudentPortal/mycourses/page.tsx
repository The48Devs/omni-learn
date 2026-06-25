"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { useOrganizations } from "@/app/components/organizations/OrganizationContext";
import { useAuth } from "@/app/components/AuthCOntext";

export default function MyCoursesPage() {
    const { announce } = useAccessibility();
    const { user } = useAuth();
    const { getOrganizationsForStudent, getOrgCoursesWithData, getCourseProgress } = useOrganizations();
    const [courses, setCourses] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");

    // mock database state for later firestore integration

    useEffect(() => {
        if (!user?.uid) { setLoading(false); return; }
        const uid: string = user.uid;
        getOrganizationsForStudent(uid).then(async (orgs) => {
            const allCourses = await Promise.all(
                orgs.map(org => getOrgCoursesWithData(org.id))
            );
            const flat = allCourses.flat();
            setCourses(flat);
            const proms = await Promise.all(
                flat.filter(c => c.id).map(c => getCourseProgress(c.id!, uid))
            );
            const map: Record<string, number> = {};
            flat.filter(c => c.id).forEach((c, i) => { map[c.id!] = proms[i]; });
            setProgressMap(map);
            setLoading(false);
        });
    }, [user?.uid, getOrganizationsForStudent, getOrgCoursesWithData, getCourseProgress]);

    const coursesData: any[] = courses.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.subject || "General",
        currentModule: Object.keys(c.modules || {})[0] ? `Module 1: ${c.modules[Object.keys(c.modules)[0]].title}` : "No modules yet",
        progress: progressMap[c.id] || 0,
        timeRemaining: progressMap[c.id] === 100 ? "Complete" : "In progress",
        status: progressMap[c.id] === 100 ? "completed" : "in-progress",
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
    }));

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
                            <Link
                                href={`/StudentPortal/courses/${coursesData[0].id}`}
                                className="w-[3rem] h-[3rem] rounded-full bg-[#ff6b35] hover:bg-[#e05621] text-white flex items-center justify-center text-[0.95rem] shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#ff6b35] focus-visible:outline-offset-2 shrink-0 self-start sm:self-auto"
                                aria-label={`Resume playing course module for ${coursesData[0].title}`}
                            >
                                ▶
                            </Link>
                        </div>

                    </div>
                </section>
            )}
            {/* Course cards layout */}
            {!loading && filteredCourses.length === 0 && (
                <section
                    className="flex flex-col items-center justify-center py-[5rem] gap-[1.5rem] rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)]"
                    aria-label="No courses available"
                >
                    <div className="w-[4rem] h-[4rem] rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[2rem]" aria-hidden="true">
                        📚
                    </div>
                    <div className="text-center space-y-[0.4rem]">
                        <h2 className="text-[1.1rem] font-extrabold text-[var(--text-main)]">
                            No courses available at the moment.
                        </h2>
                        <p className="text-[0.82rem] text-[var(--text-muted)] max-w-[22rem]">
                            {filter !== "all"
                                ? `No ${filter.replace("-", " ")} courses found. Try switching to "All Courses".`
                                : "Join an organization or ask your tutor to enroll you in a course."}
                        </p>
                    </div>
                    <Link
                        href="/StudentPortal/explore"
                        className="px-[1.5rem] py-[0.65rem] bg-[var(--text-main)] text-[var(--bg-primary)] text-[0.82rem] font-extrabold rounded-full hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2"
                    >
                        Explore Courses →
                    </Link>
                </section>
            )}
            <section aria-label="Subscribed courses grid">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
                        >
                            <div className="space-y-[1.2rem]">
                                <div className={`h-[8rem] bg-gradient-to-br ${course.themeColor.gradient} relative flex items-center justify-center text-white/20 select-none`}>
                                    <span className="absolute top-[0.8rem] left-[0.8rem] px-[0.6rem] py-[0.2rem] bg-white/10 border border-white/10 rounded-full text-[0.62rem] font-extrabold uppercase tracking-widest text-white">
                                        {course.category}
                                    </span>
                                    {course.iconGlyph}
                                </div>
                                {/* Text content panel */}
                                <div className="px-[1.2rem] space-y-[0.6rem]">
                                    <div className="self-start px-2 py-1 rounded-md border text-[0.6rem] font-bold uppercase tracking-wider inline-block"
                                        style={{ color: '#3b82f6', borderColor: '#bfdbfe', backgroundColor: 'transparent' }}>
                                        {course.category}
                                    </div>
                                    <h3 className="text-[1.05rem] font-extrabold text-[var(--text-main)] group-hover:text-[#ff6b35] transition-colors leading-snug">
                                        {course.title}
                                    </h3>

                                    {/* New Publisher Display */}
                                    <p className="text-[0.75rem] font-medium" style={{ color: 'var(--text-muted)' }}>
                                        By {course.publisher || "OmniLearn Partner"}
                                    </p>
                                    <p className="text-[0.78rem] text-[var(--text-muted)] leading-relaxed line-clamp-2">
                                        {course.description}
                                    </p>
                                </div>
                                <div className="px-[1.2rem] flex justify-between items-center text-[0.75rem] font-bold mt-2" style={{ color: 'var(--text-muted)' }}>
                                    <span className="flex items-center gap-1 text-amber-500">
                                        ★ <span style={{ color: 'var(--text-main)' }}>{course.rating || "4.8"}</span>
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span>⏱ {course.duration || "2h 45m"}</span>
                                        <span style={{ color: 'var(--text-main)' }}>{course.lessonsCount || 10} Lessons</span>
                                    </div>
                                </div>
                            </div>
                            {/* Footer */}
                            <div className="p-[1.2rem] mt-[1.2rem] space-y-[1rem] border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
                                {/* progress metrics */}
                                <div className="space-y-[0.3rem]">
                                    <div className="flex justify-between text-[0.72rem] font-bold text-[var(--text-muted)]">
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="w-full h-[0.25rem] bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--text-main)] rounded-full"
                                            style={{ width: `${course.progress}%` }}
                                            role="progressbar"
                                            aria-valuenow={course.progress}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                        />
                                    </div>
                                </div>
                                <Link
                                    href={`/StudentPortal/courses/${course.id}`}
                                    className="block w-full py-[0.5rem] border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] font-extrabold text-[0.82rem] rounded-xl transition-all text-center focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-1"
                                >
                                    {course.progress > 0 ? "Resume Course" : "Start Course"}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div >
    );
}