"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Eye, ArrowUp, Calendar, Award, BookOpen } from 'lucide-react';
import { useCommunity } from '../../../components/community/CommunityContext';
import { useCommunityBasePath } from '../../../components/community/CommunityBasePathContext';

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function joinedDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function UserProfile() {
  const basePath = useCommunityBasePath();
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const { getUser, getPostsByUser, getRepliesByUser, getPost, getCategory, currentUserId, posts, getRepliesForPost } = useCommunity();

  const user = getUser(userId ?? '');

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">User not found.</p>
        <Link href="/community" className="inline-block mt-3 text-teal-600 hover:underline text-sm">Back</Link>
      </div>
    );
  }

  const userPosts = getPostsByUser(user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const userReplies = getRepliesByUser(user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const acceptedAnswers = userReplies.filter(r => r.isAccepted).length;
  const isCurrentUser = user.id === currentUserId;
  const totalUpvotesReceived = userReplies.reduce((sum, r) => sum + r.upvotes, 0) +
    userPosts.reduce((sum, p) => sum + p.upvotes, 0);

  const rankColors = ['text-amber-500', 'text-gray-400', 'text-amber-700'];

  const allUsersSorted = [
    { id: 'user-4', points: 1200 },
    { id: 'user-5', points: 1200 },
    { id: 'user-3', points: 850 },
    { id: 'user-6', points: 850 },
    { id: 'user-2', points: 540 },
    { id: 'user-7', points: 620 },
    { id: 'user-1', points: 320 },
  ].sort((a, b) => b.points - a.points);
  const rank = allUsersSorted.findIndex(u => u.id === user.id) + 1;

  return (
    <div className="space-y-5">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Back
      </button>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-teal-700 to-teal-500" />
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.initials}
            </div>
            {isCurrentUser && (
              <span className="px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold rounded-lg">
                Your Profile
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  Joined {joinedDate(user.joinDate)}
                </span>
                {rank <= 3 && (
                  <span className={`flex items-center gap-1 font-semibold ${rankColors[rank - 1]}`}>
                    <Award size={13} />
                    #{rank} Contributor
                  </span>
                )}
              </div>
              {user.bio && <p className="text-sm text-gray-600 mt-2 max-w-lg leading-relaxed">{user.bio}</p>}
            </div>

            <div className="flex gap-3">
              {[
                { label: 'Points', value: user.points },
                { label: 'Posts', value: user.postCount },
                { label: 'Accepted', value: acceptedAnswers },
              ].map(stat => (
                <div key={stat.label} className="text-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-lg font-bold text-teal-700">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {user.badges.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Award size={15} className="text-amber-500" />
            Badges ({user.badges.length})
          </h2>
          <div className="flex flex-wrap gap-3">
            {user.badges.map(badge => (
              <div
                key={badge.id}
                title={badge.description}
                className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <span className="text-lg">{badge.emoji}</span>
                <span className="text-sm font-medium text-amber-800">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {user.activeCourses.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
            <BookOpen size={15} className="text-teal-600" />
            Active Courses
          </h2>
          <div className="flex flex-wrap gap-3">
            {user.activeCourses.map(course => (
              <div
                key={course.id}
                className="flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-100 rounded-xl"
              >
                <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center text-xs font-bold text-teal-700">
                  {course.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-teal-800">{course.name}</p>
                  <p className="text-xs text-teal-600">{course.module}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Upvotes', value: totalUpvotesReceived, icon: ArrowUp, color: 'text-teal-600 bg-teal-50' },
          { label: 'Posts Written', value: user.postCount, icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
          { label: 'Replies Given', value: user.replyCount, icon: MessageSquare, color: 'text-purple-600 bg-purple-50' },
          { label: 'Helpful Answers', value: user.helpfulCount, icon: Award, color: 'text-amber-600 bg-amber-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon size={16} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-1">
          <h2 className="text-sm font-bold text-gray-800">Recent Discussions</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">{userPosts.length}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {userPosts.slice(0, 5).map(post => {
            const cat = getCategory(post.categoryId);
            const postReplies = getRepliesForPost(post.id);
            return (
              <Link key={post.id} href={`${basePath}/post/${post.id}`} className="block px-5 py-3 hover:bg-gray-50 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-teal-700 leading-snug truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      {cat && <span className={`${cat.color} font-medium`}>{cat.icon} {cat.name}</span>}
                      <span>{timeAgo(post.createdAt)}</span>
                      <span className="flex items-center gap-0.5"><ArrowUp size={11} />{post.upvotes}</span>
                      <span className="flex items-center gap-0.5"><MessageSquare size={11} />{postReplies.length}</span>
                      <span className="flex items-center gap-0.5"><Eye size={11} />{post.views}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${
                    post.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                    post.status === 'unanswered' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    post.status === 'announcement' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </Link>
            );
          })}
          {userPosts.length === 0 && (
            <p className="px-5 py-6 text-sm text-gray-400 text-center">No posts yet.</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-1">
          <h2 className="text-sm font-bold text-gray-800">Recent Replies</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">{userReplies.length}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {userReplies.slice(0, 5).map(reply => {
            const parentPost = getPost(reply.postId);
            return (
              <Link key={reply.id} href={`${basePath}/post/${reply.postId}`} className="block px-5 py-3 hover:bg-gray-50 transition-colors group">
                <div className="flex items-start gap-3">
                  {reply.isAccepted && (
                    <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[10px]">✓</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5 truncate">
                      on: <span className="text-gray-700 group-hover:text-teal-700">{parentPost?.title ?? 'Unknown post'}</span>
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {reply.content.replace(/```[\s\S]*?```/g, '[code]').slice(0, 120)}…
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{timeAgo(reply.createdAt)}</span>
                      <span className="flex items-center gap-0.5"><ArrowUp size={11} />{reply.upvotes}</span>
                      {reply.isAccepted && <span className="text-green-600 font-medium">Accepted</span>}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {userReplies.length === 0 && (
            <p className="px-5 py-6 text-sm text-gray-400 text-center">No replies yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
