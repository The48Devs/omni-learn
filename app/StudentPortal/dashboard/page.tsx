"use client";

import React, { useState, useEffect } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { useAuth } from "../../components/AuthCOntext";
import { useOrganizations } from "../../components/organizations/OrganizationContext";
import Link from "next/link";
import { Zap, Flame, BookOpen } from "lucide-react";


interface ContinueLearningCourse {
    id: string;
    title: string;
    status: "in-progress" | "up-next" | "review";
    progress: number;
    metricText: string;
    footerText: string;
    unlockCondition?: string;
}

// Deterministic subject → visual theme used by dashboard & cards
const SUBJECT_THEME: Record<string, { category: string; bgGradient: string; badgeStyle: string }> = {
    Physics: { category: 'SCIENCE', bgGradient: 'from-blue-900 to-indigo-950', badgeStyle: 'bg-blue-100/10 text-blue-400 border-blue-400/25' },
    Chemistry: { category: 'SCIENCE', bgGradient: 'from-cyan-950 to-sky-900', badgeStyle: 'bg-cyan-100/10 text-cyan-400 border-cyan-400/25' },
    Biology: { category: 'SCIENCE', bgGradient: 'from-emerald-950 to-teal-900', badgeStyle: 'bg-emerald-100/10 text-emerald-400 border-emerald-400/25' },
    Design: { category: 'DESIGN', bgGradient: 'from-pink-950 to-rose-900', badgeStyle: 'bg-pink-100/10 text-pink-400 border-pink-400/25' },
    Technology: { category: 'TECH', bgGradient: 'from-violet-950 to-purple-900', badgeStyle: 'bg-purple-100/10 text-purple-400 border-purple-400/25' },
    Robotics: { category: 'ROBOTICS', bgGradient: 'from-orange-950 to-amber-900', badgeStyle: 'bg-orange-100/10 text-orange-400 border-orange-400/25' },
    History: { category: 'HUMANITIES', bgGradient: 'from-stone-800 to-amber-950', badgeStyle: 'bg-amber-100/10 text-amber-500 border-amber-400/25' },
    Philosophy: { category: 'HUMANITIES', bgGradient: 'from-indigo-900 to-violet-950', badgeStyle: 'bg-indigo-100/10 text-indigo-400 border-indigo-400/25' },
    Mathematics: { category: 'SCIENCE', bgGradient: 'from-sky-900 to-blue-950', badgeStyle: 'bg-sky-100/10 text-sky-400 border-sky-400/25' },
    General: { category: 'GENERAL', bgGradient: 'from-slate-900 to-sky-950', badgeStyle: 'bg-slate-100/10 text-slate-400 border-slate-400/25' },
};
const getSubjectTheme = (subject: string) => SUBJECT_THEME[subject] ?? SUBJECT_THEME['General'];

interface RecommendedCourse {
    id: string;
    title: string;
    subject: string;
    category: string;
    lessonsCount: number;
    bgGradient: string;
    badgeStyle: string;
}

export default function StudentDashboard() {
    const { announce } = useAccessibility();
    const { user, profile } = useAuth();
    const { getOrganizationsForStudent, getStudentXp, getXpProgress, getStreak, getOrgCoursesWithData, getCourseProgress } = useOrganizations();
    const [orgLevelData, setOrgLevelData] = useState<{ orgName: string; orgId: string; level: number; currentXp: number; nextLevelXp: number } | null>(null);
    const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});
    // true while the async org/course fetch is in-flight — prevents premature empty-state flash
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;
        const uid = user.uid;
        setIsLoading(true);
        getOrganizationsForStudent(uid).then(async (orgs) => {
            if (orgs.length === 0) {
                setIsLoading(false);
                return;
            }
            const org = orgs[0];
            const xp = await getStudentXp(org.id, uid);
            const progress = getXpProgress(xp);
            setOrgLevelData({ orgName: org.name, orgId: org.id, ...progress });
            const courses = await getOrgCoursesWithData(org.id);
            setAllCourses(courses);
            // Fetch real progress for each course concurrently
            if (courses.length > 0) {
                const progressValues = await Promise.all(
                    courses.map((c: any) => getCourseProgress(c.id!, uid))
                );
                const map: Record<string, number> = {};
                courses.forEach((c: any, i: number) => { if (c.id) map[c.id] = progressValues[i]; });
                setProgressMap(map);
            }
            setIsLoading(false);
        });
        getStreak(uid).then(data => setStreak(data));
    }, [user?.uid, getOrganizationsForStudent, getStudentXp, getXpProgress, getStreak, getOrgCoursesWithData, getCourseProgress]);

    const continueLearningCourses: ContinueLearningCourse[] = allCourses.slice(0, 3).map(c => ({
        id: c.id,
        title: c.title,
        status: "in-progress" as const,
        progress: progressMap[c.id] ?? 0,
        metricText: `${Object.keys(c.modules || {}).length} Modules`,
        footerText: progressMap[c.id] > 0 ? "Resume" : "Start",
    }));
    const recommendedCourses: RecommendedCourse[] = allCourses.slice(3).map((c) => {
        const theme = getSubjectTheme(c.subject || 'General');
        return {
            id: c.id,
            title: c.title,
            subject: c.subject || 'General',
            category: theme.category,
            lessonsCount: Object.keys(c.modules || {}).length,
            bgGradient: theme.bgGradient,
            badgeStyle: theme.badgeStyle,
        };
    });

    const [carouselIndex, setCarouselIndex] = useState(0);

    const handleNextCarousel = () => {
        if (carouselIndex < recommendedCourses.length - 1) {
            setCarouselIndex((prev) => prev + 1);
            announce("Showing next recommended courses");
        }
    };

    const handlePrevCarousel = () => {
        if (carouselIndex > 0) {
            setCarouselIndex((prev) => prev - 1);
            announce("Showing Previous recommended courses");
        }
    };

    // Empty state

    const EmptyStateCard = ({ sectionLabel }: { sectionLabel: string }) => (
        <div
            role="status"
            aria-label={`${sectionLabel} — no courses available`}
            className="col-span-full flex flex-col items-center justify-center gap-[1.2rem] py-[2.5rem] px-[1.5rem] rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-secondary)] text-center"
        >
            <div className="w-[3.5rem] h-[3.5rem] rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                <BookOpen size={22} className="text-[var(--text-muted)]" />
            </div>
            <div className="space-y-[0.4rem]">
                <p className="text-[0.95rem] font-extrabold text-[var(--text-main)]">
                    No courses available at the moment.
                </p>
                <p className="text-[0.8rem] text-[var(--text-muted)] max-w-[26rem]">
                    Explore the catalog or join an organization to start learning.
                </p>
            </div>
            <Link
                href="/StudentPortal/explore"
                className="mt-[0.5rem] px-[1.2rem] py-[0.55rem] rounded-full bg-[#ff6b35] hover:bg-[#e05621] text-white text-[0.8rem] font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b35]"
            >
                Explore Courses →
            </Link>
        </div>
    );



    return (
        <div className="space-y-[2rem]">
            {/* Viewport header */}
            <div className="flex items-center justify-between pb-[1rem] border-b border-[var(--border-color)]">
                <h2 className="text-[1.35rem] font-extrabold text-[var(--text-main)]">Student Dashboard</h2>
                <div className="flex items-center gap-[1rem]">
                    <span className="text-[0.8rem] font-bold text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-[0.75rem] py-[0.35rem] rounded-full">
                        {profile?.fullName || user?.displayName || 'Student'}
                    </span>
                </div>
            </div>

            {/* Level progression + hero banner */}
            <section
                aria-label="Level progression status"
                className="bg-gradient-to-r from-[#2a5c8f] to-[#4585ab] rounded-2xl p-[1.8rem] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-[1.5rem] relative overflow-hidden shadow-xl"
            >
                {orgLevelData ? (
                    <>
                        <div className="space-y-[1.2rem] max-w-[28rem] z-10">
                            <div>
                                <h1 className="text-[1.8rem] font-extrabold leading-tight">
                                    Welcome back, {profile?.fullName || user?.displayName || 'Student'}.
                                </h1>
                                <Link href={`/StudentPortal/organization/${orgLevelData.orgId}`} className="text-[0.85rem] opacity-80 font-medium hover:opacity-100 transition-opacity underline underline-offset-2">
                                    {orgLevelData.orgName}
                                </Link>
                            </div>
                            <div className="space-y-[0.4rem]">
                                <div className="flex justify-between text-[0.78rem] font-bold tracking-wide">
                                    <span>Progress to Level {orgLevelData.level + 1}</span>
                                    <span>{orgLevelData.nextLevelXp > 0 ? Math.round((orgLevelData.currentXp / orgLevelData.nextLevelXp) * 100) : 0}%</span>
                                </div>
                                <div className="w-full h-[0.75rem] bg-black/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#ff6b35] rounded-full transition-all duration-500"
                                        style={{ width: `${orgLevelData.nextLevelXp > 0 ? Math.min((orgLevelData.currentXp / orgLevelData.nextLevelXp) * 100, 100) : 0}%` }}
                                        aria-valuenow={orgLevelData.nextLevelXp > 0 ? Math.round((orgLevelData.currentXp / orgLevelData.nextLevelXp) * 100) : 0}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        role="progressbar"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="relative shrink-0 z-10 self-center md:self-auto flex items-center gap-4">
                            <div className="w-[8.5rem] h-[8.5rem] rounded-full bg-[#c04d2b] border-4 border-white/20 shadow-2xl flex flex-col items-center justify-center text-center">
                                <span className="text-[1.35rem] font-extrabold tracking-tight flex items-center gap-1">
                                    <Zap size={22} /> {orgLevelData.currentXp} XP
                                </span>
                                <span className="text-[0.68rem] uppercase font-extrabold tracking-widest opacity-80 mt-[0.2rem]">Level {orgLevelData.level}</span>
                            </div>
                            {streak && (
                                <div className="flex flex-col items-center">
                                    <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-[#c04d2b]/70 border-2 border-white/20 shadow-lg flex flex-col items-center justify-center text-center">
                                        <Flame size={18} className="text-orange-300" />
                                        <span className="text-[1.1rem] font-extrabold tracking-tight leading-none">{streak.current}</span>
                                    </div>
                                    <span className="text-[0.6rem] uppercase font-extrabold tracking-widest opacity-70 mt-1">Streak</span>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="w-full text-center py-6">
                        <h1 className="text-[1.8rem] font-extrabold leading-tight">
                            Welcome back, {profile?.fullName || user?.displayName || 'Student'}.
                        </h1>
                        <p className="text-[0.9rem] opacity-90 font-medium mt-2">
                            Join or create an organization to start tracking your level!
                        </p>
                    </div>
                )}
            </section>

            {/* Continue learning grid */}
            <section aria-labelledby="continue-learning-heading" className="space-y-[1rem]">
                <div className="flex items-center justify-between">
                    <h2 id="continue-learning-heading" className="text-[1.2rem] font-extrabold text-[var(--text-main)]">
                        Continue Learning
                    </h2>
                    <Link
                        href="/StudentPortal/mycourses"
                        className="text-[0.85rem] font-extrabold text-[#ff6b35] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]"
                    >
                        View All Courses
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.2rem]">
                    {isLoading ? (
                        // Skeleton shimmer — prevents layout-jump during fetch
                        Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-[11rem] rounded-2xl bg-[var(--bg-secondary)] animate-pulse border border-[var(--border-color)]"
                                aria-hidden="true"
                            />
                        ))
                    ) : continueLearningCourses.length === 0 ? (
                        <EmptyStateCard sectionLabel="Continue Learning" />
                    ) : (
                        continueLearningCourses.map((course) => {
                            const isLocked = course.status === "up-next";
                            const isReview = course.status === "review";
                            return (
                                <div
                                    key={course.id}
                                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                                >
                                    <div className="p-[1.2rem] space-y-[1rem]">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`px-[0.6rem] py-[0.25rem] rounded-full text-[0.68rem] font-extrabold uppercase tracking-wider ${isLocked
                                                    ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                                                    : "bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)]"
                                                    }`}
                                            >
                                                {course.status === "in-progress" ? "In Progress" : course.status === "up-next" ? "Up Next" : "In Progress"}
                                            </span>
                                            {isLocked ? (
                                                <div className="w-[1.8rem] h-[1.8rem] rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] flex items-center justify-center text-[0.9rem] shadow-sm">
                                                    🔒
                                                </div>
                                            ) : (
                                                <Link
                                                    href={`/StudentPortal/courses/${course.id}`}
                                                    className="w-[1.8rem] h-[1.8rem] rounded-full bg-[var(--button-primary,var(--text-main))] text-[var(--bg-primary)] flex items-center justify-center text-[0.7rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]"
                                                    aria-label={`Play Lesson content for ${course.title}`}
                                                >
                                                    ▶
                                                </Link>
                                            )}
                                        </div>
                                        <h3 className="text-[0.98rem] font-extrabold text-[var(--text-main)] leading-snug min-h-[2.6rem]">
                                            {course.title}
                                        </h3>
                                        <div className="space-y-[0.35rem]">
                                            <div className="flex justify-between text-[0.72rem] font-bold text-[var(--text-muted)]">
                                                <span>{course.metricText}</span>
                                            </div>
                                            <div className="w-full h-[0.3rem] bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${isLocked ? "bg-gray-300" : "bg-[#ff6b35]"}`}
                                                    style={{ width: `${course.progress || 10}%` }}
                                                    aria-valuenow={course.progress}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    role="progressbar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] px-[1.2rem] py-[0.75rem] flex items-center justify-between gap-[0.5rem]">
                                        <span className="text-[0.72rem] font-extrabold text-[var(--text-main)]">
                                            {course.footerText}
                                        </span>
                                        {isLocked ? (
                                            <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] flex items-center justify-center text-[0.7rem]">
                                                🔒
                                            </div>
                                        ) : isReview ? (
                                            <Link
                                                href={`/StudentPortal/courses/${course.id}`}
                                                className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff6b35] hover:bg-[#e05621] text-white flex items-center justify-center text-[0.75rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]"
                                                aria-label={`Restart/Review last module of ${course.title}`}
                                            >
                                                ↻
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/StudentPortal/courses/${course.id}`}
                                                className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff6b35] hover:bg-[#e05621] text-white flex items-center justify-center text-[0.75rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]"
                                                aria-label={`Proceed with recommended next step in ${course.title}`}
                                            >
                                                →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </section>

            {/* Recommended courses */}
            <section aria-labelledby="recommended-courses-heading" className="space-y-[1rem]">
                <div className="flex items-center justify-between">
                    <h2 id="recommended-courses-heading" className="text-[1.2rem] font-extrabold text-[var(--text-main)]">
                        Recommended Courses
                    </h2>
                    <div className="flex items-center gap-[0.4rem]">
                        <button
                            type="button"
                            onClick={handlePrevCarousel}
                            disabled={carouselIndex === 0}
                            className={`w-[2rem] h-[2rem] rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center font-bold text-[0.8rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35] ${carouselIndex === 0
                                ? "opacity-40 cursor-not-allowed text-[var(--text-muted)]"
                                : "hover:bg-[#ff6b35] hover:text-white text-[var(--text-main)]"
                                }`}
                            aria-label="Previous recommended courses page"
                        >
                            &lt;
                        </button>
                        <button
                            type="button"
                            onClick={handleNextCarousel}
                            disabled={carouselIndex >= recommendedCourses.length - 1}
                            className={`w-[2rem] h-[2rem] rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-center font-bold text-[0.8rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35] ${carouselIndex >= recommendedCourses.length - 1
                                ? "opacity-40 cursor-not-allowed text-[var(--text-muted)]"
                                : "hover:bg-[#ff6b35] hover:text-white text-[var(--text-main)]"
                                }`}
                            aria-label="Next recommended courses page"
                        >
                            &gt;
                        </button>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.2rem] transition-transform duration-300 ease-out"
                        style={{ transform: `translateX(-${carouselIndex * 5}%)` }}
                    >
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-[12rem] rounded-2xl bg-[var(--bg-secondary)] animate-pulse border border-[var(--border-color)]"
                                    aria-hidden="true"
                                />
                            ))
                        ) : recommendedCourses.length === 0 ? (
                            <EmptyStateCard sectionLabel="Recommended Courses" />
                        ) : (
                            recommendedCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group focus-within:ring-3 focus-within:ring-[#2563eb]"
                                >
                                    <div
                                        className={`w-full h-[6.5rem] bg-gradient-to-br ${course.bgGradient} relative flex items-center justify-center text-white/10 text-[2.5rem] font-bold select-none`}
                                    >
                                        {course.category}
                                    </div>
                                    <div className="p-[1rem] space-y-[0.5rem]">
                                        <span className={`inline-block px-[0.5rem] py-[0.15rem] rounded-md text-[0.62rem] font-extrabold tracking-wider border ${course.badgeStyle}`}>
                                            {course.category}
                                        </span>
                                        <h3 className="text-[0.85rem] font-extrabold text-[var(--text-main)] leading-snug min-h-[2.4rem] group-hover:text-[#ff6b35] transition-colors">
                                            <Link
                                                href={`/StudentPortal/courses/${course.id}`}
                                                className="focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]"
                                            >
                                                {course.title}
                                            </Link>
                                        </h3>
                                        <div className="flex justify-end items-center text-[0.72rem] font-bold pt-[0.4rem] border-t border-[var(--border-color)] text-[var(--text-muted)]">
                                            <span>{course.lessonsCount} {course.lessonsCount === 1 ? 'Module' : 'Modules'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </section>
        </div>
    );
}
