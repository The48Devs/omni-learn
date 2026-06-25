"use client";

import React, { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { QuizBlockConfig } from "@/app/lib/course.types";

interface QuizViewProps {
    config: QuizBlockConfig;
    onComplete: (points?: number) => void;
    submitting: boolean;
}

export default function QuizView({ config, onComplete, submitting }: QuizViewProps) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const questions = config.quizQuestions || [];

    const handleSubmit = () => {
        setSubmitted(true);
        const correct = questions.filter((q, i) =>
            answers[i]?.trim().toLowerCase() === q.answer?.trim().toLowerCase()
        ).length;

        const accuracy = questions.length > 0 ? (correct / questions.length) * 100 : 0;
        // accuracy is used by completeActivity via handleComplete's overridePoints mapping
        // handleComplete in page.tsx: accuracy = overridePoints ? Math.round((overridePoints / 30) * 100) : 100
        // So we pass points equivalent to accuracy out of 30.
        // Wait, the page.tsx expects overridePoints out of 30 if we want to influence accuracy.
        // If we pass 10 here, page.tsx will calculate accuracy as (10/30)*100 = 33%.
        // So we should pass the accuracy percentage scaled to 30.
        const accuracyScaledTo30 = Math.round((accuracy / 100) * 30);
        onComplete(accuracyScaledTo30);
    };

    const allAnswered = questions.every((_, i) => answers[i]?.trim());

    if (questions.length === 0) {
        return (
            <div className="mt-6 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-center">
                <p className="text-[var(--text-muted)]">No quiz questions have been added to this block yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-6">
            {questions.map((q, i) => (
                <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-5 border border-[var(--border-color)]">
                    <p className="font-bold text-[var(--text-main)] mb-3">{i + 1}. {q.question}</p>
                    {q.options && q.options.length > 0 ? (
                        <div className="space-y-2">
                            {q.options.map((opt: string, oi: number) => (
                                <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${answers[i] === opt ? 'bg-blue-500/10 border border-blue-500/50' : 'bg-[var(--bg-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]'}`}>
                                    <input
                                        type="radio"
                                        name={`q-${i}`}
                                        value={opt}
                                        checked={answers[i] === opt}
                                        onChange={() => setAnswers({ ...answers, [i]: opt })}
                                        disabled={submitting || submitted}
                                        className="text-blue-600"
                                    />
                                    <span className="text-sm text-[var(--text-main)]">{opt}</span>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <textarea
                            value={answers[i] || ''}
                            onChange={e => setAnswers({ ...answers, [i]: e.target.value })}
                            disabled={submitting || submitted}
                            className="w-full p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[var(--text-main)]"
                            rows={3}
                            placeholder="Your answer..."
                        />
                    )}
                </div>
            ))}
            <div className="text-center">
                <button
                    onClick={handleSubmit}
                    disabled={!allAnswered || submitting || submitted}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    {submitting ? 'Submitting...' : 'Submit Answers'}
                </button>
            </div>
        </div>
    );
}
