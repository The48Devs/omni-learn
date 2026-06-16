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
    status: "In-progress" | "completed";
    themeColor: {
        bg: string;
        text: string;
        border: string;
        gradient: string;
    };
}

export default function MyCoursesPage() {
    const { announce } = useAccessibility();
    const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");


}