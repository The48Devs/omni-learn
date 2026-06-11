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
        { id: "profile", label: "Profile Settings" },
        { id: "classroom", label: "Classroom Defaults" },
        { id: "notifications", label: "Notifications Center" },
        { id: "financials", label: "Financials(MVP)" },
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

}