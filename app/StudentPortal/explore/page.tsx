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
const sandboxCourses = [
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
                <DiscoverSection title="🔥 Trending This Week" arialabel="Trending Courses Carousel">
                    <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
                        {trendingCourses.map(course => <CourseCard key={course.id} course={course} layout="horizontal" />)}
                    </div>
                </DiscoverSection>
                <DiscoverSection title="📖 Courses with Storyline Modules" arialabel="Narrative Storyline Courses">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {narrativeCourses.map(course => <CourseCard key={course.id} course={course} layout="grid" />)}
                    </div>
                </DiscoverSection>
                <DiscoverSection title="🔬 Courses with Sandbox Labs" arialabel="Technical Sandbox Courses">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sandboxCourses.map(course => <CourseCard key={course.id} course={course} layout="grid" />)}
                    </div>
                </DiscoverSection>
            </div>
        </main>
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

function CourseCard({ course, layout }: { course: any, layout: "horizontal" | "grid" }) {
    return (
        <a
            href={`/StudentPortal/course/${course.id}`}
            className={`flex flex-col rounded-2xl overflow-hidden shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md ${layout === 'horizontal' ? 'snap-start flex-none w-[85vw] sm:w-[20rem]' : ''}`}
            style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
        >
            {/* Top Graphic Area with Faded Text */}
            <div className={`w-full h-[8rem] flex items-center justify-center relative overflow-hidden select-none ${course.imageTheme}`}>
                <span className="text-4xl md:text-5xl font-black text-white opacity-10 uppercase tracking-widest pointer-events-none drop-shadow-md">
                    {course.category}
                </span>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col gap-3 flex-grow">
                {/* Outlined Pill */}
                <div className="self-start px-3 py-1 rounded-lg border text-[0.65rem] font-bold uppercase tracking-wider"
                    style={{ color: '#3b82f6', borderColor: '#bfdbfe', backgroundColor: 'transparent' }}>
                    {course.category}
                </div>

                {/* Title & Publisher */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold leading-tight line-clamp-2" style={{ color: 'var(--text-main)' }}>
                        {course.title}
                    </h3>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        By {course.publisher}
                    </p>
                </div>

                {/* Footer Data */}
                <div className="mt-auto pt-4 border-t flex justify-between items-center text-sm font-semibold"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1.5 text-amber-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span style={{ color: 'var(--text-main)' }}>{course.rating}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {course.duration && (
                            <span className="flex items-center gap-1">
                                <span aria-hidden="true" className="opacity-70">⏱</span> {course.duration}
                            </span>
                        )}
                        <span style={{ color: 'var(--text-main)' }}>{course.lessonsCount} Lessons</span>
                    </div>
                </div>
            </div>
        </a>
    );
}