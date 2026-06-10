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

}