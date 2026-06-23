"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, set, get, update, push } from 'firebase/database';
import { useAuth } from '../AuthCOntext';

export interface Organization {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  isInviteOnly: boolean;
  memberCount: number;
  courseCount: number;
  createdAt: string;
}

export interface OrganizationLeaderboardEntry {
  studentId: string;
  level: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastDate: string | null;
}

interface OrganizationContextType {
  organizations: Organization[];
  getOrganization: (id: string) => Organization | undefined;
  getOrganizationsByOwner: (ownerId: string) => Organization[];
  getOrganizationsForStudent: (studentId: string) => Promise<Organization[]>;
  getPublicOrganizations: () => Organization[];
  createOrganization: (org: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'courseCount'>) => Promise<string>;
  getOrgMembers: (orgId: string) => Promise<string[]>;
  getOrgCourses: (orgId: string) => Promise<string[]>;
  addCourseToOrganization: (orgId: string, courseId: string) => Promise<void>;
  isOrgMember: (orgId: string, studentId: string) => Promise<boolean>;
  joinOrganization: (orgId: string, studentId: string) => Promise<{ success: boolean; error?: string }>;
  inviteStudentByEmail: (orgId: string, email: string) => Promise<{ success: boolean; error?: string }>;
  getOrgLeaderboard: (orgId: string) => Promise<OrganizationLeaderboardEntry[]>;
  updateStudentLevel: (orgId: string, studentId: string, level: number) => Promise<void>;
  getStudentXp: (orgId: string, studentId: string) => Promise<number>;
  addActivityPoints: (orgId: string, studentId: string, points: number) => Promise<{ xpGained: number; newLevel: number; totalXp: number }>;
  getXpProgress: (totalXp: number) => { level: number; currentXp: number; nextLevelXp: number };
  updateStreak: (studentId: string) => Promise<StreakData>;
  getStreak: (studentId: string) => Promise<StreakData>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const orgsRef = ref(db, 'organizations');
    const unsubscribe = onValue(orgsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orgList = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
          memberCount: data[key].memberCount ?? 0,
          courseCount: data[key].courseCount ?? 0,
        }));
        setOrganizations(orgList);
      } else {
        setOrganizations([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const getOrganization = (id: string) => organizations.find(o => o.id === id);

  const getOrganizationsByOwner = (ownerId: string) => organizations.filter(o => o.ownerId === ownerId);

  const getOrganizationsForStudent = async (studentId: string): Promise<Organization[]> => {
    const orgsRef = ref(db, 'organizations');
    const snapshot = await get(orgsRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    const orgIds: string[] = [];
    for (const orgId in data) {
      if (data[orgId].members?.[studentId]) {
        orgIds.push(orgId);
      }
    }
    return organizations.filter(o => orgIds.includes(o.id));
  };

  const getPublicOrganizations = () => organizations.filter(o => !o.isInviteOnly);

  const createOrganization = async (orgData: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'courseCount'>) => {
    const newOrgRef = push(ref(db, 'organizations'));
    const newId = newOrgRef.key!;
    const newOrg = {
      ...orgData,
      memberCount: 1,
      courseCount: 0,
      createdAt: new Date().toISOString(),
    };

    await set(newOrgRef, newOrg);
    const memberRef = ref(db, `organizations/${newId}/members/${orgData.ownerId}`);
    await set(memberRef, true);
    return newId;
  };

  const getOrgMembers = async (orgId: string): Promise<string[]> => {
    const membersRef = ref(db, `organizations/${orgId}/members`);
    const snapshot = await get(membersRef);
    if (!snapshot.exists()) return [];
    return Object.keys(snapshot.val());
  };

  const getOrgCourses = async (orgId: string): Promise<string[]> => {
    const coursesRef = ref(db, `organizations/${orgId}/courses`);
    const snapshot = await get(coursesRef);
    if (!snapshot.exists()) return [];
    return Object.keys(snapshot.val());
  };

  const addCourseToOrganization = async (orgId: string, courseId: string) => {
    const courseRef = ref(db, `organizations/${orgId}/courses/${courseId}`);
    await set(courseRef, true);
    const countRef = ref(db, `organizations/${orgId}/courseCount`);
    const org = getOrganization(orgId);
    await set(countRef, (org?.courseCount ?? 0) + 1);
  };

  const joinOrganization = async (orgId: string, studentId: string) => {
    const membersRef = ref(db, `organizations/${orgId}/members/${studentId}`);
    const existing = await get(membersRef);
    if (existing.exists()) {
      return { success: false, error: 'Already a member' };
    }
    await set(membersRef, true);
    const countRef = ref(db, `organizations/${orgId}/memberCount`);
    const org = getOrganization(orgId);
    await set(countRef, (org?.memberCount ?? 0) + 1);
    const lbRef = ref(db, `organizations/${orgId}/leaderboard/${studentId}`);
    await set(lbRef, 0);
    return { success: true };
  };

  const inviteStudentByEmail = async (orgId: string, email: string) => {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) return { success: false, error: 'No users found' };

    const usersData = snapshot.val();
    let studentId = null;
    for (const uid in usersData) {
      if (usersData[uid].email === email) {
        studentId = uid;
        break;
      }
    }

    if (!studentId) {
      return { success: false, error: 'User with this email not found' };
    }

    return joinOrganization(orgId, studentId);
  };

  const getOrgLeaderboard = async (orgId: string): Promise<OrganizationLeaderboardEntry[]> => {
    const lbRef = ref(db, `organizations/${orgId}/leaderboard`);
    const snapshot = await get(lbRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      studentId: key,
      level: data[key] ?? 1,
    }));
  };

  const updateStudentLevel = async (orgId: string, studentId: string, level: number) => {
    const studentRef = ref(db, `organizations/${orgId}/leaderboard/${studentId}`);
    await set(studentRef, level);
  };

  const isOrgMember = async (orgId: string, studentId: string): Promise<boolean> => {
    const memberRef = ref(db, `organizations/${orgId}/members/${studentId}`);
    const snapshot = await get(memberRef);
    return snapshot.exists();
  };

  const xpForLevel = (level: number): number => {
    if (level === 0) return 5;
    const prev = xpForLevel(level - 1);
    return Math.ceil((prev * 1.5) / 5) * 5;
  };

  const getXpProgress = (totalXp: number): { level: number; currentXp: number; nextLevelXp: number } => {
    let level = 0;
    let xpNeeded = 5;
    let accumulated = 0;
    while (accumulated + xpNeeded <= totalXp) {
      accumulated += xpNeeded;
      level++;
      xpNeeded = Math.ceil((xpNeeded * 1.5) / 5) * 5;
    }
    return { level, currentXp: totalXp - accumulated, nextLevelXp: xpNeeded };
  };

  const calculateXpFromPoints = (points: number): number => {
    return Math.ceil(points / 20) * 5;
  };

  const getStudentXp = async (orgId: string, studentId: string): Promise<number> => {
    const xpRef = ref(db, `organizations/${orgId}/xp/${studentId}`);
    const snapshot = await get(xpRef);
    return snapshot.exists() ? (snapshot.val() as number) : 0;
  };

  const addActivityPoints = async (orgId: string, studentId: string, points: number): Promise<{ xpGained: number; newLevel: number; totalXp: number }> => {
    const xpGained = calculateXpFromPoints(points);
    const currentXp = await getStudentXp(orgId, studentId);
    const totalXp = currentXp + xpGained;

    const xpRef = ref(db, `organizations/${orgId}/xp/${studentId}`);
    await set(xpRef, totalXp);

    const { level } = getXpProgress(totalXp);
    await updateStudentLevel(orgId, studentId, level);

    return { xpGained, newLevel: level, totalXp };
  };

  const getStreak = async (studentId: string): Promise<StreakData> => {
    const streakRef = ref(db, `users/${studentId}/streak`);
    const snapshot = await get(streakRef);
    if (!snapshot.exists()) {
      return { current: 0, longest: 0, lastDate: null };
    }
    return snapshot.val() as StreakData;
  };

  const updateStreak = async (studentId: string): Promise<StreakData> => {
    const today = new Date().toISOString().split('T')[0];
    const current = await getStreak(studentId);

    if (current.lastDate === today) {
      return current;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newCurrent: number;
    if (current.lastDate === yesterdayStr) {
      newCurrent = current.current + 1;
    } else {
      newCurrent = 1;
    }

    const newLongest = Math.max(newCurrent, current.longest);
    const newData: StreakData = { current: newCurrent, longest: newLongest, lastDate: today };

    const streakRef = ref(db, `users/${studentId}/streak`);
    await set(streakRef, newData);

    return newData;
  };

  return (
    <OrganizationContext.Provider value={{
      organizations,
      getOrganization,
      getOrganizationsByOwner,
      getOrganizationsForStudent,
      getPublicOrganizations,
      createOrganization,
      getOrgMembers,
      getOrgCourses,
      addCourseToOrganization,
      isOrgMember,
      joinOrganization,
      inviteStudentByEmail,
      getOrgLeaderboard,
      updateStudentLevel,
      getStudentXp,
      addActivityPoints,
      getXpProgress,
      updateStreak,
      getStreak,
    }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganizations must be used within an OrganizationProvider');
  }
  return context;
}
