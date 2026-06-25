"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrganizations } from "@/app/components/organizations/OrganizationContext";
import { ArrowLeft, BookOpen, Clock, Zap, ChevronRight } from "lucide-react";

export default function StudentCourseDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCourse } = useOrganizations();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getCourse(id).then((data) => {
      setCourse(data);
      setLoading(false);
    });
  }, [id, getCourse]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 text-lg font-semibold">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Course not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-medium">Go Back</button>
      </div>
    );
  }

  const modules = course.modules ? Object.values(course.modules) : [];
  const totalActivities = modules.reduce((acc: number, mod: any) => acc + Object.keys(mod.activityIds || {}).length, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/StudentPortal/dashboard" className="text-sm font-medium text-blue-600 flex items-center gap-1.5 hover:underline">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3">{course.subject || "General"}</span>
            <h1 className="text-3xl font-extrabold text-slate-900">{course.title}</h1>
            <p className="text-slate-600 mt-3 text-lg">{course.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <BookOpen className="mx-auto text-blue-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-slate-800">{modules.length}</div>
            <div className="text-xs text-slate-500 font-medium">Modules</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <Zap className="mx-auto text-purple-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-slate-800">{totalActivities}</div>
            <div className="text-xs text-slate-500 font-medium">Activities</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <Clock className="mx-auto text-amber-500 mb-1" size={24} />
            <div className="text-2xl font-bold text-slate-800">{modules.length * 30}</div>
            <div className="text-xs text-slate-500 font-medium">Est. Minutes</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Course Modules</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {modules.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No modules yet.</div>
          ) : (
            modules
              .sort((a: any, b: any) => a.index - b.index)
              .map((mod: any, idx: number) => {
                const activityIds = Object.keys(mod.activityIds || {});
                const activityCount = activityIds.length;
                const firstActivityId = activityIds[0];
                const href = firstActivityId
                  ? `/StudentPortal/courses/${id}/modules/${mod.id}/activities/${firstActivityId}`
                  : '#';
                return (
                  <Link key={mod.id} href={href} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{mod.title}</h3>
                        <p className="text-sm text-slate-500">{mod.duration} &middot; {activityCount} activities</p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-400" size={20} />
                  </Link>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
