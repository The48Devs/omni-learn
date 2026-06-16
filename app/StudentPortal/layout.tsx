"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../components/AuthCOntext";
import RequireAuth from "../components/RequireAuth";
import { useAccessibility } from "../components/AccessibilityContext";

export default function StudentPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logout } = useAuth();
    const { announce } = useAccessibility();
    const pathname = usePathname();

    // Nav links helper
    const navItems = [
        { href: "/StudentPortal/dashboard", label: "Dashboard", icon: "⊞" },
        { href: "/StudentPortal/mycourses", label: "My Courses", icon: "📖" },
        { href: "/StudentPortal/explore", label: "Explore", icon: "🧭" },
        { href: "/StudentPortal/community", label: "Community", icon: "👥" },
        { href: "/StudentPortal/settings", label: "Settings", icon: "⚙️" },
    ]
}
