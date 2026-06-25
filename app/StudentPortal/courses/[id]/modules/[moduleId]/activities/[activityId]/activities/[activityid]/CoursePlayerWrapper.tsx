"use client";
import React, { Suspense, lazy } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import InteractiveSandbox from "@/app/components/InteractiveSandbox";
import { CourseBlockConfig, VideoBlockConfig, PDFBlockConfig, QuizBlockConfig } from "@/app/lib/course.types";
import { Loader2 } from "lucide-react";
// slow loading
const VideoPlayerModule = lazy(() => import("./VideoPlayerModule"));
const PDFViewerModule = lazy(() => import("./PDFViewModule"));
// quiz view is inline btw
interface CoursePlayerWrapperProps {
    activity: {
        type: string;
        title: string;
        content: CourseBlockConfig;
        durationMinutes?: number;
    };
    onComplete: (overridePoints?: number) => void;
    submitting: boolean;
}
// skelelton
function ModuleSkeleton() {
    return (
        <div className="mt-6 space-y-4 animate-pulse" aria-label="Loading module content" aria-busy="true">
            <div className="w-full aspect-video rounded-2xl bg-[var(--bg-tertiary)]" />
            <div className="h-10 rounded-xl bg-[var(--bg-tertiary)] w-3/4 mx-auto" />
            <div className="h-10 w-40 rounded-xl bg-[var(--bg-tertiary)] mx-auto" />
        </div>
    );
}
//error bourndary
class ModuleErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError) {
            return (
                <div className="mt-6 p-8 rounded-2xl border border-red-200 bg-red-50/20 text-center" role="alert">
                    <p className="font-bold text-red-600">This module failed to load.</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Please refresh and try again, or contact your tutor.</p>
                </div>
            );
        }
        return this.props.children;
    }
}
// main component
export default function CoursePlayerWrapper({ activity, onComplete, submitting }: CoursePlayerWrapperProps) {
    const { announce } = useAccessibility();
    const { type, content } = activity;
    const renderModule = () => {
        switch (type) {
            case "video":
                return (
                    <Suspense fallback={<ModuleSkeleton />}>
                        <VideoPlayerModule
                            config={content as VideoBlockConfig}
                            onComplete={onComplete}
                            submitting={submitting}
                        />
                    </Suspense>
                );
            case "pdf":
                return (
                    <Suspense fallback={<ModuleSkeleton />}>
                        <PDFViewerModule
                            config={content as PDFBlockConfig}
                            onComplete={onComplete}
                            submitting={submitting}
                        />
                    </Suspense>
                );
            case "sandbox":
                return (
                    <div className="mt-6">
                        <InteractiveSandbox
                            config={activity.content as any}
                            onComplete={(pts) => onComplete(pts)}
                        />
                        <div className="mt-4 text-center">
                            <p className="text-[0.7rem] text-[var(--text-muted,#6B7280)] italic">
                                * The completion submit button will appear once you successfully verify the circuit setup.
                            </p>
                        </div>
                    </div>
                );
            case "quiz":
                // can import and use the exisiting quiz view
                const quizConfig = content as QuizBlockConfig;
                if (!quizConfig.quizQuestions?.length) {
                    return (
                        <div className="mt-6 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-center">
                            <p className="text-[var(--text-muted)]">No quiz questions have been added to this block yet.</p>
                        </div>
                    );
                }
                return <div className="mt-6 text-[var(--text-muted)] text-center p-6">Quiz renderer — wire in QuizView component here.</div>;
            case "storyline":
                return (
                    <div className="mt-6 space-y-4">
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center border border-[var(--border-color)]">
                            <p className="text-[var(--text-muted)] font-medium">
                                {(content as any)?.description || "Work through the storyline scenarios below."}
                            </p>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={() => onComplete(20)}
                                disabled={submitting}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
                                {submitting ? "Submitting..." : "Mark as Complete"}
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="mt-6 p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-center" role="alert">
                        <p className="text-[var(--text-muted)]">Unknown module type: <code className="font-mono bg-[var(--bg-tertiary)] px-1 rounded">{type}</code></p>
                    </div>
                );
        }
    };
    return (
        <ModuleErrorBoundary>
            {renderModule()}
        </ModuleErrorBoundary>
    );
}