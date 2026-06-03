"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Navigation Links
    const navLinks = [
        { name: "Explore", href: "/" },
        { name: "Community", href: "/communityForum" },
        { name: "Tutor Studio", href: "/TutorStudio" },
        { name: "Arena", href: "/TheArena" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-xs transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href="/"
                            className="text-2xl font-black text-[#0f2942] tracking-tight hover:opacity-90 transition-opacity"
                        >
                            OmniLearn
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex space-x-8 items-center h-full">
                        {navLinks.map((link) => {
                            // Active check: Exact match for home, startsWith check for subpages
                            const isActive =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname === link.href || pathname.startsWith(link.href);

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`relative flex items-center h-16 text-sm font-medium transition-colors duration-200 ${isActive
                                            ? "text-[#f95738]"
                                            : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f95738] rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Search, Notifications & Profile */}
                    <div className="flex items-center gap-4 flex-1 justify-end max-w-md md:max-w-lg">

                        {/* Search Input */}
                        <div className="relative w-full max-w-[240px] hidden sm:block">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-transparent rounded-full focus:bg-white focus:border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 placeholder-gray-400 transition-all duration-200"
                            />
                        </div>

                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-hidden rounded-full hover:bg-gray-50 transition-all duration-200">
                            <span className="sr-only">View notifications</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {/* Active Dot indicator */}
                            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-[#f95738] ring-2 ring-white" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-1.5 focus:outline-hidden group rounded-full p-0.5 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                            >
                                <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200 relative">
                                    {/* Avatar Placeholder corresponding to the visual design */}
                                    <img
                                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
                                        alt="User Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <svg
                                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    {/* Click-outside backdrop to close the menu */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white py-1 shadow-lg border border-gray-100 focus:outline-hidden z-20 transition-all duration-200 origin-top-right">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs text-gray-500">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-700 truncate">Alex Mercer</p>
                                        </div>
                                        <Link
                                            href="/StudentPortal"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Student Portal
                                        </Link>
                                        <div className="border-t border-gray-100 my-1" />
                                        <button
                                            onClick={() => {
                                                setIsProfileOpen(false);
                                                alert("Signing out...");
                                            }}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-hidden"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner">
                    {/* Mobile Search Bar */}
                    <div className="relative mb-3 sm:hidden">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-transparent rounded-full focus:bg-white focus:border-gray-200 focus:outline-hidden"
                        />
                    </div>

                    {navLinks.map((link) => {
                        const isActive =
                            link.href === "/"
                                ? pathname === "/"
                                : pathname === link.href || pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive
                                        ? "bg-orange-50 text-[#f95738]"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
