"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { useOrganizations } from "@/app/components/organizations/OrganizationContext";
import { useAuth } from "@/app/components/AuthCOntext";
import PDFBlockEditor from "@/app/TutorStudio/courses/[id]/components/PDFBlockEditor";

export default function EditCourseWrapper() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-slate-400 text-lg font-semibold">Loading course editor...</div></div>}>
            <CourseEditorStudio />
        </Suspense>
    );
}

// Interfaces identical to builder for complete structural compatibility
interface StorylineNode {
    id: string;
    speakerName: string;
    speakerAvatarUrl: string;
    dialogueText: string;
    choices: {
        id: string;
        text: string;
        targetNodeId: string;
        syncPointsModifier: number;
    }[];
}

interface Module {
    id: string;
    index: number;
    title: string;
    duration: string;
    blocks: ContentBlock[];
}

type BlockType = "video" | "sandbox" | "quiz" | "storyline" | "pdf";

interface ContentBlock {
    id: string;
    type: BlockType;
    title: string;
    durationMinutes: number;
    videoUrl?: string;
    videoTranscript?: string;
    videoFileName?: string;
    sandboxComponents?: string[];
    savedSimulationSetup?: {
        connections: { from: string; fromTerminal: string; to: string; toTerminal: string }[];
        targetStates: { [key: string]: string };
        positions?: { [key: string]: { x: number; y: number } };
    };
    labNotes?: string;
    objectives?: string[];
    quizQuestions?: QuizQuestions[];
    storylineTitle?: string;
    storylineIntro?: string;
    storylineNodes?: StorylineNode[];
    pdfFileUrl?: string;
    pdfFileName?: string;
    pdfAllowDownload?: boolean;
    pdfForceSequential?: boolean;
    pdfDefaultZoom?: 75 | 100 | 125 | 150;
    pdfTotalPages?: number;
}

interface QuizQuestions {
    id: string;
    question: string;
    options: { id: string; text: string; isCorrect: boolean }[];
}

function CourseEditorStudio() {
    const { id: courseId } = useParams<{ id: string }>();
    const { announce } = useAccessibility();
    const router = useRouter();
    const { user } = useAuth();
    const { getCourse, getActivity, updateCourse, deleteCourse, getOrganization, getOrgMember } = useOrganizations();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Form fields mapped to state
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [courseSubject, setCourseSubject] = useState("Physics");
    const [orgId, setOrgId] = useState<string | null>(null);
    const [orgName, setOrgName] = useState("");
    const [modules, setModules] = useState<Module[]>([]);

    // Navigation and editing focus states
    const [currentView, setCurrentView] = useState<"course-overview" | "edit-module">("course-overview");
    const [selectedModuleId, setSelectedModuleId] = useState<string>("");
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        if (!courseId) return;

        const loadCourseData = async () => {
            try {
                const fetchedCourse = await getCourse(courseId);
                if (!fetchedCourse) {
                    setSaveError("Course not found");
                    setLoading(false);
                    return;
                }

                setCourseTitle(fetchedCourse.title);
                setCourseDescription(fetchedCourse.description);
                setCourseSubject(fetchedCourse.subject);
                setOrgId(fetchedCourse.orgId);

                // Fetch Organization Name
                const orgInfo = fetchedCourse.orgId ? getOrganization(fetchedCourse.orgId) : undefined;
                if (orgInfo) setOrgName(orgInfo.name);

                // Load modules and load activities (blocks) in parallel
                if (fetchedCourse.modules) {
                    const sortedModules = Object.values(fetchedCourse.modules).sort((a: any, b: any) => a.index - b.index);
                    const reconstructedModules = await Promise.all(
                        sortedModules.map(async (mod: any) => {
                            const activityIds = Object.keys(mod.activityIds || {});
                            const blocksData = await Promise.all(
                                activityIds.map(async (actId) => {
                                    const activity = await getActivity(actId);
                                    if (activity && activity.content) {
                                        return {
                                            ...activity.content,
                                            id: actId // ensure ID remains persistent
                                        } as ContentBlock;
                                    }
                                    return null;
                                })
                            );

                            return {
                                id: mod.id,
                                index: mod.index,
                                title: mod.title,
                                duration: mod.duration || "10 minutes",
                                blocks: blocksData.filter((b): b is ContentBlock => b !== null)
                            };
                        })
                    );

                    setModules(reconstructedModules);
                    if (reconstructedModules.length > 0) {
                        setSelectedModuleId(reconstructedModules[0].id);
                    }
                }
            } catch (err) {
                console.error("Failed to load course details:", err);
                setSaveError("An error occurred loading course data.");
            } finally {
                setLoading(false);
            }
        };

        loadCourseData();
    }, [courseId, getCourse, getActivity, getOrganization]);

    // Handle course save
    const handleSaveChanges = async () => {
        if (!courseTitle.trim()) {
            setSaveError("Course title is required");
            return;
        }
        if (!modules.length || !modules.some(m => m.blocks.length > 0)) {
            setSaveError("Add at least one module with content blocks");
            return;
        }
        if (!user?.uid || !orgId) return;
        setSaving(true);
        setSaveError(null);

        const modulesRecord: Record<string, { id: string; index: number; title: string; duration: string; blocks: any[] }> = {};
        for (const mod of modules) {
            modulesRecord[mod.id] = { id: mod.id, index: mod.index, title: mod.title, duration: mod.duration, blocks: mod.blocks };
        }

        const result = await updateCourse(courseId, {
            title: courseTitle.trim(),
            description: courseDescription.trim(),
            subject: courseSubject,
            orgId,
            ownerId: user.uid,
            modules: modulesRecord,
        });

        setSaving(false);
        if (result.success) {
            announce("Course successfully saved.");
            router.push(`/TutorStudio/organization/${orgId}`);
        } else {
            setSaveError(result.error || "Failed to update course");
        }
    };

    // Handle course deletion
    const handleDeleteCourse = async () => {
        if (!orgId) return;
        setSaving(true);
        const result = await deleteCourse(courseId, orgId);
        setSaving(false);
        if (result.success) {
            announce("Course permanently deleted.");
            router.push("/TutorStudio/mycourses");
        } else {
            setSaveError("Failed to delete the course.");
        }
    };

    const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
    const activeBlock = activeModule?.blocks.find((b) => b.id === selectedBlockId) || null;

    const calculateModuleDuration = (mod: Module) => {
        const totalMinutes = mod.blocks.reduce((total, block) => total + (block.durationMinutes || 0), 0);
        return totalMinutes > 0 ? `${totalMinutes} minutes` : "Empty";
    };

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
            labNotes: type === "sandbox" ? "" : undefined,
            objectives: type === "sandbox" ? [] : undefined,
            quizQuestions: type === "quiz" ? [] : undefined,
            storylineTitle: type === "storyline" ? "Untitled Scene" : undefined,
            storylineIntro: type === "storyline" ? "" : undefined,
            storylineNodes: type === "storyline" ? [] : undefined,
            pdfFileUrl: type === "pdf" ? "" : undefined,
            pdfFileName: type === "pdf" ? "" : undefined,
            pdfAllowDownload: type === "pdf" ? true : undefined,
            pdfForceSequential: type === "pdf" ? false : undefined,
            pdfDefaultZoom: type === "pdf" ? 100 : undefined,
            pdfTotalPages: type === "pdf" ? undefined : undefined,
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

    const updateBlockDuration = (minutes: number) => {
        setModules(
            modules.map((m) => ({
                ...m,
                blocks: m.blocks.map((b) => (b.id === selectedBlockId ? { ...b, durationMinutes: minutes } : b))
            }))
        );
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-slate-400 text-lg font-semibold">Loading course structure...</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[var(--bg-primary,#F9FAFB)] text-[var(--text-main,#041A3E)] flex flex-col lg:flex-row transition-colors duration-200">

            {/* Left palette drawer */}
            <aside className="w-full lg:w-[20%] bg-[var(--bg-secondary,#FFFFFF)] border-b lg:border-b-0 lg:border-r border-[var(--border-color,#E5E7EB)] p-[1.5rem] flex flex-col gap-[1.5rem]" aria-label="Studio Toolbox">
                <div className="flex justify-between items-center">
                    <h2 className="text-[1.2rem] font-bold text-[var(--text-main)]">Blocks Palette</h2>
                </div>

                {currentView === "course-overview" ? (
                    <div className="flex flex-col gap-[1rem] opacity-60">
                        <p className="text-[0.85rem] text-[var(--text-muted,#6B7280)]">
                            Select a module from the center outline and click <strong>"Edit Blocks"</strong> to modify contents.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-[1rem]">
                        <button onClick={() => handleAddBlock("video")} className="w-full p-[1rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-red-400 rounded-xl flex items-center gap-[0.75rem] text-left">
                            <div className="w-[2.2rem] h-[2.2rem] rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold">📹</div>
                            <div>
                                <span className="block font-semibold text-[0.95rem]">Video Lesson</span>
                            </div>
                        </button>
                        <button onClick={() => handleAddBlock("sandbox")} className="w-full p-[1rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-blue-400 rounded-xl flex items-center gap-[0.75rem] text-left">
                            <div className="w-[2.2rem] h-[2.2rem] rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">🧪</div>
                            <div>
                                <span className="block font-semibold text-[0.95rem]">Sandbox Lab</span>
                            </div>
                        </button>
                        <button onClick={() => handleAddBlock("quiz")} className="w-full p-[1rem] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-emerald-400 rounded-xl flex items-center gap-[0.75rem] text-left">
                            <div className="w-[2.2rem] h-[2.2rem] rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">❓</div>
                            <div>
                                <span className="block font-semibold text-[0.95rem]">Quiz Block</span>
                            </div>
                        </button>
                        <button onClick={() => setCurrentView("course-overview")} className="mt-[2rem] w-full py-[0.75rem] border border-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-white transition-colors font-bold rounded-xl text-center text-[0.9rem]">
                            &larr; Back to Outline
                        </button>
                    </div>
                )}
            </aside>

            {/* Center editing stage */}
            <main className="w-full lg:w-[55%] p-[2rem] overflow-y-auto max-h-screen flex flex-col gap-[2rem]">
                {currentView === "course-overview" ? (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-[2rem] font-bold text-[var(--text-main)]">Edit Course</h1>
                                <p className="text-[1rem] text-[var(--text-muted)] mt-[0.25rem]">Adjust metadata and layout parameters</p>
                                {orgName && (
                                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                                        <span className="text-sm font-bold text-blue-700">Org: {orgName}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    🗑️ Delete Course
                                </button>
                                <Link href="/TutorStudio/mycourses" className="px-4 py-2 border border-[var(--border-color)] hover:bg-gray-100 rounded-xl text-xs font-semibold">
                                    Cancel & Exit
                                </Link>
                            </div>
                        </div>

                        {/* Metadata Editor */}
                        <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)] space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Course Title</label>
                                <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Description</label>
                                <textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} rows={3} className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-sm" />
                            </div>
                        </div>

                        {/* Modules Stack */}
                        <div className="flex flex-col gap-[1.25rem]">
                            {modules.map((mod, idx) => (
                                <div key={mod.id} onClick={() => setSelectedModuleId(mod.id)} className={`bg-[var(--bg-secondary)] p-[1.5rem] rounded-xl border-2 transition-all flex justify-between items-center ${mod.id === selectedModuleId ? "border-[#FF6B35]" : "border-transparent"}`}>
                                    <div className="space-y-[0.5rem] flex-1">
                                        <div className="flex items-center gap-[0.75rem]">
                                            <span className="text-[0.9rem] font-bold text-[#FF6B35]">Module {mod.index}</span>
                                            <span className="text-[0.75rem] font-semibold bg-[var(--bg-primary)] px-[0.6rem] py-[0.15rem] rounded-full border">
                                                🕒 {calculateModuleDuration(mod)}
                                            </span>
                                        </div>
                                        <input type="text" value={mod.title} onChange={(e) => handleUpdateModuleTitle(mod.id, e.target.value)} className="text-[1.2rem] font-bold bg-transparent border-b border-transparent w-full focus:outline-none" />
                                    </div>
                                    <div className="flex items-center gap-[0.75rem]">
                                        <button onClick={() => { setSelectedModuleId(mod.id); setCurrentView("edit-module"); }} className="p-[0.5rem] bg-[var(--bg-primary)] border rounded-lg text-xs font-bold">
                                            ✏️ Edit Blocks
                                        </button>
                                        <button onClick={(e) => handleDeleteModule(mod.id, e)} className="p-[0.5rem] bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={handleAddModule} className="w-full py-[2rem] border-2 border-dashed border-gray-300 hover:border-[#FF6B35] rounded-xl bg-[var(--bg-secondary)] font-semibold text-sm">
                            + Add Module
                        </button>
                    </>
                ) : (
                    <>
                        {/* Edit Module Blocks */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-[1rem]">
                                <button onClick={() => setCurrentView("course-overview")} className="px-3 py-1.5 bg-[var(--bg-secondary)] border rounded-lg text-[0.85rem] font-semibold">
                                    &larr; Overview
                                </button>
                                <div>
                                    <h1 className="text-[1.8rem] font-bold">Edit Module Blocks</h1>
                                    <p className="text-xs text-[var(--text-muted)]">Module {activeModule.index}: {activeModule.title}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[1.5rem]">
                            {activeModule.blocks.length === 0 ? (
                                <div className="py-[3rem] bg-[var(--bg-secondary)] border border-dashed rounded-xl text-center text-[var(--text-muted)]">
                                    No content blocks. Use the Left Blocks Palette to add elements.
                                </div>
                            ) : (
                                activeModule.blocks.map((block, idx) => (
                                    <div key={block.id} onClick={() => setSelectedBlockId(block.id)} className={`bg-[var(--bg-secondary)] rounded-xl border-2 p-[1.5rem] transition-all flex flex-col gap-[1rem] ${block.id === selectedBlockId ? "border-[#FF6B35]" : "border-transparent"}`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-[0.75rem]">
                                                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold">
                                                    {block.type === "video" ? "📹" : block.type === "quiz" ? "❓" : "🧪"}
                                                </span>
                                                <div>
                                                    <span className="text-[0.75rem] font-bold text-[var(--text-muted)] uppercase">{block.type} component</span>
                                                    <input type="text" value={block.title} onChange={(e) => updateBlockTitle(e.target.value)} className="block font-bold text-sm bg-transparent border-none focus:outline-none" />
                                                </div>
                                            </div>
                                            <button onClick={(e) => handleDeleteBlock(block.id, e)} className="p-[0.4rem] bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                                                🗑️ Delete
                                            </button>
                                        </div>

                                        {/* Block Config Forms */}
                                        {block.type === "quiz" && (
                                            <div className="border border-[var(--border-color)] bg-[var(--bg-primary)] p-[1.25rem] rounded-lg space-y-4">
                                                {block.quizQuestions?.map((q, qidx) => (
                                                    <div key={q.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                                                        <input type="text" value={q.question} onChange={(e) => updateQuizText(q.id, e.target.value)} className="w-full bg-transparent font-bold border-b border-dashed text-sm focus:outline-none" />
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {q.options.map((opt) => (
                                                                <div key={opt.id} className={`p-2 rounded-xl border flex items-center justify-between text-xs ${opt.isCorrect ? "bg-emerald-50 border-emerald-500" : "bg-white"}`}>
                                                                    <input type="text" value={opt.text} onChange={(e) => updateQuizOptionText(q.id, opt.id, e.target.value)} className="bg-transparent focus:outline-none" />
                                                                    <button type="button" onClick={() => toggleQuizOptionCorrect(q.id, opt.id)} className={`px-2 py-0.5 rounded text-[10px] font-bold ${opt.isCorrect ? "bg-emerald-500 text-white" : "bg-slate-100"}`}>
                                                                        {opt.isCorrect ? "Correct" : "Mark"}
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={addQuizQuestion} className="w-full py-2 bg-white border border-[var(--border-color)] rounded-xl text-xs font-bold">
                                                    + Add Question
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </main>

            {/* Right Settings panel */}
            <aside className="w-full lg:w-[25%] bg-[var(--bg-secondary)] border-t lg:border-t-0 lg:border-l border-[var(--border-color)] p-[1.5rem] flex flex-col justify-between">
                <div className="space-y-6">
                    <h2 className="text-[1.2rem] font-bold text-[var(--text-main)]">Block Settings</h2>
                    {activeBlock ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Time Estimation (min)</label>
                                <input type="number" value={activeBlock.durationMinutes} onChange={(e) => updateBlockDuration(Number(e.target.value))} className="w-full p-2 border rounded-xl text-sm" />
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-[var(--text-muted)]">Select a block component to configure properties.</p>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t">
                    {saveError && <p className="text-red-500 text-xs font-semibold mb-3">{saveError}</p>}
                    <button onClick={handleSaveChanges} disabled={saving} className="w-full py-4 bg-[#FF6B35] text-white font-bold rounded-xl transition-transform hover:-translate-y-0.5 shadow-sm text-sm disabled:opacity-55">
                        {saving ? "Saving Changes..." : "✓ Save Changes"}
                    </button>
                </div>
            </aside>

            {/* Keyboard-accessible Deletion Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title" aria-describedby="confirm-delete-desc">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg border border-slate-100">
                        <h3 id="confirm-delete-title" className="text-lg font-bold text-slate-900">Are you absolutely sure?</h3>
                        <p id="confirm-delete-desc" className="text-sm text-slate-500 mt-2">
                            This will permanently delete the course <strong className="text-slate-800">"{courseTitle}"</strong>, all its modules, and all student records. This action is irreversible.
                        </p>
                        <div className="flex gap-3 mt-6 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Yes, Delete Course
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
