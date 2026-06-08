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

//firebase integration

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const isAuthenticated = !!user;

    useEffect(() => {
        const savedUser = localStorage.getItem("auth-user");
        const savedRole = localStorage.getItem("auth-role") as Role | null;
        if (savedUser && savedRole) {
            setUser(savedUser);
            setRole(savedRole);
        }
    }, []);

    const login = (email: string, password: string) => {
        //firebase integration
        if (email && password) {
            const token = crypto.randomUUID();
            localStorage.setItem("auth-token", token);
            localStorage.setItem("auth-role", email);
            setUser(email);
        } else {
            alert("Please provide email & Password")
        }
    };



    const register = (email: string, password: string, role: Role) => {
        //firebase integration
        const token = crypto.randomUUID();
        localStorage.setItem("auth-token", token);
        localStorage.setItem("auth-role", role);
        localStorage.setItem("auth-user", email);
        setUser(email);
        setRole(role);
    };

    const logout = () => {
        //firebase integration
        localStorage.clear();
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, role, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};