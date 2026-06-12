"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAccessibility } from "@/app/components/AccessibilityContext";

//interace types
interface Module {
    id: string;
    index: number;
    title: string;
    duration: string;
    blocks: ContentBlock[];
}

type BlockType = "video" | "sandbox" | "quiz";

interface ContentBlock {
    id: string;
    type: BlockType;
    title: string;
    duration?: string;
    sandboxComponents?: string[];
    quizQuesntions?: QuizQuestions[];
}

interface QuizQuestions {
    d: string;
    question: string;
    options: { text: string; isCorrect: boolean }[];
}

export default function CourseCreatorStudio() {
    const { announce } = useAccessibility();


    //switching functionality between the two view modes
    const [currentView, setCurrentView] = useState<"course-overview" | "edit-module">("course-overview");

    //course metadata
    const [courseTitle, setCourseTitle] = useState("Introduction to Current Electricity");
    const [courseDescription, setCourseDescription] = useState("Learn the fundamentals of electrical currents, conductors, insulators, and circuit design.");
    const [courseSubject, setCourseSubject] = useState("Physics");

}