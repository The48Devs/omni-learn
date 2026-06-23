"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrganizations } from '../../../components/organizations/OrganizationContext';
import { useAuth } from '../../../components/AuthCOntext';
import { ArrowLeft, Users, BookOpen, Plus, Mail, Copy, CheckCircle2, Trophy, Flame, Star } from 'lucide-react';

export default function OrganizationDetails() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const { getOrganization, inviteStudentByEmail, getOrgLeaderboard } = useOrganizations();
  const { user } = useAuth();
  const [emailToInvite, setEmailToInvite] = useState('');
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<'streak' | 'level'>('level');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [memberCount, setMemberCount] = useState(0);
  const [courseIds, setCourseIds] = useState<string[]>([]);

  const org = getOrganization(orgId);

  useEffect(() => {
    if (!org) return;
    setMemberCount(org.memberCount);
    setCourseIds([]);
  }, [org]);

  useEffect(() => {
    if (!orgId) return;
    setLoadingLeaderboard(true);
    getOrgLeaderboard(orgId).then(entries => {
      const sorted = [...entries].sort((a, b) => b.level - a.level);
      setLeaderboard(sorted);
      setLoadingLeaderboard(false);
    });
  }, [orgId, getOrgLeaderboard]);

  if (!org) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Organization not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-medium">Go Back</button>
      </div>
    );
  }

  const isOwner = user?.uid === org.ownerId;

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/StudentPortal/organization/${org.id}`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToInvite.trim()) return;

    setInviteStatus(null);
    const result = await inviteStudentByEmail(org.id, emailToInvite.trim());
    if (result.success) {
      setInviteStatus({ type: 'success', msg: 'Student invited and added successfully!' });
      setEmailToInvite('');
      setMemberCount(prev => prev + 1);
    } else {
      setInviteStatus({ type: 'error', msg: result.error || 'Failed to invite student.' });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <Link href="/TutorStudio/organizations" className="text-sm font-medium text-blue-600 flex items-center gap-1.5 mb-4 hover:underline">
          <ArrowLeft size={16} /> Back to Organizations
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900">{org.name}</h1>
        <p className="text-slate-600 mt-2 max-w-2xl text-lg">{org.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">

          {/* Courses Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="text-blue-600" /> Organization Courses
              </h2>
              <Link
                href={`/TutorStudio/mycourses/newcourse?orgId=${org.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Plus size={16} /> Create Course
              </Link>
            </div>

            <div className="p-6">
              {org.courseCount === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">No courses in this organization yet.</p>
                  <Link href={`/TutorStudio/mycourses/newcourse?orgId=${org.id}`} className="text-blue-600 font-bold mt-2 inline-block hover:underline">
                    Create the first course
                  </Link>
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
                  <p className="text-slate-400 text-sm mt-1">Students appear here as they complete courses.</p>
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
                          <Star size={14} />Lvl {entry.level}
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

          {/* Members Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Users className="text-emerald-500" /> Members
            </h2>
            <div className="text-4xl font-black text-slate-900 mb-1">{memberCount}</div>
            <p className="text-sm text-slate-500 font-medium">Total active members</p>
          </div>

          {/* Invites */}
          {isOwner && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Mail size={18} className="text-blue-500" /> Invite Students
                </h3>
              </div>

              <div className="p-5 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Share Invite Link</label>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-600 truncate flex items-center">
                      {`${window.location.origin}/StudentPortal/organization/${org.id}`}
                    </code>
                    <button
                      onClick={handleCopyInviteLink}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                      {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Students can open this link to join the organization.</p>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Invite by Email</label>
                  <form onSubmit={handleInviteByEmail} className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        value={emailToInvite}
                        onChange={e => setEmailToInvite(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!emailToInvite.trim()}
                      className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      Add
                    </button>
                  </form>
                  {inviteStatus && (
                    <p className={`text-xs font-bold mt-2 ${inviteStatus.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {inviteStatus.msg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
