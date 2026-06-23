"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrganizations } from '../../../components/organizations/OrganizationContext';
import { useAuth } from '../../../components/AuthCOntext';
import { ArrowLeft, BookOpen, Users, Trophy, Flame, Medal, Star, TrendingUp, Zap, Calendar } from 'lucide-react';

type LeaderboardTab = 'streak' | 'level';

export default function StudentOrganizationDetails() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const { getOrganization, getOrgLeaderboard, getOrgMembers, getStreak } = useOrganizations();
  const { user } = useAuth();
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardTab>('level');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const org = getOrganization(orgId);

  useEffect(() => {
    if (!orgId) return;
    setLoadingLeaderboard(true);

    if (leaderboardTab === 'level') {
      getOrgLeaderboard(orgId).then(entries => {
        const sorted = [...entries].sort((a, b) => b.level - a.level);
        setLeaderboard(sorted);
        setLoadingLeaderboard(false);
      });
    } else {
      getOrgMembers(orgId).then(async (memberIds) => {
        const streakEntries = await Promise.all(
          memberIds.map(async (studentId) => {
            const streak = await getStreak(studentId);
            return { studentId, streak: streak.current };
          })
        );
        const sorted = streakEntries.sort((a, b) => b.streak - a.streak);
        setLeaderboard(sorted);
        setLoadingLeaderboard(false);
      });
    }
  }, [orgId, leaderboardTab, getOrgLeaderboard, getOrgMembers, getStreak]);

  if (!org) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Organization not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-medium">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/StudentPortal/explore" className="text-sm font-medium text-blue-600 flex items-center gap-1.5 mb-4 hover:underline">
          <ArrowLeft size={16} /> Back to Explore
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{org.name}</h1>
            <p className="text-slate-600 mt-2 max-w-2xl text-lg">{org.description}</p>
          </div>
          <JoinButton orgId={org.id} userId={user?.uid} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Courses Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="text-blue-600" /> Courses
              </h2>
            </div>
            <div className="p-6">
              {org.courseCount === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">No courses yet.</p>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">{org.courseCount} course{org.courseCount !== 1 ? 's' : ''} in this organization.</p>
              )}
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="text-amber-500" /> Leaderboard
              </h2>
              <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setLeaderboardTab('level')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${leaderboardTab === 'level' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Star size={16} className="inline mr-1" />Level
                </button>
                <button
                  onClick={() => setLeaderboardTab('streak')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${leaderboardTab === 'streak' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Flame size={16} className="inline mr-1" />Streak
                </button>
              </div>
            </div>
            <div className="p-6">
              {loadingLeaderboard ? (
                <div className="text-center py-8 text-slate-400">Loading leaderboard...</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">No leaderboard data yet.</p>
                  <p className="text-slate-400 text-sm mt-1">Complete courses to appear here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry.studentId} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="w-8 text-center font-bold text-slate-400">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold shrink-0">
                        {entry.studentId.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 truncate">{entry.studentId}</div>
                        <div className="text-xs text-slate-400">Student</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-800 flex items-center gap-1 text-purple-500">
                          {leaderboardTab === 'level' ? (
                            <><Star size={14} />Lvl {entry.level}</>
                          ) : (
                            <><Flame size={14} className="text-orange-500" />{entry.streak} day{entry.streak !== 1 ? 's' : ''}</>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Users className="text-emerald-500" /> Members
            </h2>
            <div className="text-4xl font-black text-slate-900 mb-1">{org.memberCount}</div>
            <p className="text-sm text-slate-500 font-medium">Total members</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <BookOpen className="text-blue-500" /> Courses
            </h2>
            <div className="text-4xl font-black text-slate-900 mb-1">{org.courseCount}</div>
            <p className="text-sm text-slate-500 font-medium">Available courses</p>
          </div>

          <StudentLevelCard orgId={orgId} userId={user?.uid} />
          <StudentStreakCard userId={user?.uid} />
        </div>
      </div>
    </div>
  );
}

function JoinButton({ orgId, userId }: { orgId: string; userId?: string }) {
  const { joinOrganization, isOrgMember } = useOrganizations();
  const [joining, setJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!userId) { setChecking(false); return; }
    isOrgMember(orgId, userId).then(member => {
      setIsMember(member);
      setChecking(false);
    });
  }, [orgId, userId, isOrgMember]);

  if (!userId) return null;
  if (checking) return <div className="px-5 py-2.5 text-sm text-slate-400">...</div>;
  if (isMember) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-2.5 text-emerald-700 font-bold text-sm">
        You're a member
      </div>
    );
  }

  const handleJoin = async () => {
    setJoining(true);
    const result = await joinOrganization(orgId, userId);
    if (result.success) setIsMember(true);
    setJoining(false);
  };

  return (
    <button
      onClick={handleJoin}
      disabled={joining}
      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
    >
      {joining ? 'Joining...' : 'Join Organization'}
    </button>
  );
}

function StudentStreakCard({ userId }: { userId?: string }) {
  const { getStreak } = useOrganizations();
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);

  useEffect(() => {
    if (!userId) return;
    getStreak(userId).then(data => setStreak(data));
  }, [userId, getStreak]);

  if (!userId || !streak) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Flame className="text-orange-500" /> Your Streak
      </h2>
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 mb-2 mx-auto">
            <span className="text-xl font-black text-orange-700">{streak.current}</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">Current</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 mb-2 mx-auto">
            <span className="text-xl font-black text-amber-700">{streak.longest}</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">Best</div>
        </div>
      </div>
    </div>
  );
}

function StudentLevelCard({ orgId, userId }: { orgId: string; userId?: string }) {
  const { getStudentXp, getXpProgress } = useOrganizations();
  const [data, setData] = useState<{ level: number; currentXp: number; nextLevelXp: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    getStudentXp(orgId, userId).then(xp => {
      setData(getXpProgress(xp));
      setLoading(false);
    });
  }, [orgId, userId, getStudentXp, getXpProgress]);

  if (!userId || loading) return null;
  if (!data) return null;

  const progress = data.nextLevelXp > 0 ? (data.currentXp / data.nextLevelXp) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
        <Zap className="text-purple-500" /> Your Level
      </h2>
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 mb-3 mx-auto">
        <span className="text-2xl font-black text-purple-700">{data.level}</span>
      </div>
      <div className="text-center mb-3">
        <div className="text-xs text-slate-400 font-medium">
          XP: {data.currentXp} / {data.nextLevelXp}
        </div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-purple-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
