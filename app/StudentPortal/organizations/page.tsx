"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrganizations } from '../../components/organizations/OrganizationContext';
import { useAuth } from '../../components/AuthCOntext';
import { Building2, Globe, Lock, Users, BookOpen } from 'lucide-react';

export default function StudentOrganizations() {
  const { organizations, getPublicOrganizations, getOrganizationsForStudent, getOrgCourseCount, getOrgMemberCount } = useOrganizations();
  const { user } = useAuth();
  const [myOrgs, setMyOrgs] = useState<any[]>([]);
  const [loadingMyOrgs, setLoadingMyOrgs] = useState(true);

  const publicOrgs = getPublicOrganizations();
  const [orgCounts, setOrgCounts] = useState<Record<string, { courses: number; members: number }>>({});

  useEffect(() => {
    if (!user) {
      setMyOrgs([]);
      setLoadingMyOrgs(false);
      return;
    }
    setLoadingMyOrgs(true);
    getOrganizationsForStudent(user.uid).then(orgs => {
      setMyOrgs(orgs);
      setLoadingMyOrgs(false);
    });
  }, [user, getOrganizationsForStudent]);

  useEffect(() => {
    const allOrgs = [...(user ? myOrgs : []), ...publicOrgs];
    if (allOrgs.length === 0) return;
    let cancelled = false;
    const fetchCounts = async () => {
      const counts: Record<string, { courses: number; members: number }> = {};
      await Promise.all(allOrgs.map(async (org) => {
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
  }, [myOrgs, organizations, getOrgCourseCount, getOrgMemberCount]);

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Building2 className="text-blue-600" size={32} />
          Organizations
        </h1>
        <p className="text-slate-500 mt-2">Discover and join learning communities.</p>
      </div>

      {myOrgs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="text-blue-500" size={24} /> My Organizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myOrgs.map(org => (
              <Link
                key={org.id}
                href={`/StudentPortal/organization/${org.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 mb-4 w-fit ${org.isInviteOnly ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {org.isInviteOnly ? <Lock size={12} /> : <Globe size={12} />}
                    {org.isInviteOnly ? 'Private' : 'Public'}
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
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="text-emerald-500" size={24} /> Public Organizations
        </h2>
        {publicOrgs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No organizations yet</h3>
            <p className="text-slate-500">Check back later for new learning communities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicOrgs.map(org => (
              <Link
                key={org.id}
                href={`/StudentPortal/organization/${org.id}`}
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
