"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccessibility } from "@/app/components/AccessibilityContext";

export default function Home() {
  const { theme, focusProfile } = useAccessibility();


  const getCardStyle = (type: "student" | "tutor" | "analytics" | "arena" | "story" | "simulations") => {
    // High Contrast Theme Override
    if (theme === "high-contrast") {
      return {
        bg: "bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]",
        text: "text-[var(--text-main)]",
        icon: "text-[var(--focus-ring-color)]",
        line: "bg-[var(--border-color)]",
      };
    }


    switch (theme) {
      case "protanopia": // Red blind emphasizes cobalt blues and yellow-ambers
        const protan = {
          student: { bg: "bg-[#1e3a8a]", text: "text-white", icon: "text-[#38bdf8]" },
          tutor: { bg: "bg-[#b45309]", text: "text-white", icon: "text-[#fcd34d]" },
          analytics: { bg: "bg-[#1d4ed8]", text: "text-white", icon: "text-[#93c5fd]" },
          arena: { bg: "bg-[#0f172a]", text: "text-white", icon: "text-[#38bdf8]" },
          story: { bg: "bg-[#78350f]", text: "text-white", icon: "text-[#fde047]" },
          simulations: { bg: "bg-[#0369a1]", text: "text-white", icon: "text-[#bae6fd]" },
        };
        return {
          bg: `${protan[type].bg} border border-[var(--border-color)]/25 shadow-sm`,
          text: protan[type].text,
          icon: protan[type].icon,
          line: "bg-white/20",
        };

      case "deuteranopia": // Green blind - deep indigos and rich ambers
        const deuteran = {
          student: { bg: "bg-[#312e81]", text: "text-white", icon: "text-[#818cf8]" },
          tutor: { bg: "bg-[#9a3412]", text: "text-white", icon: "text-[#fdba74]" },
          analytics: { bg: "bg-[#1e3a8a]", text: "text-white", icon: "text-[#93c5fd]" },
          arena: { bg: "bg-[#0f172a]", text: "text-white", icon: "text-[#818cf8]" },
          story: { bg: "bg-[#7c2d12]", text: "text-white", icon: "text-[#ffedd5]" },
          simulations: { bg: "bg-[#1e40af]", text: "text-white", icon: "text-[#bfdbfe]" },
        };
        return {
          bg: `${deuteran[type].bg} border border-[var(--border-color)]/25 shadow-sm`,
          text: deuteran[type].text,
          icon: deuteran[type].icon,
          line: "bg-white/20",
        };

      case "tritanopia": // Blue-blind - avoids blue-yellow, uses reds, stone, and teal
        const tritan = {
          student: { bg: "bg-[#881337]", text: "text-white", icon: "text-[#fda4af]" },
          tutor: { bg: "bg-[#4c0519]", text: "text-white", icon: "text-[#f43f5e]" },
          analytics: { bg: "bg-[#115e59]", text: "text-white", icon: "text-[#2dd4bf]" },
          arena: { bg: "bg-[#1c1917]", text: "text-white", icon: "text-[#f43f5e]" },
          story: { bg: "bg-[#9f1239]", text: "text-white", icon: "text-[#fecdd3]" },
          simulations: { bg: "bg-[#134e4a]", text: "text-white", icon: "text-[#5eead4]" },
        };
        return {
          bg: `${tritan[type].bg} border border-[var(--border-color)]/25 shadow-sm`,
          text: tritan[type].text,
          icon: tritan[type].icon,
          line: "bg-white/20",
        };

      default: // default theme
        const def = {
          student: { bg: "bg-[#1e74f3]", text: "text-white", icon: "text-white" },
          tutor: { bg: "bg-[#f05a28]", text: "text-white", icon: "text-white" },
          analytics: { bg: "bg-[#62b6f5]", text: "text-white", icon: "text-white" },
          arena: { bg: "bg-[#0b1b3d]", text: "text-white", icon: "text-white" },
          story: { bg: "bg-[#f4794e]", text: "text-white", icon: "text-white" },
          simulations: { bg: "bg-[#89d6f8]", text: "text-slate-900", icon: "text-slate-900" },
        };
        return {
          bg: `${def[type].bg} border border-black/5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1`,
          text: def[type].text,
          icon: def[type].icon,
          line: "bg-white/25",
        };
    }
  };

  const isDistractionFree = focusProfile === "distraction-free";

  return (
    <main
      id="main-content"
      className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 overflow-hidden relative"
    >
      {/* 1. Custom CSS Animations*/}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.1); opacity: 0.45; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulseGlow 10s ease-in-out infinite;
        }
      `}} />

      {/*Interactive Background Blobs */}
      {!isDistractionFree && (
        <div className="decorative-glow absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-12 left-1/4 w-[18.75rem] h-[18.75rem] bg-[var(--focus-ring-color)]/10 rounded-full blur-[6.25rem] animate-pulse-glow" />
          <div className="absolute top-1/2 right-1/4 w-[25rem] h-[25rem] bg-[#62b6f5]/15 rounded-full blur-[7.5rem] animate-pulse-glow" style={{ animationDelay: "-3s" }} />
        </div>
      )}

      {/*HERO SECTION*/}
      <section
        aria-label="Welcome and Introduction"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center lg:py-4"
      >

        <div className="lg:col-span-5 space-y-6 flex flex-col justify-center text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[var(--text-main)]">
            "Learn by <br className="hidden lg:block" />
            doing, <br className="hidden sm:block lg:hidden" />
            <span className="text-[var(--focus-ring-color)] relative">
              not just watching.
              {!isDistractionFree && (
                <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-[var(--focus-ring-color)]/20 rounded-full" />
              )}
            </span>"
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl">
            Experience the next generation of online education. Our integrated modules combine
            theory with hands-on practice in a real-time collaborative arena.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/StudentPortal"
              className="px-8 py-3.5 rounded-full text-base font-bold bg-[#0b1b3d] text-white hover:bg-[#152c5a] shadow-md hover:shadow-lg focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color)] transition-all duration-200 active:scale-95 text-center min-w-[9.375rem]"
              aria-label="Enter the Student Portal to see your learning progress"
            >
              Student Portal
            </Link>
            <Link
              href="/TutorStudio"
              className="px-8 py-3.5 rounded-full text-base font-bold bg-[#f05a28] text-white hover:bg-[#d8481b] shadow-md hover:shadow-lg focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color)] transition-all duration-200 active:scale-95 text-center min-w-[9.375rem]"
              aria-label="Enter Tutor Studio to create and manage courses"
            >
              Tutor Studio
            </Link>
          </div>
        </div>

        {/* Hero Visual Image */}
        <div className="lg:col-span-7 flex justify-center items-center relative pl-0 lg:pl-10">
          <div className={`relative w-full max-w-[31.25rem] aspect-square rounded-2xl overflow-visible ${!isDistractionFree ? "animate-float" : ""}`}>
            <Image
              src="/landing page img.png"
              alt="Metallic dark blue torus linked with a glossy cyan sphere representing interconnected learning modules"
              fill
              priority
              className="object-contain drop-shadow-2xl rounded -2xl"
              sizes="(max-w-768px) 100vw, 500px"
            />
          </div>
        </div>
      </section>

      {/*MODULES GRID SECTION */}
      <section aria-labelledby="modules-heading" className="space-y-8">
        <div className="text-center space-y-2">
          <h2
            id="modules-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] relative inline-block"
          >
            Integrated Learning Modules
            {!isDistractionFree && (
              <span className="block h-[4px] w-16 bg-[#f05a28] mx-auto mt-2 rounded-full" />
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Student Portal */}
          <Link
            href="/StudentPortal"
            className={`group p-8 rounded-2xl flex flex-col justify-between h-[15.625rem] text-left transition-all ${getCardStyle("student").bg}`}
            aria-label="Go to Student Portal. Learn your progress or aim for an early graduation with personalized paths."
          >
            <div>
              <div className={`${getCardStyle("student").icon}`}>
                {/* Graduation Cap Icon */}
                <svg className="w-8 h-8 mb-4 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${getCardStyle("student").text}`}>Student Portal</h3>
              <p className={`text-sm opacity-90 leading-relaxed max-w-[17.5rem] ${getCardStyle("student").text}`}>
                Learn your progress or aim for an early graduation with our personalized paths.
              </p>
            </div>
            <div className={`w-6 h-[2px] rounded-full ${getCardStyle("student").line} group-hover:w-12 transition-all duration-200`} />
          </Link>

          {/* Card 2: Tutor Studio */}
          <Link
            href="/TutorStudio"
            className={`group p-8 rounded-2xl flex flex-col justify-between h-[15.625rem] text-left transition-all ${getCardStyle("tutor").bg}`}
            aria-label="Go to Tutor Studio. Share your methods and grow your audience with our professional tutor toolset."
          >
            <div>
              <div className={`${getCardStyle("tutor").icon}`}>
                {/* Tutor Studio Icon */}
                <svg className="w-8 h-8 mb-4 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${getCardStyle("tutor").text}`}>Tutor Studio</h3>
              <p className={`text-sm opacity-90 leading-relaxed max-w-[17.5rem] ${getCardStyle("tutor").text}`}>
                Share your methods and grow your audience with our professional tutor toolset.
              </p>
            </div>
            <div className={`w-6 h-[2px] rounded-full ${getCardStyle("tutor").line} group-hover:w-12 transition-all duration-200`} />
          </Link>

          {/* Card 3: Analytics */}
          <button
            onClick={() => alert("Loading learning analytics dashboard...")}
            className={`group p-8 rounded-2xl flex flex-col justify-between h-[15.625rem] text-left cursor-pointer transition-all ${getCardStyle("analytics").bg}`}
            aria-label="Open Analytics module. Monitor real-time learning metrics and receive actionable data-driven insights."
          >
            <div>
              <div className={`${getCardStyle("analytics").icon}`}>
                {/* Chart Up Icon */}
                <svg className="w-8 h-8 mb-4 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${getCardStyle("analytics").text}`}>Analytics</h3>
              <p className={`text-sm opacity-90 leading-relaxed max-w-[17.5rem] ${getCardStyle("analytics").text}`}>
                Monitor real-time learning metrics and receive actionable data-driven insights.
              </p>
            </div>
            <div className={`w-6 h-[2px] rounded-full ${getCardStyle("analytics").line} group-hover:w-12 transition-all duration-200`} />
          </button>

          {/* Card 4: The Arena */}
          <Link
            href="/TheArena"
            className={`group p-8 rounded-2xl flex flex-col justify-between h-[15.625rem] text-left transition-all ${getCardStyle("arena").bg}`}
            aria-label="Go to The Arena. Explore our competitive landscape and challenge peers in real-time skill arenas."
          >
            <div>
              <div className={`${getCardStyle("arena").icon}`}>
                {/* Crossed Swords Swords Icon */}
                <svg className="w-8 h-8 mb-4 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0L8.282 15.71a2 2 0 01-2.828 0l-.708-.707a2 2 0 010-2.828l6.536-6.536m3.536 3.536L20 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636l3.536 3.536m0 0l6.546 6.538a2 2 0 010 2.828l-.707.708a2 2 0 01-2.828 0L5.64 12.71m3.536-3.536L2 2" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${getCardStyle("arena").text}`}>The Arena</h3>
              <p className={`text-sm opacity-90 leading-relaxed max-w-[17.5rem] ${getCardStyle("arena").text}`}>
                Explore our competitive landscape and challenge peers in real-time skill arenas.
              </p>
            </div>
            <div className={`w-6 h-[2px] rounded-full ${getCardStyle("arena").line} group-hover:w-12 transition-all duration-200`} />
          </Link>

          {/* Card 5: Story Creator */}
          <button
            onClick={() => alert("Launching Story Creator workspace...")}
            className={`group p-8 rounded-2xl flex flex-col justify-between h-[15.625rem] text-left cursor-pointer transition-all ${getCardStyle("story").bg}`}
            aria-label="Open Story Creator module. Create complex educational narratives and invite students into your unique world."
          >
            <div>
              <div className={`${getCardStyle("story").icon}`}>
                {/* Book Icon */}
                <svg className="w-8 h-8 mb-4 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${getCardStyle("story").text}`}>Story Creator</h3>
              <p className={`text-sm opacity-90 leading-relaxed max-w-[17.5rem] ${getCardStyle("story").text}`}>
                Create complex educational narratives and invite students into your unique world.
              </p>
            </div>
            <div className={`w-6 h-[2px] rounded-full ${getCardStyle("story").line} group-hover:w-12 transition-all duration-200`} />
          </button>

          {/* Card 6: Simulations */}
          <button
            onClick={() => alert("Initializing 3D spatial simulation portal...")}
            className={`group p-8 rounded-2xl flex flex-col justify-between h-[15.625rem] text-left cursor-pointer transition-all ${getCardStyle("simulations").bg}`}
            aria-label="Start Simulations. Experience life-like interactive simulations designed for high-stakes practical learning."
          >
            <div>
              <div className={`${getCardStyle("simulations").icon}`}>
                {/* Cube Icon */}
                <svg className="w-8 h-8 mb-4 transition-transform group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-2 ${getCardStyle("simulations").text}`}>Simulations</h3>
              <p className={`text-sm opacity-90 leading-relaxed max-w-[17.5rem] ${getCardStyle("simulations").text}`}>
                Experience life-like interactive simulations designed for high-stakes practical learning.
              </p>
            </div>
            <div className={`w-6 h-[2px] rounded-full ${getCardStyle("simulations").line} group-hover:w-12 transition-all duration-200`} />
          </button>
        </div>
      </section>

      {/* LOWER HIGHLIGHTS */}
      <section
        aria-label="Features and Stats"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Collaborative Lab Card */}
        <div className="lg:col-span-7 p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between gap-6 shadow-xs">
          <div className="space-y-4 text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--success-accent)]/10 text-[var(--success-accent)] border border-[var(--success-accent)]/20">
              New Feature
            </span>
            <h3 className="text-2xl font-extrabold text-[var(--text-main)]">Collaborative Lab</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-lg">
              Code, design, and solve problems together with colleagues in our new synchronized workspace.
              Real-time version control, instant side-by-side reviews, and integrated sandbox execution.
            </p>
          </div>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--border-color)]">
            <Image
              src="/collaborative_lab.png"
              alt="Dashboard mockup of the synchronized collaborative workspace, containing code snippets and active users"
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 600px"
            />
          </div>
        </div>

        {/* Leaderboard & Small Stats Card */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">

          {/* Arena Leaderboard btw not visible in focus mode */}
          <div
            className="gamification-element p-8 rounded-2xl text-left flex items-start justify-between relative overflow-hidden flex-1 shadow-sm border border-[var(--border-color)]/25"
            style={{
              background: theme === "high-contrast"
                ? "var(--bg-secondary)"
                : theme === "tritanopia"
                  ? "#1c1917"
                  : theme === "protanopia" || theme === "deuteranopia"
                    ? "#0f172a"
                    : "#0b1b3d",
              color: "white"
            }}
          >
            <div className="space-y-4 max-w-[70%]">
              <h3 className="text-2xl font-extrabold">Arena Leaderboard</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                See where you stand against the top 1% of learners worldwide. Join daily tournaments
                and earn unique rank profile frames.
              </p>
              <Link
                href="/TheArena"
                className="inline-flex items-center text-sm font-bold text-[var(--focus-ring-color)] hover:underline gap-1.5 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color)]"
                aria-label="View leaderboards in the Arena module"
              >
                View Leaderboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Trophy Icon */}
            <div className="text-[var(--focus-ring-color)] opacity-90 p-1">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Bottom Row Stats Container */}
          <div className="grid grid-cols-2 gap-6">
            {/* Stat 1 */}
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center flex flex-col justify-center gap-1 shadow-2xs">
              <span className="text-3xl font-black text-[#f05a28] tracking-tight">98%</span>
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Success Rate</span>
            </div>

            {/* Stat 2 */}
            <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center flex flex-col justify-center gap-1 shadow-2xs">
              <span className="text-3xl font-black text-[var(--text-main)] tracking-tight">24/7</span>
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Expert Support</span>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
