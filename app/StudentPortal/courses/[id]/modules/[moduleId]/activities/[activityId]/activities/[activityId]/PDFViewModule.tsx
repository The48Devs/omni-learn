"use client";
import React, { useState } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { PDFBlockConfig } from "@/app/lib/course.types";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, CheckCircle, Loader2, Lock } from "lucide-react";
interface PDFViewerModuleProps {
    config: PDFBlockConfig;
    onComplete: (points?: number) => void;
    submitting: boolean;
}
export default function PDFViewerModule({ config, onComplete, submitting }: PDFViewerModuleProps) {
    const { announce } = useAccessibility();
    const totalPages = config.totalPages ?? 1;
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(config.defaultZoom);
    // Track furthest-read page for sequential enforcement
    const [furthestPage, setFurthestPage] = useState(1);
    const canGoForward = currentPage < totalPages &&
        (!config.forceSequentialReading || currentPage <= furthestPage);
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        // Sequential reading
        if (config.forceSequentialReading && page > furthestPage + 1) {
            announce("Sequential reading is enabled. Please read pages in order.");
            return;
        }
        setCurrentPage(page);
        if (page > furthestPage) setFurthestPage(page);
        announce(`Page ${page} of ${totalPages}.`);
    };
    const changeZoom = (delta: number) => {
        const levels = [75, 100, 125, 150] as const;
        const idx = levels.indexOf(zoom);
        const nextIdx = Math.max(0, Math.min(levels.length - 1, idx + delta));
        setZoom(levels[nextIdx]);
        announce(`Zoom set to ${levels[nextIdx]}%.`);
    };
    const hasReadAll = currentPage === totalPages || furthestPage >= totalPages;
    return (
        <div className="mt-6 space-y-4" aria-label={`PDF Module: ${config.title}`}>
            {/* Toolbar */}
            <div
                className="flex items-center flex-wrap gap-3 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
                role="toolbar"
                aria-label="PDF viewer controls"
            >
                {/* Page navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-main)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-bold text-[var(--text-main)] select-none" aria-live="polite" aria-atomic="true">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={!canGoForward}
                        className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed text-[var(--text-main)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className="h-4 w-px bg-[var(--border-color)]" aria-hidden="true" />
                {/* Zoom */}
                <div className="flex items-center gap-2">
                    <button onClick={() => changeZoom(-1)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]" aria-label="Zoom out">
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-sm font-bold text-[var(--text-main)] w-12 text-center">{zoom}%</span>
                    <button onClick={() => changeZoom(1)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]" aria-label="Zoom in">
                        <ZoomIn size={16} />
                    </button>
                </div>
                <div className="flex-1" />
                {/* Sequential reading badge */}
                {config.forceSequentialReading && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full font-bold">
                        <Lock size={10} /> Sequential Reading
                    </div>
                )}
                {/* Download*/}
                {config.allowDownload && (
                    <a
                        href={config.fileUrl}
                        download={config.fileName}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 px-2.5 py-1.5 rounded-lg hover:bg-blue-50/20 transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                        aria-label={`Download ${config.fileName}`}
                        onClick={() => announce(`Downloading ${config.fileName}.`)}
                    >
                        <Download size={14} /> Download
                    </a>
                )}
            </div>
            {/* PDF Embed Frame */}
            <div
                className="w-full rounded-2xl overflow-hidden border border-[var(--border-color)] bg-slate-950"
                style={{ height: "70vh" }}
            >
                <iframe
                    src={`${config.fileUrl}#page=${currentPage}&zoom=${zoom}`}
                    className="w-full h-full"
                    title={config.title}
                    aria-label={`PDF viewer for ${config.title}, page ${currentPage} of ${totalPages}`}
                    style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left", width: `${10000 / zoom}%`, height: `${10000 / zoom}%` }}
                />
            </div>
            {/* Sequential progress indicator */}
            {config.forceSequentialReading && (
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[var(--text-muted)]">
                        <span>Reading Progress</span>
                        <span>{Math.round((furthestPage / totalPages) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${(furthestPage / totalPages) * 100}%` }}
                            role="progressbar"
                            aria-valuenow={furthestPage}
                            aria-valuemin={1}
                            aria-valuemax={totalPages}
                            aria-label="PDF reading progress"
                        />
                    </div>
                </div>
            )}
            {/* Complete Button */}
            <div className="text-center">
                {!hasReadAll && config.forceSequentialReading && (
                    <p className="text-sm text-[var(--text-muted)] mb-2">
                        Read all {totalPages} pages to unlock completion.
                    </p>
                )}
                <button
                    onClick={() => onComplete(15)}
                    disabled={(!hasReadAll && config.forceSequentialReading) || submitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                    aria-label="Mark PDF as complete"
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    {submitting ? "Submitting..." : "Mark as Complete"}
                </button>
            </div>
        </div>
    );
}