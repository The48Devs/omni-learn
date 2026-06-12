"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { title } from "process";

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

    //selections
    const [selectedModuleId, setSelectedModuleId] = useState<string>("mod-1");
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>("block-2");

    const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
    const activeBlock = activeModule?.blocks.find((b) => b.id === selectedBlockId) || null;

    //handlers
    const handleAddModule = () => {
        const newIndex = modules.length + 1;
        const newMod: Module = {
            id: `mod-${Date.now()}`,
            index: newIndex,
            title: `New Module ${newIndex}`,
            duration: "15 minutes",
            blocks: []
        };
        setModules([...modules, newMod]);
        setSelectedModuleId(newMod.id);
        announce(`Created module ${newIndex}:${newMod.title}`);
    };

    const handleAddBlock = (type: BlockType) => {
        if (!activeModule) return;
        const newBlock: ContentBlock = {
            id: `block-${Date.now()}`,
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
            duration: type === "video" ? "10 mins" : undefined,
            sandboxComponents: type === "sandbox" ? ["Battery"] : undefined,
            quizQuestions: type === "quiz" ? [] : undefined
        };

        setModules(
            modules.map((m) => {
                if (m.id === activeModule.id) {
                    return { ...m, blocks: [...m.blocks, newBlock] };
                }
                return m;
            })
        );
        setSelectedBlockId(newBlock.id);
        announce(`Added a new ${type} block to ${activeModule.title}.`);
    };
    const updateBlockTitle = (newTitle: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => (b.id === selectedBlockId ? { ...b, title: newTitle } : b))
            }))
        );
    };

    const addSandboxComponent = (comp: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.sandboxComponents) {
                        return { ...b, sandboxComponents: { ...b.sandboxComponents, comp } };
                    }
                    return b;
                })
            }))
        );
        announce(`Added component ${comp} to sandbox`);
    };

    const addQuizQuestion = () => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.quizQuestions) {
                        const newQ: quizQuestions = {
                            id: `q-${Date.now()}`,
                            question: "Click to edit question text",
                            options: [
                                { text: "Option A (Correct)", isCorrect: true },
                                { text: "Option B", isCorrect: false }
                            ]
                        };
                        return { ...b, quizQuestions: [...b.quizQuestions, newQ] };
                    }
                    return b;
                })
            }))
        );
        announce("Added new question to quiz block.");
    };

    return (
        <div className="w-full min-h-screen bg-[var(--bg-primary,#F9FAFB)] text-[var(--text-main,#041A3E)] flex flex-col lg:flex-row transition-colors duration-200">
            {/*Too pallete - left */}
            <aside
                className="w-full lg:w-[20%] bg-[var(--bg-secondary,#FFFFFF)] border-b lg:border-b-0 lg:border-r border-[var(--border-color,#E5E7EB)] p-[1.5rem] flex flex-col gap-[1.5rem]"
                aria-label="Studio Toolbox">
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.2rem] font-bold text-[var(--text-main)]"> Blocks Pallette</h2>
                </div>
                {currentView === "course-overview" ? (
                    <div className="flex flex-col gap-[1rem] opacity-60">
                        <p className="text-[0.85rem] text-[var(--text-muted,#6B7280)] leading-relaxed">
                            Select a module from the center canvas and click <strong>"Edit Blocks"</strong> to begin adding content blocks.
                        </p>
                        <div className="p-[1rem] bg-gray-50 border border-dashed rounded-xl flex items-center gap-[0.75rem] text-gray-400">
                            <span>📹</span> <span className="font-semibold text-[0.9rem]">Video Lesson</span>
                        </div>
                        <div className="p-[1rem] bg-gray-50 border border-dashed rounded-xl flex items-center gap-[0.75rem] text-gray-400">
                            <span>🧪</span> <span className="font-semibold text-[0.9rem]">Sandbox Simulation</span>
                        </div>
                        <div className="p-[1rem] bg-gray-50 border border-dashed rounded-xl flex items-center gap-[0.75rem] text-gray-400">
                            <span>❓</span> <span className="font-semibold text-[0.9rem]">Quiz Block</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[1rem]">
                        <p className="text-[0.85rem] text-[var(--text-muted,#6B7280)] leading-relaxed">
                            Select block type to add:
                        </p>
                        <button
                            onClick={() => handleAddBlock("video")}
                            className="w-full p-[1rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-red-400 rounded-xl flex items-center gap-[0.75rem] text-left transition-all hover:-translate-y-[1px] hover:shadow-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                        >
                            <div className="w-[2.2rem] h-[2.2rem] rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold">📹</div>
                            <div>
                                <span className="block font-semibold text-[0.95rem]">Video Lesson</span>
                                <span className="text-[0.75rem] text-[var(--text-muted)]">Upload or embed MP4</span>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAddBlock("sandbox")}
                            className="w-full p-[1rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-blue-400 rounded-xl flex items-center gap-[0.75rem] text-left transition-all hover:-translate-y-[1px] hover:shadow-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                        >
                            <div className="w-[2.2rem] h-[2.2rem] rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">🧪</div>
                            <div>
                                <span className="block font-semibold text-[0.95rem]">Sandbox Lab</span>
                                <span className="text-[0.75rem] text-[var(--text-muted)]">2D workspace workbench</span>
                            </div>
                        </button>
                        <button
                            onClick={() => handleAddBlock("quiz")}
                            className="w-full p-[1rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-emerald-400 rounded-xl flex items-center gap-[0.75rem] text-left transition-all hover:-translate-y-[1px] hover:shadow-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                        >
                            <div className="w-[2.2rem] h-[2.2rem] rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">❓</div>
                            <div>
                                <span className="block font-semibold text-[0.95rem]">Quiz Block</span>
                                <span className="text-[0.75rem] text-[var(--text-muted)]">Configurable questions</span>
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                setCurrentView("course-overview");
                                announce("Switched back to Course Outline overview.");
                            }}
                            className="mt-[2rem] w-full py-[0.75rem] border border-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-white transition-colors duration-150 font-bold rounded-xl text-center text-[0.9rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                        >
                            &larr; Back to Outline
                        </button>
                    </div>
                )}
            </aside>

            {/* Center canvas*/}
            <main className="w-full lg:w-[55%] p-[2rem] overflow-y-auto max-h-screen flex flex-col gap-[2rem]">
                {currentView === "course-overview" ? (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-[2rem] font-bold text-[var(--text-main)]">Create New Course</h1>
                                <p className="text-[1rem] text-[var(--text-muted)] mt-[0.25rem]">Outline the modules below</p>
                            </div>
                            <Link
                                href="/TutorStudio/mycourses"
                                className="px-4 py-2 border border-[var(--border-color)] hover:bg-gray-100 rounded-xl text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                            >
                                Cancel & Exit
                            </Link>
                        </div>
                        <div className="flex flex-col gap-[1.25rem]" role="list" aria-label="Course Modules Stack">
                            {modules.map((mod) => {
                                const isActive = mod.id === selectedModuleId;
                                return (
                                    <div
                                        key={mod.id}
                                        onClick={() => setSelectedModuleId(mod.id)}
                                        className={`bg-[var(--bg-secondary)] p-[1.5rem] rounded-xl shadow-sm border-2 cursor-pointer transition-all flex justify-between items-center group focus-within:outline focus-within:outline-3 focus-within:outline-[var(--focus-ring,#FF6B35)] focus-within:outline-offset-2 ${isActive ? "border-[#FF6B35]" : "border-transparent hover:border-gray-200"
                                            }`}
                                        role="listitem"
                                    >
                                        <div className="space-y-[0.5rem] flex-1">
                                            <div className="flex items-center gap-[0.75rem]">
                                                <span className="text-[0.9rem] font-bold text-[#FF6B35]">Module {mod.index}</span>
                                                <span className="text-[0.75rem] font-semibold bg-[var(--bg-primary)] px-[0.6rem] py-[0.15rem] rounded-full border border-[var(--border-color)]">
                                                    🕒 {mod.duration}
                                                </span>
                                            </div>
                                            <h3 className="ext-[1.2rem] font-bold text-[var(--text-main)]">{mod.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-[0.75rem] opacity-70 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedBlockId(mod.id);
                                                setCurrentView("edit-module");
                                                announce(`Editing content block for module: ${mod.title}`);
                                            }} className="p-[0.5rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:bg-[#FF6B35]/15 rounded-lg text-[var(--text-main)] hover:text-[#FF6B35] font-bold text-[0.85rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-1">
                                                ✏️ Edit Blocks
                                            </button>
                                            <span className="cursor-grab select-none p-1 text-gray-400">::</span>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>

                        <button
                            onClick={handleAddModule}
                            className="w-full py-[2rem] border-2 border-dashed border-gray-300 hover:border-[#FF6B35] rounded-xl flex flex-col justify-center items-center gap-[0.5rem] text-[var(--text-muted)] hover:text-[#FF6B35] transition-all bg-[var(--bg-secondary)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                            aria-label="Add new Module to Course">
                            <span className="text-[1.5rem">+</span>
                            <span className="font-semibold text-[0.95rem]">Drag or Click to Add Module</span>
                        </button>
                    </>
                ) : (
                    <>
                        {/*Content block builder*/}

                    </>)}
            </main>
        </div >
    )
}

