"use client";

import React, { useState, use } from "react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

//student data 
interface Student {
    name: string;
    email: string;
    progress: number;
    lastActive: string;
    avgScore: number;
    status: "Excelling" | "on Track" | "At Risk";
    avatarColor: string;
    initials: string;
}

