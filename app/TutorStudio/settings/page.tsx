"use client";
import React, { useState } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";

//states interface
interface ProfileData {
    displayName: string;
    email: string;
    tutorHandle: string;
    phone: string;
    institution: string;
    title: string;
    bio: string;
}