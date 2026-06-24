"use client";
import React, { useState } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { useAuth } from "@/app/components/AuthCOntext";

// use data interace
interface ProfileData {
    fullName: string;
    email: string;
    tutorHandle: string;
    institution: string;
    mobile: string;
    bio: string;
    tags: string[];
}

export default function TutorSettingsContent() {
    const { announce } = useAccessibility();
    const { user, profile, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<"profile" | "classroom" | "notifications" | "financials">("profile");

    // initial session data
    const [profileState, setProfileState] = useState<ProfileData>({
        fullName: profile?.fullName || user?.displayName || "",
        email: profile?.email || user?.email || "",
        tutorHandle: profile?.tutorId || "",
        institution: profile?.institution || "",
        mobile: profile?.mobileNumber || "",
        bio: (profile as any)?.bio || "",
        tags: (profile as any)?.tags || [],
    });

    // tags
    const [tags, setTags] = useState<string[]>([
        "Embedded Systems",
        "Accessible Design",
        "Web Accessibility",
        "IoT"
    ]);
    const [newTagInput, setNewTagInput] = useState("");

    // Classroom defaults
    const [enableLinter, setEnableLinter] = useState(true);

    // notifications
    const [notification, setNotifications] = useState({
        studentFlag: true,
        scoringComplete: true,
        discussionReply: false,
    });
    const [emailFrequency, setEmailFrequency] = useState("digest");

    // tab configurations
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileState.tutorHandle.trim()) {
            alert('Tutor handle is required');
            return;
        }
        try {
            await updateProfile({
                fullName: profileState.fullName,
                email: profileState.email,
                tutorId: profileState.tutorHandle,
                institution: profileState.institution,
                mobileNumber: profileState.mobile,
                bio: profileState.bio,
                tags: profileState.tags,
            } as any);
            announce("Tutor settings saved successfully.");
        } catch (err) {
            alert('Failed to save settings');
        }
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
        announce(`Removed expertise tag: ${tag}`);
    };

    return (
        <div className="w-full max-w-[80rem] mx-auto bg-[var(--bg-primary)] min-h-screen text-[var(--text-main)] p-[1.5rem] md:p-[3rem] space-y-[2rem] transition-colors duration-200">
            {/* Header */}
            <header className="border-b border-[var(--border-color)] pb-[1rem]">
                <h1 className="text-[2rem] font-bold text-[var(--text-main)]">Tutor Settings</h1>
                <p className="text-[1rem] text-[var(--text-muted)] mt-[0.25rem]">
                    Configure your personal profile settings, automated tools, notifications and payouts
                </p>
            </header>

            {/* Tabs */}
            <nav aria-label="Settings sub-tabs">
                <ul className="flex flex-wrap border-b border-[var(--border-color)] gap-[1rem]" role="tablist">
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
                                        focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none
                                        ${isActive
                                            ? "border-[var(--text-main)] text-[var(--text-main)] font-semibold"
                                            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
                                        }
                                        ${tab.disabled ? "opacity-50 cursor-not-allowed text-[var(--text-muted)]" : ""}
                                    `}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Content Wrapper */}
            <form onSubmit={handleSave} className="space-y-[2.5rem]">
                {/* Profile Settings */}
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
                                    <label htmlFor="display-name" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                        Display Name
                                    </label>
                                    <input
                                        id="display-name"
                                        type="text"
                                        value={profileState.fullName}
                                        onChange={(e) => setProfileState({ ...profileState, fullName: e.target.value })}
                                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                        required
                                    />
                                </div>
                                {/* Email*/}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="account-email" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                        Account Email
                                    </label>
                                    <input
                                        id="account-email"
                                        type="email"
                                        value={profileState.email}
                                        onChange={(e) => setProfileState({ ...profileState, email: e.target.value })}
                                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                    />
                                </div>
                                {/* Tutor Handle*/}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="tutor-handle" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                        Tutor Handle
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm">@</span>
                                        <input
                                            id="tutor-handle"
                                            type="text"
                                            value={profileState.tutorHandle}
                                            onChange={(e) => setProfileState({ ...profileState, tutorHandle: e.target.value })}
                                            className="flex-1 p-3 bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-r-xl text-sm focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                {/* Phone */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="contact-phone" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                        Contact Phone
                                    </label>
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        value={profileState.mobile}
                                        onChange={(e) => setProfileState({ ...profileState, mobile: e.target.value })}
                                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                    />
                                </div>
                                {/* Institution */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="institution" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                        Affiliated Institution
                                    </label>
                                    <input
                                        id="institution"
                                        type="text"
                                        value={profileState.institution}
                                        onChange={(e) => setProfileState({ ...profileState, institution: e.target.value })}
                                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                    />
                                </div>
                                {/* Full Name */}
                                <div className="flex flex-col gap-[0.5rem]">
                                    <label htmlFor="professional-title" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                        Full Name
                                    </label>
                                    <input
                                        id="professional-title"
                                        type="text"
                                        value={profileState.fullName}
                                        placeholder="e.g., Senior Electronics Lecturer"
                                        onChange={(e) => setProfileState({ ...profileState, fullName: e.target.value })}
                                        className="w-full bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                                    />
                                </div>
                            </div>
                            {/* Expertise Tags */}
                            <div className="flex flex-col gap-[0.5rem]">
                                <label htmlFor="add-tag" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                    Expertise Tags (Press Enter to add tags)
                                </label>
                                <div className="flex flex-wrap gap-[0.5rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] p-[0.75rem] rounded-lg items-center">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-[0.35rem] bg-[var(--text-main)] text-[var(--bg-primary)] text-[0.85rem] px-[0.75rem] py-[0.25rem] rounded-full"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                aria-label={`Remove expertise tag ${tag}`}
                                                className="hover:text-red-400 focus-visible:outline-[2px] focus-visible:outline-current rounded-full p-[0.1rem]"
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
                                        className="flex-grow bg-transparent text-[1rem] text-[var(--text-main)] border-none outline-none focus:ring-0 p-[0.25rem]"
                                    />
                                </div>
                            </div>
                            {/* Instructor Bio */}
                            <div className="flex flex-col gap-[0.5rem]">
                                <label htmlFor="instructor-bio" className="text-[0.95rem] font-semibold text-[var(--text-main)]">
                                    Short Instructor Bio
                                </label>
                                <textarea
                                    id="instructor-bio"
                                    rows={5}
                                    value={profileState.bio}
                                    onChange={(e) => setProfileState({ ...profileState, bio: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] text-[var(--text-main)] border border-[var(--border-color)] rounded-lg p-[0.75rem] text-[1rem] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none resize-y"
                                />
                            </div>
                        </fieldset>
                    </div>
                )}

                {/* Classroom Defaults */}
                {activeTab === "classroom" && (
                    <div
                        id="tabpanel-classroom"
                        role="tabpanel"
                        aria-labelledby="tab-btn-classroom"
                        className="space-y-[1.5rem] animate-fadeIn"
                    >
                        <fieldset className="border border-[var(--border-color)] p-[1.5rem] rounded-lg">
                            <legend className="text-[1.1rem] font-bold text-[var(--text-main)] px-[0.5rem]">Automated Workflows</legend>
                            <div className="flex items-start justify-between mt-[1rem] gap-[1.5rem]">
                                <div className="space-y-[0.25rem]">
                                    <label htmlFor="linter-toggle" className="text-[1rem] font-semibold text-[var(--text-main)] cursor-pointer">
                                        Enable Automated Courseware Compliance Linter
                                    </label>
                                    <p className="text-[0.9rem] text-[var(--text-muted)]">
                                        Automatically scans newly uploaded course text, videos, and images for missing descriptions,
                                        captions, or alt text attributes.
                                    </p>
                                </div>
                                {/* Accessible Toggle */}
                                <button
                                    id="linter-toggle"
                                    type="button"
                                    role="switch"
                                    aria-checked={enableLinter}
                                    onClick={() => {
                                        setEnableLinter(!enableLinter);
                                        announce(`Automated compliance linter ${!enableLinter ? "enabled" : "disabled"}.`);
                                    }}
                                    className={`relative inline-flex h-[1.5rem] w-[2.75rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none
                                        ${enableLinter ? "bg-[#FF6B35]" : "bg-[var(--bg-tertiary)]"}`}
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

                {/* Notification Center */}
                {activeTab === "notifications" && (
                    <div
                        id="tabpanel-notifications"
                        role="tabpanel"
                        aria-labelledby="tab-btn-notifications"
                        className="space-y-[2rem] animate-fadeIn"
                    >
                        {/* App Alerts */}
                        <fieldset className="border border-[var(--border-color)] p-[1.5rem] rounded-lg space-y-[1rem]">
                            <legend className="text-[1.1rem] font-bold text-[var(--text-main)] px-[0.5rem]">In-App Alerts</legend>
                            <div className="space-y-[0.75rem]">
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-[var(--text-main)] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notification.studentFlag}
                                        onChange={(e) => setNotifications({ ...notification, studentFlag: e.target.checked })}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] rounded border-[var(--border-color)] bg-[var(--bg-secondary)] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Notify when a student flags a critical blocking issue inside a lesson.</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-[var(--text-main)] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notification.scoringComplete}
                                        onChange={(e) => setNotifications({ ...notification, scoringComplete: e.target.checked })}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] rounded border-[var(--border-color)] bg-[var(--bg-secondary)] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Notify when an assignment scoring task completes its run cycle.</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-[var(--text-main)] cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notification.discussionReply}
                                        onChange={(e) => setNotifications({ ...notification, discussionReply: e.target.checked })}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] rounded border-[var(--border-color)] bg-[var(--bg-secondary)] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Notify when a discussion thread gets a new community reply.</span>
                                </label>
                            </div>
                        </fieldset>
                        {/* Email Frequency */}
                        <fieldset className="border border-[var(--border-color)] p-[1.5rem] rounded-lg space-y-[1rem]">
                            <legend className="text-[1.1rem] font-bold text-[var(--text-main)] px-[0.5rem]">Email Notification Frequency</legend>
                            <div className="space-y-[0.75rem]">
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-[var(--text-main)] cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email-frequency"
                                        value="realtime"
                                        checked={emailFrequency === "realtime"}
                                        onChange={() => setEmailFrequency("realtime")}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] border-[var(--border-color)] bg-[var(--bg-secondary)] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Real-time system alerts</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-[var(--text-main)] cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email-frequency"
                                        value="digest"
                                        checked={emailFrequency === "digest"}
                                        onChange={() => setEmailFrequency("digest")}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] border-[var(--border-color)] bg-[var(--bg-secondary)] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Daily Digest summary emails</span>
                                </label>
                                <label className="flex items-center gap-[0.75rem] text-[1rem] text-[var(--text-main)] cursor-pointer">
                                    <input
                                        type="radio"
                                        name="email-frequency"
                                        value="weekly"
                                        checked={emailFrequency === "weekly"}
                                        onChange={() => setEmailFrequency("weekly")}
                                        className="w-[1.25rem] h-[1.25rem] text-[#FF6B35] border-[var(--border-color)] bg-[var(--bg-secondary)] focus:ring-[#FF6B35] focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2"
                                    />
                                    <span>Weekly technical & analytics reports</span>
                                </label>
                            </div>
                        </fieldset>
                    </div>
                )}

                {/* Financials Tab */}
                {activeTab === "financials" && (
                    <div
                        id="tabpanel-financials"
                        role="tabpanel"
                        aria-labelledby="tab-btn-financials"
                        className="space-y-[1.5rem] animate-fadeIn opacity-50 pointer-events-none"
                        aria-disabled="true"
                    >
                        <div className="border border-[var(--border-color)] rounded-lg p-[2rem] bg-[var(--bg-secondary)] flex flex-col items-center justify-center text-center gap-[1.5rem]">
                            <div className="max-w-[30rem] space-y-[0.5rem]">
                                <h3 className="text-[1.25rem] font-bold text-[var(--text-main)]">Stripe Account Integration</h3>
                                <p className="text-[0.95rem] text-[var(--text-muted)]">
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

                {/* Action Bar */}
                {activeTab !== "financials" && (
                    <div className="flex justify-end pt-[1.5rem] border-t border-[var(--border-color)]">
                        <button
                            type="submit"
                            className="bg-[#FF6B35] hover:bg-[#e05825] text-white font-semibold text-[1rem] py-[0.75rem] px-[2rem] rounded-lg transition-all duration-200 focus-visible:outline-[3px] focus-visible:outline-[var(--focus-ring-color,#2563eb)] focus-visible:outline-offset-2 focus:outline-none"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
