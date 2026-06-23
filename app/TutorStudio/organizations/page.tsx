"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useOrganizations } from '../../components/organizations/OrganizationContext';
import { useAuth } from '../../components/AuthCOntext';
import { Building2, Users, BookOpen, Plus, Lock, Globe } from 'lucide-react';

export default function OrganizationsDashboard() {
  const { getOrganizationsByOwner, createOrganization } = useOrganizations();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isInviteOnly, setIsInviteOnly] = useState(false);

  const tutorId = user?.uid || 'tutor-1';
  const myOrganizations = getOrganizationsByOwner(tutorId);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    await createOrganization({
      name: name.trim(),
      description: description.trim(),
      ownerId: tutorId,
      isInviteOnly,
    });

    setShowCreateModal(false);
    setName('');
    setDescription('');
    setIsInviteOnly(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Building2 className="text-blue-600" size={32} />
            My Organizations
          </h1>
          <p className="text-slate-500 mt-2">Manage your learning communities, courses, and member leaderboards.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow"
        >
          <Plus size={20} />
          Create Organization
        </button>
      </div>

      {myOrganizations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No organizations yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Create an organization to group your courses, track student progress, and build a community leaderboard.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2 transition-all"
          >
            <Plus size={20} />
            Create Your First Organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myOrganizations.map(org => (
            <div key={org.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${org.isInviteOnly ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {org.isInviteOnly ? <Lock size={12} /> : <Globe size={12} />}
                    {org.isInviteOnly ? 'Private' : 'Public'}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">{org.name}</h3>
                <p className="text-slate-600 text-sm line-clamp-2 mb-6">{org.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <BookOpen className="text-blue-500" size={20} />
                    <div>
                      <div className="text-xl font-bold text-slate-800 leading-none">{org.courseCount}</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Courses</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <Users className="text-emerald-500" size={20} />
                    <div>
                      <div className="text-xl font-bold text-slate-800 leading-none">{org.memberCount}</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Members</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-4 bg-slate-50 flex gap-3">
                <Link
                  href={`/TutorStudio/organization/${org.id}`}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Manage
                </Link>
                <Link
                  href={`/TutorStudio/mycourses/newcourse?orgId=${org.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                  Add Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Create Organization</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Organization Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="e.g. Advanced Mathematics Institute"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  placeholder="What is this organization about?"
                />
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInviteOnly}
                    onChange={e => setIsInviteOnly(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-bold text-slate-800">Make Private (Invite-Only)</div>
                    <div className="text-sm text-slate-500">Students can only join via invite link or email invitation.</div>
                  </div>
                </label>
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || !description.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
