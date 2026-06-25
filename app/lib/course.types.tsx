export interface VideoBlockConfig {
    type: "video";
    title: string;
    videoUrl: string;          // Direct URL or Firebase Storage URL
    thumbnailUrl?: string;
    captionUrl?: string;       // .vtt subtitle file URL
    description?: string;
    allowPlaybackControl: boolean;  // If false, no seeking
    durationMinutes: number;
}
export interface PDFBlockConfig {
    type: "pdf";
    title: string;
    fileUrl: string;           // Firebase Storage URL to the PDF
    fileName: string;
    allowDownload: boolean;    // Tutor toggle
    forceSequentialReading: boolean; // Locks pages — student can't jump ahead
    defaultZoom: 75 | 100 | 125 | 150; // Default zoom level
    totalPages?: number;       // Populated after upload
    durationMinutes: number;
}
export interface QuizQuestion {
    question: string;
    options?: string[];        // If present → radio buttons; if absent → textarea
    answer: string;
}
export interface QuizBlockConfig {
    type: "quiz";
    title: string;
    quizQuestions: QuizQuestion[];
    description?: string;
    durationMinutes: number;
}
export interface SandboxBlockConfig {
    type: "sandbox";
    title: string;
    description?: string;
    scenarioId?: string;       // For future scenario-based sandboxes
    durationMinutes: number;
}
export interface StorylineBlockConfig {
    type: "storyline";
    title: string;
    description?: string;
    slides?: {
        id: string;
        content: string;
        imageUrl?: string;
        choices?: { label: string; nextSlideId: string }[];
    }[];
    durationMinutes: number;
}
//block congfigs
export type CourseBlockConfig =
    | VideoBlockConfig
    | PDFBlockConfig
    | QuizBlockConfig
    | SandboxBlockConfig
    | StorylineBlockConfig;
// typed activity data
export interface TypedActivityData<T extends CourseBlockConfig = CourseBlockConfig> {
    id?: string;
    type: T["type"];
    title: string;
    courseId: string;
    moduleId: string;
    orgId: string;
    content: T;
    durationMinutes: number;
    maxPoints: number;
    createdAt: string;
    updatedAt: string;
}
// playload for course creations
export interface CoursePayload {
    title: string;
    description: string;
    subject: string;
    orgId: string;
    ownerId: string;
    modules: Record<
        string,
        {
            id: string;
            index: number;
            title: string;
            duration: string;
            blocks: CourseBlockConfig[];
        }
    >;
}
// progress analytics
export interface StudentProgressPayload {
    studentId: string;
    courseId: string;
    completedActivityIds: string[];
    totalXp: number;
    currentLevel: number;
    lastActiveAt: string;
    accuracyByActivity: Record<string, number>;
}