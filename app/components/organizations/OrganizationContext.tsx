"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, set, get, push, remove } from 'firebase/database';
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

export interface ModuleData {
  id: string;
  index: number;
  title: string;
  duration: string;
  activityIds: Record<string, boolean>;
}

export interface ActivityData {
  id?: string;
  type: string;
  title: string;
  courseId: string;
  moduleId: string;
  orgId: string;
  content: any;
  durationMinutes: number;
  maxPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseData {
  id?: string;
  title: string;
  description: string;
  subject: string;
  orgId: string;
  ownerId: string;
  modules: Record<string, ModuleData>;
  leaderboard: Record<string, number>;
  moduleLeaderboard: Record<string, Record<string, number>>;
  createdAt: string;
  updatedAt: string;
}

export interface OrgMemberDetails {
  uid: string;
  role: 'student' | 'tutor';
  permissions: {
    canCreateCourses: boolean;
  };
}

interface OrganizationContextType {
  organizations: Organization[];
  getOrganization: (id: string) => Organization | undefined;
  getOrganizationsByOwner: (ownerId: string) => Organization[];
  getOrganizationsForStudent: (studentId: string) => Promise<Organization[]>;
  getPublicOrganizations: () => Organization[];
  createOrganization: (org: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'courseCount'>) => Promise<string>;
  getOrgMembers: (orgId: string) => Promise<string[]>;
  getOrgMembersDetails: (orgId: string) => Promise<OrgMemberDetails[]>;
  getOrgMember: (orgId: string, uid: string) => Promise<OrgMemberDetails | null>;
  getOrgMemberRole: (orgId: string, uid: string) => Promise<'student' | 'tutor' | null>;
  getOrgCourses: (orgId: string) => Promise<string[]>;
  getOrgCoursesWithData: (orgId: string) => Promise<CourseData[]>;
  getOrgCourseCount: (orgId: string) => Promise<number>;
  getOrgMemberCount: (orgId: string) => Promise<number>;
  addCourseToOrganization: (orgId: string, courseId: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  createCourse: (data: { title: string; description: string; subject: string; orgId: string; ownerId: string; modules: Record<string, { id: string; index: number; title: string; duration: string; blocks: any[] }> }) => Promise<{ success: boolean; courseId?: string; error?: string }>;
  isOrgMember: (orgId: string, studentId: string) => Promise<boolean>;
  getCourse: (courseId: string) => Promise<CourseData | null>;
  getCourseLeaderboard: (courseId: string) => Promise<{ studentId: string; points: number }[]>;
  getModuleLeaderboard: (courseId: string, moduleId: string) => Promise<{ studentId: string; points: number }[]>;
  getActivity: (activityId: string) => Promise<ActivityData | null>;
  recordActivityPoints: (activityId: string, courseId: string, moduleId: string, studentId: string, points: number) => Promise<void>;
  getActivityPoints: (activityId: string, studentId: string) => Promise<number>;
  getCourseProgress: (courseId: string, studentId: string) => Promise<number>;
  joinOrganization: (orgId: string, studentId: string) => Promise<{ success: boolean; error?: string }>;
  inviteStudentByEmail: (orgId: string, email: string) => Promise<{ success: boolean; error?: string }>;
  getOrgLeaderboard: (orgId: string) => Promise<OrganizationLeaderboardEntry[]>;
  updateStudentLevel: (orgId: string, studentId: string, level: number) => Promise<void>;
  getStudentXp: (orgId: string, studentId: string) => Promise<number>;
  addActivityPoints: (orgId: string, studentId: string, points: number) => Promise<{ xpGained: number; newLevel: number; totalXp: number }>;
  getXpProgress: (totalXp: number) => { level: number; currentXp: number; nextLevelXp: number };
  calculatePoints: (accuracy: number, timeTakenSeconds: number, expectedDurationSeconds: number, deadline: string, completionDateTime: string) => { accuracyPoints: number; speedPoints: number; deadlinePoints: number; total: number };
  completeActivity: (params: { activityId: string; courseId: string; moduleId: string; orgId: string; studentId: string; accuracy: number; timeTakenSeconds: number; expectedDurationSeconds: number; deadline: string; completionDateTime: string }) => Promise<{ totalPoints: number; xpGained: number; newLevel: number; streak: StreakData }>;
  updateStreak: (studentId: string) => Promise<StreakData>;
  getStreak: (studentId: string) => Promise<StreakData>;
  setMemberRole: (orgId: string, targetUid: string, role: 'student' | 'tutor') => Promise<void>;
  setMemberPermission: (orgId: string, targetUid: string, permission: string, value: boolean) => Promise<void>;
  generateInviteLink: (orgId: string) => Promise<string>;
  joinViaInviteLink: (orgId: string, token: string, studentId: string) => Promise<{ success: boolean; error?: string }>;
  leaveOrganization: (orgId: string, studentId: string) => Promise<{ success: boolean; error?: string }>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

function defaultMemberData(role: 'student' | 'tutor') {
  return { role, permissions: { canCreateCourses: role === 'tutor' } };
}

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

  const getUserRole = async (uid: string): Promise<'student' | 'tutor'> => {
    const userRef = ref(db, `users/${uid}/role`);
    const snapshot = await get(userRef);
    return (snapshot.val() as 'student' | 'tutor') || 'student';
  };

  const createOrganization = async (orgData: Omit<Organization, 'id' | 'createdAt' | 'memberCount' | 'courseCount'>) => {
    const newOrgRef = push(ref(db, 'organizations'));
    const newId = newOrgRef.key!;
    const newOrg = {
      ...orgData,
      createdAt: new Date().toISOString(),
    };

    await set(newOrgRef, newOrg);
    const memberRef = ref(db, `organizations/${newId}/members/${orgData.ownerId}`);
    await set(memberRef, defaultMemberData('tutor'));
    return newId;
  };

  const getOrgMembers = async (orgId: string): Promise<string[]> => {
    const membersRef = ref(db, `organizations/${orgId}/members`);
    const snapshot = await get(membersRef);
    if (!snapshot.exists()) return [];
    return Object.keys(snapshot.val());
  };

  const getOrgMembersDetails = async (orgId: string): Promise<OrgMemberDetails[]> => {
    const membersRef = ref(db, `organizations/${orgId}/members`);
    const snapshot = await get(membersRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map(uid => ({
      uid,
      role: data[uid]?.role ?? 'student',
      permissions: {
        canCreateCourses: data[uid]?.permissions?.canCreateCourses ?? false,
      },
    }));
  };

  const getOrgMember = async (orgId: string, uid: string): Promise<OrgMemberDetails | null> => {
    const memberRef = ref(db, `organizations/${orgId}/members/${uid}`);
    const snapshot = await get(memberRef);
    if (!snapshot.exists()) return null;
    const data = snapshot.val();
    return {
      uid,
      role: data?.role ?? 'student',
      permissions: {
        canCreateCourses: data?.permissions?.canCreateCourses ?? false,
      },
    };
  };

  const getOrgCourses = async (orgId: string): Promise<string[]> => {
    const coursesRef = ref(db, `organizations/${orgId}/courses`);
    const snapshot = await get(coursesRef);
    if (!snapshot.exists()) return [];
    return Object.keys(snapshot.val());
  };

  const getOrgCoursesWithData = async (orgId: string): Promise<CourseData[]> => {
    const courseIds = await getOrgCourses(orgId);
    const courses = await Promise.all(courseIds.map(id => getCourse(id)));
    return courses.filter((c): c is CourseData => c !== null);
  };

  const getOrgCourseCount = async (orgId: string): Promise<number> => {
    const courses = await getOrgCourses(orgId);
    return courses.length;
  };

  const getOrgMemberCount = async (orgId: string): Promise<number> => {
    const members = await getOrgMembers(orgId);
    return members.length;
  };

  const addCourseToOrganization = async (orgId: string, courseId: string, userId: string) => {
    const org = getOrganization(orgId);
    if (!org) return { success: false, error: 'Organization not found' };

    if (org.ownerId !== userId) {
      const member = await getOrgMember(orgId, userId);
      if (!member || member.role !== 'tutor' || !member.permissions.canCreateCourses) {
        return { success: false, error: 'You do not have permission to create courses in this organization' };
      }
    }

    const courseRef = ref(db, `organizations/${orgId}/courses/${courseId}`);
    await set(courseRef, true);
    return { success: true };
  };

  const createCourse = async (data: { title: string; description: string; subject: string; orgId: string; ownerId: string; modules: Record<string, { id: string; index: number; title: string; duration: string; blocks: any[] }> }) => {
    const courseRef = push(ref(db, 'courses'));
    const courseId = courseRef.key!;
    const now = new Date().toISOString();

    const modulesData: Record<string, ModuleData> = {};

    for (const moduleKey of Object.keys(data.modules)) {
      const mod = data.modules[moduleKey];
      const moduleActivityIds: Record<string, boolean> = {};

      for (const block of mod.blocks) {
        const activityRef = push(ref(db, 'activities'));
        const activityId = activityRef.key!;
        const maxPoints = block.type === 'quiz'
          ? (block.quizQuestions?.length || 0) * 10
          : block.type === 'sandbox' ? 30 : 10;
        const activity: ActivityData = {
          id: activityId,
          type: block.type,
          title: block.title || `${mod.title} Activity`,
          courseId,
          moduleId: mod.id,
          orgId: data.orgId,
          content: block,
          durationMinutes: block.durationMinutes || 10,
          maxPoints,
          createdAt: now,
          updatedAt: now,
        };

        // Clean activity payload to remove any 'undefined' properties for Firebase
        const cleanActivity = JSON.parse(JSON.stringify(activity));
        await set(activityRef, cleanActivity);
        moduleActivityIds[activityId] = true;
      }

      modulesData[mod.id] = {
        id: mod.id,
        index: mod.index,
        title: mod.title,
        duration: mod.duration,
        activityIds: moduleActivityIds,
      };
    }

    const course: CourseData = {
      id: courseId,
      title: data.title,
      description: data.description,
      subject: data.subject,
      orgId: data.orgId,
      ownerId: data.ownerId,
      modules: modulesData,
      leaderboard: {},
      moduleLeaderboard: {},
      createdAt: now,
      updatedAt: now,
    };

    // Clean course payload to remove any 'undefined' properties
    const cleanCourse = JSON.parse(JSON.stringify(course));
    await set(courseRef, cleanCourse);
    const orgResult = await addCourseToOrganization(data.orgId, courseId, data.ownerId);
    if (!orgResult.success) {
      await remove(courseRef);
      return { success: false, error: orgResult.error };
    }
    return { success: true, courseId };
  };


  const getCourse = async (courseId: string): Promise<CourseData | null> => {
    const courseRef = ref(db, `courses/${courseId}`);
    const snapshot = await get(courseRef);
    if (!snapshot.exists()) return null;
    return snapshot.val() as CourseData;
  };

  const getCourseLeaderboard = async (courseId: string): Promise<{ studentId: string; points: number }[]> => {
    const lbRef = ref(db, `courses/${courseId}/leaderboard`);
    const snapshot = await get(lbRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ studentId: key, points: data[key] }));
  };

  const getModuleLeaderboard = async (courseId: string, moduleId: string): Promise<{ studentId: string; points: number }[]> => {
    const lbRef = ref(db, `courses/${courseId}/moduleLeaderboard/${moduleId}`);
    const snapshot = await get(lbRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ studentId: key, points: data[key] }));
  };

  const getActivity = async (activityId: string): Promise<ActivityData | null> => {
    const activityRef = ref(db, `activities/${activityId}`);
    const snapshot = await get(activityRef);
    if (!snapshot.exists()) return null;
    return snapshot.val() as ActivityData;
  };

  const recordActivityPoints = async (activityId: string, courseId: string, moduleId: string, studentId: string, points: number) => {
    const now = new Date().toISOString();
    const pointsRef = ref(db, `activities/${activityId}/points/${studentId}`);
    await set(pointsRef, points);

    const courseLbRef = ref(db, `courses/${courseId}/leaderboard/${studentId}`);
    const courseSnap = await get(courseLbRef);
    const currentCoursePoints = courseSnap.exists() ? (courseSnap.val() || 0) : 0;
    await set(courseLbRef, currentCoursePoints + points);

    const moduleLbRef = ref(db, `courses/${courseId}/moduleLeaderboard/${moduleId}/${studentId}`);
    const moduleSnap = await get(moduleLbRef);
    const currentModulePoints = moduleSnap.exists() ? (moduleSnap.val() || 0) : 0;
    await set(moduleLbRef, currentModulePoints + points);

    await set(ref(db, `activities/${activityId}/updatedAt`), now);
  };

  const getActivityPoints = async (activityId: string, studentId: string): Promise<number> => {
    const pointsRef = ref(db, `activities/${activityId}/points/${studentId}`);
    const snapshot = await get(pointsRef);
    return snapshot.exists() ? (snapshot.val() || 0) : 0;
  };

  const getCourseProgress = async (courseId: string, studentId: string): Promise<number> => {
    const course = await getCourse(courseId);
    if (!course || !course.modules) return 0;
    const modules = Object.values(course.modules);
    if (modules.length === 0) return 0;

    let completedCount = 0;
    for (const mod of modules) {
      const activityIds = Object.keys(mod.activityIds || {});
      if (activityIds.length === 0) continue;
      const points = await Promise.all(activityIds.map(aid => getActivityPoints(aid, studentId)));
      const allDone = points.every(p => p > 0);
      if (allDone) completedCount++;
    }
    return Math.round((completedCount / modules.length) * 100);
  };

  const joinOrganization = async (orgId: string, studentId: string) => {
    const org = getOrganization(orgId);
    if (!org) return { success: false, error: 'Organization not found' };

    const membersRef = ref(db, `organizations/${orgId}/members/${studentId}`);
    const existing = await get(membersRef);
    if (existing.exists()) {
      return { success: false, error: 'Already a member' };
    }

    if (org.isInviteOnly) {
      return { success: false, error: 'This organization is invite-only' };
    }

    const role = await getUserRole(studentId);
    await set(membersRef, defaultMemberData(role));
    if (role !== 'tutor') {
      const lbRef = ref(db, `organizations/${orgId}/leaderboard/${studentId}`);
      await set(lbRef, 0);
    }
    return { success: true };
  };

  const inviteStudentByEmail = async (orgId: string, email: string) => {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) return { success: false, error: 'No users found' };

    const usersData = snapshot.val();
    let foundUid: string | null = null;
    for (const uid in usersData) {
      if (usersData[uid].email === email) {
        foundUid = uid;
        break;
      }
    }

    if (!foundUid) {
      return { success: false, error: 'User with this email not found' };
    }

    const memberRef = ref(db, `organizations/${orgId}/members/${foundUid}`);
    const existing = await get(memberRef);
    if (existing.exists()) {
      return { success: false, error: 'Already a member' };
    }

    const role = await getUserRole(foundUid);
    await set(memberRef, defaultMemberData(role));
    if (role !== 'tutor') {
      const lbRef = ref(db, `organizations/${orgId}/leaderboard/${foundUid}`);
      await set(lbRef, 0);
    }
    return { success: true };
  };

  const getOrgLeaderboard = async (orgId: string): Promise<OrganizationLeaderboardEntry[]> => {
    const lbRef = ref(db, `organizations/${orgId}/leaderboard`);
    const snapshot = await get(lbRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();

    const membersRef = ref(db, `organizations/${orgId}/members`);
    const membersSnap = await get(membersRef);
    const memberRoles = membersSnap.exists() ? membersSnap.val() : {};

    return Object.keys(data)
      .filter(key => {
        const role = memberRoles[key]?.role;
        return role !== 'tutor';
      })
      .map(key => ({
        studentId: key,
        level: data[key] ?? 1,
      }));
  };

  const getOrgMemberRole = async (orgId: string, uid: string): Promise<'student' | 'tutor' | null> => {
    const roleRef = ref(db, `organizations/${orgId}/members/${uid}/role`);
    const snap = await get(roleRef);
    return snap.exists() ? snap.val() : null;
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
    const role = await getOrgMemberRole(orgId, studentId);
    if (role === 'tutor') {
      return { xpGained: 0, newLevel: 0, totalXp: 0 };
    }

    const xpGained = calculateXpFromPoints(points);
    const currentXp = await getStudentXp(orgId, studentId);
    const totalXp = currentXp + xpGained;

    const xpRef = ref(db, `organizations/${orgId}/xp/${studentId}`);
    await set(xpRef, totalXp);

    const { level } = getXpProgress(totalXp);
    await updateStudentLevel(orgId, studentId, level);

    return { xpGained, newLevel: level, totalXp };
  };

  const calculatePoints = (accuracy: number, timeTakenSeconds: number, expectedDurationSeconds: number, deadline: string, completionDateTime: string) => {
    const accuracyPoints = Math.round(accuracy / 10);

    const deadlineTime = new Date(deadline).getTime();
    const completionTime = new Date(completionDateTime).getTime();
    const isBeforeDeadline = !isNaN(deadlineTime) && !isNaN(completionTime) && completionTime <= deadlineTime;
    const deadlinePoints = isBeforeDeadline ? 10 : 0;

    const speedRatio = expectedDurationSeconds > 0 ? timeTakenSeconds / expectedDurationSeconds : 1;
    let speedPoints = 0;
    if (speedRatio <= 0.5) {
      speedPoints = 10;
    } else if (speedRatio <= 1.5) {
      const countedValue = (speedRatio - 0.5) * 100;
      speedPoints = (100 - countedValue) / 10;
    }
    const finalSpeedPoints = Math.max(0, Math.min(10, Math.round(speedPoints)));

    const total = accuracyPoints + deadlinePoints + finalSpeedPoints;
    return { accuracyPoints, speedPoints: finalSpeedPoints, deadlinePoints, total };
  };

  const completeActivity = async (params: { activityId: string; courseId: string; moduleId: string; orgId: string; studentId: string; accuracy: number; timeTakenSeconds: number; expectedDurationSeconds: number; deadline: string; completionDateTime: string }) => {
    const { total: totalPoints } = calculatePoints(
      params.accuracy, params.timeTakenSeconds, params.expectedDurationSeconds,
      params.deadline, params.completionDateTime
    );

    await recordActivityPoints(params.activityId, params.courseId, params.moduleId, params.studentId, totalPoints);
    const xpResult = await addActivityPoints(params.orgId, params.studentId, totalPoints);
    const streak = await updateStreak(params.studentId);

    return { totalPoints, ...xpResult, streak };
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
    const userRef = ref(db, `users/${studentId}/role`);
    const roleSnap = await get(userRef);
    if (roleSnap.exists() && roleSnap.val() === 'tutor') {
      const existing = await getStreak(studentId);
      return existing;
    }

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

  const setMemberRole = async (orgId: string, targetUid: string, role: 'student' | 'tutor') => {
    const roleRef = ref(db, `organizations/${orgId}/members/${targetUid}/role`);
    await set(roleRef, role);
    if (role === 'tutor') {
      const permRef = ref(db, `organizations/${orgId}/members/${targetUid}/permissions/canCreateCourses`);
      await set(permRef, true);
    } else {
      const permRef = ref(db, `organizations/${orgId}/members/${targetUid}/permissions`);
      await set(permRef, { canCreateCourses: false });
    }
  };

  const setMemberPermission = async (orgId: string, targetUid: string, permission: string, value: boolean) => {
    const permRef = ref(db, `organizations/${orgId}/members/${targetUid}/permissions/${permission}`);
    await set(permRef, value);
  };

  const generateInviteLink = async (orgId: string): Promise<string> => {
    const token = crypto.randomUUID();
    const inviteRef = ref(db, `organizations/${orgId}/inviteLinks/${token}`);
    await set(inviteRef, {
      createdBy: user?.uid ?? 'unknown',
      createdAt: new Date().toISOString(),
      used: false,
    });
    return token;
  };

  const joinViaInviteLink = async (orgId: string, token: string, studentId: string) => {
    const inviteRef = ref(db, `organizations/${orgId}/inviteLinks/${token}`);
    const snapshot = await get(inviteRef);
    if (!snapshot.exists()) {
      return { success: false, error: 'Invalid or expired invite link' };
    }
    const data = snapshot.val();
    if (data.used) {
      return { success: false, error: 'This invite link has already been used' };
    }

    const memberRef = ref(db, `organizations/${orgId}/members/${studentId}`);
    const existing = await get(memberRef);
    if (existing.exists()) {
      return { success: false, error: 'Already a member' };
    }

    const role = await getUserRole(studentId);
    await set(memberRef, defaultMemberData(role));
    const lbRef = ref(db, `organizations/${orgId}/leaderboard/${studentId}`);
    await set(lbRef, 0);

    await set(inviteRef, { ...data, used: true, usedBy: studentId, usedAt: new Date().toISOString() });
    return { success: true };
  };

  const leaveOrganization = async (orgId: string, studentId: string) => {
    const memberRef = ref(db, `organizations/${orgId}/members/${studentId}`);
    const existing = await get(memberRef);
    if (!existing.exists()) {
      return { success: false, error: 'Not a member' };
    }
    const org = getOrganization(orgId);
    if (org?.ownerId === studentId) {
      return { success: false, error: 'Owner cannot leave. Transfer ownership first.' };
    }
    await remove(memberRef);
    const lbRef = ref(db, `organizations/${orgId}/leaderboard/${studentId}`);
    await remove(lbRef);
    const xpRef = ref(db, `organizations/${orgId}/xp/${studentId}`);
    await remove(xpRef);
    return { success: true };
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
      getOrgMembersDetails,
      getOrgMember,
      getOrgCourses,
      getOrgCoursesWithData,
      getOrgCourseCount,
      getOrgMemberCount,
      getOrgMemberRole,
      addCourseToOrganization,
      createCourse,
      isOrgMember,
      joinOrganization,
      inviteStudentByEmail,
      getOrgLeaderboard,
      updateStudentLevel,
      getStudentXp,
      addActivityPoints,
      getXpProgress,
      calculatePoints,
      completeActivity,
      updateStreak,
      getStreak,
      getCourse,
      getCourseLeaderboard,
      getModuleLeaderboard,
      getActivity,
      recordActivityPoints,
      getActivityPoints,
      getCourseProgress,
      setMemberRole,
      setMemberPermission,
      generateInviteLink,
      joinViaInviteLink,
      leaveOrganization,
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
