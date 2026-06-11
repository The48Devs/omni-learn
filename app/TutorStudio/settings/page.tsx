"use client";
import React, { useState } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";

//states interface
interface ProfileData {
    displayName: string;
    email: string;
    tutorHandle: string;
    phone: string;
    institution: string;
    title: string;
    bio: string;
}

export default function TutorSettingsContent() {
    const { announce } = useAccessibility();
    const [activeTab, setActiveTab] = useState<"profile" | "classroom" | "notifications" | "financials">("profile");

    //initial session data
    const [profile, setProfile] = useState<ProfileData>({
        displayName: "Manuja Samarathunga",
        email: "manuja.work61@gmail.com",
        tutorHandle: "T-20043",
        phone: "+94710816037",
        institution: "Nalanda College",
        title: "Senior Electronics Lecturer",
        bio: "Passionate about building highly interactive learning ecosystems that align with universal accessibility design standards.",
    });

    //Expertise tas
    const [tags, setTags] = useState<string[]>
        (["Embedded Systems", "Accessible Design", "Web Accessibility", "IoT"]);
    const [newTagInput, setNewTagInput] = useState("");

    //Clasroom defaults
    const [enableLinter, setEnableLinter] = useState(true);

    //notifications
    const [notification, setNotifications] = useState({
        studentFlag: true,
        scoringComplete: true,
        discussionReply: false,
    });
    const [emailFrequency, setEmailFrequency] = useState("digest");

    //tab configurations
    const tabs = [
        { id: "profile", label: "Profile Settings", disabled: false },
        { id: "classroom", label: "Classroom Defaults", disabled: false },
        { id: "notifications", label: "Notification Center", disabled: false },
        { id: "financials", label: "Financials (MVP)", disabled: true },
    ] as const;

    const handleTabChange = (tabID: typeof activeTab) => {
        setActiveTab(tabID);
        announce(`Switched to ${tabs.find((t) => t.id === tabID)?.label} tab.`);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        announce("Tutor settings saved successfully.");
        alert("Settings saved successfully!");
    };

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(newTagInput.trim())) {
                setTags([...tags, newTagInput.trim()]);
                announce(`Added expertise tag: ${newTagInput.trim()}`);
            }
            setNewTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
        announce(`Removed expertise tag:${tag}`);
    };

    return (
        <div className="w-full max-w-[80rem] mx-auto bg-white min-h-screen text-gray-900 p-[1.5rem] md:p-[3rem] space-y-[2rem]">
            {/*Header*/}
            <header className="border-b border-gray-200 pb-[1rem0">
                <h1 className="text-[2rem] font-bold text-[#041A3E]"> Tutor Settings</h1>
                <p className="text-[1rem] text-gray-500 mt-[0.25rem">
                    Configure your personal profile settings, automated tools, notifications and payouts
                </p>
            </header>
            {/*Tabs*/}
            <nav aria-label="Settings sub-tabs">
                <ul className="flex flex-wrap border-b border-gray-200 gap-[1rem]" role="tablist">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <li key={tab.id} role="presentation">
                                <button
                                    id={`tab-btn-${tab.id}`}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`tabpanel-${tab.id}`}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`py-[0.75rem] px-[1.25rem] text-[1rem] font-medium border-b-2 transition-all duration-200 relative
                    focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none
                    ${isActive
                                            ? "border-[#041A3E] text-[#041A3E] font-semibold"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                        }
                    ${tab.disabled ? "text-gray-400 cursor-not-allowed" : ""}
                  `}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div >
    )

}