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
                        <div className="flex items-center gap-[1rem]">
                            <button
                                onClick={() => setCurrentView("course-overview")}
                                className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-gray-50 rounded-lg text-[0.85rem] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-1"
                                aria-label="Back to Course Modules overview"
                            >
                                &larr; Overview
                            </button>
                            <div>
                                <h1 className="text-[1.8rem] font-bold text-[var(--text-main)]">Edit Module</h1>
                                <p className="text-[0.95rem] text-[var(--text-muted)]">
                                    Editing Module {activeModule.index}: {activeModule.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-[1.5rem]" role="list" aria-label="Block Builders Canvas">
                            {activeModule.blocks.length === 0 ? (
                                <div className="py-[3rem] bg-[var(--bg-secondary)] border border-dashed rounded-xl flex flex-col items-center justify-center text-[var(--text-muted)] gap-[0.5rem]">
                                    <span className="text-[2rem]">📦</span>
                                    <p className="font-semibold">No content blocks created yet.</p>
                                    <p className="text-[0.8rem]">Use the Left Blocks panel to add elements.</p>
                                </div>
                            ) : (
                                activeModule.blocks.map((block) => {
                                    const isSelected = block.id === selectedBlockId;
                                    return (
                                        <div
                                            key={block.id}
                                            onClick={() => setSelectedBlockId(block.id)}
                                            className={`bg-[var(--bg-secondary)] rounded-xl border-2 p-[1.5rem] relative cursor-pointer transition-all flex flex-col gap-[1rem] focus-within:outline focus-within:outline-3 focus-within:outline-[var(--focus-ring,#FF6B35)] focus-within:outline-offset-2 ${isSelected ? "border-[#FF6B35]" : "border-transparent hover:border-gray-200"
                                                }`}
                                            role="listitem"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-[0.75rem]">
                                                    <span className={`w-[2rem] h-[2rem] rounded-lg flex items-center justify-center font-bold ${block.type === "video" ? "bg-red-100 text-red-600" :
                                                        block.type === "quiz" ? "bg-emerald-100 text-emerald-600" :
                                                            "bg-blue-100 text-blue-600"
                                                        }`}>
                                                        {block.type === "video" ? "📹" : block.type === "quiz" ? "❓" : "🧪"}
                                                    </span>
                                                    <div>
                                                        <span className="text-[0.75rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">{block.type} component</span>
                                                        <h3 className="text-[1.1rem] font-bold text-[var(--text-main)]">{block.title}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                            {block.type === "video" && (
                                                <div className="flex gap-[1rem] bg-gray-50 border border-gray-100 p-[0.75rem] rounded-lg items-center">
                                                    <div className="relative w-[6rem] h-[3.5rem] bg-black rounded flex items-center justify-center text-white text-[0.8rem]">
                                                        ▶️
                                                    </div>
                                                    <div>
                                                        <p className="text-[0.9rem] font-bold text-[var(--text-main)]">Video Lesson Playback</p>
                                                        <p className="text-[0.75rem] text-[var(--text-muted)]">Includes dynamic accessibility caption track syncing.</p>
                                                    </div>
                                                </div>
                                            )}
                                            {block.type === "sandbox" && (
                                                <div className="border border-gray-100 bg-gray-50 p-[1rem] rounded-lg">
                                                    <p className="text-[0.8rem] font-bold text-[var(--text-main)] mb-[0.5rem]">Active Workspace Components:</p>
                                                    <div className="flex flex-wrap gap-[0.5rem]">
                                                        {block.sandboxComponents?.map((comp, idx) => (
                                                            <span key={idx} className="bg-blue-100 border border-blue-200 text-blue-800 text-[0.75rem] font-semibold px-[0.6rem] py-[0.2rem] rounded-md">
                                                                ⚡ {comp}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {block.type === "quiz" && (
                                                <div className="border border-gray-100 bg-gray-50 p-[1.25rem] rounded-lg flex flex-col gap-[1rem]">
                                                    {block.quizQuestions?.map((q, idx) => (
                                                        <div key={q.id} className="space-y-[0.5rem] border-b border-gray-200 pb-[1.25rem] last:border-b-0 last:pb-0">
                                                            <p className="text-[0.9rem] font-bold text-[var(--text-main)]">{idx + 1}. {q.question}</p>
                                                            <div className="grid grid-cols-2 gap-[0.5rem]">
                                                                {q.options.map((opt, oIdx) => (
                                                                    <div
                                                                        key={oIdx}
                                                                        className={`text-[0.8rem] p-[0.4rem] rounded border font-semibold flex justify-between ${opt.isCorrect
                                                                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                                                            : "bg-orange-50 border-orange-200 text-orange-800"
                                                                            }`}
                                                                    >
                                                                        <span>{opt.text}</span>
                                                                        <span>{opt.isCorrect ? "✓" : "✗"}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addQuizQuestion();
                                                        }}
                                                        className="self-center py-[0.4rem] px-[1rem] bg-white border border-[var(--border-color)] hover:bg-[#F3F4F6] text-[var(--text-main)] font-semibold text-[0.8rem] rounded-lg flex items-center gap-[0.4rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                                                    >
                                                        ➕ Add Question Option
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </main>

            {/*Right properties bar*/}
            <aside
                className="w-full lg:w-[25%] bg-[var(--bg-secondary,#FFFFFF)] border-t lg:border-t-0 lg:border-l border-[var(--border-color,#E5E7EB)] flex flex-col"
                aria-label="Configuration Settings Inspector"
            >
                <div className="bg-[#041A3E] text-white p-[1.25rem] flex items-center gap-[0.75rem]">
                    <span>⚙️</span>
                    <h2 className="text-[1.1rem] font-bold">
                        {currentView === "course-overview" ? "Course Settings" : "Block Settings"}
                    </h2>
                </div>
                <div className="p-[1.5rem] flex-1 flex flex-col gap-[1.5rem]">
                    {currentView === "course-overview" ? (
                        <>
                            <div className="space-y-[0.4rem]">
                                <label htmlFor="course-title-inp" className="block text-[0.85rem] font-bold text-[var(--text-muted)]">
                                    Course Title
                                </label>
                                <input
                                    id="course-title-inp"
                                    type="text"
                                    value={courseTitle}
                                    onChange={(e) => setCourseTitle(e.target.value)}
                                    className="w-full p-[0.75rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.95rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                    placeholder="Enter Course title"
                                />
                            </div>
                            <div className="space-y-[0.4rem]">
                                <label htmlFor="course-desc-inp" className="block text-[0.85rem] font-bold text-[var(--text-muted)]">
                                    Description
                                </label>
                                <textarea
                                    id="course-desc-inp"
                                    rows={3}
                                    value={courseDescription}
                                    onChange={(e) => setCourseDescription(e.target.value)}
                                    className="w-full p-[0.75rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.95rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                    placeholder="Enter course description"
                                />
                            </div>
                            <div className="space-y-[0.4rem]">
                                <label htmlFor="course-subj-sel" className="block text-[0.85rem] font-bold text-[var(--text-muted)]">
                                    Subject
                                </label>
                                <select
                                    id="course-subj-sel"
                                    value={courseSubject}
                                    onChange={(e) => setCourseSubject(e.target.value)}
                                    className="w-full p-[0.75rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.95rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                >
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Biology">Biology</option>
                                    <option value="Mathematics">Mathematics</option>
                                </select>
                            </div>
                            <button
                                disabled
                                className="w-full mt-auto py-[0.75rem] bg-gray-100 text-gray-400 font-bold rounded-lg cursor-not-allowed text-center text-[0.95rem]"
                            >
                                View Course Analytics
                            </button>
                        </>
                    ) : (
                        <>
                            {activeBlock ? (
                                <>
                                    <div className="space-y-[0.4rem]">
                                        <label htmlFor="block-title-inp" className="block text-[0.85rem] font-bold text-[var(--text-muted)]">
                                            Block Title
                                        </label>
                                        <input
                                            id="block-title-inp"
                                            type="text"
                                            value={activeBlock.title}
                                            onChange={(e) => updateBlockTitle(e.target.value)}
                                            className="w-full p-[0.75rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.95rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                        />
                                    </div>
                                    {activeBlock.type === "sandbox" && (
                                        <div className="space-y-[0.75rem]">
                                            <span className="block text-[0.85rem] font-bold text-[var(--text-muted)]">Initial Components</span>
                                            <div className="flex flex-col gap-[0.5rem]">
                                                {activeBlock.sandboxComponents?.map((comp, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-[var(--bg-primary)] p-[0.5rem] rounded-lg border border-[var(--border-color)] text-[0.85rem]">
                                                        <span className="font-semibold">🔌 {comp}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-2 gap-[0.5rem] pt-[0.5rem]">
                                                <button
                                                    onClick={() => addSandboxComponent("Battery")}
                                                    className="py-[0.4rem] bg-white border border-[var(--border-color)] hover:bg-gray-50 rounded-lg text-[0.75rem] font-bold text-[var(--text-main)]"
                                                >
                                                    + Battery
                                                </button>
                                                <button
                                                    onClick={() => addSandboxComponent("LED")}
                                                    className="py-[0.4rem] bg-white border border-[var(--border-color)] hover:bg-gray-50 rounded-lg text-[0.75rem] font-bold text-[var(--text-main)]"
                                                >
                                                    + LED
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {activeBlock.type === "quiz" && (
                                        <div className="space-y-[0.75rem]">
                                            <span className="block text-[0.85rem] font-bold text-[var(--text-muted)]">Questions Summary</span>
                                            <p className="text-[0.8rem] text-[var(--text-muted)]">
                                                {activeBlock.quizQuestions?.length || 0} questions configured in this block.
                                            </p>
                                            <button
                                                onClick={addQuizQuestion}
                                                className="w-full py-[0.5rem] bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold rounded-lg text-center text-[0.85rem]"
                                            >
                                                Create New Question
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-[4rem] text-center text-gray-400">
                                    <span className="block text-[2rem]">👈</span>
                                    <p className="mt-[0.5rem] font-semibold">Select a Block</p>
                                    <p className="text-[0.75rem]">Select a block on the center canvas to configure its settings.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </aside>
        </div>

    );
}
