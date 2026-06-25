"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAccessibility } from "./AccessibilityContext";
import {
    Check,
    X,
    AlertCircle,
    ArrowRight,
    RotateCcw,
    Award,
    Loader2
} from "lucide-react";

interface QuizOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface NormalizedQuestion {
    id: string;
    questionText: string;
    options: QuizOption[];
    type: "single" | "multi" | "text" | "boolean";
    points: number;
}

interface QuizViewProps {
    config?: any; // Accepting any structure to handle both tutor schema and mock payload safely
    onComplete?: (points: number) => void;
    submitting?: boolean;
}

export default function QuizView({ config, onComplete, submitting }: QuizViewProps) {
    const { announce, theme, fontProfile } = useAccessibility();

    // 1. Recover and parse config object in case it is loaded as stringified JSON
    const parsedConfig = useMemo(() => {
        if (!config) return null;
        if (typeof config === "string") {
            try {
                return JSON.parse(config);
            } catch (e) {
                console.error("Failed to parse quiz configuration string:", e);
                return null;
            }
        }
        return config;
    }, [config]);

    const title = parsedConfig?.title || "Quiz Knowledge Check";
    const description = parsedConfig?.description || "Answer the questions below to test your understanding of this topic.";

    // 2. Normalize tutor schema vs mock payload into a unified internal schema
    const questions = useMemo<NormalizedQuestion[]>(() => {
        const questionsList = parsedConfig?.quizQuestions || parsedConfig?.questions || [];
        return questionsList.map((q: any, idx: number) => {
            const id = q.id || `q-${idx}`;
            const questionText = q.question || q.questionText || "Question";

            let options: QuizOption[] = [];
            if (Array.isArray(q.options)) {
                options = q.options.map((opt: any, optIdx: number) => {
                    if (typeof opt === "string") {
                        // Option is a string (mock payload schema)
                        return {
                            id: `opt-${idx}-${optIdx}`,
                            text: opt,
                            isCorrect: opt.trim().toLowerCase() === q.answer?.trim().toLowerCase()
                        };
                    } else {
                        // Option is an object (tutor schema: { id, text, isCorrect })
                        return {
                            id: opt.id || `opt-${idx}-${optIdx}`,
                            text: opt.text || "",
                            isCorrect: !!opt.isCorrect
                        };
                    }
                });
            }

            // Determine question type
            let type: "single" | "multi" | "text" | "boolean" = "single";
            if (options.length === 0) {
                type = "text";
            } else {
                const correctCount = options.filter(o => o.isCorrect).length;
                if (correctCount > 1) {
                    type = "multi";
                } else if (
                    options.length === 2 &&
                    (options[0].text.toLowerCase() === "true" || options[0].text.toLowerCase() === "yes") &&
                    (options[1].text.toLowerCase() === "false" || options[1].text.toLowerCase() === "no")
                ) {
                    type = "boolean";
                }
            }

            // Default XP points per question (10 points fallback)
            const points = Number(q.points) || 10;

            return {
                id,
                questionText,
                options,
                type,
                points
            };
        });
    }, [parsedConfig]);

    // Traversal and Answer States
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [textAnswer, setTextAnswer] = useState<string>("");
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [results, setResults] = useState<Record<string, { selected: string[]; isCorrect: boolean; textValue?: string }>>({});
    const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>("");
    const [quizStarted, setQuizStarted] = useState<boolean>(false);
    const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

    const currentQuestion = useMemo<NormalizedQuestion | null>(() => {
        if (questions.length === 0 || currentIndex >= questions.length) return null;
        return questions[currentIndex];
    }, [questions, currentIndex]);

    // Announce state updates to screen readers
    useEffect(() => {
        if (!quizStarted) {
            const msg = `Quiz: ${title}. ${description}. Select Start Quiz to begin.`;
            setScreenReaderAnnouncement(msg);
            announce(msg);
        } else if (quizCompleted) {
            const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
            const msg = `Quiz finished! Your accuracy score is ${accuracy} percent. Select Submit Results to complete.`;
            setScreenReaderAnnouncement(msg);
            announce(msg);
        } else if (currentQuestion) {
            let typeDesc = "Choose one option.";
            if (currentQuestion.type === "multi") {
                typeDesc = "Select all options that apply.";
            } else if (currentQuestion.type === "text") {
                typeDesc = "Type your response in the text area.";
            }
            const msg = `Question ${currentIndex + 1} of ${questions.length}: ${currentQuestion.questionText}. ${typeDesc}`;
            setScreenReaderAnnouncement(msg);
            announce(msg);
        }
    }, [quizStarted, quizCompleted, currentIndex, currentQuestion, title, description, announce, questions.length, score]);

    // Handle interactive selections
    const handleOptionSelect = (optionId: string) => {
        if (isChecked || !currentQuestion) return;

        if (currentQuestion.type === "multi") {
            setSelectedOptions(prev =>
                prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
            );
        } else {
            setSelectedOptions([optionId]);
        }
    };

    // Evaluate answers
    const handleCheckAnswer = () => {
        if (!currentQuestion || isChecked) return;

        let isCorrect = false;
        if (currentQuestion.type === "text") {
            const correctText = currentQuestion.options[0]?.text || ""; // Fallback standard answers
            isCorrect = textAnswer.trim().toLowerCase() === correctText.trim().toLowerCase();
        } else {
            const correctIds = currentQuestion.options.filter(o => o.isCorrect).map(o => o.id);
            const isAllCorrectSelected = correctIds.every(id => selectedOptions.includes(id));
            const isNoIncorrectSelected = selectedOptions.every(id => correctIds.includes(id));
            isCorrect = isAllCorrectSelected && isNoIncorrectSelected;
        }

        if (isCorrect) {
            setScore(prev => prev + 1);
            announce("Correct answer! Well done.");
        } else {
            announce("Incorrect answer. Review correct options.");
        }

        setResults(prev => ({
            ...prev,
            [currentQuestion.id]: {
                selected: selectedOptions,
                isCorrect,
                textValue: currentQuestion.type === "text" ? textAnswer : undefined
            }
        }));

        setIsChecked(true);
    };

    // Proceed to next block
    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOptions([]);
            setTextAnswer("");
            setIsChecked(false);
        } else {
            setQuizCompleted(true);
        }
    };

    // Restart Quiz
    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedOptions([]);
        setTextAnswer("");
        setIsChecked(false);
        setScore(0);
        setResults({});
        setQuizCompleted(false);
        setQuizStarted(true);
        announce("Quiz restarted.");
    };

    // Typographical styling adaptions
    const textStyleClass = useMemo(() => {
        if (fontProfile === "dyslexic") {
            return "font-mono tracking-wide leading-loose text-[1rem]";
        }
        return "font-sans leading-relaxed text-[0.95rem]";
    }, [fontProfile]);

    const progressPercent = useMemo(() => {
        if (questions.length === 0) return 0;
        return Math.round((currentIndex / questions.length) * 100);
    }, [currentIndex, questions.length]);

    if (questions.length === 0) {
        return (
            <div className="p-[2rem] border border-[var(--border-color,#E5E7EB)] rounded-2xl bg-[var(--bg-secondary,#F3F4F6)] text-center">
                <p className="text-[var(--text-muted,#6B7280)] font-bold">No questions found in this quiz.</p>
            </div>
        );
    }

    return (
        <div
            className={`border border-[var(--border-color,#E5E7EB)] rounded-2xl p-[1.5rem] shadow-sm flex flex-col gap-[1.25rem] ${theme === "high-contrast" ? "bg-black border-4 border-white text-white" : "bg-[var(--bg-primary,#FFFFFF)] text-[var(--text-main,#041A3E)]"
                }`}
        >
            {/* Screen Reader Live Mirror */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {screenReaderAnnouncement}
            </div>

            {/* HEADER AREA */}
            <div className="flex items-center justify-between border-b border-[var(--border-color,#E5E7EB)] pb-[0.75rem] select-none">
                <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[var(--text-muted,#6B7280)]">
                    {title}
                </h2>
                {quizStarted && !quizCompleted && (
                    <div className="flex items-center gap-[0.5rem] text-[0.8rem] font-bold">
                        <span>📋 Points:</span>
                        <span className="text-[#FF6B35]">{score * 10} XP</span>
                    </div>
                )}
            </div>

            {/* INTRO SCREEN */}
            {!quizStarted && (
                <div className="flex flex-col items-center text-center p-[2rem] gap-[1.5rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl">
                    <div className="w-[4rem] h-[4rem] bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-[2rem]">
                        ✏️
                    </div>
                    <div className="space-y-[0.5rem]">
                        <h3 className="text-[1.25rem] font-extrabold">{title}</h3>
                        <p className={`text-[var(--text-muted,#6B7280)] max-w-[30rem] ${textStyleClass}`}>
                            {description}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setQuizStarted(true)}
                        className="px-[2rem] py-[0.75rem] bg-[#FF6B35] hover:opacity-90 text-white font-extrabold rounded-xl transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2 shadow-md hover:scale-[1.02]"
                    >
                        Start Quiz
                    </button>
                </div>
            )}

            {/* QUIZ ACTIVE VIEW */}
            {quizStarted && !quizCompleted && currentQuestion && (
                <div className="flex flex-col gap-[1.25rem]">
                    {/* Progress tracker */}
                    <div className="space-y-[0.4rem]">
                        <div className="flex justify-between items-center text-[0.75rem] font-bold text-[var(--text-muted,#6B7280)]">
                            <span>Question {currentIndex + 1} of {questions.length}</span>
                            <span>{progressPercent}% Complete</span>
                        </div>
                        <div className="w-full bg-[var(--bg-secondary,#F3F4F6)] h-[0.5rem] rounded-full overflow-hidden border border-[var(--border-color,#E5E7EB)]">
                            <div
                                className="bg-[#FF6B35] h-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card form */}
                    <form onSubmit={(e) => { e.preventDefault(); handleCheckAnswer(); }} className="space-y-[1.25rem]">
                        <fieldset className="space-y-[1.25rem] border-0 p-0 m-0">
                            <legend className={`text-[1.1rem] font-extrabold ${textStyleClass}`}>
                                {currentQuestion.questionText}
                            </legend>

                            {/* Option Selections */}
                            {currentQuestion.type !== "text" ? (
                                <div className="grid grid-cols-1 gap-[0.5rem]" role="group" aria-label="Question choices">
                                    {currentQuestion.options.map((opt) => {
                                        const isSelected = selectedOptions.includes(opt.id);

                                        // Colors mapping tailored to high-contrast and normal settings
                                        let borderClass = theme === "high-contrast"
                                            ? "border-4 border-white bg-black text-white"
                                            : "border-[var(--border-color,#E5E7EB)] bg-[var(--bg-primary,#FFFFFF)] text-[var(--text-main,#041A3E)]";

                                        if (isSelected) {
                                            borderClass = theme === "high-contrast"
                                                ? "border-4 border-yellow-400 text-yellow-400 bg-black"
                                                : "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]";
                                        }

                                        if (isChecked) {
                                            if (opt.isCorrect) {
                                                borderClass = theme === "high-contrast"
                                                    ? "border-4 border-emerald-400 bg-black text-emerald-400 font-extrabold"
                                                    : "border-emerald-500 bg-emerald-500/5 text-emerald-600 font-semibold";
                                            } else if (isSelected && !opt.isCorrect) {
                                                borderClass = theme === "high-contrast"
                                                    ? "border-4 border-red-500 bg-black text-red-500"
                                                    : "border-red-500 bg-red-500/5 text-red-600";
                                            }
                                        }

                                        return (
                                            <label
                                                key={opt.id}
                                                className={`flex items-center gap-[0.75rem] p-[1rem] rounded-xl cursor-pointer border transition-all select-none focus-within:ring-3 focus-within:ring-[var(--focus-ring,#FF6B35)] focus-within:ring-offset-2 ${borderClass}`}
                                            >
                                                <input
                                                    type={currentQuestion.type === "multi" ? "checkbox" : "radio"}
                                                    name={`q-${currentQuestion.id}`}
                                                    value={opt.id}
                                                    checked={isSelected}
                                                    onChange={() => handleOptionSelect(opt.id)}
                                                    disabled={isChecked}
                                                    className="sr-only" // Native element accessible via keyboard focus
                                                />
                                                {/* Visual Selector indicator */}
                                                <div
                                                    className={`w-[1.25rem] h-[1.25rem] flex items-center justify-center shrink-0 border-2 ${currentQuestion.type === "multi" ? "rounded-md" : "rounded-full"
                                                        } ${isSelected
                                                            ? theme === "high-contrast" ? "border-yellow-400" : "border-[#FF6B35]"
                                                            : "border-[var(--border-color,#E5E7EB)]"
                                                        }`}
                                                    aria-hidden="true"
                                                >
                                                    {isSelected && (
                                                        <div
                                                            className={`w-[0.6rem] h-[0.6rem] ${currentQuestion.type === "multi" ? "rounded-sm" : "rounded-full"
                                                                } ${theme === "high-contrast" ? "bg-yellow-400" : "bg-[#FF6B35]"
                                                                }`}
                                                        />
                                                    )}
                                                </div>

                                                <span className="flex-1 text-[0.95rem]">{opt.text}</span>

                                                {/* Correctness indicators */}
                                                {isChecked && opt.isCorrect && (
                                                    <span className="flex items-center gap-[0.25rem] text-[0.75rem] font-bold text-emerald-600">
                                                        <Check size={16} /> Correct
                                                    </span>
                                                )}
                                                {isChecked && isSelected && !opt.isCorrect && (
                                                    <span className="flex items-center gap-[0.25rem] text-[0.75rem] font-bold text-red-500">
                                                        <X size={16} /> Incorrect
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="space-y-[0.5rem]">
                                    <textarea
                                        value={textAnswer}
                                        onChange={(e) => setTextAnswer(e.target.value)}
                                        disabled={isChecked}
                                        placeholder="Type your response here..."
                                        rows={4}
                                        className={`w-full p-[1rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:outline-none resize-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2 ${theme === "high-contrast" ? "bg-black border-white text-white" : ""
                                            } ${textStyleClass}`}
                                    />
                                    {isChecked && (
                                        <div className={`p-[1rem] rounded-xl border text-[0.85rem] ${results[currentQuestion.id]?.isCorrect
                                                ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-600"
                                                : "bg-red-500/5 border-red-500/30 text-red-500"
                                            }`}>
                                            <p className="font-extrabold mb-[0.25rem]">
                                                {results[currentQuestion.id]?.isCorrect ? "✓ Correct Answer" : "✗ Incorrect Answer"}
                                            </p>
                                            <p>Expected: <span className="underline italic">{currentQuestion.options[0]?.text || "Your tutor's response"}</span></p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </fieldset>

                        {/* Submit / Navigation triggers */}
                        <div className="flex justify-end gap-[0.5rem] pt-[0.5rem] border-t border-[var(--border-color,#E5E7EB)]">
                            {!isChecked ? (
                                <button
                                    type="submit"
                                    disabled={currentQuestion.type === "text" ? !textAnswer.trim() : selectedOptions.length === 0}
                                    className="px-[2rem] py-[0.75rem] bg-[#FF6B35] disabled:opacity-50 hover:opacity-90 text-white font-extrabold rounded-xl transition-all focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-[2rem] py-[0.75rem] bg-[#FF6B35] hover:opacity-90 text-white font-extrabold rounded-xl transition-all flex items-center gap-[0.25rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2"
                                >
                                    {currentIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* COMPLETION SUMMARY SCREEN */}
            {quizCompleted && (
                <div className="flex flex-col items-center text-center p-[2rem] gap-[1.5rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl">
                    <div className="w-[4rem] h-[4rem] bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-[2rem] text-emerald-500">
                        <Award size={32} />
                    </div>

                    <div className="space-y-[0.5rem]">
                        <h3 className="text-[1.25rem] font-extrabold">Quiz Completed!</h3>
                        <p className={`text-[var(--text-muted,#6B7280)] max-w-[28rem] ${textStyleClass}`}>
                            You have completed all questions. Review your performance breakdown below.
                        </p>
                    </div>

                    {/* Stat Breakdown Grid */}
                    <div className="grid grid-cols-2 gap-[1rem] w-full max-w-[22rem]">
                        <div className="p-[1rem] border border-[var(--border-color,#E5E7EB)] rounded-2xl bg-[var(--bg-primary,#FFFFFF)]">
                            <span className="block text-[0.7rem] font-bold text-[var(--text-muted,#6B7280)] uppercase tracking-wider">Correct</span>
                            <span className="text-[1.5rem] font-extrabold text-emerald-600">{score} / {questions.length}</span>
                        </div>
                        <div className="p-[1rem] border border-[var(--border-color,#E5E7EB)] rounded-2xl bg-[var(--bg-primary,#FFFFFF)]">
                            <span className="block text-[0.7rem] font-bold text-[var(--text-muted,#6B7280)] uppercase tracking-wider">Accuracy</span>
                            <span className="text-[1.5rem] font-extrabold text-[#FF6B35]">
                                {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%
                            </span>
                        </div>
                    </div>

                    {/* Detailed Review List */}
                    <div className="w-full text-left max-h-[12rem] overflow-y-auto border border-[var(--border-color,#E5E7EB)] rounded-xl bg-[var(--bg-primary,#FFFFFF)] p-[0.75rem] space-y-[0.5rem] select-none">
                        <p className="text-[0.75rem] font-bold text-[var(--text-muted,#6B7280)] uppercase pb-[0.25rem] border-b border-[var(--border-color,#E5E7EB)]">
                            Question Breakdown
                        </p>
                        {questions.map((q, idx) => {
                            const correct = results[q.id]?.isCorrect;
                            return (
                                <div key={q.id} className="flex justify-between items-center text-[0.8rem] py-[0.25rem] border-b border-[var(--border-color,#E5E7EB)]/50 last:border-0">
                                    <span className="truncate max-w-[70%] text-[var(--text-main,#041A3E)]">
                                        {idx + 1}. {q.questionText}
                                    </span>
                                    <span className={`font-bold flex items-center gap-[0.25rem] ${correct ? "text-emerald-600" : "text-red-500"}`}>
                                        {correct ? <Check size={14} /> : <X size={14} />}
                                        {correct ? "Correct" : "Incorrect"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Completion actions */}
                    <div className="flex gap-[0.5rem] w-full max-w-[22rem]">
                        <button
                            type="button"
                            onClick={handleRestart}
                            className="flex-1 px-[1.25rem] py-[0.6rem] border border-[var(--border-color,#E5E7EB)] bg-[var(--bg-primary,#FFFFFF)] hover:bg-[var(--bg-secondary,#F3F4F6)] text-[0.8rem] font-bold rounded-xl transition-all flex items-center justify-center gap-[0.25rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                        >
                            <RotateCcw size={14} /> Retry
                        </button>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => {
                                const earnedXP = score * 10;
                                if (onComplete) onComplete(earnedXP);
                            }}
                            className="flex-1 px-[1.25rem] py-[0.6rem] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md focus-visible:outline focus-visible:outline-3 focus-visible:outline-emerald-400 flex items-center justify-center gap-[0.25rem]"
                        >
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            Submit Results
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
