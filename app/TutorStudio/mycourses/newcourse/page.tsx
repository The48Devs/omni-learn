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