"use client";

import React, { useState, use } from "react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}