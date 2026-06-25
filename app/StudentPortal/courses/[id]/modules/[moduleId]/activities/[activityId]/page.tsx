"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrganizations } from "@/app/components/organizations/OrganizationContext";
import { useAuth } from "@/app/components/AuthCOntext";
import InteractiveSandbox from "@/app/components/InteractiveSandbox";
import { ArrowLeft, CheckCircle, Clock, Zap, Loader2 } from "lucide-react";
import CoursePlayerWrapper from "./activities/[activityid]/CoursePlayerWrapper";


export default function StudentActivityPage() {
  const params = useParams<{ id: string; moduleId: string; activityId: string }>();
  const router = useRouter();
  const { getActivity, completeActivity, getCourse } = useOrganizations();
  const { user } = useAuth();
  const [activity, setActivity] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ totalPoints: number; xpGained: number; newLevel: number } | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!params.activityId || !params.id) return;
    Promise.all([
      getActivity(params.activityId),
      getCourse(params.id),
    ]).then(([act, crs]) => {
      setActivity(act);
      setCourse(crs);
      setLoading(false);
    });
  }, [params.activityId, params.id, getActivity, getCourse]);

  const handleComplete = useCallback(async (overridePoints?: number) => {
    if (!user?.uid || !activity || !course || submitting) return;
    setSubmitting(true);
    try {
      const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
      const now = new Date().toISOString();

      const res = await completeActivity({
        activityId: params.activityId,
        courseId: params.id,
        moduleId: params.moduleId,
        orgId: activity.orgId || course.orgId,
        studentId: user.uid,
        accuracy: overridePoints ? Math.round((overridePoints / 30) * 100) : 100,
        timeTakenSeconds,
        expectedDurationSeconds: (activity.durationMinutes || 10) * 60,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        completionDateTime: now,
      });
      setResult(res);
    } catch (err) {
      console.error("Failed to complete activity:", err);
    } finally {
      setSubmitting(false);
    }
  }, [user, activity, course, submitting, startTime, params, completeActivity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Activity not found</h2>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-medium">Go Back</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-emerald-600" size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Activity Complete!</h1>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 rounded-xl p-4">
              <Zap className="mx-auto text-purple-500 mb-1" size={24} />
              <div className="text-2xl font-bold text-slate-800">{result.totalPoints}</div>
              <div className="text-xs text-slate-500 font-medium">Points</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <Zap className="mx-auto text-amber-500 mb-1" size={24} />
              <div className="text-2xl font-bold text-slate-800">+{result.xpGained}</div>
              <div className="text-xs text-slate-500 font-medium">XP Earned</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <ArrowLeft className="mx-auto text-blue-500 mb-1" size={24} style={{ transform: "rotate(90deg)" }} />
              <div className="text-2xl font-bold text-slate-800">Level {result.newLevel}</div>
              <div className="text-xs text-slate-500 font-medium">Current Level</div>
            </div>
          </div>
          <Link
            href={`/StudentPortal/courses/${params.id}`}
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href={`/StudentPortal/courses/${params.id}`}
        className="text-sm font-medium text-blue-600 flex items-center gap-1.5 hover:underline"
      >
        <ArrowLeft size={16} /> Back to Course
      </Link>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full capitalize">{activity.type}</span>
          <span className="flex items-center gap-1 text-sm text-slate-500">
            <Clock size={14} /> {activity.durationMinutes || 10} min
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{activity.title}</h1>

        {/* Render activity contents dynamically with the player wrapper */}
        <CoursePlayerWrapper
          activity={activity}
          onComplete={handleComplete}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
