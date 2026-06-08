"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "student" | "tutor";
interface AuthContextProps {
    user: string | null;
    role: Role | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
    register: (email: string, password: string, role: Role) => void;
}