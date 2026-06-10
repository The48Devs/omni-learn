"use client";
import React, { useState } from "react";

//student records
interface Student {
    name: string;
    email: string;
    progress: number;
    lastActive: string;
    avgScore: number;
    status: "Excelling" | "On Track" | "At Risk";
    avatarColor: string;
}

export default function TutorAnalyticsPage() {
    const [filterStatus, setFilterStatus] = useState<"All" | "Excelling" | "On Track" | "At Risk">("All");
    const [searchQuery, setSearchQuery] = useState("");

    //Firebase implementation space here

    const initialStudents: Student[] = [
        {
            name: "Green Smith",
            email: "green.smith@email.com",
            progress: 85,
            lastActive: "2 hours ago",
            avgScore: 92,
            status: "Excelling",
            avatarColor: "bg-teal-500",
        },
        {
            name: "Joan Lulia",
            email: "j.lulia@email.com",
            progress: 56,
            lastActive: "4 hours ago",
            avgScore: 92,
            status: "At Risk",
            avatarColor: "bg-rose-500",
        },
        {
            name: "Dana Rewitt",
            email: "dana.r@email.com",
            progress: 92,
            lastActive: "4 hours ago",
            avgScore: 93,
            status: "On Track",
            avatarColor: "bg-amber-500",
        },
        {
            name: "Laria Watto",
            email: "l.watto@email.com",
            progress: 88,
            lastActive: "4 hours ago",
            avgScore: 92,
            status: "On Track",
            avatarColor: "bg-blue-500",
        },
    ];

    //filtering logic
    const filteredStudents = initialStudents.filter((student) => {
        const matchesStatus = filterStatus === "All" || student.status === filterStatus;
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });
    return (
        <div className="space-y-10">

            {/* Header*/}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-extrabold text-[var(--text-main)]">
                        Tutor Analytics
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
                        Detailed student engagement and progress tracking for the current semester.
                        Monitor performance trends and identify students who may need additional support.
                    </p>
                </div>

                {/* Controls for analytics*/}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => alert("Exporting report as PDF/CSV... [Firebase functions integration point]")}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs font-bold text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-all duration-150 outline-none focus-visible:outline-3 focus-visible:outline-yellow-400 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Report
                    </button>

                    <button
                        onClick={() => alert("Opening Bulk Action Panel...")}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ff5a36] hover:bg-[#e04e2d] text-white text-xs font-bold transition-all duration-150 outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Bulk Action
                    </button>
                </div>
            </div>
            {/* Quick stats*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Completion Card */}
                <div className="bg-[var(--bg-primary)] border-t-4 border-blue-400 p-6 rounded-xl border border-[var(--border-color)] shadow-xs flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[11px] font-bold tracking-widest text-[var(--text-muted)]">COMPLETION RATE</span>
                    <div className="w-14 h-14 rounded-full bg-slate-100/80 flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-3xl font-extrabold text-[var(--text-main)]">84.2%</span>
                    <span className="text-xs font-semibold text-emerald-600">↗ +2.4% vs last week</span>
                </div>

                {/* Avg. Time Spent */}
                <div className="bg-[var(--bg-primary)] border-t-4 border-indigo-400 p-6 rounded-xl border border-[var(--border-color)] shadow-xs flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[11px] font-bold tracking-widest text-[var(--text-muted)]">AVG. TIME SPENT</span>
                    <div className="w-14 h-14 rounded-full bg-slate-100/80 flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-3xl font-extrabold text-[var(--text-main)]">4h 12m</span>
                    <span className="text-xs font-semibold text-[var(--text-muted)]">Stable vs last week</span>
                </div>

                {/* Struggling Rate */}
                <div className="bg-[var(--bg-primary)] border-t-4 border-orange-400 p-6 rounded-xl border border-[var(--border-color)] shadow-xs flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[11px] font-bold tracking-widest text-[var(--text-muted)]">STRUGGLING RATE</span>
                    <div className="w-14 h-14 rounded-full bg-slate-100/80 flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <span className="text-3xl font-extrabold text-[var(--text-main)]">12</span>
                    <span className="text-xs font-bold text-rose-500">⚠ +3 vs last week</span>
                </div>

                {/* Avg. Quiz Score */}
                <div className="bg-[var(--bg-primary)] border-t-4 border-teal-500 p-6 rounded-xl border border-[var(--border-color)] shadow-xs flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-[11px] font-bold tracking-widest text-[var(--text-muted)]">AVG. QUIZ SCORE</span>
                    <div className="w-14 h-14 rounded-full bg-slate-100/80 flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4a2 2 0 110 4h-4m0-4h-4a2 2 0 100 4h4" /></svg>
                    </div>
                    <span className="text-3xl font-extrabold text-[var(--text-main)]">78%</span>
                    <span className="text-xs font-semibold text-emerald-600">↗ +1.5% vs last week</span>
                </div>
            </div>
            {/* Engagement Graphs */}
            <div className="space-y-6">
                {/*Sandbox Engagement */}
                <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 shadow-xs relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Daily Sandbox Engagement</h3>
                        <button className="text-[var(--text-muted)] hover:text-[var(--text-main)]">•••</button>
                    </div>

                    {/* svg line mockup */}
                    <div className="w-full h-56 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                            {/* Gridlines */}
                            <line x1="50" y1="20" x2="680" y2="20" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="60" x2="680" y2="60" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="100" x2="680" y2="100" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="140" x2="680" y2="140" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="180" x2="680" y2="180" stroke="rgba(0,0,0,0.1)" />
                            {/*Trend representation */}
                            <path
                                d="M 50 180 Q 150 140 250 80 T 450 120 T 650 40 L 680 40 L 680 180 Z"
                                fill="url(#sandboxGradient)"
                                opacity="0.15"
                            />
                            <path
                                d="M 50 180 Q 150 140 250 80 T 450 120 T 650 40"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                            />

                            {/* Gradients */}
                            <defs>
                                <linearGradient id="sandboxGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="flex justify-between pl-[40px] pr-[15px] pt-4 text-xs font-semibold text-[var(--text-muted)]">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/*Daily Course Engagement */}
                <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] p-6 shadow-xs relative">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[var(--text-main)]">Daily Course Engagement</h3>
                        <button className="text-[var(--text-muted)] hover:text-[var(--text-main)]">•••</button>
                    </div>
                    {/* SVG Bar Chart */}
                    <div className="w-full h-56 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                            <line x1="50" y1="20" x2="680" y2="20" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="60" x2="680" y2="60" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="100" x2="680" y2="100" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="140" x2="680" y2="140" stroke="rgba(0,0,0,0.05)" />
                            <line x1="50" y1="180" x2="680" y2="180" stroke="rgba(0,0,0,0.1)" />
                            <rect x="75" y="60" width="28" height="120" rx="6" fill="#128a9b" />
                            <rect x="175" y="90" width="28" height="90" rx="6" fill="#128a9b" />
                            <rect x="275" y="40" width="28" height="140" rx="6" fill="#128a9b" />
                            <rect x="375" y="110" width="28" height="70" rx="6" fill="#128a9b" />
                            <rect x="475" y="70" width="28" height="110" rx="6" fill="#128a9b" />
                            <rect x="575" y="140" width="28" height="40" rx="6" fill="#128a9b" />
                            <rect x="640" y="50" width="28" height="130" rx="6" fill="#128a9b" />
                        </svg>
                    </div>
                    <div className="flex justify-between pl-[40px] pr-[15px] pt-4 text-xs font-semibold text-[var(--text-muted)]">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>
            </div>

            {/*Student Engagement Tabe*/}
            <section aria-labelledby="student-engagement-heading" className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xs">
                <div className="p-6 border-b border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 id="student-engagement-heading" className="text-xl font-bold text-[var(--text-main)]">
                            Student Engagement
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            Real-time learning metrics and activity status.
                        </p>
                    </div>
                    {/* Filters dropdown & search */}
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-3.5 py-1.5 text-xs rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] outline-none focus:border-[var(--focus-ring-color)]"
                        />

                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Filter by:</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] rounded-lg px-2.5 py-1.5 font-semibold cursor-pointer outline-none focus:border-[var(--focus-ring-color)]"
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
                            <tr className="bg-[var(--bg-secondary)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
                                <th className="py-4 px-6">STUDENT NAME</th>
                                <th className="py-4 px-6">COURSE PROGRESS</th>
                                <th className="py-4 px-6">LAST ACTIVE</th>
                                <th className="py-4 px-6">AVG. SCORE</th>
                                <th className="py-4 px-6">STATUS</th>
                                <th className="py-4 px-6 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-main)]">
                            {filteredStudents.map((student, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/45 transition-colors duration-150">
                                    {/* Student Name */}
                                    <td className="py-4 px-6 flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full ${student.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{student.name}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{student.email}</div>
                                        </div>
                                    </td>


                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3 max-w-[150px]">
                                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
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
                                            <span className="text-xs font-bold text-[var(--text-muted)]">{student.progress}%</span>
                                        </div>
                                    </td>

                                    {/* Last Active */}
                                    <td className="py-4 px-6 text-xs font-medium text-[var(--text-muted)]">
                                        {student.lastActive}
                                    </td>

                                    {/* Avg. Score */}
                                    <td className="py-4 px-6 font-extrabold">
                                        {student.avgScore}%
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border
                      ${student.status === "Excelling"
                                                ? "bg-teal-50 border-teal-200 text-teal-700"
                                                : student.status === "At Risk"
                                                    ? "bg-rose-50 border-rose-200 text-rose-700 font-extrabold"
                                                    : "bg-orange-50 border-orange-200 text-orange-700"
                                            }`}
                                        >
                                            {student.status}
                                        </span>
                                    </td>

                                    <td className="py-4 px-6 text-right">
                                        <button className="text-[var(--text-muted)] hover:text-[var(--text-main)] outline-none focus-visible:outline-3 focus-visible:outline-yellow-400 p-1 rounded">
                                            •••
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-10 text-xs font-semibold text-[var(--text-muted)]">
                            No student records match filters.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)]">
                    <span>Showing {filteredStudents.length} of {initialStudents.length} students</span>
                    <div className="flex items-center gap-1.5">
                        <span className="cursor-pointer">Pagination</span>
                        <button className="p-1 px-2 border border-[var(--border-color)] rounded bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]" disabled>&lt;</button>
                        <span className="px-2 font-bold text-[var(--text-main)]">1</span>
                        <button className="p-1 px-2 border border-[var(--border-color)] rounded bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]" disabled>&gt;</button>
                    </div>
                </div>
            </section>

            {/*Extra Metrics*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-color)] shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-teal-50 rounded-xl">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Avg. Completion</div>
                        <div className="text-2xl font-extrabold text-[var(--text-main)] mt-0.5">76.4%</div>
                    </div>
                    <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12%</span>
                </div>
                {/* Metric 2 */}
                <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-color)] shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl">
                        <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">At Risk Students</div>
                        <div className="text-2xl font-extrabold text-[var(--text-main)] mt-0.5">12</div>
                    </div>
                    <span className="ml-auto text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">3 Alert</span>
                </div>
                {/* Metric 3 */}
                <div className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-color)] shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Active Now</div>
                        <div className="text-2xl font-extrabold text-[var(--text-main)] mt-0.5">148</div>
                    </div>
                </div>
            </div>
        </div>


    )

}