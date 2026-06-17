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