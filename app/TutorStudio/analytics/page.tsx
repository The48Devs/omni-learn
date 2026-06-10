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

}