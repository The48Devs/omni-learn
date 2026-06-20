"use client";

import { useAuth } from "./AuthCOntext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({
    role,
    children,
}: {
    role: "student" | "tutor";
    children: React.ReactNode;
}) {
    const { isAuthenticated, profile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/auth/signin");
        } else if (profile?.role !== role) {
            router.replace(profile?.role === "tutor" ? "/TutorStudio/dashboard" : "/StudentPortal/dashboard");
        }
    }, [isAuthenticated, profile, role, router]);

    return <>{children}</>
}