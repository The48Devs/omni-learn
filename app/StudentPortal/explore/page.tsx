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
            {/*Refined filter and sort bar*/}
            <section className="w-full max-w-7xl mx-auto flex flex-col xl:flex-row gap-4 justify-between items-center p-4 rounded-xl shadow-sm"
                style={{ backgroundColor: `var(--bg-secondary)`, border: '1px solid var(--border-color' }}
                aria-label="Course Filters">
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <FilterSelect
                        label="Subject"
                        options={['All Subjects', 'Physics', 'Biology', 'Technology', 'History', 'Design', 'Robotics']}
                    />
                    <FilterSelect
                        label="Experience Type"
                        options={['All Formats', 'Interactive Storylines', 'Sandbox Simulations', 'Core Assessments']}
                    />
                    <FilterSelect
                        label="Duration"
                        options={['Any Duration', 'Quick Sessions (< 1 hr)', 'Standard Modules (1-3 hrs)', 'Deep Dives (3+ hrs)']}
                    />
                </div>

                <div className="w-full xl:w-auto flex justify-start xl:justify-end mt-4 xl:mt-0">
                    <FilterSelect
                        label="Sort By"
                        options={['Popularity', 'Highest Rated (★)', 'Newest Releases']}
                    />
                </div>

            </section>

            {/*Discovery Sections */}
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 pb-16">
                {/*Trending this week*/}
                <DiscoverSection title="🔥 Trending This Week" arialabel="Trending Courses Carousel">
                    <div className="flex overflw-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
                        {trendingCourses.map(course => (
                            <a href={`/StudentPortal/course/${course.id}`}
                                className="snap-start flex-none w-[85vw] sm:w-[20rem] flex flex-col rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
                                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <div className={`w-full h[12rem] ${course.image} opacity-80`}>
                                    <div className="p-6 flex flex-col gap-4 flex-grow">
                                        <span className="self-start text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                                            {course.tag}
                                        </span>
                                        <h3 className="text-xl font-bold leading-tight">{course.title}</h3>
                                        <div className="mt-auto flex justify-between items-center"
                                            style={{ color: 'var(--text-muted' }}>
                                            <span className="text-sm font-medium">{course.lessons} Lessons </span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                </DiscoverSection>
                {/*Immersive Narrative */}
                <DiscoverSection title="📖 Immersive Narrative Highlights" arialabel="Narrative Storyline Courses">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {narrativeCourses.map(course => (
                            <a href={`/StudentPortal/course/${course.id}`}
                                key={course.id}
                                className="flex flex-col sm:flex-row rounded-2xl overflow-hidden transition-transform hover:-translate-y-1"
                                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <div className={`w-full sm:w-[12rem] h-[12rem] sm:h-auto ${course.image} opacity-80`}></div>
                                <div className="p-6 flex flex-col justify-center gap-3 flex-grow">
                                    <h3 className="text-xl font-bold leading-tight">{course.title}</h3>
                                    <div className="flex flex-col gap-1 mt-2" style={{ color: 'var(--text-muted)' }}>
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <span aria-hidden="true">🔀</span> {course.nodes} Branching Nodes
                                        </span>
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <span aria-hidden="true">⏱️</span> {course.time} Est. Completion
                                        </span>
                                    </div>
                                </div>

                            </a>
                        ))}
                    </div>

                </DiscoverSection>
                {/*Advanced Sandboxes*/}
                <DiscoverSection title="🔬 Advanced Virtual Sandboxes" arialabel="Technical Sandbox Modules">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sandboxModules.map(course => (
                            <a
                                href={`/student/sandbox/${course.id}`}
                                key={course.id}
                                className="flex flex-col rounded-2xl overflow-hidden p-6 gap-4 transition-transform hover:-translate-y-1"
                                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                            >
                                <h3 className="text-xl font-bold">{course.title}</h3>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {course.hasNotes && (
                                        <span className="text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                                            <span aria-hidden="true">📝</span> Lab Notes
                                        </span>
                                    )}
                                    {course.hasTracking && (
                                        <span className="text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                                            <span aria-hidden="true">🎯</span> Live Objectives
                                        </span>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                </DiscoverSection>

            </div>
        </main >
    );
}

function FilterSelect({ label, options }: {
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