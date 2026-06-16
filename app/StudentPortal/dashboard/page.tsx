"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/components/AuthCOntext";
import RequireAuth from "@/app/components/RequireAuth";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { transform } from "next/dist/build/swc";

interface ContinueLearningCourse {
    id: string;
    title: string;
    status: "in-progress" | "up-next" | "review";
    progress: number;
    metricText: string;
    footerText: string;
    unlockCondition?: string;
}
interface RecommendedCourse {
    id: string;
    title: string;
    category: "SCIENCE" | "DESIGN" | "TECH" | "ROBOTICS";
    rating: number;
    lessonsCount: number;
    bgGradient: string;

}

export default function StudentDashboard() {
    const { announce } = useAccessibility();

    const continueLearningCourses: ContinueLearningCourse[] = [
        {
            id: "quantum-mech",
            title: "Advanced Quantum Mechanics",
            status: "in-progress",
            progress: 65,
            metricText: "65% Complete • 2h 15m left",
            footerText: "Recommended Next",
        },
        {
            id: "cellular-bio",
            title: "Cellular Biology: Structure & Function",
            status: "up-next",
            progress: 0,
            metricText: "0% Complete • 8 Modules",
            footerText: "Unlocks after Quantum Mechanics",
            unlockCondition: "Advanced Quantum Mechanics",
        },
        {
            id: "euro-history",
            title: "European History: The Renaissance",
            status: "review",
            progress: 12,
            metricText: "12% Complete • 4h left",
            footerText: "Review Previous Module",
        },
    ];

    const recommendedCourses: RecommendedCourse[] = [
        {
            id: "org-chem",
            title: "Organic Chemistry Synthesis",
            category: "SCIENCE",
            rating: 4.9,
            lessonsCount: 12,
            bgGradient: "from-blue-900 to-indigo-950",
        },
        {
            id: "uiux-principles",
            title: "UI/UX Principles for Future Systems",
            category: "DESIGN",
            rating: 4.8,
            lessonsCount: 18,
            bgGradient: "from-orange-950 to-amber-900",
        },
        {
            id: "intro-neural",
            title: "Intro to Neural Networks",
            category: "TECH",
            rating: 5.0,
            lessonsCount: 24,
            bgGradient: "from-slate-900 to-sky-950",
        },
        {
            id: "embedded-hardware",
            title: "Embedded Systems & Hardware",
            category: "ROBOTICS",
            rating: 4.7,
            lessonsCount: 15,
            bgGradient: "from-emerald-950 to-teal-900",
        },
    ];
    const [carouselIndex, setCarouselIndex] = useState(0);

    const handleNextCarousel = () => {
        if (carouselIndex < recommendedCourses.length - 1) {
            setCarouselIndex((prev) => prev + 1);
            announce("Showing next recommended courses");
        }
    };

    const handlePrevCarousel = () => {
        if (carouselIndex > 0) {
            setCarouselIndex((prev) => prev + 1);
            announce("Showing Previous recommended courses")
        }
    }
    return (
        <div className="space-y-[2rem]">
            {/*Viewport header*/}
            <div className="flex items-center justify-between pb-[1rem] border-b border-gray-200">
                <h2 className="text-[1.35rem] font-extrabold text-[#0b1b3d]">Student Dasboard</h2>
                <div className="flex items-center gap-[1rem]">
                    <span className="text-[0.8rem] font-bold text-gray-500 bg-gray-100 px-[0.75rem] py-[0.35rem] rounded-full">
                        Sarah A.
                    </span>
                </div>
            </div>
            {/*Level progression + hero banner*/}
            <section aria-lavel="Level progression status"
                className="bg-gradient-to-r from-[#2a5c8f] to-[#4585ab] rounded-2xl p-[1.8rem] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-[1.5rem] relative overflow-hidden shadow-xl">
                {/*Left metadata stack*/}
                <div className="space-y-[1.2rem] max-w-[28rem] z-10">
                    <div> <h1 className="text-[1.8rem] font-extrabold leading-tight">
                        Welcome back, Sarah A.
                    </h1>
                        <p className="text-[0.9rem] opacity-90 font-medium leading-relaxed mt-[0.35rem]">
                            You're making great progress this week. Keep up the momentum and reach Level 13! </p>
                    </div>
                    {/*Linear metric tracker */}
                    <div className="space-y-[0.4rem]">
                        <div className="flex justify-between text-[0.78rem] font-bold tracking-wide ">
                            <span>Progress to Level 13</span>
                            <span>75%</span>
                        </div>
                        <div className="w-full h-[0.75rem] bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#ff6b35] rounded-full transition-all duration-500"
                                style={{ width: "75%" }}
                                aria-valuenow={75}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                role="progressbar"
                            />
                        </div>
                    </div>
                </div>
                {/* XP medal*/}
                <div className="relative shrink-0 z-10 self-center md:self-auto">
                    <div className="w-[8.5rem] h-[8.5rem] rounded-full bg-[#c04d2b] border-4 border-white/20 shadow-2xl flex flex-col items-center justify-center text-center">
                        <span className="text-[1.35rem] font-extrabold tracking-tight"> 2,450 XP</span>
                        <span className="text-[0.68rem] uppercase font-extrabold tracking-widest opacity-80 mt-[0.2rem]">Level 12 Scholar</span>
                    </div>
                    <div className="absolute top-0 right-0 w-[2.2rem] h-[2.2rem] rounded-full bg-[#7ec4cf] text-[#0b1b3d] flex items-center justify-center font-bold text-[1.1rem] shadow-md border-2 border-white">🎖️</div>
                </div>
            </section >
            {/*Coontinue learning grid */}
            <section aria-labelledby="continue-learning-heading" className="space-y-[1rem]">
                <div className="flex items-center justify-between">
                    <h2 id="continue-learning-heading" className="text-[1.2rem] font-extrabold text-[#0b1b3d]">
                        Continue Learning</h2>
                    <a
                        href="#all-courses"
                        className="text-[0.85rem] font-extrabold text-[#ff6b35] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]">
                        View All Courses
                    </a>
                </div>
                <div className="rid grid-cols-1 md:grid-cols-3 gap-[1.2rem]">
                    {continueLearningCourses.map((course) => {
                        const isLocked = course.status === "up-next";
                        const isReview = course.status === "review";
                        return (
                            <div
                                key={course.id}
                                className="bg-white border border-[#e2e8f0] rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                            >
                                <div className="p-[1.2rem] space-y-[1rem]">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`px-[0.6rem] py-[0.25rem] rounded-full text-[0.68rem] font-extrabold uppercase tracking-wider ${isLocked
                                                ? "bg-slate-100 text-slate-500"
                                                : "bg-blue-50 text-blue-600"
                                                }`}
                                        >
                                            {course.status === "in-progress" ? "In Progress" : course.status === "up-next" ? "Up Next" : "In Progress"}
                                        </span>
                                        {isLocked ? (
                                            <div className="w-[1.8rem] h-[1.8rem] rounded-full bg-[#f1f5f9] text-[#64748b] flex items-center justify-center text-[0.9rem] shadow-sm">
                                                🔒
                                            </div>
                                        ) : (
                                            <button type="button"
                                                className="w-[1.8rem] h-[1.8rem] rounded-full bg-[#0b1b3d] hover:bg-[#ff6b35] text-white flex items-center justify-center text-[0.7rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35"
                                                aria-label={`Play Lesson content for ${course.title}`}>
                                                ▶
                                            </button>
                                        )}
                                    </div>
                                    <h3
                                        className="text-[0.98rem] font-extrabold text-[#0b1b3d] leading-snug min-h-[2.6rem]">
                                        {course.title}
                                    </h3>
                                    <div className="space-y-[0.35rem]">
                                        <div className="flex justify-between text-[0.72rem] font-bold text-gray-500">
                                            <span>{course.metricText}</span>
                                        </div>
                                        <div className="w-full h-[0.3rem] bg-gray-100 rounded-full overflow-hidden">
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
                                <div className="bg-[#f8fafc] border-t border-[#e2e8f0] px-[1.2rem] py-[0.75rem] flex items-center justify-between gap-[0.5rem]">
                                    <span className={`text-[0.72rem] font-extrabold ${isLocked ? "text-slate-500" : "text-[#0b1b3d]"}`}>
                                        {course.footerText}
                                    </span>
                                    {isLocked ? (
                                        <div className="w-[1.5rem] h-[1.5rem] rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[0.7rem]">
                                            🔒
                                        </div>
                                    ) : isReview ? (
                                        <button
                                            type="button"
                                            className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff6b35] hover:bg-[#e05621] text-white flex items-center justify-center text-[0.75rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]"
                                            aria-label={`Restart/Review last module of ${course.title}`}
                                        >
                                            ↻
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="w-[1.5rem] h-[1.5rem] rounded-full bg-[#ff6b35] hover:bg-[#e05621] text-white flex items-center justify-center text-[0.75rem] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35]"
                                            aria-label={`Proceed with recommended next step in ${course.title}`}
                                        >
                                            →
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section >

            {/* Recommended courses*/}
            <section aria-labelledby="recommended-courses-heading" className="space-y-[1rem]">
                <div className="flex items-center justify-between">
                    <h2 id="recommended-courses-heading" className="text-[1.2rem] font-extrabold text-[#0b1b3d]">
                        Recommended Courses
                    </h2>
                    <div className="flex items-center gap-[0.4rem]">
                        <button
                            type="button"
                            onClick={handlePrevCarousel}
                            disabled={carouselIndex === 0}
                            className={`w-[2rem] h-[2rem] rounded-full border border-gray-200 bg-white flex items-center justify-center font-bold text-[0.8rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35] ${carouselIndex === 0
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-[#ff6b35] hover:text-white"
                                }`}
                            aria-label="Previous recommended courses page"
                        >
                            &lt;
                        </button>
                        <button
                            type="button"
                            onClick={handleNextCarousel}
                            disabled={carouselIndex >= recommendedCourses.length - 1}
                            className={`w-[2rem] h-[2rem] rounded-full border border-gray-200 bg-white flex items-center justify-center font-bold text-[0.8rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff6b35] ${carouselIndex >= recommendedCourses.length - 1
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:bg-[#ff6b35] hover:text-white"
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
                        {recommendedCourses.map((course) => {
                            const badgeStyles = {
                                SCIENCE: "bg-blue-100 text-blue-800",
                                DESIGN: "bg-pink-100 text-pink-800",
                                TECH: "bg-purple-100 text-purple-800",
                                ROBOTICS: "bg-emerald-100 text-emerald-800",
                            }[course.category];
                            return (
                                <div
                                    key={course.id}
                                    className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group focus-within:ring-3 focus-within:ring-[#2563eb]"
                                >
                                    <div
                                        className={`w-full h-[6.5rem] bg-gradient-to-br ${course.bgGradient} relative flex items-center justify-center text-white/10 text-[2.5rem] font-bold select-none`}
                                    >
                                        {course.category}
                                    </div>
                                    <div className="p-[1rem] space-y-[0.5rem]">
                                        <span className={`inline-block px-[0.5rem] py-[0.15rem] rounded-md text-[0.62rem] font-extrabold tracking-wider ${badgeStyles}`}>
                                            {course.category}
                                        </span>
                                        <h3 className="text-[0.85rem] font-extrabold text-[#0b1b3d] leading-snug min-h-[2.4rem] group-hover:text-[#ff6b35] transition-colors">
                                            <a
                                                href={`#course-${course.id}`}
                                                className="focus:outline-none"
                                            >
                                                {course.title}
                                            </a>
                                        </h3>
                                        <div className="flex justify-between items-center text-[0.72rem] font-bold pt-[0.4rem] border-t border-gray-50 text-gray-500">
                                            <span className="flex items-center gap-[0.2rem] text-amber-500">
                                                ⭐ {course.rating.toFixed(1)}
                                            </span>
                                            <span>{course.lessonsCount} Lessons</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div >
    )
}