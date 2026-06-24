"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrganizations } from '../../components/organizations/OrganizationContext';
import { Building2, Globe, Users, BookOpen, Search } from 'lucide-react';

export default function TutorExplore() {
  const { organizations, getPublicOrganizations, getOrgCourseCount, getOrgMemberCount } = useOrganizations();
  const publicOrgs = getPublicOrganizations();
  const [searchQuery, setSearchQuery] = useState('');
  const [orgCounts, setOrgCounts] = useState<Record<string, { courses: number; members: number }>>({});

  useEffect(() => {
    if (publicOrgs.length === 0) return;
    let cancelled = false;
    const fetchCounts = async () => {
      const counts: Record<string, { courses: number; members: number }> = {};
      await Promise.all(publicOrgs.map(async (org) => {
        try {
          const [courses, members] = await Promise.all([
            getOrgCourseCount(org.id),
            getOrgMemberCount(org.id),
          ]);
          if (!cancelled) counts[org.id] = { courses, members };
        } catch {
          if (!cancelled) counts[org.id] = { courses: 0, members: 0 };
        }
      }));
      if (!cancelled) setOrgCounts(counts);
    };
    fetchCounts();
    return () => { cancelled = true; };
  }, [organizations, getOrgCourseCount, getOrgMemberCount]);

  const filteredOrgs = publicOrgs.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Building2 className="text-blue-600" size={32} />
          Explore Organizations
        </h1>
        <p className="text-slate-500 mt-2">Discover public learning communities.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search organizations..."
          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Public Organizations</h2>
        {filteredOrgs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No organizations found</h3>
            <p className="text-slate-500">Try a different search term or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map(org => (
              <Link
                key={org.id}
                href={`/TutorStudio/organization/${org.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-emerald-100 text-emerald-800">
                      <Globe size={12} /> Public
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{org.name}</h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-6">{org.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                      <BookOpen className="text-blue-500" size={20} />
                      <div>
                        <div className="text-xl font-bold text-slate-800 leading-none">{orgCounts[org.id]?.courses ?? 0}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">Courses</div>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                      <Users className="text-emerald-500" size={20} />
                      <div>
                        <div className="text-xl font-bold text-slate-800 leading-none">{orgCounts[org.id]?.members ?? 0}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">Members</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
