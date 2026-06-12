"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccessibility } from "@/app/components/AccessibilityContext";

// --- INTERFACE TYPES ---
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
    // Video Block Specific
    videoUrl?: string;
    videoTranscript?: string;
    // Sandbox Block Specific
    sandboxComponents?: string[];
    savedSimulationSetup?: {
        connections: { from: string; to: string }[];
        targetStates: { [key: string]: string };
    };
    // Quiz Block Specific
    quizQuestions?: QuizQuestions[];
}

interface QuizQuestions {
    id: string;
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
}

export default function CourseCreatorStudio() {
    const { announce } = useAccessibility();

    // Switching functionality between the two view modes
    const [currentView, setCurrentView] = useState<"course-overview" | "edit-module">("course-overview");

    // Course metadata
    const [courseTitle, setCourseTitle] = useState("Introduction to Current Electricity");
    const [courseDescription, setCourseDescription] = useState("Learn the fundamentals of electrical currents, conductors, insulators, and circuit design.");
    const [courseSubject, setCourseSubject] = useState("Physics");

    // Drag-and-drop state trackers
    const [draggedModuleIdx, setDraggedModuleIdx] = useState<number | null>(null);
    const [draggedBlockIdx, setDraggedBlockIdx] = useState<number | null>(null);

    // Modules & Content block states
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
                    duration: "12 mins",
                    videoUrl: "https://example.com/electricity-intro.mp4",
                    videoTranscript: "Welcome to electrical engineering! Today we cover standard circuit diagrams..."
                },
                {
                    id: "block-2",
                    type: "sandbox",
                    title: "Sandbox: Understanding Current Electricity",
                    sandboxComponents: ["Battery", "LED", "Switch"],
                    savedSimulationSetup: {
                        connections: [
                            { from: "Battery", to: "Switch" },
                            { from: "Switch", to: "LED" }
                        ],
                        targetStates: { "Switch": "Closed", "LED": "Lit" }
                    }
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
                                { id: "opt-1", text: "Electrons", isCorrect: true },
                                { id: "opt-2", text: "Neutrons", isCorrect: false },
                                { id: "opt-3", text: "Protons", isCorrect: false },
                                { id: "opt-4", text: "Photons", isCorrect: false }
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

    // Selections
    const [selectedModuleId, setSelectedModuleId] = useState<string>("mod-1");
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>("block-2");

    const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
    const activeBlock = activeModule?.blocks.find((b) => b.id === selectedBlockId) || null;

    // Available options for the Sandbox Component dropdown
    const availableSandboxComponents = ["Battery", "LED", "Switch", "Resistor", "Wire", "Ammeter"];

    // module handlers
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
        announce(`Created module ${newIndex}: ${newMod.title}`);
    };

    const handleDeleteModule = (modId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = modules
            .filter((m) => m.id !== modId)
            .map((m, idx) => ({ ...m, index: idx + 1 }));
        setModules(updated);
        if (selectedModuleId === modId && updated.length > 0) {
            setSelectedModuleId(updated[0].id);
        }
        announce("Module deleted successfully.");
    };

    // content block handlerss
    const handleAddBlock = (type: BlockType) => {
        if (!activeModule) return;
        const newBlock: ContentBlock = {
            id: `block-${Date.now()}`,
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
            duration: type === "video" ? "10 mins" : undefined,
            videoUrl: type === "video" ? "" : undefined,
            videoTranscript: type === "video" ? "" : undefined,
            sandboxComponents: type === "sandbox" ? ["Battery", "LED"] : undefined,
            savedSimulationSetup: type === "sandbox" ? { connections: [], targetStates: {} } : undefined,
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

    const handleDeleteBlock = (blockId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setModules(
            modules.map((m) => {
                if (m.id === activeModule.id) {
                    return { ...m, blocks: m.blocks.filter((b) => b.id !== blockId) };
                }
                return m;
            })
        );
        if (selectedBlockId === blockId) {
            setSelectedBlockId(null);
        }
        announce("Content block deleted.");
    };

    const updateBlockTitle = (newTitle: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => (b.id === selectedBlockId ? { ...b, title: newTitle } : b))
            }))
        );
    };

    // video block config
    const updateVideoSettings = (field: "videoUrl" | "videoTranscript", value: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => (b.id === selectedBlockId ? { ...b, [field]: value } : b))
            }))
        );
    };

    // sandbox config
    const addSandboxComponent = (comp: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.sandboxComponents) {
                        // prevent duplicates
                        return { ...b, sandboxComponents: [...b.sandboxComponents, comp] };
                    }
                    return b;
                })
            }))
        );
        announce(`Added component ${comp} to sandbox`);
    };

    const deleteSandboxComponent = (compIdx: number) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.sandboxComponents) {
                        return {
                            ...b,
                            sandboxComponents: b.sandboxComponents.filter((_, idx) => idx !== compIdx)
                        };
                    }
                    return b;
                })
            }))
        );
        announce("Component removed from sandbox configuration.");
    };

    const saveSimulationState = (connections: { from: string; to: string }[], states: { [key: string]: string }) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId) {
                        return {
                            ...b,
                            savedSimulationSetup: { connections, targetStates: states }
                        };
                    }
                    return b;
                })
            }))
        );
        announce("Simulation validation layout saved successfully.");
    };

    // quiz ques config
    const addQuizQuestion = () => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.quizQuestions) {
                        const newQ: QuizQuestions = {
                            id: `q-${Date.now()}`,
                            question: "Click to edit question text",
                            options: [
                                { id: `opt-${Date.now()}-1`, text: "Choice A", isCorrect: true },
                                { id: `opt-${Date.now()}-2`, text: "Choice B", isCorrect: false },
                                { id: `opt-${Date.now()}-3`, text: "Choice C", isCorrect: false },
                                { id: `opt-${Date.now()}-4`, text: "Choice D", isCorrect: false }
                            ]
                        };
                        return { ...b, quizQuestions: [...b.quizQuestions, newQ] };
                    }
                    return b;
                })
            }))
        );
        announce("Added new question to quiz block with four options.");
    };

    const toggleQuizOptionCorrect = (questionId: string, optionId: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.quizQuestions) {
                        return {
                            ...b,
                            quizQuestions: b.quizQuestions.map((q) => {
                                if (q.id === questionId) {
                                    return {
                                        ...q,
                                        options: q.options.map((opt) => ({
                                            ...opt,
                                            isCorrect: opt.id === optionId
                                        }))
                                    };
                                }
                                return q;
                            })
                        };
                    }
                    return b;
                })
            }))
        );
        announce("Correct answer selection updated.");
    };

    const updateQuizText = (questionId: string, text: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.quizQuestions) {
                        return {
                            ...b,
                            quizQuestions: b.quizQuestions.map((q) => (q.id === questionId ? { ...q, question: text } : q))
                        };
                    }
                    return b;
                })
            }))
        );
    };

    const updateQuizOptionText = (questionId: string, optionId: string, text: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.quizQuestions) {
                        return {
                            ...b,
                            quizQuestions: b.quizQuestions.map((q) => {
                                if (q.id === questionId) {
                                    return {
                                        ...q,
                                        options: q.options.map((opt) => (opt.id === optionId ? { ...opt, text } : opt))
                                    };
                                }
                                return q;
                            })
                        };
                    }
                    return b;
                })
            }))
        );
    };

    // drag & drop / swapping logics
    const handleModuleDragStart = (idx: number) => {
        setDraggedModuleIdx(idx);
    };

    const handleModuleDrop = (targetIdx: number) => {
        if (draggedModuleIdx === null) return;
        const reordered = [...modules];
        const [draggedItem] = reordered.splice(draggedModuleIdx, 1);
        reordered.splice(targetIdx, 0, draggedItem);

        // order recalculation
        const adjusted = reordered.map((mod, idx) => ({ ...mod, index: idx + 1 }));
        setModules(adjusted);
        setDraggedModuleIdx(null);
        announce(`Module moved to outline position ${targetIdx + 1}`);
    };

    const handleBlockDragStart = (idx: number) => {
        setDraggedBlockIdx(idx);
    };

    const handleBlockDrop = (targetIdx: number) => {
        if (draggedBlockIdx === null) return;
        const updatedBlocks = [...activeModule.blocks];
        const [draggedItem] = updatedBlocks.splice(draggedBlockIdx, 1);
        updatedBlocks.splice(targetIdx, 0, draggedItem);

        setModules(
            modules.map((m) => (m.id === activeModule.id ? { ...m, blocks: updatedBlocks } : m))
        );
        setDraggedBlockIdx(null);
        announce(`Block rearranged to canvas position ${targetIdx + 1}`);
    };

    return (
        <div className="w-full min-h-screen bg-[var(--bg-primary,#F9FAFB)] text-[var(--text-main,#041A3E)] flex flex-col lg:flex-row transition-colors duration-200">

            {/* left bar */}
            <aside
                className="w-full lg:w-[20%] bg-[var(--bg-secondary,#FFFFFF)] border-b lg:border-b-0 lg:border-r border-[var(--border-color,#E5E7EB)] p-[1.5rem] flex flex-col gap-[1.5rem]"
                aria-label="Studio Toolbox"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.2rem] font-bold text-[var(--text-main)]">Blocks Palette</h2>
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

            {/* center canvas */}
            <main className="w-full lg:w-[55%] p-[2rem] overflow-y-auto max-h-screen flex flex-col gap-[2rem]">
                {currentView === "course-overview" ? (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-[2rem] font-bold text-[var(--text-main)]">Create New Course</h1>
                                <p className="text-[1rem] text-[var(--text-muted)] mt-[0.25rem]">Outline the modules below (Drag handles to reorder)</p>
                            </div>
                            <Link
                                href="/TutorStudio/mycourses"
                                className="px-4 py-2 border border-[var(--border-color)] hover:bg-gray-100 rounded-xl text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                            >
                                Cancel & Exit
                            </Link>
                        </div>

                        <div className="flex flex-col gap-[1.25rem]" role="list" aria-label="Course Modules Stack">
                            {modules.map((mod, idx) => {
                                const isActive = mod.id === selectedModuleId;
                                return (
                                    <div
                                        key={mod.id}
                                        onClick={() => setSelectedModuleId(mod.id)}
                                        draggable
                                        onDragStart={() => handleModuleDragStart(idx)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={() => handleModuleDrop(idx)}
                                        className={`bg-[var(--bg-secondary)] p-[1.5rem] rounded-xl shadow-sm border-2 cursor-grab active:cursor-grabbing transition-all flex justify-between items-center group focus-within:outline focus-within:outline-3 focus-within:outline-[var(--focus-ring,#FF6B35)] focus-within:outline-offset-2 ${isActive ? "border-[#FF6B35]" : "border-transparent hover:border-gray-200"
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
                                            <h3 className="text-[1.2rem] font-bold text-[var(--text-main)]">{mod.title}</h3>
                                        </div>

                                        <div className="flex items-center gap-[0.75rem] opacity-70 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedModuleId(mod.id);
                                                    setCurrentView("edit-module");
                                                    announce(`Editing content blocks for module: ${mod.title}`);
                                                }}
                                                className="p-[0.5rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:bg-[#FF6B35]/15 rounded-lg text-[var(--text-main)] hover:text-[#FF6B35] font-bold text-[0.85rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-1"
                                            >
                                                ✏️ Edit Blocks
                                            </button>

                                            <button
                                                onClick={(e) => handleDeleteModule(mod.id, e)}
                                                className="p-[0.5rem] bg-red-50 hover:bg-red-100 rounded-lg text-red-600 font-bold text-[0.85rem] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-1"
                                                aria-label={`Delete Module ${mod.title}`}
                                            >
                                                🗑️ Delete
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
                            aria-label="Add new Module to Course"
                        >
                            <span className="text-[1.5rem]">+</span>
                            <span className="font-semibold text-[0.95rem]">Drag or Click to Add Module</span>
                        </button>
                    </>
                ) : (
                    <>
                        {/* content block builder*/}
                        <div className="flex justify-between items-center">
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
                                        Editing Module {activeModule.index}: {activeModule.title} (Drag cards to reorder)
                                    </p>
                                </div>
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
                                activeModule.blocks.map((block, idx) => {
                                    const isSelected = block.id === selectedBlockId;
                                    return (
                                        <div
                                            key={block.id}
                                            onClick={() => setSelectedBlockId(block.id)}
                                            draggable
                                            onDragStart={() => handleBlockDragStart(idx)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleBlockDrop(idx)}
                                            className={`bg-[var(--bg-secondary)] rounded-xl border-2 p-[1.5rem] relative cursor-grab active:cursor-grabbing transition-all flex flex-col gap-[1rem] focus-within:outline focus-within:outline-3 focus-within:outline-[var(--focus-ring,#FF6B35)] focus-within:outline-offset-2 ${isSelected ? "border-[#FF6B35]" : "border-transparent hover:border-gray-200"
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

                                                <div className="flex items-center gap-[0.5rem]">
                                                    <button
                                                        onClick={(e) => handleDeleteBlock(block.id, e)}
                                                        className="p-[0.4rem] bg-red-50 hover:bg-red-100 rounded-lg text-red-600 font-bold text-[0.8rem] transition-colors"
                                                        aria-label={`Delete block ${block.title}`}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {block.type === "video" && (
                                                <div className="flex flex-col gap-[0.75rem] bg-gray-50 border border-gray-100 p-[1rem] rounded-lg">
                                                    <div className="flex gap-[1rem] items-center">
                                                        <div className="relative w-[6rem] h-[3.5rem] bg-black rounded flex items-center justify-center text-white text-[0.8rem]">
                                                            ▶️
                                                        </div>
                                                        <div>
                                                            <p className="text-[0.9rem] font-bold text-[var(--text-main)]">Video Player Block</p>
                                                            {block.videoUrl ? (
                                                                <p className="text-[0.75rem] text-emerald-600 font-semibold truncate max-w-[20rem]">📹 Linked: {block.videoUrl}</p>
                                                            ) : (
                                                                <p className="text-[0.75rem] text-amber-600 font-medium">⚠️ No video file/URL linked yet.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {block.videoTranscript && (
                                                        <div className="border-t border-gray-200 pt-[0.5rem] mt-[0.25rem]">
                                                            <span className="block text-[0.75rem] font-bold text-[var(--text-muted)]">Active Lesson Transcript Snippet:</span>
                                                            <p className="text-[0.75rem] text-[var(--text-main)] italic line-clamp-2 mt-[0.15rem]">
                                                                "{block.videoTranscript}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {block.type === "sandbox" && (
                                                <div className="border border-gray-100 bg-gray-50 p-[1rem] rounded-lg">
                                                    <p className="text-[0.8rem] font-bold text-[var(--text-main)] mb-[0.5rem]">Assigned Workspace Components:</p>
                                                    <div className="flex flex-wrap gap-[0.5rem] mb-[0.5rem]">
                                                        {block.sandboxComponents && block.sandboxComponents.length > 0 ? (
                                                            block.sandboxComponents.map((comp, idx) => (
                                                                <span key={idx} className="bg-blue-100 border border-blue-200 text-blue-800 text-[0.75rem] font-semibold px-[0.6rem] py-[0.2rem] rounded-md flex items-center gap-[0.4rem]">
                                                                    ⚡ {comp}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[0.75rem] text-amber-600">No components assigned yet. Add one in Block Settings.</span>
                                                        )}
                                                    </div>
                                                    {block.savedSimulationSetup && Object.keys(block.savedSimulationSetup.targetStates).length > 0 && (
                                                        <div className="border-t border-gray-200 pt-[0.5rem] mt-[0.5rem]">
                                                            <p className="text-[0.75rem] text-emerald-700 font-semibold">✓ Correct Simulation Validation Setup Saved</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {block.type === "quiz" && (
                                                <div className="border border-gray-100 bg-gray-50 p-[1.25rem] rounded-lg flex flex-col gap-[1rem]">
                                                    {block.quizQuestions?.map((q, idx) => (
                                                        <div key={q.id} className="space-y-[0.75rem] border-b border-gray-200 pb-[1.25rem] last:border-b-0 last:pb-0">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-[0.9rem] font-bold text-[var(--text-main)]">
                                                                    {idx + 1}. <input
                                                                        type="text"
                                                                        value={q.question}
                                                                        onChange={(e) => updateQuizText(q.id, e.target.value)}
                                                                        className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#FF6B35] focus:outline-none font-bold"
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[0.75rem]">
                                                                {q.options.map((opt) => (
                                                                    <div
                                                                        key={opt.id}
                                                                        className={`text-[0.8rem] p-[0.75rem] rounded-xl border flex flex-col gap-[0.4rem] transition-all ${opt.isCorrect
                                                                                ? "bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20"
                                                                                : "bg-white border-gray-200 hover:border-gray-300"
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center justify-between">
                                                                            <input
                                                                                type="text"
                                                                                value={opt.text}
                                                                                onChange={(e) => updateQuizOptionText(q.id, opt.id, e.target.value)}
                                                                                className="bg-transparent border-b border-dashed border-gray-200 focus:border-[#FF6B35] focus:outline-none text-[0.8rem] font-medium w-[75%]"
                                                                            />
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    toggleQuizOptionCorrect(q.id, opt.id);
                                                                                }}
                                                                                className={`px-[0.5rem] py-[0.15rem] rounded text-[0.7rem] font-bold transition-all ${opt.isCorrect
                                                                                        ? "bg-emerald-600 text-white"
                                                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                                                    }`}
                                                                            >
                                                                                {opt.isCorrect ? "Correct ✓" : "Mark Correct"}
                                                                            </button>
                                                                        </div>
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
                                                        className="self-center py-[0.5rem] px-[1.25rem] bg-white border border-[var(--border-color)] hover:bg-[#F3F4F6] text-[var(--text-main)] font-semibold text-[0.85rem] rounded-xl flex items-center gap-[0.4rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                                                    >
                                                        ➕ Add Question (4 Choices)
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

            {/* properties inspector */}
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

                <div className="p-[1.5rem] flex-1 flex flex-col gap-[1.5rem] overflow-y-auto max-h-[85vh]">
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
                                <div className="space-y-[1.5rem]">
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

                                    {/* video block config */}
                                    {activeBlock.type === "video" && (
                                        <div className="space-y-[1rem] border-t border-gray-100 pt-[1rem]">
                                            <h3 className="text-[0.9rem] font-bold text-[var(--text-main)]">Video Settings</h3>

                                            <div className="space-y-[0.4rem]">
                                                <label htmlFor="video-url-inp" className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">
                                                    Upload / Video File URL
                                                </label>
                                                <input
                                                    id="video-url-inp"
                                                    type="text"
                                                    value={activeBlock.videoUrl || ""}
                                                    onChange={(e) => updateVideoSettings("videoUrl", e.target.value)}
                                                    className="w-full p-[0.6rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                                    placeholder="e.g. /videos/lesson1.mp4"
                                                />
                                            </div>

                                            <div className="space-y-[0.4rem]">
                                                <label htmlFor="video-transcript-inp" className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">
                                                    Lesson Transcript
                                                </label>
                                                <textarea
                                                    id="video-transcript-inp"
                                                    rows={4}
                                                    value={activeBlock.videoTranscript || ""}
                                                    onChange={(e) => updateVideoSettings("videoTranscript", e.target.value)}
                                                    className="w-full p-[0.6rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                                    placeholder="Type or paste video subtitles/transcript for WCAG compliance..."
                                                />
                                            </div>

                                            <div className="p-[0.75rem] bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[0.75rem]">
                                                <strong>WCAG AA/AAA Rule:</strong> Providing a synchronized transcript is necessary for hard-of-hearing learners to follow interactive media lessons.
                                            </div>
                                        </div>
                                    )}

                                    {/* sandbx block config */}
                                    {activeBlock.type === "sandbox" && (
                                        <div className="space-y-[1.25rem] border-t border-gray-100 pt-[1rem]">
                                            <h3 className="text-[0.9rem] font-bold text-[var(--text-main)]">Sandbox Settings</h3>

                                            <div className="space-y-[0.5rem]">
                                                <label htmlFor="comp-select" className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">
                                                    Add Component to Workspace:
                                                </label>
                                                <select
                                                    id="comp-select"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            addSandboxComponent(e.target.value);
                                                            e.target.value = ""; // reset
                                                        }
                                                    }}
                                                    className="w-full p-[0.6rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                                >
                                                    <option value="">-- Choose Component --</option>
                                                    {availableSandboxComponents.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-[0.4rem]">
                                                <span className="block text-[0.8rem] font-bold text-[var(--text-muted)]">Current Sandbox Layout</span>
                                                <ul className="space-y-[0.4rem]">
                                                    {activeBlock.sandboxComponents?.map((comp, idx) => (
                                                        <li key={idx} className="flex justify-between items-center bg-[var(--bg-primary)] p-[0.4rem] px-[0.75rem] rounded-lg border border-[var(--border-color)] text-[0.8rem]">
                                                            <span className="font-semibold text-[var(--text-main)]">⚡ {comp}</span>
                                                            <button
                                                                onClick={() => deleteSandboxComponent(idx)}
                                                                className="text-red-500 hover:text-red-700 font-bold"
                                                                aria-label={`Remove ${comp}`}
                                                            >
                                                                ✕ Remove
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* simulation validations etup */}
                                            <div className="border-t border-gray-200 pt-[1rem] mt-[1rem] space-y-[0.75rem]">
                                                <h4 className="text-[0.85rem] font-bold text-[var(--text-main)]">Simulation Correct Setup Validator</h4>
                                                <p className="text-[0.75rem] text-[var(--text-muted)]">
                                                    Tutors: Simulate the target correct setup here. Students must match this exact state pattern to complete the lab.
                                                </p>

                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-[0.75rem] space-y-[0.5rem]">
                                                    <span className="block text-[0.75rem] font-bold text-gray-500 uppercase tracking-wider">Device Connection Validation</span>
                                                    <div className="space-y-[0.25rem] text-[0.75rem]">
                                                        <div className="flex justify-between items-center text-gray-600">
                                                            <span>Battery Connects To:</span>
                                                            <select
                                                                className="bg-white border text-[0.7rem] rounded p-[0.1rem]"
                                                                onChange={(e) => {
                                                                    if (e.target.value) {
                                                                        saveSimulationState(
                                                                            [{ from: "Battery", to: e.target.value }],
                                                                            { ...activeBlock.savedSimulationSetup?.targetStates, "Switch": "Closed", "LED": "Lit" }
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <option value="">-- Choose Target Connection --</option>
                                                                {activeBlock.sandboxComponents?.filter(c => c !== "Battery").map(c => (
                                                                    <option key={c} value={c}>{c}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="flex justify-between items-center text-gray-600">
                                                            <span>Switch Setup State:</span>
                                                            <select
                                                                className="bg-white border text-[0.7rem] rounded p-[0.1rem]"
                                                                onChange={(e) => {
                                                                    if (e.target.value) {
                                                                        saveSimulationState(
                                                                            activeBlock.savedSimulationSetup?.connections || [],
                                                                            { ...activeBlock.savedSimulationSetup?.targetStates, "Switch": e.target.value }
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <option value="Closed">Closed (On)</option>
                                                                <option value="Open">Open (Off)</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        saveSimulationState(
                                                            [{ from: "Battery", to: "Switch" }, { from: "Switch", to: "LED" }],
                                                            { "Switch": "Closed", "LED": "Lit" }
                                                        );
                                                        alert("Simulation validation blueprint successfully saved.");
                                                    }}
                                                    className="w-full py-[0.4rem] bg-[#FF6B35] text-white hover:bg-[#e05825] font-bold text-[0.8rem] rounded-lg transition-colors text-center"
                                                >
                                                    Save Correct Simulation Pattern
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeBlock.type === "quiz" && (
                                        <div className="space-y-[0.75rem] border-t border-gray-100 pt-[1rem]">
                                            <span className="block text-[0.85rem] font-bold text-[var(--text-muted)]">Questions Config Summary</span>
                                            <p className="text-[0.8rem] text-[var(--text-muted)]">
                                                {activeBlock.quizQuestions?.length || 0} questions are configured.
                                            </p>
                                            <p className="text-[0.75rem] text-[var(--text-muted)] italic">
                                                Configure correct options and question text directly on the cards on the main builder canvas.
                                            </p>
                                        </div>
                                    )}
                                </div>
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
