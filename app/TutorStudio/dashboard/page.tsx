"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/components/AuthCOntext";
import { title } from "process";

export default function TutorDashboard() {
    const { user } = useAuth();
    const userName = user ? user.split("@")[0].toUpperCase() : "DANIEL";

    // published courses section
    const courses = [
        {
            id: "physics-1",
            title: "Advanced Quantum Mechanics",
            tag: "Physics",
            bgClass: "from-blue-800 to-sky-600",
            buttonColor: "bg-orange-700 hover:bg-orange-800",
        },
        {
            id: "biology-1",
            title: "Cellular Biology: Structure & Function",
            tag: "Biology",
            bgClass: "from-teal-600 to-cyan-500",
            buttonColor: "bg-orange-700 /80 hover:bg-orange-800",
        },
        {
            id: "history-1",
            title: "European History: The Renaissance",
            tag: "History",
            bgClass: "ffrom-[#0d5c75] to-[#128a9b]",
            buttonColor: "bg-orange-800 hover:bg-orange-900",
        },
    ];


}