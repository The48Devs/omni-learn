"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on portal routes
    if (pathname.startsWith('/StudentPortal') || pathname.startsWith('/TutorStudio')) {
        return null;
    }

    return (
        <footer
            role="contentinfo"
            className="w-full bg-[var(--bg-primary)] border-t border-[var(--border-color)] py-8 transition-colors duration-200"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
                <div className="space-y-1">
                    <span className="text-xl font-black text-[var(--text-main)] tracking-tight" >
                        OmniLearn</span>
                    <p className="text-xs text-[var(--text-muted)]">
                        © 2026 OmniLearn Systems. All rights reserved. </p> </div>
                <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2" >
                    <Link
                        href="/privacy-policy"
                        className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms-of-service"
                        className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        href="/help-center"
                        className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
                    >
                        Help Center
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
                    >
                        Contact
                    </Link>
                    <div className="flex items-center gap-3">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] transition-colors cursor-pointer"
                            aria-label="Visit OmniLearn on Twitter"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] transition-colors cursor-pointer"
                            aria-label="Visit OmniLearn on Instagram"
                        >
                            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                    </div></nav></div>
        </footer>
    )
}