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
        </div>

    )

}

