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



        </div>
        </div >

    )

}