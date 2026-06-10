"use client";
import React, { useState } from "react";
import Link from "next/link";
export default function MyCoursesPage() {
    const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
    const coursesList = [
        {
            id: "biology-1",
            title: "Cellular Biology: Structure & Function",
            description: "Explore the microscopic world of cells and their intricate mechanisms.",
            tag: "Science",
            status: "published",
            bgClass: "from-[#4ca5bf] to-[#128a9b]",
            icon: (
                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
        },
        {
            id: "history-1",
            title: "European History: The Renaissance",
            description: "A deep dive into the cultural rebirth of Europe.",
            tag: "History",
            status: "published",
            bgClass: "from-[#b47a61] to-[#cf987f]",
            icon: (
                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            ),
        },
        {
            id: "tech-1",
            title: "Introduction to Machine Learning",
            description: "Fundamentals of algorithms that learn from data.",
            tag: "Technology",
            status: "draft",
            bgClass: "from-[#5b7887] to-[#7f9ba9]",
            icon: (
                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    const filteredCourses = coursesList.filter((course) => {
        if (activeTab == "all") return true;
        return course.status == activeTab;
    });
}