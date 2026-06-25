"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAccessibility } from "./AccessibilityContext";
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    RotateCcw,
    AlertCircle,
    Award
} from "lucide-react";

interface StorylineChoice {
    id: string;
    text: string;
    targetNodeId: string;
    syncPointsModifier: number;
}

interface StorylineNode {
    id: string;
    speakerName: string;
    speakerAvatarUrl: string;
    dialogueText: string;
    choices: StorylineChoice[];
}

interface StorylinePlayerProps {
    config?: {
        storylineTitle?: string;
        storylineIntro?: string;
        storylineNodes?: StorylineNode[];
    };
    onComplete?: (points: number) => void;
    submitting?: boolean;
}

// Rich default branching narrative in case the tutor hasn't defined nodes yet
const defaultNodes: StorylineNode[] = [
    {
        id: "start",
        speakerName: "Dr. Elena",
        speakerAvatarUrl: "👩‍🔬",
        dialogueText: "Welcome to the Lab! We are investigating an electrical power anomaly. We need to decide whether to shut down the main power grid or run a diagnostic cycle. What should we do?",
        choices: [
            { id: "c1", text: "Shut down the power grid immediately", targetNodeId: "shutdown", syncPointsModifier: 10 },
            { id: "c2", text: "Run a full system diagnostic cycle first", targetNodeId: "diagnostic", syncPointsModifier: 15 }
        ]
    },
    {
        id: "shutdown",
        speakerName: "Dr. Elena",
        speakerAvatarUrl: "👩‍🔬",
        dialogueText: "The power grid has been successfully shut down. The lab is dark, but safe. We have avoided a major overload cascade. Excellent risk mitigation!",
        choices: [] // Terminal Node
    },
    {
        id: "diagnostic",
        speakerName: "Dr. Elena",
        speakerAvatarUrl: "👩‍🔬",
        dialogueText: "The diagnostic scan completed, indicating a critical thermal overload in capacitor bank B. We must vent the excess charge or isolate the capacitor bank immediately.",
        choices: [
            { id: "c3", text: "Vent the excess charge to the emergency stack", targetNodeId: "vent", syncPointsModifier: 20 },
            { id: "c4", text: "Isolate the capacitor bank manually", targetNodeId: "isolate", syncPointsModifier: 5 }
        ]
    },
    {
        id: "vent",
        speakerName: "Dr. Elena",
        speakerAvatarUrl: "👩‍🔬",
        dialogueText: "The capacitor bank vented successfully! Power levels have stabilized, and the lab is fully operational. Exceptional decision-making skills!",
        choices: [] // Terminal Node
    },
    {
        id: "isolate",
        speakerName: "Dr. Elena",
        speakerAvatarUrl: "👩‍🔬",
        dialogueText: "Isolating the capacitor bank caused a secondary surge, triggering an emergency shutdown. The systems are offline, but structural damage was mitigated.",
        choices: [] // Terminal Node
    }
];

export default function StorylinePlayer({ config, onComplete, submitting }: StorylinePlayerProps) {
    const { announce, theme, fontProfile } = useAccessibility();

    const title = config?.storylineTitle || "Branching Learning Scenario";
    const introText = config?.storylineIntro || "Read the dialogue and make decisions to guide the narrative.";

    const nodes = useMemo(() => {
        return config?.storylineNodes && config.storylineNodes.length > 0
            ? config.storylineNodes
            : defaultNodes;
    }, [config]);

    //Traverse states
    // null represent the Scenario Intro / Cover page
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [points, setPoints] = useState<number>(0);
    const [history, setHistory] = useState<string[]>([]);
    const [pointsHistory, setPointsHistory] = useState<number[]>([]);

    // Accessibility announcement block
    const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>("");

    const currentNode = useMemo(() => {
        if (currentNodeId === null) return null;
        return nodes.find(n => n.id === currentNodeId) || null;
    }, [currentNodeId, nodes]);

    const isTerminal = useMemo(() => {
        if (currentNodeId === null) return false;
        return !currentNode || !currentNode.choices || currentNode.choices.length === 0;
    }, [currentNodeId, currentNode]);

    // Handle screen reader announcements on slide updates
    useEffect(() => {
        if (currentNodeId === null) {
            const message = `Welcome to ${title}. ${introText}. Click Enter Scenario to start.`;
            setScreenReaderAnnouncement(message);
            announce(message);
        } else if (currentNode) {
            const choicesDesc = currentNode.choices.length > 0
                ? `There are ${currentNode.choices.length} choices available below.`
                : "Scenario concluded. Use the submit button to complete the activity.";
            const message = `${currentNode.speakerName} says: ${currentNode.dialogueText} ${choicesDesc}`;
            setScreenReaderAnnouncement(message);
            announce(message);
        }
    }, [currentNodeId, currentNode, title, introText, announce]);

    const handleStart = () => {
        if (nodes.length > 0) {
            setCurrentNodeId(nodes[0].id);
            setHistory([]);
            setPointsHistory([]);
            setPoints(0);
        }
    };

    const handleChoiceSelect = (choice: StorylineChoice) => {
        if (!currentNodeId) return;
        setHistory(prev => [...prev, currentNodeId]);
        setPointsHistory(prev => [...prev, points]);
        setPoints(prev => prev + choice.syncPointsModifier);
        setCurrentNodeId(choice.targetNodeId);
    };

    const handleBack = () => {
        if (history.length === 0) {
            setCurrentNodeId(null);
            setPoints(0);
        } else {
            const prevNodeId = history[history.length - 1];
            const prevPoints = pointsHistory[pointsHistory.length - 1];

            setHistory(prev => prev.slice(0, -1));
            setPointsHistory(prev => prev.slice(0, -1));
            setPoints(prevPoints);
            setCurrentNodeId(prevNodeId);
        }
    };

    const handleRestart = () => {
        setCurrentNodeId(null);
        setPoints(0);
        setHistory([]);
        setPointsHistory([]);
        announce("Scenario restarted.");
    };

    // Adapt font styling based on Dyslexia font profile
    const textStyleClass = useMemo(() => {
        if (fontProfile === "dyslexic") {
            return "font-mono tracking-wide leading-loose text-[1rem]";
        }
        return "font-sans leading-relaxed text-[0.95rem]";
    }, [fontProfile]);

    // Adapt button colors for accessibility settings
    const choiceBtnClass = useMemo(() => {
        if (theme === "high-contrast") {
            return "w-full border-4 border-yellow-400 text-yellow-400 bg-black hover:bg-yellow-400 hover:text-black font-extrabold p-[1rem] rounded-xl text-left transition-all focus-visible:outline-4 focus-visible:outline-white";
        }
        return "w-full border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-100 hover:border-slate-500 hover:scale-[1.01] p-[1rem] rounded-xl text-left transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2";
    }, [theme]);

    return (
        <div
            className={`border border-[var(--border-color,#E5E7EB)] rounded-2xl p-[1.5rem] shadow-sm flex flex-col gap-[1.25rem] ${theme === "high-contrast" ? "bg-black border-4 border-white text-white" : "bg-[var(--bg-primary,#FFFFFF)] text-[var(--text-main,#041A3E)]"
                }`}
        >
            {/* Screen Reader Announcements Mirror */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {screenReaderAnnouncement}
            </div>

            {/* HEADER METRICS */}
            <div className="flex items-center justify-between border-b border-[var(--border-color,#E5E7EB)] pb-[0.75rem] select-none">
                <h2 className="text-[1rem] font-extrabold uppercase tracking-wider text-[var(--text-muted,#6B7280)]">
                    {title}
                </h2>
                {currentNodeId !== null && (
                    <div className="flex items-center gap-[0.5rem] text-[0.8rem] font-bold">
                        <span>🏆 Sync Score:</span>
                        <span className="text-[#FF6B35]">{points} pts</span>
                    </div>
                )}
            </div>

            {/*COVER SCREEN / SCENARIO INTRO */}
            {currentNodeId === null && (
                <div className="flex flex-col items-center text-center p-[2rem] gap-[1.5rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl">
                    <div className="w-[4rem] h-[4rem] bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-[2rem]">
                        📖
                    </div>
                    <div className="space-y-[0.5rem]">
                        <h3 className="text-[1.25rem] font-extrabold">{title}</h3>
                        <p className={`text-[var(--text-muted,#6B7280)] max-w-[30rem] ${textStyleClass}`}>
                            {introText}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleStart}
                        className="px-[2rem] py-[0.75rem] bg-[#FF6B35] hover:opacity-90 text-white font-extrabold rounded-xl transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2 shadow-md hover:scale-[1.02]"
                    >
                        Enter Scenario
                    </button>
                </div>
            )}

            {/*ACTIVE DIALOGUE DISPLAY */}
            {currentNodeId !== null && !isTerminal && currentNode && (
                <div className="flex flex-col gap-[1.25rem]">
                    {/* Speaker Header Card */}
                    <div className="flex gap-[1rem] items-start p-[1rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-2xl">
                        <div
                            className="w-[3rem] h-[3rem] rounded-full border border-[var(--border-color,#E5E7EB)] flex items-center justify-center text-[1.5rem] shrink-0 bg-gradient-to-br from-indigo-500/10 to-indigo-500/20"
                            aria-hidden="true"
                        >
                            {currentNode.speakerAvatarUrl || "👤"}
                        </div>
                        <div className="space-y-[0.25rem] flex-1">
                            <span className="inline-block text-[0.7rem] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/5 px-[0.5rem] py-[0.1rem] rounded-md">
                                {currentNode.speakerName}
                            </span>
                            <p className={textStyleClass}>
                                {currentNode.dialogueText}
                            </p>
                        </div>
                    </div>

                    {/* Choices traversals */}
                    <div className="space-y-[0.5rem]">
                        <h4 className="text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted,#6B7280)]">
                            Select your course of action:
                        </h4>
                        <div className="grid grid-cols-1 gap-[0.5rem]" role="group" aria-label="Branching Choices">
                            {currentNode.choices.map((choice) => (
                                <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() => handleChoiceSelect(choice)}
                                    className={choiceBtnClass}
                                >
                                    <div className="flex items-center justify-between gap-[0.5rem]">
                                        <span>{choice.text}</span>
                                        <ChevronRight size={16} className="shrink-0 opacity-60" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Traversal Controls */}
                    <div className="flex gap-[0.5rem] pt-[0.5rem] border-t border-[var(--border-color,#E5E7EB)]">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-[1rem] py-[0.5rem] border border-[var(--border-color,#E5E7EB)] hover:bg-[var(--bg-secondary,#F3F4F6)] text-[0.75rem] font-bold rounded-lg transition-colors flex items-center gap-[0.25rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                        >
                            <ArrowLeft size={14} /> Back
                        </button>
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="px-[1rem] py-[0.5rem] border border-[var(--border-color,#E5E7EB)] hover:bg-[var(--bg-secondary,#F3F4F6)] text-[0.75rem] font-bold rounded-lg transition-colors flex items-center gap-[0.25rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                        >
                            <RotateCcw size={14} /> Restart
                        </button>
                    </div>
                </div>
            )}

            {/*TERMINAL END NODE SCREEN */}
            {currentNodeId !== null && isTerminal && (
                <div className="flex flex-col items-center text-center p-[2rem] gap-[1.5rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl">
                    <div className="w-[4rem] h-[4rem] bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-[2rem] text-emerald-500">
                        <Award size={32} />
                    </div>
                    <div className="space-y-[0.5rem]">
                        <h3 className="text-[1.25rem] font-extrabold">Scenario Concluded</h3>
                        <p className={`text-[var(--text-muted,#6B7280)] max-w-[28rem] ${textStyleClass}`}>
                            {currentNode?.dialogueText || "You have reached the end of this branching dialogue scene. Thank you for completing the storyline!"}
                        </p>
                    </div>

                    <div className="flex items-center gap-[0.5rem] bg-emerald-500/5 border border-emerald-500/20 px-[1.25rem] py-[0.5rem] rounded-xl text-[0.8rem] font-bold text-emerald-600 dark:text-emerald-400">
                        <span>💰 Points Earned:</span>
                        <span>{points} XP</span>
                    </div>

                    <div className="flex gap-[0.5rem] w-full max-w-[20rem]">
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="flex-1 px-[1.25rem] py-[0.6rem] border border-[var(--border-color,#E5E7EB)] bg-[var(--bg-primary,#FFFFFF)] hover:bg-[var(--bg-secondary,#F3F4F6)] text-[0.8rem] font-bold rounded-xl transition-all flex items-center justify-center gap-[0.25rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                        >
                            <RotateCcw size={14} /> Restart
                        </button>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => {
                                if (onComplete) onComplete(points);
                            }}
                            className="flex-1 px-[1.25rem] py-[0.6rem] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md focus-visible:outline focus-visible:outline-3 focus-visible:outline-emerald-400 flex items-center justify-center gap-[0.25rem]"
                        >
                            <CheckCircle2 size={14} /> Submit Results
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
