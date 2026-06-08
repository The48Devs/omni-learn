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
    const { isAuthenticated, role: userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/auth/signin");
        } else if (userRole !== role) {
            router.replace(`/${userRole}/dashboard`);
        }
    }, [isAuthenticated, userRole, router]);

    return <>{children}</>
}