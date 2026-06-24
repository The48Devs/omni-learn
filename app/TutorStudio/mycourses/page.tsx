"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useOrganizations } from "@/app/components/organizations/OrganizationContext";
import { useAuth } from "@/app/components/AuthCOntext";
export default function MyCoursesPage() {
    const { user } = useAuth();
    const { getOrganizationsByOwner, getOrganizationsForStudent, getOrgCoursesWithData } = useOrganizations();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");

    useEffect(() => {
        if (!user?.uid) { setLoading(false); return; }
        Promise.all([
            getOrganizationsByOwner(user.uid),
            getOrganizationsForStudent(user.uid),
        ]).then(async ([owned, memberOf]) => {
            const allOrgs = [...owned, ...memberOf.filter(o => !owned.find(x => x.id === o.id))];
            const allCourses = await Promise.all(
                allOrgs.map(org => getOrgCoursesWithData(org.id))
            );
            setCourses(allCourses.flat());
            setLoading(false);
        });
    }, [user?.uid, getOrganizationsByOwner, getOrganizationsForStudent, getOrgCoursesWithData]);

    const coursesList = courses.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        tag: c.subject || "General",
        status: "published",
        bgClass: "from-[#4ca5bf] to-[#128a9b]",
        icon: (
            <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    }));

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
                                <Link
                                    href={`/TutorStudio/courses/${course.id}`}
                                    className="w-full text-center border border-[var(--border-color)] text-[var(--text-muted)] bg-[var(--bg-secondary)] font-semibold text-xs py-3 rounded-xl block hover:bg-[var(--bg-tertiary)] transition-colors"
                                >
                                    View Course
                                </Link>
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