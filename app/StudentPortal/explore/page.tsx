"use client";

import React, { useState } from "react";

//mock data arrays

const trendingCourses = [
    { id: 1, title: 'Introduction to Quantum Mechanics', tag: 'Physics', lessons: 12, image: 'bg-blue-900' },
    { id: 2, title: 'Advanced UI/UX Principles', tag: 'Design', lessons: 8, image: 'bg-purple-900' },
    { id: 3, title: 'Cellular Biology Fundamentals', tag: 'Biology', lessons: 15, image: 'bg-green-900' },
];
const narrativeCourses = [
    { id: 4, title: 'The Fall of Rome: An Interactive Journey', nodes: 45, time: '2hrs 30 mins', image: 'bg-stone-800' },
    { id: 5, title: 'Cyberpunk Ethics & Philosophy', nodes: 32, time: '1hr 45 mins', image: 'bg-indigo-900' },
];
const sandboxModules = [
    { id: 6, title: 'Kinematics Sandbox Lab', hasNotes: true, hasTracking: true, image: 'bg-slate-800' },
    { id: 7, title: 'Neural Net Visualizer', hasNotes: true, hasTracking: false, image: 'bg-zinc-800' },
];

export default function ExploreCourses() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        < main
            className="w-full min-h-screen p-4 md:p-8 lg:p-12 flex flex-col gap-12"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)' }}>
            {/*Header and search zone */}
            <section className="flex flex-col items-center text-center max-w-4xl mx-auto w-full pt-8 gap-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Discover New Skills
                </h1>
                <p className="text-lg md:text-xl max-w-2xl" style={{ color: 'var(--text-muted)' }}>
                    Explore immersive storylines, elite interactive sandboxes, and expert-led programs tailored for your learning track.
                </p>
                <form
                    className="w-full max-w-3xl mt-4 relative flex items-center rounded-2xl overflow-hidden shadow-lg transition-shadow focus-within:shadow-xl"
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="pl-6 flex items-center justify-center" aria-hidden="true" style={{ color: 'var(--text-muted)' }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        className="w-full py-4 px-4 bg-transparent border-none outline-none text-lg placeholder-opacity-70"
                        placeholder="Search across courses, subjects, sandboxes, or modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ color: 'var(--text-main)' }}
                        aria-label="Search across courses"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: 'var(--focus-ring-color)' }}
                        aria-label="Execute search"
                    >
                        Search
                    </button>
                </form>
            </section>
        </main >
    );
}

function FIlterSelect({ label, options }: {
    label: string, options: string[]
}) {
    return (
        <div className="flex items-center gap-3">
            <label className="text-sm font-semibold whitespace nowrap hidden md:block"
                style={{ color: 'var(--text-muted)' }}>
                {label}:
            </label>
            <div className="relative">
                <select className="appearance-none py-2 pl-4 pr-10 rounded-lg text-sm font-medium cursor-pointer"
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
                    aria-label={`Filter by ${label}`}>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function DiscoverSection({ title, arialabel, children }: { title: string, arialabel: string, children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-6" aria-label={arialabel}>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: `var(--text-main)` }}>
                {title}
            </h2>
            {children}
        </section>
    )
} 