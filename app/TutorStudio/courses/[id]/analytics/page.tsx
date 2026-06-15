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


}


