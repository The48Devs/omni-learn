"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthCOntext";

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { isAuthenticated, role, logout } = useAuth();


    // Navigation Links
    const navLinks = [
        { name: "Explore", href: "/" },
        { name: "Community", href: "/community" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-[var(--bg-primary)] border-b border-[var(--border-color)] shadow-xs transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4">
                    {/* Brand */}
                    <Link href="/" className="text-xl font-bold text-[var(--text-main)]">
                        OmniLearn
                    </Link>
                    {/* Desktop navigation */}
                    <ul className="hidden md:flex space-x-4">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`px-3 py-2 rounded ${pathname === link.href
                                        ? "bg-[var(--bg-secondary)] text-[var(--focus-ring-color)]"
                                        : "text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        {/* Auth‑aware items */}
                        {isAuthenticated ? (
                            <>
                                {/* Dashboard link – resolved from role */}
                                <li>
                                    <Link
                                        href={`/${role}/dashboard`}
                                        className="px-3 py-2 rounded text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                {/* Sign‑out button */}
                                <li>
                                    <button
                                        onClick={logout}
                                        className="px-3 py-2 rounded text-[var(--text-main)] hover:bg-[var(--bg-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
                                    >
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href="/auth/signin"
                                        className="px-3 py-2 rounded text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                                    >
                                        Sign In
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/auth/signup"
                                        className="px-3 py-2 rounded text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-[var(--text-main)] focus:outline-none"
                    >
                        ☰
                    </button>
                </div>
            </div>
        </nav>
    );
}