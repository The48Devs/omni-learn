"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/components/AuthCOntext";
import RequireAuth from "@/app/components/RequireAuth";
import { useAccessibility } from "@/app/components/AccessibilityContext";

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

        </div >
    )
}