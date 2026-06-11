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

            {/* content wrapper */}
            <form onSubmit={handleSave} className="space-y-[2.5rem]">
                {/* profile settings */}
                {activeTab === "profile" && (
                    <div
                        id="tabpanel-profile"
                        role="tabpanel"
                        aria-labelledby="tab-btn-profile"
                        className="space-y-[2rem] animate-fadeIn"
                    >
                        <fieldset className="space-y-[1.5rem]">
                            <legend className="sr-only">Profile Settings Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1.5rem]">
                                {/* Display Name */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="display-name" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                        Display Name
                                    </label>
                                    <input
                                        id="display-name"
                                        type="text"
                                        value={profile.displayName}
                                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                        className="w-full bg-[#F3F4F6] text-gray-900 rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none border-transparent"
                                        required
                                    />
                                </div>
                                {/* email */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="account-email" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                        Account Email (Read-Only)
                                    </label>
                                    <input
                                        id="account-email"
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full bg-gray-200 text-gray-500 rounded-lg p-[0.75rem] text-[1rem] cursor-not-allowed border-transparent focus:outline-none"
                                    />
                                </div>
                                {/* handle*/}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="tutor-handle" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                        Tutor Handle
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-[0.75rem] text-gray-500 text-[1rem] select-none">@</span>
                                        <input
                                            id="tutor-handle"
                                            type="text"
                                            value={profile.tutorHandle}
                                            disabled
                                            className="w-full bg-gray-200 text-gray-500 rounded-lg p-[0.75rem] pl-[1.75rem] text-[1rem] cursor-not-allowed border-transparent focus:outline-none"
                                        />
                                    </div>
                                </div>
                                {/*Phone */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="contact-phone" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                        Contact Phone
                                    </label>
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full bg-[#F3F4F6] text-gray-900 rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none border-transparent"
                                    />
                                </div>
                                {/* Institution */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="institution" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                        Affiliated Institution
                                    </label>
                                    <input
                                        id="institution"
                                        type="text"
                                        value={profile.institution}
                                        onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                                        className="w-full bg-[#F3F4F6] text-gray-900 rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none border-transparent"
                                    />
                                </div>
                                {/*Title */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="professional-title" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                        Professional Title
                                    </label>
                                    <input
                                        id="professional-title"
                                        type="text"
                                        value={profile.title}
                                        placeholder="e.g., Senior Electronics Lecturer"
                                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                        className="w-full bg-[#F3F4F6] text-gray-900 rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none border-transparent"
                                    />
                                </div>
                            </div>
                            {/* Expertise Tags */}
                            <div className="flex flex-col gap-[0.5rem]">
                                <label htmlFor="add-tag" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                    Expertise Tags (Press Enter to add tags)
                                </label>
                                <div className="flex flex-wrap gap-[0.5rem] bg-[#F3F4F6] p-[0.75rem] rounded-lg items-center">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-[0.35rem] bg-[#041A3E] text-white text-[0.85rem] px-[0.75rem] py-[0.25rem] rounded-full"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                aria-label={`Remove expertise tag ${tag}`}
                                                className="hover:text-red-400 focus-visible:outline-[2px] focus-visible:outline-white rounded-full p-[0.1rem]"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        id="add-tag"
                                        type="text"
                                        value={newTagInput}
                                        onChange={(e) => setNewTagInput(e.target.value)}
                                        onKeyDown={addTag}
                                        placeholder="Add area of expertise..."
                                        className="flex-grow bg-transparent text-[1rem] text-gray-900 border-none outline-none focus:ring-0 p-[0.25rem]"
                                    />
                                </div>
                            </div>
                            {/* Instructor Bio */}
                            <div className="flex flex-col gap-[0.5rem]">
                                <label htmlFor="instructor-bio" className="text-[0.95rem] font-semibold text-[#041A3E]">
                                    Short Instructor Bio
                                </label>
                                <textarea
                                    id="instructor-bio"
                                    rows={5}
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    className="w-full bg-[#F3F4F6] text-gray-900 rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none border-transparent resize-y"
                                />
                            </div>
                        </fieldset>
                    </div>
                )}

                {/* clasroom defaults */}
                {activeTab === "classroom" && (
                    <div
                        id="tabpanel-classroom"
                        role="tabpanel"
                        aria-labelledby="tab-btn-classroom"
                        className="space-y-[1.5rem] animate-fadeIn"
                    >
                        <fieldset className="border border-gray-200 p-[1.5rem] rounded-lg">
                            <legend className="text-[1.1rem] font-bold text-[#041A3E] px-[0.5rem]">Automated Workflows</legend>
                            <div className="flex items-start justify-between mt-[1rem] gap-[1.5rem]">
                                <div className="space-y-[0.25rem]">
                                    <label htmlFor="linter-toggle" className="text-[1rem] font-semibold text-gray-900 cursor-pointer">
                                        Enable Automated Courseware Compliance Linter
                                    </label>
                                    <p className="text-[0.9rem] text-gray-500">
                                        Automatically scans newly uploaded course text, videos, and images for missing descriptions,
                                        captions, or alt text attributes.
                                    </p>
                                </div>
                                {/* Accessible Toggle*/}
                                <button
                                    id="linter-toggle"
                                    type="button"
                                    role="switch"
                                    aria-checked={enableLinter}
                                    onClick={() => {
                                        setEnableLinter(!enableLinter);
                                        announce(`Automated compliance linter ${!enableLinter ? "enabled" : "disabled"}.`);
                                    }}
                                    className={`relative inline-flex h-[1.5rem] w-[2.75rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none
                    ${enableLinter ? "bg-[#FF6B35]" : "bg-gray-300"}`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-[1.25rem] w-[1.25rem] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${enableLinter ? "translate-x-[1.25rem]" : "translate-x-0"}`}
                                    />
                                </button>
                            </div>
                        </fieldset>
                    </div>
                )}

                {/* notif center*/}
                {activeTab === "notifications" && (
                    <div
                        id="tabpanel-notifications"
                        role="tabpanel"
                        aria-labelledby="tab-btn-notifications"
                        className="space-y-[2rem] animate-fadeIn"
                    >
                        {/* app alerts */}
                        <fieldset className="border border-gray-200 p-[1.5rem] rounded-lg space-y-[1rem]">
                            <legend className="text-[1.1rem] font-bold text-[#041A3E] px-[0.5rem]">In-App Alerts</legend>
                            <div className="space-y-[0.75rem]">
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notification.studentFlag}
                                        onChange={(e) => setNotifications({ ...notification, studentFlag: e.target.checked })}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] rounded border-gray-300 bg-[#F3F4F6] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Notify when a student flags a critical blocking issue inside a lesson.</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notification.scoringComplete}
                                        onChange={(e) => setNotifications({ ...notification, scoringComplete: e.target.checked })}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] rounded border-gray-300 bg-[#F3F4F6] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Notify when an assignment scoring task completes its run cycle.</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notification.discussionReply}
                                        onChange={(e) => setNotifications({ ...notification, discussionReply: e.target.checked })}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] rounded border-gray-300 bg-[#F3F4F6] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Notify when a discussion thread gets a new community reply.</span>
                                </label>
                            </div>
                        </fieldset>
                        {/* Email Frequency */}
                        <fieldset className="border border-gray-200 p-[1.5rem] rounded-lg space-y-[1rem]">
                            <legend className="text-[1.1rem] font-bold text-[#041A3E] px-[0.5rem]">Email Notification Frequency</legend>
                            <div className="space-y-[0.75rem]">
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-gray-700 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email-frequency"
                                        value="realtime"
                                        checked={emailFrequency === "realtime"}
                                        onChange={() => setEmailFrequency("realtime")}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] border-gray-300 bg-[#F3F4F6] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Real-time system alerts</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-gray-700 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email-frequency"
                                        value="digest"
                                        checked={emailFrequency === "digest"}
                                        onChange={() => setEmailFrequency("digest")}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] border-gray-300 bg-[#F3F4F6] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Daily Digest summary emails</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-gray-700 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email-frequency"
                                        value="weekly"
                                        checked={emailFrequency === "weekly"}
                                        onChange={() => setEmailFrequency("weekly")}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] border-gray-300 bg-[#F3F4F6] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Weekly technical & analytics reports</span>
                                </label>
                            </div>
                        </fieldset>
                    </div>
                )}

                {/* financials tab */}
                {activeTab === "financials" && (
                    <div
                        id="tabpanel-financials"
                        role="tabpanel"
                        aria-labelledby="tab-btn-financials"
                        className="space-y-[1.5rem] animate-fadeIn opacity-50 pointer-events-none"
                        aria-disabled="true"
                    >
                        <div className="border border-gray-200 rounded-lg p-[2rem] bg-gray-50 flex flex-col items-center justify-center text-center gap-[1.5rem]">
                            <div className="max-w-[30rem] space-y-[0.5rem]">
                                <h3 className="text-[1.25rem] font-bold text-[#041A3E]">Stripe Account Integration</h3>
                                <p className="text-[0.95rem] text-gray-500">
                                    Securely connect a Stripe account to receive automated student tuition payouts and subscriptions.
                                    Financial features will be enabled fully in a future release.
                                </p>
                            </div>
                            <button
                                type="button"
                                disabled
                                className="bg-gray-400 text-white font-medium text-[1rem] py-[0.75rem] px-[1.5rem] rounded-lg transition-colors cursor-not-allowed"
                            >
                                Connect Stripe Account (Post-MVP Release)
                            </button>
                        </div>
                    </div>
                )}

                {/* action bar */}
                {activeTab !== "financials" && (
                    <div className="flex justify-end pt-[1.5rem] border-t border-gray-200">
                        <button
                            type="submit"
                            className="bg-[#FF6B35] hover:bg-[#e05825] text-white font-semibold text-[1rem] py-[0.75rem] px-[2rem] rounded-lg transition-all duration-200 focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                        >
                            Save Changes
                        </button>
                    </div>
                )}

            </form>
        </div>
    );
}