"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useOrganizations } from "../../components/organizations/OrganizationContext";
import { useAuth } from "../../components/AuthCOntext";
import { Building2, Globe, Users, BookOpen } from "lucide-react";

// Deterministic subject → image theme for course cards
const SUBJECT_IMAGE_THEME: Record<string, string> = {
    Physics:     'bg-[#1a2b4c]',
    Chemistry:   'bg-[#0c4a6e]',
    Biology:     'bg-[#052e16]',
    Design:      'bg-[#4a044e]',
    Technology:  'bg-[#2e1065]',
    Robotics:    'bg-[#431407]',
    History:     'bg-stone-800',
    Philosophy:  'bg-indigo-900',
    Mathematics: 'bg-slate-900',
    General:     'bg-zinc-800',
};
const getImageTheme = (subject: string) => SUBJECT_IMAGE_THEME[subject] ?? SUBJECT_IMAGE_THEME['General'];

// Which subjects map to each discover section
const STORYLINE_SUBJECTS = new Set(['History', 'Philosophy', 'Literature', 'Social Studies', 'Ethics']);
const SANDBOX_SUBJECTS   = new Set(['Physics', 'Chemistry', 'Biology', 'Robotics', 'Technology', 'Mathematics']);

export default function ExploreCourses() {
    const [searchQuery, setSearchQuery] = useState('');
    const { organizations, getPublicOrganizations, getOrgCourseCount, getOrgMemberCount, getOrgCoursesWithData } = useOrganizations();
    const { user } = useAuth();
    const publicOrgs = getPublicOrganizations();
    const [orgCounts, setOrgCounts] = useState<Record<string, { courses: number; members: number }>>({});
    const [allPublicCourses, setAllPublicCourses] = useState<any[]>([]);
    const [orgNameMap, setOrgNameMap] = useState<Record<string, string>>({});
    const [coursesLoading, setCoursesLoading] = useState(true);

    // Fetch courses from all public orgs
    useEffect(() => {
        const visibleOrgs = publicOrgs.slice(0, 6);
        if (visibleOrgs.length === 0) {
            setCoursesLoading(false);
            return;
        }
        let cancelled = false;
        const fetchAll = async () => {
            const nameMap: Record<string, string> = {};
            visibleOrgs.forEach(org => { nameMap[org.id] = org.name; });
            const results = await Promise.all(visibleOrgs.map(org => getOrgCoursesWithData(org.id)));
            if (!cancelled) {
                const flat = results.flat().map((c: any) => ({
                    ...c,
                    orgName: nameMap[c.orgId] ?? 'OmniLearn',
                    moduleCount: Object.keys(c.modules || {}).length,
                    imageTheme: getImageTheme(c.subject || 'General'),
                    category: c.subject || 'General',
                }));
                // Sort newest first for trending
                flat.sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
                setAllPublicCourses(flat);
                setOrgNameMap(nameMap);
                setCoursesLoading(false);
            }
        };
        fetchAll();
        return () => { cancelled = true; };
    }, [organizations, getOrgCoursesWithData]);

    // Org course/member counts
    useEffect(() => {
        const visibleOrgs = publicOrgs.slice(0, 6);
        if (visibleOrgs.length === 0) return;
        let cancelled = false;
        const fetchCounts = async () => {
            const counts: Record<string, { courses: number; members: number }> = {};
            await Promise.all(visibleOrgs.map(async (org) => {
                try {
                    const [courses, members] = await Promise.all([
                        getOrgCourseCount(org.id),
                        getOrgMemberCount(org.id),
                    ]);
                    if (!cancelled) counts[org.id] = { courses, members };
                } catch {
                    if (!cancelled) counts[org.id] = { courses: 0, members: 0 };
                }
            }));
            if (!cancelled) setOrgCounts(counts);
        };
        fetchCounts();
        return () => { cancelled = true; };
    }, [organizations, getOrgCourseCount, getOrgMemberCount]);

    // Split real courses into sections by subject
    const trendingCourses   = allPublicCourses; // all courses, sorted newest-first
    const narrativeCourses  = allPublicCourses.filter(c => STORYLINE_SUBJECTS.has(c.subject || ''));
    const sandboxCourses    = allPublicCourses.filter(c => SANDBOX_SUBJECTS.has(c.subject || ''));

    const q = searchQuery.toLowerCase().trim();
    const filteredTrending = q
        ? trendingCourses.filter(c =>
            c.title.toLowerCase().includes(q) ||
            (c.category ?? '').toLowerCase().includes(q) ||
            (c.orgName ?? '').toLowerCase().includes(q)
        )
        : trendingCourses;
    const filteredNarrative = q
        ? narrativeCourses.filter(c =>
            c.title.toLowerCase().includes(q) ||
            (c.category ?? '').toLowerCase().includes(q) ||
            (c.orgName ?? '').toLowerCase().includes(q)
        )
        : narrativeCourses;
    const filteredSandbox = q
        ? sandboxCourses.filter(c =>
            c.title.toLowerCase().includes(q) ||
            (c.category ?? '').toLowerCase().includes(q) ||
            (c.orgName ?? '').toLowerCase().includes(q)
        )
        : sandboxCourses;

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

            {/* Organizations Section */}
            <section className="w-full max-w-7xl mx-auto flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                        <Building2 className="inline mr-2 text-blue-500" size={28} />
                        Organizations
                    </h2>
                    <Link
                        href="/StudentPortal/organizations"
                        className="text-sm font-bold text-blue-600 hover:underline"
                    >
                        View all &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publicOrgs.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-slate-400 font-medium">
                            No public organizations available yet.
                        </div>
                    ) : (
                        publicOrgs.slice(0, 6).map(org => (
                            <Link
                                key={org.id}
                                href={`/StudentPortal/organization/${org.id}`}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-emerald-100 text-emerald-800">
                                            <Globe size={12} /> Public
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{org.name}</h3>
                                    <p className="text-slate-600 text-sm line-clamp-2 mb-6">{org.description}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                                            <BookOpen className="text-blue-500" size={20} />
                                            <div>
                                                <div className="text-xl font-bold text-slate-800 leading-none">{orgCounts[org.id]?.courses ?? 0}</div>
                                                <div className="text-xs text-slate-500 font-medium mt-1">Courses</div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                                            <Users className="text-emerald-500" size={20} />
                                            <div>
                                                <div className="text-xl font-bold text-slate-800 leading-none">{orgCounts[org.id]?.members ?? 0}</div>
                                                <div className="text-xs text-slate-500 font-medium mt-1">Members</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>
            {/*Discovery Sections */}
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 pb-16">
                <DiscoverSection title="🔥 Trending This Week" arialabel="Trending Courses Carousel">
                    <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar">
                        {coursesLoading
                            ? Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} layout="horizontal" />)
                            : filteredTrending.length > 0
                                ? filteredTrending.map(course => <CourseCard key={course.id} course={course} layout="horizontal" />)
                                : <p className="text-[var(--text-muted)] py-4 text-sm">No courses available at the moment.</p>
                        }
                    </div>
                </DiscoverSection>
                <DiscoverSection title="📖 Courses with Storyline Modules" arialabel="Narrative Storyline Courses">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coursesLoading
                            ? Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} layout="grid" />)
                            : filteredNarrative.length > 0
                                ? filteredNarrative.map(course => <CourseCard key={course.id} course={course} layout="grid" />)
                                : <p className="text-[var(--text-muted)] py-4 text-sm">No courses available at the moment.</p>
                        }
                    </div>
                </DiscoverSection>
                <DiscoverSection title="🔬 Courses with Sandbox Labs" arialabel="Technical Sandbox Courses">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coursesLoading
                            ? Array.from({ length: 3 }).map((_, i) => <CourseCardSkeleton key={i} layout="grid" />)
                            : filteredSandbox.length > 0
                                ? filteredSandbox.map(course => <CourseCard key={course.id} course={course} layout="grid" />)
                                : <p className="text-[var(--text-muted)] py-4 text-sm">No courses available at the moment.</p>
                        }
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

function CourseCardSkeleton({ layout }: { layout: "horizontal" | "grid" }) {
    return (
        <div
            className={`flex flex-col rounded-2xl overflow-hidden animate-pulse ${layout === 'horizontal' ? 'snap-start flex-none w-[85vw] sm:w-[20rem]' : ''}`}
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        >
            <div className="w-full h-[8rem] bg-[var(--bg-tertiary)]" />
            <div className="p-5 flex flex-col gap-3">
                <div className="h-3 w-16 rounded-full bg-[var(--bg-tertiary)]" />
                <div className="h-4 w-3/4 rounded-full bg-[var(--bg-tertiary)]" />
                <div className="h-3 w-1/2 rounded-full bg-[var(--bg-tertiary)]" />
            </div>
        </div>
    );
}

function CourseCard({ course, layout }: { course: any, layout: "horizontal" | "grid" }) {
    return (
        <Link
            href={`/StudentPortal/courses/${course.id}`}
            className={`flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${layout === 'horizontal' ? 'snap-start flex-none w-[85vw] sm:w-[20rem]' : ''}`}
            style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
            aria-label={`View course: ${course.title}`}
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

                {/* Title & Publisher (real org name) */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold leading-tight line-clamp-2" style={{ color: 'var(--text-main)' }}>
                        {course.title}
                    </h3>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        By {course.orgName}
                    </p>
                </div>

                {/* Footer — real module count, no fake rating */}
                <div className="mt-auto pt-4 border-t flex justify-end items-center text-sm font-semibold"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--text-main)' }}>
                        {course.moduleCount} {course.moduleCount === 1 ? 'Module' : 'Modules'}
                    </span>
                </div>
            </div>
        </Link>
    );
}