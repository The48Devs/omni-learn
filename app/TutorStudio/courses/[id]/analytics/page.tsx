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

            {/* Enrolled student table components*/}
            <section aria-labelledby="student-roster-title" className="bg-[var(--bg-primary)] rounded-[1.25rem] border border-[var(--border-color)] overflow-hidden shadow-xs">
                <div className="p-[1.5rem] border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[1rem]">
                    <div>
                        <h3 id="student-roster-title" className="text-[1.25rem] font-bold text-[var(--text-main)]">
                            Student Engagement
                        </h3>
                        <p className="text-[0.75rem] text-[var(--text-muted)] mt-[0.25rem]">
                            Real-time learning metrics and activity status for students enrolled in this course.
                        </p>
                    </div>
                    {/* Search and Filters */}
                    <div className="flex items-center gap-[0.75rem] flex-wrap">
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-[0.875rem] py-[0.375rem] text-[0.75rem] rounded-[0.5rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] outline-none focus:border-[var(--focus-ring-color)] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)]"
                            aria-label="Search students by name or email"
                        />
                        <div className="flex items-center gap-[0.5rem] text-[0.75rem]">
                            <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[0.625rem]">Filter:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] rounded-[0.5rem] px-[0.625rem] py-[0.375rem] font-semibold cursor-pointer outline-none focus:border-[var(--focus-ring-color)] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)]"
                                aria-label="Filter roster by status"
                            >
                                <option value="All">All Students</option>
                                <option value="Excelling">Excelling</option>
                                <option value="On Track">On Track</option>
                                <option value="At Risk">At Risk</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] text-[0.625rem] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
                                <th className="py-[1rem] px-[1.5rem]" scope="col">Student Name</th>
                                <th className="py-[1rem] px-[1.5rem]" scope="col">Course Progress</th>
                                <th className="py-[1rem] px-[1.5rem]" scope="col">Last Active</th>
                                <th className="py-[1rem] px-[1.5rem]" scope="col">Avg. Score</th>
                                <th className="py-[1rem] px-[1.5rem]" scope="col">Status</th>
                                <th className="py-[1rem] px-[1.5rem] text-right" scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-[0.875rem] text-[var(--text-main)]">
                            {filteredStudents.map((student, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/10 transition-colors">
                                    {/* Name and avatar info*/}
                                    <td className="py-[1rem] px-[1.5rem] flex items-center gap-[0.75rem]">
                                        <div
                                            className={`w-[2rem] h-[2rem] rounded-full ${student.avatarColor} flex items-center justify-center font-bold text-[0.75rem] shadow-xs`}
                                            aria-hidden="true"
                                        >
                                            {student.initials}
                                        </div>
                                        <div>
                                            <span className="font-semibold block">{student.name}</span>
                                            <span className="text-[0.75rem] text-[var(--text-muted)] block">{student.email}</span>
                                        </div>
                                    </td>
                                    {/* Progressive Bar */}
                                    <td className="py-[1rem] px-[1.5rem]">
                                        <div className="flex items-center gap-[0.75rem] max-w-[9.375rem]">
                                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-[0.5rem] overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full rounded-full ${student.status === "Excelling"
                                                        ? "bg-teal-500"
                                                        : student.status === "At Risk"
                                                            ? "bg-rose-500"
                                                            : "bg-orange-500"
                                                        }`}
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-[0.75rem] font-bold text-[var(--text-muted)]">
                                                {student.progress}%
                                            </span>
                                        </div>
                                    </td>
                                    {/* Last Active Timestamp */}
                                    <td className="py-[1rem] px-[1.5rem] text-[0.75rem] font-medium text-[var(--text-muted)]">
                                        {student.lastActive}
                                    </td>
                                    {/* Avg Score */}
                                    <td className="py-[1rem] px-[1.5rem] font-extrabold">
                                        {student.avgScore}%
                                    </td>
                                    {/* Status Pills */}
                                    <td className="py-[1rem] px-[1.5rem]">
                                        <span
                                            className={`px-[0.75rem] py-[0.25rem] rounded-full text-[0.75rem] font-bold tracking-wide border ${student.status === "Excelling"
                                                ? "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400"
                                                : student.status === "At Risk"
                                                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
                                                    : "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400"
                                                }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>
                                    {/* Actions ellipses */}
                                    <td className="py-[1rem] px-[1.5rem] text-right">
                                        <button
                                            onClick={() => alert(`Context actions for ${student.name}`)}
                                            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-[0.25rem] rounded-[0.25rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color)] cursor-pointer"
                                            aria-label={`More actions for ${student.name}`}
                                        >
                                            •••
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-[2.5rem] text-[0.75rem] font-semibold text-[var(--text-muted)]">
                            No students match the criteria.
                        </div>
                    )}
                </div>
                {/* Footer Summary of Table */}
                <div className="p-[1rem] border-t border-[var(--border-color)] flex flex-wrap gap-[1rem] items-center justify-between text-[0.75rem] font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)]">
                    <span>
                        Showing {filteredStudents.length} of {courseData.students.length} students
                    </span>
                    <div className="flex gap-[1.5rem] items-center flex-wrap">
                        <div className="flex items-center gap-[0.5rem]">
                            <span className="text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wider">Avg. Completion:</span>
                            <span className="font-extrabold text-[var(--text-main)]">76.4%</span>
                            <span className="text-[0.625rem] px-[0.375rem] py-[0.125rem] rounded-[0.25rem] bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold">
                                +12%
                            </span>
                        </div>
                        <div className="flex items-center gap-[0.5rem]">
                            <span className="text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wider">At Risk:</span>
                            <span className="font-extrabold text-[var(--text-main)]">{courseData.strugglingRate}</span>
                            <span className="text-[0.625rem] px-[0.375rem] py-[0.125rem] rounded-[0.25rem] bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold">
                                3 Alert
                            </span>
                        </div>
                        <div className="flex items-center gap-[0.5rem]">
                            <span className="text-[0.6875rem] text-[var(--text-muted)] uppercase tracking-wider">Active Now:</span>
                            <span className="font-extrabold text-[var(--text-main)]">148</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>


    )

}

