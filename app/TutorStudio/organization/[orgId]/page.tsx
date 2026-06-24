"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrganizations, OrgMemberDetails } from '../../../components/organizations/OrganizationContext';
import { useAuth } from '../../../components/AuthCOntext';
import { ArrowLeft, Users, BookOpen, Plus, Mail, Copy, CheckCircle2, Trophy, Flame, Star, Shield, UserCog, Link as LinkIcon } from 'lucide-react';

export default function OrganizationDetails() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const { getOrganization, inviteStudentByEmail, getOrgLeaderboard, getOrgMembersDetails, setMemberRole, setMemberPermission, generateInviteLink, leaveOrganization, getOrgCoursesWithData } = useOrganizations();
  const { user } = useAuth();
  const [emailToInvite, setEmailToInvite] = useState('');
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<'streak' | 'level'>('level');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [members, setMembers] = useState<OrgMemberDetails[]>([]);
  const [inviteLink, setInviteLink] = useState('');
  const [orgCourses, setOrgCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const org = getOrganization(orgId);

  useEffect(() => {
    if (!org) return;
    setInviteLink(`${window.location.origin}/StudentPortal/organization/${org.id}`);
  }, [org]);

  useEffect(() => {
    if (!orgId) return;
    getOrgMembersDetails(orgId).then(setMembers);
  }, [orgId, getOrgMembersDetails]);

  useEffect(() => {
    if (!orgId) return;
    setLoadingCourses(true);
    getOrgCoursesWithData(orgId).then(courses => {
      setOrgCourses(courses);
      setLoadingCourses(false);
    });
  }, [orgId, getOrgCoursesWithData]);

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

  const handleCopyInviteLink = async () => {
    let link = inviteLink;
    if (org.isInviteOnly) {
      const token = await generateInviteLink(org.id);
      link = `${window.location.origin}/StudentPortal/organization/${org.id}?token=${token}`;
    }
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToInvite.trim()) return;

    setInviteStatus(null);
    const result = await inviteStudentByEmail(org.id, emailToInvite.trim());
    if (result.success) {
      setInviteStatus({ type: 'success', msg: 'User invited and added successfully!' });
      setEmailToInvite('');
      getOrgMembersDetails(orgId).then(setMembers);
    } else {
      setInviteStatus({ type: 'error', msg: result.error || 'Failed to invite user.' });
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
        {org.isInviteOnly && (
          <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Shield size={12} /> Invite-Only
          </span>
        )}
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
              {loadingCourses ? (
                <div className="text-center py-8 text-slate-400">Loading courses...</div>
              ) : orgCourses.length === 0 ? (
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
                <div className="space-y-3">
                  {orgCourses.map(course => (
                    <div key={course.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <h3 className="font-bold text-slate-800">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{course.subject} &middot; {Object.keys(course.modules || {}).length} modules</p>
                      </div>
                      <Link href={`/TutorStudio/courses/${course.id}/analytics`} className="text-xs font-bold text-blue-600 hover:underline">Analytics</Link>
                    </div>
                  ))}
                  <p className="text-sm text-slate-500 mt-2">{orgCourses.length} course{orgCourses.length !== 1 ? 's' : ''} in this organization.</p>
                </div>
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
            <div className="text-4xl font-black text-slate-900 mb-1">{members.length}</div>
            <p className="text-sm text-slate-500 font-medium">Total active members</p>
          </div>

          {/* Member Permissions Management */}
          {isOwner && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <UserCog size={18} className="text-indigo-500" /> Manage Members
                </h3>
              </div>
              <div className="p-5 max-h-80 overflow-y-auto space-y-3">
                {members.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No members yet.</p>
                ) : (
                  members.map(m => (
                    <div key={m.uid} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
                          {m.uid.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{m.uid.slice(0, 8)}...</div>
                          <div className="text-xs font-medium text-slate-400">{m.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {m.uid === org.ownerId ? (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Owner</span>
                        ) : (
                          <>
                            {m.role === 'student' ? (
                              <button
                                onClick={() => setMemberRole(org.id, m.uid, 'tutor')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                              >
                                Promote
                              </button>
                            ) : (
                              <button
                                onClick={() => setMemberRole(org.id, m.uid, 'student')}
                                className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors"
                              >
                                Demote
                              </button>
                            )}
                            {m.role === 'tutor' && (
                              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={m.permissions.canCreateCourses}
                                  onChange={e => setMemberPermission(org.id, m.uid, 'canCreateCourses', e.target.checked)}
                                  className="rounded border-slate-300"
                                />
                                Create
                              </label>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Invites */}
          {isOwner && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Mail size={18} className="text-blue-500" /> Invite Users
                </h3>
              </div>

              <div className="p-5 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    <LinkIcon size={14} className="inline mr-1" />
                    Share Invite Link
                  </label>
                  <div className="flex gap-2">
                    <code className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-600 truncate flex items-center">
                      {inviteLink}
                    </code>
                    <button
                      onClick={handleCopyInviteLink}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                      {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {org.isInviteOnly
                      ? 'A unique token is included for invite-only orgs.'
                      : 'Students can open this link to join.'}
                  </p>
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
                        placeholder="user@example.com"
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

          {/* Leave Organization */}
          {!isOwner && user && (
            <LeaveOrgButton orgId={org.id} userId={user.uid} />
          )}

        </div>
      </div>
    </div>
  );
}

function LeaveOrgButton({ orgId, userId }: { orgId: string; userId: string }) {
  const { leaveOrganization } = useOrganizations();
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleLeave = async () => {
    setLeaving(true);
    const result = await leaveOrganization(orgId, userId);
    setLeaving(false);
    if (result.success) {
      setDone(true);
      setTimeout(() => router.push('/TutorStudio/organizations'), 1500);
    }
  };

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center shadow-sm">
        <p className="text-emerald-700 font-bold text-sm">Left organization successfully</p>
        <p className="text-emerald-500 text-xs mt-1">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-red-200 p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm mb-3">Leave Organization</h3>
      <button
        onClick={handleLeave}
        disabled={leaving}
        className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
      >
        {leaving ? 'Leaving...' : 'Leave Organization'}
      </button>
    </div>
  );
}
