"use client";

import { Suspense, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare, Eye, ArrowUp, Bookmark, Pin, ChevronDown,
  SlidersHorizontal, Flame, Clock, TrendingUp, Filter
} from 'lucide-react';
import { useCommunity } from '../components/community/CommunityContext';
import type { Post, FilterOption, SortOption } from '../components/community/types';

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

function StatusBadge({ status }: { status: Post['status'] }) {
  const map: Record<string, string> = {
    unanswered: 'bg-amber-100 text-amber-700 border-amber-200',
    resolved: 'bg-green-100 text-green-700 border-green-200',
    announcement: 'bg-slate-100 text-slate-600 border-slate-200',
    discussion: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  const label: Record<string, string> = {
    unanswered: 'Unanswered',
    resolved: 'Resolved',
    announcement: 'Announcement',
    discussion: 'Discussion',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function PostCard({ post }: { post: Post }) {
  const { getUser, getCategory, upvotePost, toggleBookmark, currentUserId } = useCommunity();
  const author = getUser(post.authorId);
  const category = getCategory(post.categoryId);
  const hasUpvoted = post.upvotedBy.includes(currentUserId);
  const isBookmarked = post.bookmarkedBy.includes(currentUserId);
  const excerpt = post.content.replace(/```[\s\S]*?```/g, '').replace(/\*\*/g, '').trim().slice(0, 180);

  return (
    <article className={`bg-white border rounded-xl p-5 hover:shadow-md transition-shadow ${
      post.isPinned ? 'border-teal-200 bg-teal-50/30' : 'border-gray-200'
    }`}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
          <button
            onClick={e => { e.preventDefault(); upvotePost(post.id); }}
            className={`flex flex-col items-center gap-0.5 group p-1.5 rounded-lg transition-colors ${
              hasUpvoted ? 'text-teal-600 bg-teal-50' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
            }`}
          >
            <ArrowUp size={16} className={hasUpvoted ? 'fill-teal-600' : ''} />
            <span className="text-xs font-semibold">{post.upvotes}</span>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              {post.isPinned && (
                <span className="flex items-center gap-1 text-xs text-teal-600 font-medium">
                  <Pin size={12} />
                  Pinned
                </span>
              )}
              <StatusBadge status={post.status} />
              {category && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${category.color} ${category.bgColor} ${category.borderColor}`}>
                  {category.icon} {category.name}
                </span>
              )}
            </div>
            <button
              onClick={e => { e.preventDefault(); toggleBookmark(post.id); }}
              className={`shrink-0 p-1 rounded transition-colors ${
                isBookmarked ? 'text-teal-600' : 'text-gray-300 hover:text-teal-500'
              }`}
            >
              <Bookmark size={14} className={isBookmarked ? 'fill-teal-600' : ''} />
            </button>
          </div>

          <Link href={`/community/post/${post.id}`} className="block group">
            <h2 className="text-base font-semibold text-gray-900 group-hover:text-teal-700 transition-colors leading-snug mb-1">
              {post.title}
            </h2>
          </Link>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{excerpt}…</p>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              {author && (
                <Link href={`/community/user/${author.id}`} className="flex items-center gap-1.5 hover:text-teal-600">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: author.avatarColor }}
                  >
                    {author.initials}
                  </div>
                  <span>{author.name}</span>
                </Link>
              )}
            </div>
            <span>{timeAgo(post.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {post.views}
            </span>
            <Link href={`/community/post/${post.id}`} className="flex items-center gap-1 hover:text-teal-600">
              <MessageSquare size={12} />
              {post.status === 'resolved' ? (
                <span className="text-green-600 font-medium">Answered</span>
              ) : (
                'Reply'
              )}
            </Link>
            {post.tags.slice(0, 2).map(tag => (
              <span key={tag} className="hidden sm:inline text-teal-600 hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All Topics' },
  { key: 'unanswered', label: 'Unanswered' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'course-specific', label: 'Course Specific' },
  { key: 'announcements', label: 'Announcements' },
];

const SORTS: { key: SortOption; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'latest', label: 'Latest', icon: Clock },
  { key: 'popular', label: 'Popular', icon: Flame },
  { key: 'views', label: 'Most Viewed', icon: TrendingUp },
];

function CommunityHubContent() {
  const { posts, categories } = useCommunity();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = searchParams.get('q') ?? '';
  const filterParam = (searchParams.get('filter') as FilterOption) ?? 'all';
  const sortParam = (searchParams.get('sort') as SortOption) ?? 'latest';
  const categoryParam = searchParams.get('cat') ?? '';

  const [visibleCount, setVisibleCount] = useState(8);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const setFilter = useCallback((f: FilterOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', f);
    params.delete('cat');
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const setSort = useCallback((s: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', s);
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const setCat = useCallback((catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('cat', catId);
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const filteredSorted = useMemo(() => {
    let result = [...posts];

    if (q) {
      const lower = q.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(lower) || p.content.toLowerCase().includes(lower) || p.tags.some(t => t.toLowerCase().includes(lower))
      );
    }

    if (categoryParam) result = result.filter(p => p.categoryId === categoryParam);

    if (filterParam === 'unanswered') result = result.filter(p => p.status === 'unanswered');
    else if (filterParam === 'resolved') result = result.filter(p => p.status === 'resolved');
    else if (filterParam === 'course-specific') result = result.filter(p => !!p.courseId);
    else if (filterParam === 'announcements') result = result.filter(p => p.status === 'announcement');

    result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    const pinned = result.filter(p => p.isPinned);
    const rest = result.filter(p => !p.isPinned);
    if (sortParam === 'latest') rest.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortParam === 'popular') rest.sort((a, b) => b.upvotes - a.upvotes);
    else if (sortParam === 'views') rest.sort((a, b) => b.views - a.views);

    return [...pinned, ...rest];
  }, [posts, q, filterParam, sortParam, categoryParam]);

  const visible = filteredSorted.slice(0, visibleCount);
  const activeSort = SORTS.find(s => s.key === sortParam) ?? SORTS[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {q ? `Results for "${q}"` : categoryParam
              ? categories.find(c => c.id === categoryParam)?.name ?? 'Discussions'
              : 'Community Discussions'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredSorted.length} discussion{filteredSorted.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setVisibleCount(8); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filterParam === f.key
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(o => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-teal-300 transition-colors"
          >
            <activeSort.icon size={14} />
            {activeSort.label}
            <ChevronDown size={14} />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-36 py-1">
              {SORTS.map(s => (
                <button
                  key={s.key}
                  onClick={() => { setSort(s.key); setShowSortMenu(false); }}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                    sortParam === s.key ? 'text-teal-700 font-semibold' : 'text-gray-700'
                  }`}
                >
                  <s.icon size={14} />
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!categoryParam && filterParam === 'all' && !q && (
        <div className="flex gap-2 flex-wrap mb-5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCat(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border font-medium transition-colors ${cat.color} ${cat.bgColor} ${cat.borderColor} hover:opacity-80`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No discussions found</p>
            <p className="text-sm text-gray-400 mt-1">
              {q ? 'Try different search terms' : 'Be the first to start one!'}
            </p>
            <Link
              href="/community/post/new"
              className="inline-block mt-4 bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-800 transition-colors"
            >
              Start a Discussion
            </Link>
          </div>
        ) : (
          visible.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {visibleCount < filteredSorted.length && (
        <button
          onClick={() => setVisibleCount(c => c + 8)}
          className="w-full mt-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:border-teal-300 transition-colors font-medium"
        >
          Load More Discussions ({filteredSorted.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}

export default function CommunityHub() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-gray-400">Loading discussions...</div>}>
      <CommunityHubContent />
    </Suspense>
  );
}
