"use client";

import { createContext, useContext } from 'react';

// Allows community pages to know their base path so links resolve correctly
export const CommunityBasePathContext = createContext('/community');

export function useCommunityBasePath() {
  return useContext(CommunityBasePathContext);
}
