"use client";

import { useAccessibility, AccessibilityTheme, TextScale } from "./AccessibilityContext";

export default function AccessibilityToolbar() {
    const {
        theme,
        fontProfile,
        textScale,
        focusProfile,
        isToolbarOpen,
        setTheme,
        setFontProfile,
        setTextScale,
        setFocusProfile,
        setIsToolbarOpen,
    } = useAccessibility();

    if (!isToolbarOpen) {
        return (
            <button
                onClick={() => setIsToolbarOpen(true)}
                className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#f95738] text-white hover:bg-orange-600 rounded-full font-bold shadow-lg transition-transform focus:scale-105 active:scale-95 cursor-pointer"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-label="Open Accessibility Settings Toolbar"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Accessibility Toolbar</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 ml-2 text-xs bg-orange-800/30 rounded border border-white/20">Alt+A</kbd>
            </button>
        );
    }

    const themesList: { value: AccessibilityTheme; label: string }[] = [
        { value: "default", label: "Default Theme" },
        { value: "high-contrast", label: "High Contrast (AAA)" },
        { value: "protanopia", label: "Protanopia Filter" },
        { value: "deuteranopia", label: "Deuteranopia Filter" },
        { value: "tritanopia", label: "Tritanopia Filter" },
    ];

    const fontScales: TextScale[] = [100, 125, 150, 200];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
                onClick={() => setIsToolbarOpen(false)}
            />

            {/* Settings Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="toolbar-title"
                className="fixed top-0 right-0 z-50 h-screen w-80 max-w-full bg-[var(--bg-primary)] text-[var(--text-main)] shadow-2xl border-l border-[var(--border-color)] overflow-y-auto flex flex-col p-6 animate-slide-in"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
                    <div>
                        <h2 id="toolbar-title" className="text-xl font-extrabold tracking-tight">Accessibility</h2>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Press <kbd className="font-bold">Alt+A</kbd> to toggle toolbar</p>
                    </div>
                    <button
                        onClick={() => setIsToolbarOpen(false)}
                        className="p-2 hover:bg-[var(--bg-secondary)] rounded-full text-[var(--text-main)] focus:outline-hidden"
                        aria-label="Close settings"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-6">

                    {/* 1. Theme Configuration */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Theme Selection</h3>
                        <div className="grid grid-cols-1 gap-2" role="group" aria-label="Select Color Theme">
                            {themesList.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setTheme(t.value)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border cursor-pointer ${theme === t.value
                                        ? "border-[var(--focus-ring-color)] bg-[var(--bg-secondary)] text-[var(--focus-ring-color)] shadow-xs"
                                        : "border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
                                        }`}
                                    aria-pressed={theme === t.value}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Text Scaling */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Text Scale</h3>
                        <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Select Text Scale Percentage">
                            {fontScales.map((scale) => (
                                <button
                                    key={scale}
                                    onClick={() => setTextScale(scale)}
                                    className={`py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${textScale === scale
                                        ? "border-[var(--focus-ring-color)] bg-[var(--bg-secondary)] text-[var(--focus-ring-color)]"
                                        : "border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
                                        }`}
                                    aria-pressed={textScale === scale}
                                >
                                    {scale}%
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Dyslexia Typography Toggle */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Dyslexia Support</h3>
                        <div className="flex justify-between items-center p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                            <label htmlFor="dyslexic-font-toggle" className="text-sm font-bold cursor-pointer">
                                OpenDyslexic Font
                            </label>
                            <button
                                id="dyslexic-font-toggle"
                                onClick={() => setFontProfile(fontProfile === "dyslexic" ? "default" : "dyslexic")}
                                role="switch"
                                aria-checked={fontProfile === "dyslexic"}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${fontProfile === "dyslexic" ? "bg-[var(--success-accent)]" : "bg-gray-300"
                                    }`}
                            >
                                <span className="sr-only">Toggle OpenDyslexic Font</span>
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${fontProfile === "dyslexic" ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* 4. Focus Mode Configuration */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Distraction Controls</h3>
                        <div className="flex justify-between items-center p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                            <div>
                                <label htmlFor="focus-mode-toggle" className="text-sm font-bold cursor-pointer block">
                                    Focus Mode
                                </label>
                                <span className="text-[10px] text-[var(--text-muted)]">Hides banners & simplifies layout</span>
                            </div>
                            <button
                                id="focus-mode-toggle"
                                onClick={() => setFocusProfile(focusProfile === "distraction-free" ? "standard" : "distraction-free")}
                                role="switch"
                                aria-checked={focusProfile === "distraction-free"}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${focusProfile === "distraction-free" ? "bg-[var(--success-accent)]" : "bg-gray-300"
                                    }`}
                            >
                                <span className="sr-only">Toggle Focus Mode</span>
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${focusProfile === "distraction-free" ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
