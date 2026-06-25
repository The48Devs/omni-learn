"use client";
import React, { useState, useRef } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { PDFBlockConfig } from "@/app/lib/course.types";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
interface PDFBlockEditorProps {
    initialConfig?: Partial<PDFBlockConfig>;
    onChange: (config: PDFBlockConfig) => void;
}
export default function PDFBlockEditor({ initialConfig, onChange }: PDFBlockEditorProps) {
    const { announce } = useAccessibility();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // local block states
    const [title, setTitle] = useState(initialConfig?.title ?? "");
    const [fileName, setFileName] = useState(initialConfig?.fileName ?? "");
    const [fileUrl, setFileUrl] = useState(initialConfig?.fileUrl ?? "");      // In production: Firebase Storage URL
    const [allowDownload, setAllowDownload] = useState(initialConfig?.allowDownload ?? true);
    const [forceSequential, setForceSequential] = useState(initialConfig?.forceSequentialReading ?? false);
    const [defaultZoom, setDefaultZoom] = useState<PDFBlockConfig["defaultZoom"]>(initialConfig?.defaultZoom ?? 100);
    const [durationMinutes, setDurationMinutes] = useState(initialConfig?.durationMinutes ?? 15);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const emitChange = (overrides: Partial<PDFBlockConfig> = {}) => {
        const config: PDFBlockConfig = {
            type: "pdf",
            title: overrides.title ?? title,
            fileUrl: overrides.fileUrl ?? fileUrl,
            fileName: overrides.fileName ?? fileName,
            allowDownload: overrides.allowDownload ?? allowDownload,
            forceSequentialReading: overrides.forceSequentialReading ?? forceSequential,
            defaultZoom: overrides.defaultZoom ?? defaultZoom,
            durationMinutes: overrides.durationMinutes ?? durationMinutes,
        };
        onChange(config);
    };
    // file handling *needs to replace with firebase file handling
    const handleFileSelect = (file: File) => {
        setUploadError("");
        if (file.type !== "application/pdf") {
            setUploadError("Only PDF files are accepted.");
            announce("Error: Only PDF files are accepted.");
            return;
        }
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            setUploadError("File must be under 50MB.");
            announce("Error: File must be under 50MB.");
            return;
        }
        // !!!!!!!! TODO: Replace with Firebase Storage upload logic
        // const storageRef = ref(storage, `courses/pdfs/${uuid()}`);
        // const snapshot = await uploadBytes(storageRef, file);
        // const url = await getDownloadURL(snapshot.ref);
        const mockUrl = URL.createObjectURL(file);
        setFileName(file.name);
        setFileUrl(mockUrl);
        announce(`PDF uploaded: ${file.name}`);
        emitChange({ fileName: file.name, fileUrl: mockUrl });
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };
    // toggle helper
    const Toggle = ({
        id, label, description, checked, onToggle,
    }: { id: string; label: string; description: string; checked: boolean; onToggle: (v: boolean) => void }) => (
        <div className="flex items-start justify-between gap-4 py-3 border-b border-[var(--border-color)] last:border-0">
            <div className="flex-1">
                <label htmlFor={id} className="text-sm font-semibold text-[var(--text-main)] cursor-pointer">
                    {label}
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
            </div>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => { onToggle(!checked); emitChange(); }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 ${checked ? "bg-blue-600" : "bg-[var(--bg-tertiary)]"
                    }`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                        }`}
                />
                <span className="sr-only">{checked ? "On" : "Off"}</span>
            </button>
        </div>
    );
    return (
        <div
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] overflow-hidden"
            aria-label="PDF Block Editor"
        >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <FileText className="text-orange-500" size={20} />
                <h3 className="font-extrabold text-[var(--text-main)] text-sm tracking-tight">PDF Block</h3>
                <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                    Document Module
                </span>
            </div>
            <div className="p-5 space-y-5">
                {/* Block Title */}
                <div>
                    <label htmlFor="pdf-block-title" className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                        Block Title
                    </label>
                    <input
                        id="pdf-block-title"
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); emitChange({ title: e.target.value }); }}
                        placeholder="e.g. Chapter 3: Reference Sheet"
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] focus:outline focus:outline-3 focus:outline-[var(--focus-ring-color,#2563eb)] focus:outline-offset-1 placeholder:text-[var(--text-muted)]"
                    />
                </div>
                {/* File Upload Zone */}
                <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                        PDF File
                    </label>
                    {fileUrl ? (
                        <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl">
                            <FileText className="text-orange-500 shrink-0" size={20} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[var(--text-main)] truncate">{fileName}</p>
                                <p className="text-xs text-[var(--text-muted)]">PDF uploaded successfully</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setFileName(""); setFileUrl(""); emitChange({ fileName: "", fileUrl: "" }); }}
                                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                                aria-label="Remove uploaded PDF"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${isDragging
                                ? "border-blue-500 bg-blue-50/10"
                                : "border-[var(--border-color)] hover:border-blue-400 bg-[var(--bg-secondary)]"
                                }`}
                            role="button"
                            tabIndex={0}
                            aria-label="Drop PDF here or click to upload"
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                        >
                            <UploadCloud className="mx-auto text-[var(--text-muted)] mb-2" size={28} />
                            <p className="text-sm font-semibold text-[var(--text-main)]">
                                {isDragging ? "Release to upload" : "Drop PDF here or click to browse"}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">PDF only · Max 50MB</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                className="sr-only"
                                aria-hidden="true"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                            />
                        </div>
                    )}
                    {uploadError && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-red-600" role="alert">
                            <AlertCircle size={12} /> {uploadError}
                        </div>
                    )}
                </div>
                {/* Tutor Controls */}
                <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 divide-y divide-[var(--border-color)]">
                    <Toggle
                        id="pdf-allow-download"
                        label="Allow Student Download"
                        description="Students can download this PDF to their device."
                        checked={allowDownload}
                        onToggle={(v) => { setAllowDownload(v); emitChange({ allowDownload: v }); }}
                    />
                    <Toggle
                        id="pdf-force-sequential"
                        label="Force Sequential Reading"
                        description="Students cannot jump ahead — must read pages in order."
                        checked={forceSequential}
                        onToggle={(v) => { setForceSequential(v); emitChange({ forceSequentialReading: v }); }}
                    />
                </div>
                {/* Zoom & Duration */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="pdf-default-zoom" className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                            Default Zoom
                        </label>
                        <select
                            id="pdf-default-zoom"
                            value={defaultZoom}
                            onChange={(e) => {
                                const z = Number(e.target.value) as PDFBlockConfig["defaultZoom"];
                                setDefaultZoom(z);
                                emitChange({ defaultZoom: z });
                            }}
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] focus:outline focus:outline-3 focus:outline-[var(--focus-ring-color,#2563eb)]"
                        >
                            <option value={75}>75%</option>
                            <option value={100}>100% (Default)</option>
                            <option value={125}>125%</option>
                            <option value={150}>150%</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="pdf-duration" className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide">
                            Est. Duration (min)
                        </label>
                        <input
                            id="pdf-duration"
                            type="number"
                            min={1} max={120}
                            value={durationMinutes}
                            onChange={(e) => { setDurationMinutes(Number(e.target.value)); emitChange({ durationMinutes: Number(e.target.value) }); }}
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-main)] focus:outline focus:outline-3 focus:outline-[var(--focus-ring-color,#2563eb)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}