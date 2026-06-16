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




}