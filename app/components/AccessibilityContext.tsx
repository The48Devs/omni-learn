"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type AccessibilityTheme = "default" | "high-contrast" | "protanopia" | "deuteranopia" | "tritanopia";
export type FontProfile = "default" | "dyslexic";
export type FocusProfile = "standard" | "distraction-free";
export type TextScale = 100 | 125 | 150 | 200;

interface AccessibilityContextType {
    theme: AccessibilityTheme;
    fontProfile: FontProfile;
    textScale: TextScale;
    focusProfile: FocusProfile;
    ariaLiveMessage: string;
    isToolbarOpen: boolean;
    setTheme: (theme: AccessibilityTheme) => void;
    setFontProfile: (profile: FontProfile) => void;
    setTextScale: (scale: TextScale) => void;
    setFocusProfile: (profile: FocusProfile) => void;
    announce: (message: string) => void;
    toggleToolbar: () => void;
    setIsToolbarOpen: (open: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<AccessibilityTheme>("default");
    const [fontProfile, setFontProfileState] = useState<FontProfile>("default");
    const [textScale, setTextScaleState] = useState<TextScale>(100);
    const [focusProfile, setFocusProfileState] = useState<FocusProfile>("standard");
    const [ariaLiveMessage, setAriaLiveMessage] = useState("");
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const savedTheme = localStorage.getItem("acc-theme") as AccessibilityTheme;
        const savedFont = localStorage.getItem("acc-font") as FontProfile;
        const savedScale = Number(localStorage.getItem("acc-scale")) as TextScale;
        const savedFocus = localStorage.getItem("acc-focus") as FocusProfile;

        if (savedTheme) setThemeState(savedTheme);
        if (savedFont) setFontProfileState(savedFont);
        if (savedScale && [100, 125, 150, 200].includes(savedScale)) setTextScaleState(savedScale);
        if (savedFocus) setFocusProfileState(savedFocus);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-font", fontProfile);
        document.documentElement.setAttribute("data-focus-profile", focusProfile);
        document.documentElement.style.setProperty("--text-scale", `${textScale}%`);
    }, [theme, fontProfile, focusProfile, textScale]);

    // Accessibility Announcement helper (triggers screen reader reading queue)
    const announce = useCallback((message: string) => {
        setAriaLiveMessage(""); // Clear out buffer to force re-render announcement
        setTimeout(() => {
            setAriaLiveMessage(message);
        }, 50);
    }, []);

    const setTheme = (newTheme: AccessibilityTheme) => {
        setThemeState(newTheme);
        localStorage.setItem("acc-theme", newTheme);
        announce(`Theme changed to ${newTheme.replace("-", " ")}.`);
    };

    const setFontProfile = (newFont: FontProfile) => {
        setFontProfileState(newFont);
        localStorage.setItem("acc-font", newFont);
        announce(newFont === "dyslexic" ? "Font changed to OpenDyslexic. Text may appear larger." : "Font changed to default sans-serif.");
    };

    const setTextScale = (newScale: TextScale) => {
        setTextScaleState(newScale);
        localStorage.setItem("acc-scale", String(newScale));
        announce(`Text size set to ${newScale}%.`);
    };

    const setFocusProfile = (newFocus: FocusProfile) => {
        setFocusProfileState(newFocus);
        localStorage.setItem("acc-focus", newFocus);
        announce(newFocus === "distraction-free" ? "Distraction-free mode enabled." : "Standard mode enabled.");
    };

    const toggleToolbar = useCallback(() => {
        setIsToolbarOpen(prev => !prev);

    }, []);

    useEffect(() => {
        const handlekeyDown = (e: KeyboardEvent) => {
            if (e.altKey && (e.code == "KeyA" || e.key.toLocaleLowerCase() == "a")) {
                e.preventDefault();
                toggleToolbar();
                announce("Accessibility Settings toolbar toggled.");
            }

        };
        window.addEventListener("keydown", handlekeyDown);
        return () =>
            window.removeEventListener("keydown", handlekeyDown);
    }, [toggleToolbar, announce]);

    return (
        <AccessibilityContext.Provider
            value={{
                theme,
                fontProfile,
                textScale,
                focusProfile,
                ariaLiveMessage,
                isToolbarOpen,
                setTheme,
                setFontProfile,
                setTextScale,
                setFocusProfile,
                announce,
                toggleToolbar,
                setIsToolbarOpen,
            }}
        >
            {children}
            {/* Absolute Screen Reader-Only announcements element */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                style={{
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    padding: "0",
                    margin: "-1px",
                    overflow: "hidden",
                    clip: "rect(0, 0, 0, 0)",
                    whiteSpace: "nowrap",
                    borderWidth: "0",
                }}
            >
                {ariaLiveMessage}
            </div>
        </AccessibilityContext.Provider>
    );
}
export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
}