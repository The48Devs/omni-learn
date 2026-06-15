"use client";

import React, { useState, use } from "react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

//student data 
interface Student {
    name: string;
    email: string;
    progress: number;
    lastActive: string;
    avgScore: number;
    status: "Excelling" | "On Track" | "At Risk";
    avatarColor: string;
    initials: string;
}

//course data scope by the ID
const MOCK_COURSES_DATA: Record<
    string,
    {
        title: string;
        completionRate: string;
        completionTrend: string;
        avgTimeSpent: string;
        avgTimeTrend: string;
        strugglingRate: number;
        strugglingTrend: string;
        avgQuizScore: string;
        quizTrend: string;
        students: Student[];
        sandboxData: { day: string; interactions: number }[];
        engagementData: { day: string; activeMinutes: number }[];
    }
> = {
    default: {
        title: "Advanced Quantum Mechanics",
        completionRate: "84.2%",
        completionTrend: "+2.4%",
        avgTimeSpent: "4h 12m",
        avgTimeTrend: "Stable",
        strugglingRate: 12,
        strugglingTrend: "+3",
        avgQuizScore: "78%",
        quizTrend: "+1.5%",
        students: [
            {
                name: "Green Smith",
                email: "green.smith@email.com",
                progress: 85,
                lastActive: "2 hours ago",
                avgScore: 92,
                status: "Excelling",
                avatarColor: "bg-teal-500 text-white",
                initials: "GS",
            },
            {
                name: "Joan Lulia",
                email: "j.lulia@email.com",
                progress: 56,
                lastActive: "4 hours ago",
                avgScore: 68,
                status: "At Risk",
                avatarColor: "bg-rose-500 text-white",
                initials: "JL",
            },
            {
                name: "Dana Rewitt",
                email: "dana.r@email.com",
                progress: 92,
                lastActive: "5 hours ago",
                avgScore: 88,
                status: "On Track",
                avatarColor: "bg-amber-500 text-white",
                initials: "DR",
            },
            {
                name: "Laria Watto",
                email: "l.watto@email.com",
                progress: 88,
                lastActive: "1 day ago",
                avgScore: 84,
                status: "On Track",
                avatarColor: "bg-blue-500 text-white",
                initials: "LW",
            },
        ],
        sandboxData: [
            { day: "Mon", interactions: 45 },
            { day: "Tue", interactions: 72 },
            { day: "Wed", interactions: 110 },
            { day: "Thu", interactions: 95 },
            { day: "Fri", interactions: 130 },
            { day: "Sat", interactions: 60 },
            { day: "Sun", interactions: 88 },
        ],
        engagementData: [
            { day: "Mon", activeMinutes: 120 },
            { day: "Tue", activeMinutes: 90 },
            { day: "Wed", activeMinutes: 140 },
            { day: "Thu", activeMinutes: 70 },
            { day: "Fri", activeMinutes: 110 },
            { day: "Sat", activeMinutes: 40 },
            { day: "Sun", activeMinutes: 130 },
        ],
    },
};

export default function CourseAnalyticsPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const courseId = resolvedParams?.id || "default";

    //resolve course data
    const courseData = MOCK_COURSES_DATA[courseId] || MOCK_COURSES_DATA.default;

    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"All" | "Excelling" | "On Track" | "At Risk">("All");

    const filteredStudents = courseData.students.filter((student) => {
        const matchesSearch =
            student.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
            student.email.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase());
        const matchesFilter = filterStatus === "All" || student.status === filterStatus;
        return matchesSearch && matchesFilter;
    });
    return (
        <div className="space-y-[2.5rem] p-[2rem] bg-[var(--bg-primary)] text-[var(--text-main)] min-h-screen">
            {/* Context Header */}
            <div className="flex flex-col gap-[1rem]">
                <Link
                    href="/TutorStudio/mycourses"
                    className="inline-flex items-center text-[0.875rem] font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-2 rounded-[0.25rem] w-fit"
                    aria-label="Back to My Courses dashboard"
                >
                    ← Back to My Courses
                </Link>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-[1.5rem]">
                    <div className="max-w-[42.5rem]">
                        <h1 className="text-[2rem] font-extrabold tracking-tight text-[#041A3E] dark:text-[var(--text-main)]">
                            Course Analytics: {courseData.title}
                        </h1>
                        <p className="text-[0.875rem] text-[var(--text-muted)] mt-[0.375rem] leading-relaxed">
                            Detailed student engagement, progress tracking, and sandbox performance metrics for this course.
                        </p>
                    </div>
                </div>

            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-[0.75rem]">
                <button
                    onClick={() => alert("Exporting Scoped Course Report...")}
                    className="px-[1.25rem] py-[0.75rem] rounded-[0.75rem] border border-[var(--border-color)] bg-[var(--bg-primary)] text-[0.75rem] font-bold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-2"
                    aria-label="Export analytics report as PDF or CSV"
                >
                    📥 Export Report
                </button>
                <button
                    onClick={() => alert("Opening Bulk Actions Menu...")}
                    className="px-[1.25rem] py-[0.75rem] rounded-[0.75rem] bg-[#FF6B35] hover:bg-[#e0521f] text-white text-[0.75rem] font-bold transition-all cursor-pointer focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)] focus-visible:outline-offset-2"
                    aria-label="Perform bulk action on selected students"
                >
                    + Bulk Action
                </button>
            </div>
            {/*Scoped course performance */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]" aria-label="Course stats summary">
                {/*Competition rate*/}
                <div className="bg-[var(--bg-primary)] border-t-[4px] border-[var(--success-accent)] p-[1.5rem] rounded-[0.75rem] border border-[var(--border-color)] flex flex-col items-center justify-center text-center space-y-[1rem]">
                    <span className="text-[0.6875rem] font-bold tracking-widest text-[var(--text-muted)] uppercase">Completion Rate</span>
                    <div className="w-[3.5rem] h-[3.5rem] rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shadow-inner">
                        <svg className="w-[1.5rem] h-[1.5rem] text-[var(--success-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-[1.875rem] font-extrabold text-[var(--text-main)]">{courseData.completionRate}</span>
                    <span className="text-[0.75rem] font-semibold text-emerald-600 dark:text-emerald-400">↗ {courseData.completionTrend} vs last week</span>
                </div>
            </section>
            {/* Course specifics*/}
            <section className="space-y-[1.5rem]" aria-label="Visual analytics graphs">
                {/* Daily Sandbox Engagement */}
                <div className="bg-[var(--bg-primary)] rounded-[1.25rem] border border-[var(--border-color)] p-[1.5rem] shadow-xs">
                    <div className="flex justify-between items-center mb-[1.5rem]">
                        <div>
                            <h3 className="text-[1.125rem] font-bold text-[var(--text-main)]">Daily Sandbox Engagement</h3>
                            <p className="text-[0.75rem] text-[var(--text-muted)]">Simulator interactions triggered per day</p>
                        </div>
                        <button
                            onClick={() => alert("Sandbox configurations...")}
                            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-[0.25rem] rounded-[0.25rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)]"
                            aria-label="Sandbox engagement actions menu"
                        >
                            •••
                        </button>
                    </div>

                    {/* trend line graphic */}
                    <div className="w-full h-[14rem] flex items-end" aria-hidden="true">
                        <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                            <line x1="50" y1="20" x2="680" y2="20" stroke="var(--border-color)" strokeOpacity="0.4" />
                            <line x1="50" y1="60" x2="680" y2="60" stroke="var(--border-color)" strokeOpacity="0.4" />
                            <line x1="50" y1="100" x2="680" y2="100" stroke="var(--border-color)" strokeOpacity="0.4" />
                            <line x1="50" y1="140" x2="680" y2="140" stroke="var(--border-color)" strokeOpacity="0.4" />
                            <line x1="50" y1="180" x2="680" y2="180" stroke="var(--border-color)" strokeOpacity="0.8" />

                            {/* Spline gradient */}
                            <path
                                d="M 50 180 Q 150 140 250 80 T 450 120 T 650 40 L 680 40 L 680 180 Z"
                                fill="url(#sandboxGradient)"
                                opacity="0.15"
                            />
                            {/* Spline Line */}
                            <path
                                d="M 50 180 Q 150 140 250 80 T 450 120 T 650 40"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="sandboxGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    {/* X-Axis Labels */}
                    <div className="flex justify-between pl-[2.5rem] pr-[1rem] pt-[1rem] text-[0.75rem] font-semibold text-[var(--text-muted)]" aria-hidden="true">
                        {courseData.sandboxData.map((d) => (
                            <span key={d.day}>{d.day}</span>
                        ))}
                    </div>
                    {/* accessbility fall backs table*/}
                    <div className="sr-only">
                        <h4 id="sandbox-fallback-caption">Daily Sandbox Simulator Interaction Counts</h4>
                        <table aria-describedby="sandbox-fallback-caption">
                            <thead>
                                <tr>
                                    <th scope="col">Day</th>
                                    <th scope="col">Interactions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseData.sandboxData.map((d) => (
                                    <tr key={d.day}>
                                        <td>{d.day}</td>
                                        <td>{d.interactions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Daily Course Engagement */}
                    <div className="bg-[var(--bg-primary)] rounded-[1.25rem] border border-[var(--border-color)] p-[1.5rem] shadow-xs">
                        <div className="flex justify-between items-center mb-[1.5rem]">
                            <div>
                                <h3 className="text-[1.125rem] font-bold text-[var(--text-main)]">Daily Course Engagement</h3>
                                <p className="text-[0.75rem] text-[var(--text-muted)]">Active minutes recorded on curriculum pages</p>
                            </div>
                            <button
                                onClick={() => alert("Course analytics configurations...")}
                                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-[0.25rem] rounded-[0.25rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)]"
                                aria-label="Course engagement actions menu"
                            >
                                •••
                            </button>
                        </div>
                        {/* Bar Chart Graphic */}
                        <div className="w-full h-[14rem] flex items-end" aria-hidden="true">
                            <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                                <line x1="50" y1="20" x2="680" y2="20" stroke="var(--border-color)" strokeOpacity="0.4" />
                                <line x1="50" y1="60" x2="680" y2="60" stroke="var(--border-color)" strokeOpacity="0.4" />
                                <line x1="50" y1="100" x2="680" y2="100" stroke="var(--border-color)" strokeOpacity="0.4" />
                                <line x1="50" y1="140" x2="680" y2="140" stroke="var(--border-color)" strokeOpacity="0.4" />
                                <line x1="50" y1="180" x2="680" y2="180" stroke="var(--border-color)" strokeOpacity="0.8" />

                                <rect x="75" y="60" width="28" height="120" rx="6" fill="#128a9b" />
                                <rect x="175" y="90" width="28" height="90" rx="6" fill="#128a9b" />
                                <rect x="275" y="40" width="28" height="140" rx="6" fill="#128a9b" />
                                <rect x="375" y="110" width="28" height="70" rx="6" fill="#128a9b" />
                                <rect x="475" y="70" width="28" height="110" rx="6" fill="#128a9b" />
                                <rect x="575" y="140" width="28" height="40" rx="6" fill="#128a9b" />
                                <rect x="640" y="50" width="28" height="130" rx="6" fill="#128a9b" />
                            </svg>
                        </div>
                        {/*X-Axis Labels */}
                        <div className="flex justify-between pl-[2.5rem] pr-[1rem] pt-[1rem] text-[0.75rem] font-semibold text-[var(--text-muted)]" aria-hidden="true">
                            {courseData.engagementData.map((d) => (
                                <span key={d.day}>{d.day}</span>
                            ))}
                        </div>
                        {/* accessibility fall back table */}
                        <div className="sr-only">
                            <h4 id="engagement-fallback-caption">Daily Active Minutes Records</h4>
                            <table aria-describedby="engagement-fallback-caption">
                                <thead>
                                    <tr>
                                        <th scope="col">Day</th>
                                        <th scope="col">Active Minutes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.engagementData.map((d) => (
                                        <tr key={d.day}>
                                            <td>{d.day}</td>
                                            <td>{d.activeMinutes}m</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>


    )

}

