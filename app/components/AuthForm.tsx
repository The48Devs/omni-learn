"use client";

import { useState } from "react";
import { useAuth } from "./AuthCOntext";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
    const { login, register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"student" | "tutor">("student");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "login") {
            login(email, password);
        } else {
            register(email, password, role);
        }
    };
}