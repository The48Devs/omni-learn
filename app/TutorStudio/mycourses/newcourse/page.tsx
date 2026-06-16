"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAccessibility } from "@/app/components/AccessibilityContext";

// interface types
interface StorylineNode {
    id: string;
    speakerName: string;
    speakerAvatarUrl: string;
    dialogueText: string;
    choice: { id: string; text: string }[];
}

interface Module {
    id: string;
    index: number;
    title: string;
    duration: string;
    blocks: ContentBlock[];
}

type BlockType = "video" | "sandbox" | "quiz" | "storyline";

interface ContentBlock {
    id: string;
    type: BlockType;
    title: string;
    durationMinutes: number;
    // Video Block Specific
    videoUrl?: string;
    videoTranscript?: string;
    videoFileName?: string;
    // Sandbox Block Specific
    sandboxComponents?: string[];
    savedSimulationSetup?: {
        connections: { from: string; fromTerminal: string; to: string; toTerminal: string }[];
        targetStates: { [key: string]: string };
        positions?: { [key: string]: { x: number; y: number } };
    };
    // sandbox lab notes & objectives extensions
    labNotes?: string;
    objectives?: string[];
    // Quiz Block Specific
    quizQuestions?: QuizQuestions[];
    // storyline block specific
    storylineTitle?: string;
    storylineIntro?: string;
    storylineNodes?: StorylineNode[];
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

    // File Upload states
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingProgress, setUploadingProgress] = useState<number | null>(null);

    // mini circuit canvas 
    const [selectedSourceNode, setSelectedSourceNode] = useState<{ component: string; terminal: string } | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Canvas Zoom & Camera Pan states
    const [zoomScale, setZoomScale] = useState<number>(1.0);
    const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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
                    durationMinutes: 12,
                    videoUrl: "https://example.com/electricity-intro.mp4",
                    videoTranscript: "Welcome to electrical engineering! Today we cover standard circuit diagrams..."
                },
                {
                    id: "block-2",
                    type: "sandbox",
                    title: "Sandbox: Understanding Current Electricity",
                    durationMinutes: 10,
                    sandboxComponents: ["Battery", "LED", "Switch"],
                    savedSimulationSetup: {
                        connections: [
                            { from: "Battery", fromTerminal: "positive", to: "Switch", toTerminal: "terminal-1" }
                        ],
                        targetStates: { "Switch": "Closed", "LED": "Lit" },
                        positions: {
                            "Battery": { x: 150, y: 150 },
                            "LED": { x: 450, y: 300 },
                            "Switch": { x: 300, y: 150 }
                        }
                    }
                },
                {
                    id: "block-3",
                    type: "quiz",
                    title: "Current Electricity Quiz",
                    durationMinutes: 8,
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

    // Track mouse position on the canvas for dynamic wire rendering
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current || !selectedSourceNode) return;
            const rect = canvasRef.current.getBoundingClientRect();
            // Compensate mousePos calculation for scale & pan values
            setMousePos({
                x: (e.clientX - rect.left - panOffset.x) / zoomScale,
                y: (e.clientY - rect.top - panOffset.y) / zoomScale
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [selectedSourceNode, zoomScale, panOffset]);

    // Track canvas dragging
    useEffect(() => {
        const handleMouseUp = () => {
            setDraggingComponent(null);
            setIsPanning(false);
        };
        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);

    // time allocation calculation
    const calculateModuleDuration = (mod: Module) => {
        const totalMinutes = mod.blocks.reduce((total, block) => total + (block.durationMinutes || 0), 0);
        return totalMinutes > 0 ? `${totalMinutes} minutes` : "Empty";
    };

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

    const handleUpdateModuleTitle = (modId: string, newTitle: string) => {
        setModules(
            modules.map((m) => (m.id === modId ? { ...m, title: newTitle } : m))
        );
    };

    // -content block handlers
    const handleAddBlock = (type: BlockType) => {
        if (!activeModule) return;
        const newBlock: ContentBlock = {
            id: `block-${Date.now()}`,
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
            durationMinutes: 10,
            videoUrl: type === "video" ? "" : undefined,
            videoTranscript: type === "video" ? "" : undefined,
            sandboxComponents: type === "sandbox" ? ["Battery", "LED"] : undefined,
            savedSimulationSetup: type === "sandbox" ? {
                connections: [],
                targetStates: {},
                positions: {
                    "Battery": { x: 150, y: 150 },
                    "LED": { x: 450, y: 300 }
                }
            } : undefined,
            //sandbox extensions
            labnotes: type === "sandbox" ? "" : undefined,
            objectives: type === "sandbox" ? [] : undefined,
            quizQuestions: type === "quiz" ? [] : undefined,

            //storyline block seedss
            storylineTitle: type === "storyline" ? "Untitled Scene" : undefined,
            storylineIntro: type === "storyline" ? "" : undefined,
            storylineNodes: type === "storyline" ? [] : undefined,
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
        announce(`Added a new ${type} block with a 10-minute duration to ${activeModule.title}.`);
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

    const updateBlockDuration = (minutes: number) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => (b.id === selectedBlockId ? { ...b, durationMinutes: minutes } : b))
            }))
        );
    };

    // video block handlers
    const updateVideoSettings = (field: "videoUrl" | "videoTranscript" | "videoFileName", value: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => (b.id === selectedBlockId ? { ...b, [field]: value } : b))
            }))
        );
    };

    // file upload simulations
    const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingProgress(10);
        announce("Uploading video file...");

        // Simulate upload progress
        const timer = setInterval(() => {
            setUploadingProgress((prev) => {
                if (prev === null) return null;
                if (prev >= 100) {
                    clearInterval(timer);
                    updateVideoSettings("videoFileName", file.name);
                    updateVideoSettings("videoUrl", `/uploaded-videos/${file.name}`);
                    announce("Video upload complete.");
                    return null;
                }
                return prev + 30;
            });
        }, 400);
    };

    // -sandbox config
    const addSandboxComponent = (comp: string) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.sandboxComponents) {
                        const currentPositions = b.savedSimulationSetup?.positions || {};
                        // Position components offset within standard canvas bounds
                        const nextX = 150 + (b.sandboxComponents.length * 90) % 400;
                        const nextY = 150 + (b.sandboxComponents.length * 60) % 300;
                        return {
                            ...b,
                            sandboxComponents: [...b.sandboxComponents, comp],
                            savedSimulationSetup: {
                                ...b.savedSimulationSetup,
                                connections: b.savedSimulationSetup?.connections || [],
                                targetStates: b.savedSimulationSetup?.targetStates || {},
                                positions: {
                                    ...currentPositions,
                                    [comp]: { x: nextX, y: nextY }
                                }
                            }
                        };
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
                        const removedCompName = b.sandboxComponents[compIdx];
                        const filteredConnections = b.savedSimulationSetup?.connections.filter(
                            (conn) => conn.from !== removedCompName && conn.to !== removedCompName
                        ) || [];

                        const filteredStates = { ...(b.savedSimulationSetup?.targetStates || {}) };
                        delete filteredStates[removedCompName];

                        const filteredPositions = { ...(b.savedSimulationSetup?.positions || {}) };
                        delete filteredPositions[removedCompName];

                        return {
                            ...b,
                            sandboxComponents: b.sandboxComponents.filter((_, idx) => idx !== compIdx),
                            savedSimulationSetup: {
                                connections: filteredConnections,
                                targetStates: filteredStates,
                                positions: filteredPositions
                            }
                        };
                    }
                    return b;
                })
            }))
        );
        announce("Component removed from sandbox configuration.");
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (!activeBlock || !canvasRef.current) return;

        // Handle dragging/moving of sandbox components
        if (draggingComponent) {
            const rect = canvasRef.current.getBoundingClientRect();
            // Scale and pan adjustments
            const x = Math.max(10, Math.min(1800, (e.clientX - rect.left - panOffset.x) / zoomScale - 50));
            const y = Math.max(10, Math.min(1800, (e.clientY - rect.top - panOffset.y) / zoomScale - 35));

            setModules(
                modules.map((m) => ({
                    ...m,
                    blocks: m.blocks.map((b) => {
                        if (b.id === selectedBlockId && b.savedSimulationSetup) {
                            return {
                                ...b,
                                savedSimulationSetup: {
                                    ...b.savedSimulationSetup,
                                    positions: {
                                        ...(b.savedSimulationSetup.positions || {}),
                                        [draggingComponent]: { x, y }
                                    }
                                }
                            };
                        }
                        return b;
                    })
                }))
            );
        }
        // Handle panning camera drag
        else if (isPanning) {
            setPanOffset({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            });
        }
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        // Panning the viewport
        if (e.button === 1 || e.shiftKey) {
            setIsPanning(true);
            setPanStart({
                x: e.clientX - panOffset.x,
                y: e.clientY - panOffset.y
            });
        }
    };

    const handleTerminalClick = (componentName: string, terminalName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!activeBlock) return;

        if (selectedSourceNode === null) {
            setSelectedSourceNode({ component: componentName, terminal: terminalName });
            announce(`Selected terminal ${terminalName} on ${componentName}. Tap target terminal to hook wire.`);
        } else {
            if (selectedSourceNode.component === componentName) {
                setSelectedSourceNode(null);
                return;
            }

            const currentConnections = activeBlock.savedSimulationSetup?.connections || [];
            const newConn = {
                from: selectedSourceNode.component,
                fromTerminal: selectedSourceNode.terminal,
                to: componentName,
                toTerminal: terminalName
            };

            const updatedConnections = [...currentConnections, newConn];
            const defaultStates = { ...(activeBlock.savedSimulationSetup?.targetStates || {}) };
            defaultStates["Switch"] = "Closed";
            defaultStates["LED"] = "Lit";

            setModules(
                modules.map((m) => ({
                    ...m,
                    blocks: m.blocks.map((b) => {
                        if (b.id === selectedBlockId && b.savedSimulationSetup) {
                            return {
                                ...b,
                                savedSimulationSetup: {
                                    ...b.savedSimulationSetup,
                                    connections: updatedConnections,
                                    targetStates: defaultStates
                                }
                            };
                        }
                        return b;
                    })
                }))
            );
            setSelectedSourceNode(null);
            announce(`Connected wire from ${selectedSourceNode.component} to ${componentName}.`);
        }
    };

    const clearVisualConnections = () => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => {
                    if (b.id === selectedBlockId && b.savedSimulationSetup) {
                        return {
                            ...b,
                            savedSimulationSetup: {
                                ...b.savedSimulationSetup,
                                connections: [],
                                targetStates: {}
                            }
                        };
                    }
                    return b;
                })
            }))
        );
        announce("Connections reset.");
    };

    // fetching coordinates for the svgs
    const getTerminalCoords = (compName: string, terminal: string) => {
        const pos = activeBlock?.savedSimulationSetup?.positions?.[compName] || { x: 150, y: 150 };
        let offset = { x: 15, y: 35 };
        if (terminal === "positive" || terminal === "terminal-2") {
            offset = { x: 85, y: 35 };
        }
        return { x: pos.x + offset.x, y: pos.y + offset.y };
    };

    // Zoom handlers
    const zoomIn = () => setZoomScale(prev => Math.min(2.0, prev + 0.15));
    const zoomOut = () => setZoomScale(prev => Math.max(0.5, prev - 0.15));
    const resetCamera = () => {
        setZoomScale(1.0);
        setPanOffset({ x: 0, y: 0 });
        announce("Camera viewpoint reset.");
    };

    // Directional pan shifts
    const panViewport = (dir: "up" | "down" | "left" | "right") => {
        const amt = 80;
        setPanOffset(prev => {
            switch (dir) {
                case "up": return { ...prev, y: prev.y + amt };
                case "down": return { ...prev, y: prev.y - amt };
                case "left": return { ...prev, x: prev.x + amt };
                case "right": return { ...prev, x: prev.x - amt };
            }
        });
    };

    // quiz question config
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

    // drag and drop logic
    const handleModuleDragStart = (idx: number) => {
        setDraggedModuleIdx(idx);
    };

    const handleModuleDrop = (targetIdx: number) => {
        if (draggedModuleIdx === null) return;
        const reordered = [...modules];
        const [draggedItem] = reordered.splice(draggedModuleIdx, 1);
        reordered.splice(targetIdx, 0, draggedItem);

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

            {/* left options bar */}
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
                        <div className="p-[1rem] bg-gray-50 border border-dashed rounded-xl flex items-center gap-[0.75rem] text-gray-400">
                            <span>📖</span>
                            <span className="font-semibold text-[0.9rem]">Interactive Storyline</span>
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
                            onClick={() => handleAddBlock("storyline")}
                            className="w-full p-[1rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-orange-400 rounded-xl flex items-center gap-[0.75rem] text-left transition-all hover:-translate-y-[1px] hover:shadow-sm focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2">
                            <div className="w-[2.2rem] h-[2.2rem] rounded-lg bg-orange-100 flex items-center justify-center shrink-0" aria-hidden="true">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="7" height="5" rx="1" />
                                    <rect x="15" y="3" width="7" height="5" rx="1" />
                                    <rect x="8" y="16" width="8" height="5" rx="1" />
                                    <line x1="5.5" y1="8" x2="12" y2="16" />
                                    <line x1="18.5" y1="8" x2="12" y2="16" />
                                </svg>
                            </div>
                            <div>
                                <span className="block font-semibold text-[0.95rem] text-[var(--text-main)]">Interactive Storyline</span>
                                <span className="text-[0.75rem] text-[var(--text-muted)]">Configurable immersive branched narratives</span>
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
                                                {/* module time display*/}
                                                <span className="text-[0.75rem] font-semibold bg-[var(--bg-primary)] px-[0.6rem] py-[0.15rem] rounded-full border border-[var(--border-color)]">
                                                    🕒 {calculateModuleDuration(mod)}
                                                </span>
                                            </div>

                                            {/* module rename */}
                                            <input
                                                type="text"
                                                value={mod.title}
                                                onChange={(e) => handleUpdateModuleTitle(mod.id, e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[1.2rem] font-bold text-[var(--text-main)] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#FF6B35] focus:outline-none w-full max-w-[80%]"
                                                aria-label={`Rename Module ${mod.index}`}
                                            />
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
                                                        <span className="text-[0.75rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">{block.type} component ({block.durationMinutes} min)</span>
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
                                                            {block.videoFileName ? (
                                                                <p className="text-[0.75rem] text-emerald-600 font-semibold truncate max-w-[20rem]">
                                                                    📁 File: {block.videoFileName}
                                                                </p>
                                                            ) : block.videoUrl ? (
                                                                <p className="text-[0.75rem] text-emerald-600 font-semibold truncate max-w-[20rem]">
                                                                    🔗 URL: {block.videoUrl}
                                                                </p>
                                                            ) : (
                                                                <p className="text-[0.75rem] text-amber-600 font-medium">⚠️ No video file/URL linked yet.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {block.videoTranscript && (
                                                        <div className="border-t border-gray-200 pt-[0.5rem] mt-[0.25rem]">
                                                            <span className="block text-[0.75rem] font-bold text-[var(--text-muted)]">Active Lesson Transcript:</span>
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
                                                    {block.savedSimulationSetup && block.savedSimulationSetup.connections.length > 0 && (
                                                        <div className="border-t border-gray-200 pt-[0.5rem] mt-[0.5rem] text-[0.75rem]">
                                                            <p className="text-emerald-700 font-semibold">✓ Correct Simulation Validation Setup Saved</p>
                                                            <p className="text-gray-500 mt-[0.15rem]">
                                                                Connections: {block.savedSimulationSetup.connections.map(c => `${c.from}.${c.fromTerminal} ⚡ ${c.to}.${c.toTerminal}`).join(", ")}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* lab notes*/}
                                                    {block.labNotes && (
                                                        <div className="mt-[0.75rem] bg-sky-50 border border-sky-200 rounded-lg p-[0.75rem] flex flex-col gap-[0.4rem]">
                                                            <div className="flex items-center gap-[0.5rem]">
                                                                <div
                                                                    className="w-[1.4rem] h-[1.4rem] rounded-full bg-sky-400 flex items-center justify-center text-white text-[0.65rem] font-extrabold shrink-0"
                                                                    aria-hidden="true"
                                                                >
                                                                    i
                                                                </div>
                                                                <span className="text-[0.75rem] font-bold text-sky-800 uppercase tracking-wide">Lab Notes Preview</span>
                                                            </div>
                                                            <p className="text-[0.75rem] text-sky-700 leading-relaxed line-clamp-3 font-mono">
                                                                {block.labNotes}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* objectives checklist*/}
                                                    {block.objectives && block.objectives.length > 0 && (
                                                        <div className="mt-[0.5rem] flex flex-col gap-[0.35rem]">
                                                            <span className="text-[0.7rem] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                                                                Current Objectives
                                                            </span>
                                                            <ul className="space-y-[0.3rem]" role="list" aria-label="Lesson objectives checklist preview">
                                                                {block.objectives.map((obj, i) => (
                                                                    <li key={i} className="flex items-start gap-[0.5rem] text-[0.78rem] text-[var(--text-main)]">
                                                                        <input
                                                                            type="checkbox"
                                                                            defaultChecked={i === 0}
                                                                            readOnly
                                                                            className="mt-[0.15rem] accent-[#FF6B35] shrink-0"
                                                                            aria-label={`Objective: ${obj}`}
                                                                            tabIndex={-1}
                                                                        />
                                                                        <span className={i === 0 ? "line-through text-[var(--text-muted)]" : ""}>{obj}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}



                                                </div>


                                            )}



                                            {block.type === "quiz" && (
                                                <div className="border border-gray-100 bg-gray-50 p-[1.25rem] rounded-lg flex flex-col gap-[1rem]">
                                                    {block.quizQuestions?.map((q, idx) => (
                                                        <div key={q.id} className="space-y-[0.75rem] border-b border-gray-200 pb-[1.25rem] last:border-b-0 last:pb-0">
                                                            <div className="flex justify-between items-center">
                                                                <label className="text-[0.9rem] font-bold text-[var(--text-main)] w-full">
                                                                    {idx + 1}. <input
                                                                        type="text"
                                                                        value={q.question}
                                                                        onChange={(e) => updateQuizText(q.id, e.target.value)}
                                                                        className="bg-transparent border-b border-dashed border-gray-300 focus:border-[#FF6B35] focus:outline-none font-bold w-[90%]"
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
                                            {block.type === "storyline" && (
                                                <div className="border border-orange-200 bg-orange-50/60 p-[1rem] rounded-lg flex flex-col gap-[0.75rem]">
                                                    {/* Header bar */}
                                                    <div className="flex items-center gap-[0.6rem]">
                                                        <div
                                                            className="w-[1.8rem] h-[1.8rem] rounded-md bg-orange-500 flex items-center justify-center shrink-0"
                                                            aria-hidden="true"
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="2" y="3" width="7" height="5" rx="1" />
                                                                <rect x="15" y="3" width="7" height="5" rx="1" />
                                                                <rect x="8" y="16" width="8" height="5" rx="1" />
                                                                <line x1="5.5" y1="8" x2="12" y2="16" />
                                                                <line x1="18.5" y1="8" x2="12" y2="16" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-[0.7rem] font-extrabold text-orange-700 uppercase tracking-wider">
                                                            Interactive Storyline
                                                        </span>
                                                    </div>
                                                    {/* Main title display */}
                                                    <p className="text-[1.05rem] font-extrabold text-[var(--text-main)] uppercase tracking-wide leading-snug">
                                                        {block.storylineTitle || "Untitled Scene"}
                                                    </p>

                                                    {block.storylineIntro ? (
                                                        <p className="text-[0.8rem] text-[var(--text-muted)] leading-relaxed line-clamp-3 italic">
                                                            {block.storylineIntro}
                                                        </p>
                                                    ) : (
                                                        <p className="text-[0.75rem] text-orange-400 font-medium">
                                                            ✏️ No scene intro written yet — configure in Block Settings.
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between mt-[0.25rem]">
                                                        <div className="flex items-center gap-[0.4rem] text-[0.75rem] text-[var(--text-muted)]">
                                                            <span>⏱</span>
                                                            <span className="font-semibold">{block.durationMinutes} min</span>
                                                            {block.storylineNodes && block.storylineNodes.length > 0 && (
                                                                <span className="ml-[0.4rem] bg-orange-100 text-orange-700 border border-orange-200 px-[0.5rem] py-[0.1rem] rounded-full text-[0.7rem] font-bold">
                                                                    {block.storylineNodes.length} node{block.storylineNodes.length !== 1 ? "s" : ""}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div
                                                            className="px-[0.75rem] py-[0.3rem] bg-orange-500 text-white text-[0.7rem] font-bold rounded-lg opacity-50 cursor-not-allowed select-none"
                                                            aria-hidden="true"
                                                            title="Placeholder — playable by students"
                                                        >
                                                            ▶ Start
                                                        </div>
                                                    </div>
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

            {/* properties inspector*/}
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

                            <Link
                                href="/TutorStudio/courses/course-1/analytics"
                                className="w-full py-[0.75rem] bg-[#0b1b3d] dark:bg-[var(--button-primary)] text-white hover:opacity-90 font-bold rounded-lg text-center text-[0.95rem] transition-all block focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                            >
                                View Course Analytics
                            </Link>


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

                                    {/* time allocation for blocks */}
                                    <div className="space-y-[0.4rem]">
                                        <label htmlFor="block-duration-inp" className="block text-[0.85rem] font-bold text-[var(--text-muted)]">
                                            Time Allocation (Minutes)
                                        </label>
                                        <input
                                            id="block-duration-inp"
                                            type="number"
                                            min={1}
                                            value={activeBlock.durationMinutes || 0}
                                            onChange={(e) => updateBlockDuration(parseInt(e.target.value) || 0)}
                                            className="w-full p-[0.75rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.95rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                        />
                                    </div>

                                    {/* video block file upload */}
                                    {activeBlock.type === "video" && (
                                        <div className="space-y-[1rem] border-t border-gray-100 pt-[1rem]">
                                            <h3 className="text-[0.9rem] font-bold text-[var(--text-main)]">Video Settings</h3>

                                            {/* drag / click  upload box */}
                                            <div className="space-y-[0.4rem]">
                                                <span className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">Video File</span>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    ref={fileInputRef}
                                                    onChange={handleVideoFileUpload}
                                                    className="hidden"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full border-2 border-dashed border-gray-300 hover:border-[#FF6B35] bg-gray-50 rounded-xl p-[1rem] flex flex-col items-center justify-center text-center cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                                                >
                                                    <span className="text-[1.5rem]">📤</span>
                                                    <span className="text-[0.8rem] font-bold text-[var(--text-main)] mt-[0.25rem]">
                                                        {activeBlock.videoFileName ? "Change Uploaded Video" : "Drag or Click to Upload Video"}
                                                    </span>
                                                    {activeBlock.videoFileName && (
                                                        <span className="text-[0.7rem] text-emerald-600 font-semibold mt-[0.15rem]">
                                                            {activeBlock.videoFileName}
                                                        </span>
                                                    )}
                                                </button>

                                                {uploadingProgress !== null && (
                                                    <div className="w-full bg-gray-200 rounded-full h-[6px] mt-[0.5rem] overflow-hidden">
                                                        <div
                                                            className="bg-[#FF6B35] h-[6px] rounded-full transition-all duration-300"
                                                            style={{ width: `${uploadingProgress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-[0.4rem]">
                                                <label htmlFor="video-url-inp" className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">
                                                    Or Link External Video URL
                                                </label>
                                                <input
                                                    id="video-url-inp"
                                                    type="text"
                                                    value={activeBlock.videoUrl || ""}
                                                    onChange={(e) => updateVideoSettings("videoUrl", e.target.value)}
                                                    className="w-full p-[0.6rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none"
                                                    placeholder="e.g. https://domain.com/lecture.mp4"
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
                                        </div>
                                    )}

                                    {/* mini circuit builder */}
                                    {activeBlock.type === "sandbox" && (
                                        <div className="space-y-[1.25rem] border-t border-gray-100 pt-[1rem]">
                                            <h3 className="text-[0.9rem] font-bold text-[var(--text-main)]">Sandbox Workspace</h3>

                                            <div className="space-y-[0.5rem]">
                                                <label htmlFor="comp-select" className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">
                                                    Assign Component:
                                                </label>
                                                <select
                                                    id="comp-select"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            addSandboxComponent(e.target.value);
                                                            e.target.value = "";
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

                                            {/* circuit canvas */}
                                            <div className="space-y-[0.5rem]">
                                                <span className="block text-[0.8rem] font-bold text-[var(--text-muted)]">Circuit Designer Validator (Visual Canvas)</span>
                                                <p className="text-[0.7rem] text-[var(--text-muted)]">
                                                    Tutors: Drag elements to arrange, and click terminal pins to connect colored wires. Shift+Drag to pan camera viewport.
                                                </p>

                                                {/* Infinite Scrolling Layout Wrapper with Zoom & Pan */}
                                                <div
                                                    ref={canvasRef}
                                                    onMouseMove={handleCanvasMouseMove}
                                                    onMouseDown={handleCanvasMouseDown}
                                                    className="relative h-[20rem] w-full rounded-xl bg-[#141E30] overflow-hidden border border-slate-700 shadow-inner select-none cursor-default"
                                                    style={{
                                                        backgroundImage: "radial-gradient(#1e293b 1.5px, transparent 0)",
                                                        backgroundSize: "16px 16px"
                                                    }}
                                                >
                                                    {/* Viewport Transform Layer */}
                                                    <div
                                                        style={{
                                                            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                                                            transformOrigin: "0 0",
                                                            width: "2000px",
                                                            height: "2000px",
                                                            position: "absolute"
                                                        }}
                                                    >
                                                        {/* SVG Wire Layout Connections */}
                                                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                                                            {activeBlock.savedSimulationSetup?.connections.map((conn, idx) => {
                                                                const fromPt = getTerminalCoords(conn.from, conn.fromTerminal);
                                                                const toPt = getTerminalCoords(conn.to, conn.toTerminal);
                                                                const dx = toPt.x - fromPt.x;
                                                                const dy = toPt.y - fromPt.y;

                                                                const pathD = `M ${fromPt.x} ${fromPt.y} C ${fromPt.x + dx * 0.25} ${fromPt.y + dy * 0.8}, ${fromPt.x + dx * 0.75} ${fromPt.y - dy * 0.2}, ${toPt.x} ${toPt.y}`;
                                                                return (
                                                                    <path
                                                                        key={idx}
                                                                        d={pathD}
                                                                        fill="none"
                                                                        stroke="#ef4444"
                                                                        strokeWidth="3.5"
                                                                        strokeLinecap="round"
                                                                        className="opacity-95"
                                                                    />
                                                                );
                                                            })}
                                                            {/* Live drag wire preview rendering */}
                                                            {selectedSourceNode && (
                                                                (() => {
                                                                    const fromPt = getTerminalCoords(selectedSourceNode.component, selectedSourceNode.terminal);
                                                                    const dx = mousePos.x - fromPt.x;
                                                                    const dy = mousePos.y - fromPt.y;
                                                                    const pathD = `M ${fromPt.x} ${fromPt.y} C ${fromPt.x + dx * 0.25} ${fromPt.y + dy * 0.8}, ${fromPt.x + dx * 0.75} ${fromPt.y - dy * 0.2}, ${mousePos.x} ${mousePos.y}`;
                                                                    return (
                                                                        <path
                                                                            d={pathD}
                                                                            fill="none"
                                                                            stroke="#38bdf8"
                                                                            strokeWidth="3"
                                                                            strokeDasharray="4 4"
                                                                            className="animate-pulse"
                                                                        />
                                                                    );
                                                                })()
                                                            )}
                                                        </svg>

                                                        {/* Draggable Component Cards */}
                                                        {activeBlock.sandboxComponents?.map((comp, idx) => {
                                                            const pos = activeBlock.savedSimulationSetup?.positions?.[comp] || { x: 150 + idx * 120, y: 150 };
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    style={{ left: pos.x, top: pos.y }}
                                                                    onMouseDown={(e) => {
                                                                        e.stopPropagation();
                                                                        setDraggingComponent(comp);
                                                                    }}
                                                                    className={`absolute w-[100px] h-[70px] bg-[#1e293b]/90 border text-slate-100 rounded-lg p-[0.35rem] flex flex-col justify-between shadow-md select-none transition-shadow z-20 ${draggingComponent === comp ? "shadow-2xl border-sky-400 cursor-grabbing" : "border-slate-600 cursor-grab hover:border-slate-400"
                                                                        }`}
                                                                >
                                                                    <div className="flex justify-between items-center text-[0.65rem] border-b border-slate-700/60 pb-[0.2rem]">
                                                                        <span className="font-bold truncate w-[80%]">⚡ {comp}</span>
                                                                    </div>

                                                                    {/* Circular pin connectors for the blocks */}
                                                                    <div className="flex justify-between px-[0.1rem] pb-[0.2rem]">
                                                                        <button
                                                                            type="button"
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            onClick={(e) => handleTerminalClick(comp, comp === "Battery" ? "negative" : "terminal-1", e)}
                                                                            className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center transition-all ${selectedSourceNode?.component === comp && (selectedSourceNode.terminal === "negative" || selectedSourceNode.terminal === "terminal-1")
                                                                                ? "bg-sky-400 border-white scale-110"
                                                                                : "bg-amber-400 hover:bg-amber-300 border-amber-600"
                                                                                }`}
                                                                            title={comp === "Battery" ? "Negative (-)" : "Terminal 1"}
                                                                        >
                                                                            <span className="text-[7px] text-black font-bold"></span>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onMouseDown={(e) => e.stopPropagation()}
                                                                            onClick={(e) => handleTerminalClick(comp, comp === "Battery" ? "positive" : "terminal-2", e)}
                                                                            className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center transition-all ${selectedSourceNode?.component === comp && (selectedSourceNode.terminal === "positive" || selectedSourceNode.terminal === "terminal-2")
                                                                                ? "bg-sky-400 border-white scale-110"
                                                                                : "bg-red-500 hover:bg-red-400 border-red-700"
                                                                                }`}
                                                                            title={comp === "Battery" ? "Positive (+)" : "Terminal 2"}
                                                                        >
                                                                            <span className="text-[7px] text-black font-bold"></span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Zoom & scale view changing options*/}
                                                    <div className="absolute bottom-[0.5rem] right-[0.5rem] bg-[#0b1329]/95 border border-slate-700/60 rounded-xl p-[0.4rem] flex items-center gap-[0.4rem] z-30 shadow-md">
                                                        <button
                                                            type="button"
                                                            onClick={zoomIn}
                                                            className="w-[1.6rem] h-[1.6rem] rounded bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
                                                            title="Zoom In"
                                                        >
                                                            ＋
                                                        </button>
                                                        <span className="text-[0.65rem] font-bold text-slate-300 w-[2.2rem] text-center">
                                                            {Math.round(zoomScale * 100)}%
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={zoomOut}
                                                            className="w-[1.6rem] h-[1.6rem] rounded bg-slate-800 text-white text-xs font-bold hover:bg-slate-700"
                                                            title="Zoom Out"
                                                        >
                                                            －
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={resetCamera}
                                                            className="w-[1.6rem] h-[1.6rem] rounded bg-slate-800 text-white text-[0.6rem] font-bold hover:bg-slate-700"
                                                            title="Reset Camera Viewport"
                                                        >
                                                            🏠
                                                        </button>
                                                    </div>

                                                    {/*camera navigation presets */}
                                                    <div className="absolute top-[0.5rem] right-[0.5rem] bg-[#0b1329]/95 border border-slate-700/60 rounded-xl p-[0.35rem] grid grid-cols-3 gap-[0.15rem] z-30 shadow-md">
                                                        <div></div>
                                                        <button type="button" onClick={() => panViewport("up")} className="w-[1.2rem] h-[1.2rem] bg-slate-800 text-white text-[0.5rem] rounded hover:bg-slate-700">▲</button>
                                                        <div></div>
                                                        <button type="button" onClick={() => panViewport("left")} className="w-[1.2rem] h-[1.2rem] bg-slate-800 text-white text-[0.5rem] rounded hover:bg-slate-700">◀</button>
                                                        <div></div>
                                                        <button type="button" onClick={() => panViewport("right")} className="w-[1.2rem] h-[1.2rem] bg-slate-800 text-white text-[0.5rem] rounded hover:bg-slate-700">▶</button>
                                                        <div></div>
                                                        <button type="button" onClick={() => panViewport("down")} className="w-[1.2rem] h-[1.2rem] bg-slate-800 text-white text-[0.5rem] rounded hover:bg-slate-700">▼</button>
                                                        <div></div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-[0.5rem] pt-[0.25rem]">
                                                    <button
                                                        type="button"
                                                        onClick={clearVisualConnections}
                                                        className="w-1/2 py-[0.4rem] border border-slate-700 hover:bg-slate-800 text-[0.75rem] font-bold text-red-400 rounded-lg"
                                                    >
                                                        Reset Canvas
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => alert("Simulation setup validator locked successfully.")}
                                                        className="w-1/2 py-[0.4rem] bg-[#FF6B35] text-white text-[0.75rem] font-bold rounded-lg hover:bg-[#e05825]"
                                                    >
                                                        Save Rules
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Text Layout deletion */}
                                            <div className="space-y-[0.4rem]">
                                                <span className="block text-[0.8rem] font-bold text-[var(--text-muted)]">Assigned Components List</span>
                                                <ul className="space-y-[0.4rem]">
                                                    {activeBlock.sandboxComponents?.map((comp, idx) => (
                                                        <li key={idx} className="flex justify-between items-center bg-[var(--bg-primary)] p-[0.4rem] px-[0.75rem] rounded-lg border border-[var(--border-color)] text-[0.8rem]">
                                                            <span className="font-semibold text-[var(--text-main)]">⚡ {comp}</span>
                                                            <button
                                                                onClick={() => deleteSandboxComponent(idx)}
                                                                className="text-red-500 hover:text-red-700 font-bold"
                                                            >
                                                                ✕ Remove
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {activeBlock.type === "quiz" && (
                                        <div className="space-y-[0.75rem] border-t border-gray-100 pt-[1rem]">
                                            <span className="block text-[0.85rem] font-bold text-[var(--text-muted)]">Questions Config Summary</span>
                                            <p className="text-[0.8rem] text-[var(--text-muted)]">
                                                {activeBlock.quizQuestions?.length || 0} questions are configured.
                                            </p>
                                        </div>
                                    )}

                                    {/* Storyline block settings*/}
                                    {activeBlock.type === "storyline" && (
                                        <div className="space-y-[1.5rem] border-t border-[var(--border-color)] pt-[1rem]">
                                            <h3 className="text-[0.9rem] font-bold text-[var(--text-main)]">Storyline Settings</h3>

                                            {/* Section Title */}
                                            <div className="space-y-[0.4rem]">
                                                <label htmlFor="storyline-title-inp" className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">
                                                    Storyline Section Title
                                                </label>
                                                <input
                                                    id="storyline-title-inp"
                                                    type="text"
                                                    value={activeBlock.storylineTitle || ""}
                                                    onChange={(e) =>
                                                        setModules(modules.map((m) => ({
                                                            ...m,
                                                            blocks: m.blocks.map((b) =>
                                                                b.id === selectedBlockId ? { ...b, storylineTitle: e.target.value } : b
                                                            )
                                                        })))
                                                    }
                                                    placeholder="e.g. Fall of the Roman Empire"
                                                    className="w-full p-[0.6rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                />
                                            </div>

                                            {/* Global Scene Intro */}
                                            <div className="space-y-[0.4rem]">
                                                <label htmlFor="storyline-intro-inp" className="block text-[0.8rem] font-semibold text-[var(--text-muted)]">
                                                    Global Scene Intro
                                                </label>
                                                <textarea
                                                    id="storyline-intro-inp"
                                                    rows={3}
                                                    value={activeBlock.storylineIntro || ""}
                                                    onChange={(e) =>
                                                        setModules(modules.map((m) => ({
                                                            ...m,
                                                            blocks: m.blocks.map((b) =>
                                                                b.id === selectedBlockId ? { ...b, storylineIntro: e.target.value } : b
                                                            )
                                                        })))
                                                    }
                                                    placeholder="Set the stage — describe the opening scene context for this storyline..."
                                                    className="w-full p-[0.6rem] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                />
                                            </div>

                                            {/* Dialogue Node Stack */}
                                            <div className="space-y-[0.75rem]">
                                                <span className="block text-[0.8rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                                    Dialogue Nodes ({activeBlock.storylineNodes?.length || 0})
                                                </span>

                                                {activeBlock.storylineNodes && activeBlock.storylineNodes.length > 0 ? (
                                                    activeBlock.storylineNodes.map((node, nodeIdx) => (
                                                        <div
                                                            key={node.id}
                                                            className="border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-xl p-[0.85rem] flex flex-col gap-[0.65rem]"
                                                        >
                                                            {/* Node Header */}
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[0.72rem] font-extrabold text-orange-600 uppercase tracking-wide">
                                                                    Node {nodeIdx + 1}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setModules(modules.map((m) => ({
                                                                            ...m,
                                                                            blocks: m.blocks.map((b) =>
                                                                                b.id === selectedBlockId
                                                                                    ? { ...b, storylineNodes: b.storylineNodes?.filter((_, i) => i !== nodeIdx) }
                                                                                    : b
                                                                            )
                                                                        })))
                                                                    }
                                                                    className="text-[0.7rem] text-red-500 hover:text-red-700 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                                                                    aria-label={`Delete dialogue node ${nodeIdx + 1}`}
                                                                >
                                                                    ✕ Remove
                                                                </button>
                                                            </div>

                                                            {/* Speaker avatar */}
                                                            <div className="space-y-[0.3rem]">
                                                                <label
                                                                    htmlFor={`node-avatar-${node.id}`}
                                                                    className="block text-[0.75rem] font-semibold text-[var(--text-muted)]"
                                                                >
                                                                    Speaker Avatar URL
                                                                </label>
                                                                <input
                                                                    id={`node-avatar-${node.id}`}
                                                                    type="text"
                                                                    value={node.speakerAvatarUrl}
                                                                    onChange={(e) =>
                                                                        setModules(modules.map((m) => ({
                                                                            ...m,
                                                                            blocks: m.blocks.map((b) =>
                                                                                b.id === selectedBlockId
                                                                                    ? {
                                                                                        ...b,
                                                                                        storylineNodes: b.storylineNodes?.map((n, i) =>
                                                                                            i === nodeIdx ? { ...n, speakerAvatarUrl: e.target.value } : n
                                                                                        )
                                                                                    }
                                                                                    : b
                                                                            )
                                                                        })))
                                                                    }
                                                                    placeholder="https://... or /avatars/character.png"
                                                                    className="w-full p-[0.5rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.8rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                                />
                                                            </div>

                                                            {/* Speaker Name */}
                                                            <div className="space-y-[0.3rem]">
                                                                <label
                                                                    htmlFor={`node-name-${node.id}`}
                                                                    className="block text-[0.75rem] font-semibold text-[var(--text-muted)]"
                                                                >
                                                                    Character Profile
                                                                </label>
                                                                <input
                                                                    id={`node-name-${node.id}`}
                                                                    type="text"
                                                                    value={node.speakerName}
                                                                    onChange={(e) =>
                                                                        setModules(modules.map((m) => ({
                                                                            ...m,
                                                                            blocks: m.blocks.map((b) =>
                                                                                b.id === selectedBlockId
                                                                                    ? {
                                                                                        ...b,
                                                                                        storylineNodes: b.storylineNodes?.map((n, i) =>
                                                                                            i === nodeIdx ? { ...n, speakerName: e.target.value } : n
                                                                                        )
                                                                                    }
                                                                                    : b
                                                                            )
                                                                        })))
                                                                    }
                                                                    placeholder="e.g. Senator Gracchus"
                                                                    className="w-full p-[0.5rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.8rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                                />
                                                            </div>

                                                            {/* Dialogue text */}
                                                            <div className="space-y-[0.3rem]">
                                                                <label
                                                                    htmlFor={`node-dialogue-${node.id}`}
                                                                    className="block text-[0.75rem] font-semibold text-[var(--text-muted)]"
                                                                >
                                                                    Character Dialogue
                                                                </label>
                                                                <textarea
                                                                    id={`node-dialogue-${node.id}`}
                                                                    rows={3}
                                                                    value={node.dialogueText}
                                                                    onChange={(e) =>
                                                                        setModules(modules.map((m) => ({
                                                                            ...m,
                                                                            blocks: m.blocks.map((b) =>
                                                                                b.id === selectedBlockId
                                                                                    ? {
                                                                                        ...b,
                                                                                        storylineNodes: b.storylineNodes?.map((n, i) =>
                                                                                            i === nodeIdx ? { ...n, dialogueText: e.target.value } : n
                                                                                        )
                                                                                    }
                                                                                    : b
                                                                            )
                                                                        })))
                                                                    }
                                                                    placeholder='"The senate must act — the people cannot wait any longer..."'
                                                                    className="w-full p-[0.5rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.8rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                                />
                                                            </div>

                                                            {/* Decision Choices */}
                                                            <div className="space-y-[0.35rem]">
                                                                <span className="block text-[0.72rem] font-bold text-[var(--text-muted)]">
                                                                    Decision Choices ({node.choices.length})
                                                                </span>

                                                                {node.choices.map((choice, choiceIdx) => (
                                                                    <div key={choice.id} className="flex items-center gap-[0.4rem]">
                                                                        <span className="text-[0.7rem] font-bold text-orange-500 shrink-0 w-[3.5rem]">
                                                                            Choice {choiceIdx + 1}:
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            value={choice.text}
                                                                            onChange={(e) =>
                                                                                setModules(modules.map((m) => ({
                                                                                    ...m,
                                                                                    blocks: m.blocks.map((b) =>
                                                                                        b.id === selectedBlockId
                                                                                            ? {
                                                                                                ...b,
                                                                                                storylineNodes: b.storylineNodes?.map((n, ni) =>
                                                                                                    ni === nodeIdx
                                                                                                        ? {
                                                                                                            ...n,
                                                                                                            choices: n.choices.map((c, ci) =>
                                                                                                                ci === choiceIdx ? { ...c, text: e.target.value } : c
                                                                                                            )
                                                                                                        }
                                                                                                        : n
                                                                                                )
                                                                                            }
                                                                                            : b
                                                                                    )
                                                                                })))
                                                                            }
                                                                            placeholder={`e.g. I stand with the Senate...`}
                                                                            className="flex-1 p-[0.4rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.78rem] text-[var(--text-main)] focus:ring-2 focus:ring-[#FF6B35] focus:outline-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                                            aria-label={`Node ${nodeIdx + 1} Choice ${choiceIdx + 1} text`}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                setModules(modules.map((m) => ({
                                                                                    ...m,
                                                                                    blocks: m.blocks.map((b) =>
                                                                                        b.id === selectedBlockId
                                                                                            ? {
                                                                                                ...b,
                                                                                                storylineNodes: b.storylineNodes?.map((n, ni) =>
                                                                                                    ni === nodeIdx
                                                                                                        ? { ...n, choices: n.choices.filter((_, ci) => ci !== choiceIdx) }
                                                                                                        : n
                                                                                                )
                                                                                            }
                                                                                            : b
                                                                                    )
                                                                                })))
                                                                            }
                                                                            className="text-red-400 hover:text-red-600 text-[0.75rem] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                                                                            aria-label={`Remove choice ${choiceIdx + 1} from node ${nodeIdx + 1}`}
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                ))}

                                                                {/* Add Decision Choice */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setModules(modules.map((m) => ({
                                                                            ...m,
                                                                            blocks: m.blocks.map((b) =>
                                                                                b.id === selectedBlockId
                                                                                    ? {
                                                                                        ...b,
                                                                                        storylineNodes: b.storylineNodes?.map((n, ni) =>
                                                                                            ni === nodeIdx
                                                                                                ? {
                                                                                                    ...n,
                                                                                                    choices: [
                                                                                                        ...n.choices,
                                                                                                        { id: `choice-${Date.now()}`, text: "" }
                                                                                                    ]
                                                                                                }
                                                                                                : n
                                                                                        )
                                                                                    }
                                                                                    : b
                                                                            )
                                                                        })))
                                                                    }
                                                                    className="text-[0.75rem] font-bold text-orange-600 hover:text-orange-800 border border-dashed border-orange-300 hover:border-orange-500 rounded-lg px-[0.75rem] py-[0.35rem] transition-colors w-full text-center focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                                >
                                                                    + Add Decision Choice
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-[1.5rem] border border-dashed border-orange-200 rounded-xl text-center text-[var(--text-muted)] text-[0.8rem]">
                                                        <span className="block text-[1.2rem] mb-[0.25rem]">📖</span>
                                                        No dialogue nodes yet. Add one below.
                                                    </div>
                                                )}

                                                {/* Add New Dialogue*/}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newNode: StorylineNode = {
                                                            id: `node-${Date.now()}`,
                                                            speakerName: "",
                                                            speakerAvatarUrl: "",
                                                            dialogueText: "",
                                                            choices: []
                                                        };
                                                        setModules(modules.map((m) => ({
                                                            ...m,
                                                            blocks: m.blocks.map((b) =>
                                                                b.id === selectedBlockId
                                                                    ? { ...b, storylineNodes: [...(b.storylineNodes || []), newNode] }
                                                                    : b
                                                            )
                                                        })));
                                                        announce("New dialogue node added to storyline block.");
                                                    }}
                                                    className="w-full py-[0.6rem] bg-orange-500 hover:bg-orange-600 text-white font-bold text-[0.85rem] rounded-xl transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                                >
                                                    + Add Dialogue Node
                                                </button>
                                            </div>
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
