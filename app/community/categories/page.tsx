"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, TrendingUp, Hash } from 'lucide-react';
import { useCommunity } from '../../components/community/CommunityContext';
import { useCommunityBasePath } from '../../components/community/CommunityBasePathContext';

export default function Categories() {
  const { categories, getPostsByCategory, posts } = useCommunity();
  const basePath = useCommunityBasePath();
  const router = useRouter();

  const catStats = categories.map(cat => {
    const catPosts = getPostsByCategory(cat.id);
    const resolved = catPosts.filter(p => p.status === 'resolved').length;
    const unanswered = catPosts.filter(p => p.status === 'unanswered').length;
    const totalUpvotes = catPosts.reduce((s, p) => s + p.upvotes, 0);
    const recentPost = catPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return { cat, count: catPosts.length, resolved, unanswered, totalUpvotes, recentPost };
  });

  const totalPosts = posts.length;
  const totalResolved = posts.filter(p => p.status === 'resolved').length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Hash size={22} className="text-teal-600" />
          Browse Categories
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {totalPosts} discussions · {totalResolved} resolved
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Discussions', value: totalPosts, color: 'border-teal-200 bg-teal-50 text-teal-700' },
          { label: 'Resolved', value: posts.filter(p => p.status === 'resolved').length, color: 'border-green-200 bg-green-50 text-green-700' },
          { label: 'Unanswered', value: posts.filter(p => p.status === 'unanswered').length, color: 'border-amber-200 bg-amber-50 text-amber-700' },
          { label: 'Categories', value: categories.length, color: 'border-purple-200 bg-purple-50 text-purple-700' },
        ].map(stat => (
          <div key={stat.label} className={`border rounded-xl p-4 ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {catStats.map(({ cat, count, resolved, unanswered, totalUpvotes, recentPost }) => (
          <div
            key={cat.id}
            className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${cat.borderColor}`}
            onClick={() => router.push(`${basePath}?cat=${cat.id}`)}
          >
            <div className={`${cat.bgColor} px-5 py-4 border-b ${cat.borderColor}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h2 className={`font-bold ${cat.color}`}>{cat.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${cat.color}`}>{count}</div>
              </div>
            </div>

            <div className="px-5 py-3">
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  {count} posts
                </span>
                {resolved > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    ✓ {resolved} resolved
                  </span>
                )}
                {unanswered > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    ? {unanswered} unanswered
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  {totalUpvotes} upvotes
                </span>
              </div>

              {recentPost ? (
                <Link
                  href={`${basePath}/post/${recentPost.id}`}
                  onClick={e => e.stopPropagation()}
                  className="block text-xs text-gray-500 truncate hover:text-teal-700 transition-colors"
                >
                  <span className="text-gray-400">Latest: </span>
                  {recentPost.title}
                </Link>
              ) : (
                <p className="text-xs text-gray-400 italic">No posts yet. Be the first!</p>
              )}

              <button
                onClick={e => { e.stopPropagation(); router.push(`${basePath}?cat=${cat.id}`); }}
                className={`mt-3 w-full py-1.5 rounded-lg text-xs font-semibold border transition-colors ${cat.color} ${cat.bgColor} ${cat.borderColor} hover:opacity-80`}
              >
                Browse {cat.name} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
