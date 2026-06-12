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
    quizQuestions?: quizQuestions[];
}

interface quizQuestions {
    id: string;
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

    //Modules * content block states
    const [modules, setModules] = useState<Module[]>([
        {
            id: "mod-1",
            index: 1,
            title: "Introduction to Current Electricity",
            duration: "30 minutes",
            blocks: [
                {
                    id: "block-1",
                    type: "video",
                    title: "Video Lesson: Introduction to Electronics",
                    duration: "12 mins"
                },
                {
                    id: "block-2",
                    type: "sandbox",
                    title: "Sandbox: Understanding Current Electricity",
                    sandboxComponents: ["Battery", "LED"]
                },
                {
                    id: "block-3",
                    type: "quiz",
                    title: "Current Electricity Quiz",
                    quizQuestions: [
                        {
                            id: "q-1",
                            question: "Which particle transmits electricity?",
                            options: [
                                { text: "Electrons", isCorrect: true },
                                { text: "Neutrons", isCorrect: false },
                                { text: "Protons", isCorrect: false },
                                { text: "None", isCorrect: false }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: "mod-2",
            index: 2,
            title: "Electrical Conductors & Insulators",
            duration: "45 minutes",
            blocks: []
        }
    ]);

}