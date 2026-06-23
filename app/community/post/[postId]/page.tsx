"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUp, ArrowLeft, MessageSquare, Eye, Bookmark, Share2,
  Check, Flag, CornerDownRight, ChevronDown, ChevronUp, Pin,
  CheckCircle2, Clock
} from 'lucide-react';
import { useCommunity } from '../../../components/community/CommunityContext';
import { useCommunityBasePath } from '../../../components/community/CommunityBasePathContext';
import type { Reply } from '../../../components/community/types';

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function ContentRenderer({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-3">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
          return (
            <pre key={i} className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm leading-relaxed">
              <code>{code}</code>
            </pre>
          );
        }
        return (
          <div key={i} className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {part.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) =>
              chunk.startsWith('**') ? (
                <strong key={j} className="font-semibold text-gray-900">
                  {chunk.slice(2, -2)}
                </strong>
              ) : (
                chunk
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReplyCard({
  reply,
  postAuthorId,
  isPostAuthor,
  depth = 0,
  allReplies,
}: {
  reply: Reply;
  postAuthorId: string;
  isPostAuthor: boolean;
  depth?: number;
  allReplies: Reply[];
}) {
  const { getUser, upvoteReply, markResolved, currentUserId, addReply, deleteReply } = useCommunity();
  const basePath = useCommunityBasePath();
  const author = getUser(reply.authorId);
  const hasUpvoted = reply.upvotedBy.includes(currentUserId);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showChildren, setShowChildren] = useState(true);
  const postId = reply.postId;

  const children = allReplies.filter(r => r.parentId === reply.id);

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    addReply(postId, replyText.trim(), reply.id);
    setReplyText('');
    setShowReplyBox(false);
  };

  return (
    <div className={depth > 0 ? 'pl-5 border-l-2 border-gray-100' : ''}>
      <div className={`rounded-xl p-4 ${reply.isAccepted ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'}`}>
        {reply.isAccepted && (
          <div className="flex items-center gap-2 mb-3 text-green-700 text-sm font-semibold">
            <CheckCircle2 size={16} />
            Accepted Answer
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <Link href={`${basePath}/user/${reply.authorId}`} className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: author?.avatarColor ?? '#6b7280' }}
            >
              {author?.initials}
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">
                {author?.name}
                {reply.authorId === postAuthorId && (
                  <span className="ml-1.5 text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full font-medium">OP</span>
                )}
              </span>
              <p className="text-xs text-gray-400">{timeAgo(reply.createdAt)}</p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {isPostAuthor && depth === 0 && (
              <button
                onClick={() => markResolved(postId, reply.id)}
                title={reply.isAccepted ? 'Unaccept answer' : 'Accept as answer'}
                className={`p-1.5 rounded-lg transition-colors ${
                  reply.isAccepted
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-300 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Check size={16} />
              </button>
            )}
            {reply.authorId === currentUserId && (
              <button
                onClick={() => deleteReply(reply.id)}
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors text-xs"
                title="Delete reply"
              >
                <Flag size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-3">
          <ContentRenderer content={reply.content} />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => upvoteReply(reply.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition-colors ${
              hasUpvoted ? 'bg-teal-50 text-teal-700' : 'text-gray-400 hover:bg-gray-50 hover:text-teal-600'
            }`}
          >
            <ArrowUp size={14} className={hasUpvoted ? 'fill-teal-600' : ''} />
            <span className="font-semibold">{reply.upvotes}</span>
          </button>

          <button
            onClick={() => setShowReplyBox(o => !o)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm text-gray-400 hover:text-teal-600 hover:bg-gray-50 transition-colors"
          >
            <CornerDownRight size={14} />
            Reply
          </button>

          {children.length > 0 && (
            <button
              onClick={() => setShowChildren(o => !o)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-teal-600 ml-auto"
            >
              {showChildren ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {children.length} {children.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {showReplyBox && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={() => setShowReplyBox(false)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className="px-4 py-1.5 bg-teal-700 text-white text-sm rounded-lg font-medium hover:bg-teal-800 disabled:opacity-40 transition-colors"
              >
                Post Reply
              </button>
            </div>
          </div>
        )}
      </div>

      {showChildren && children.length > 0 && (
        <div className="mt-2 space-y-2">
          {children.map(child => (
            <ReplyCard
              key={child.id}
              reply={child}
              postAuthorId={postAuthorId}
              isPostAuthor={isPostAuthor}
              depth={depth + 1}
              allReplies={allReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const basePath = useCommunityBasePath();
  const {
    getPost, getUser, getCategory, getRepliesForPost,
    upvotePost, toggleBookmark, incrementViews, addReply,
    currentUserId, posts
  } = useCommunity();

  const [replyText, setReplyText] = useState('');
  const [copied, setCopied] = useState(false);
  const replyBoxRef = useRef<HTMLTextAreaElement>(null);

  const post = getPost(postId ?? '');

  useEffect(() => {
    if (postId) incrementViews(postId);
  }, [postId, incrementViews]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-medium">Post not found.</p>
        <Link href={basePath} className="inline-block mt-4 text-teal-600 hover:underline text-sm">
          Back to discussions
        </Link>
      </div>
    );
  }

  const author = getUser(post.authorId);
  const category = getCategory(post.categoryId);
  const allReplies = getRepliesForPost(post.id);
  const topLevelReplies = allReplies.filter(r => !r.parentId);
  const hasUpvoted = post.upvotedBy.includes(currentUserId);
  const isBookmarked = post.bookmarkedBy.includes(currentUserId);
  const isPostAuthor = post.authorId === currentUserId;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    addReply(post.id, replyText.trim());
    setReplyText('');
  };

  const related = posts
    .filter(p => p.categoryId === post.categoryId && p.id !== post.id)
    .slice(0, 3);

  const statusColors: Record<string, string> = {
    unanswered: 'bg-amber-100 text-amber-700 border-amber-200',
    resolved: 'bg-green-100 text-green-700 border-green-200',
    announcement: 'bg-slate-100 text-slate-600 border-slate-200',
    discussion: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  const statusLabel: Record<string, string> = {
    unanswered: 'Unanswered',
    resolved: 'Resolved',
    announcement: 'Announcement',
    discussion: 'Discussion',
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Discussions
      </button>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 pt-5 flex-wrap">
          {post.isPinned && (
            <span className="flex items-center gap-1 text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
              <Pin size={11} />
              Pinned
            </span>
          )}
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColors[post.status]}`}>
            {statusLabel[post.status]}
          </span>
          {category && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${category.color} ${category.bgColor} ${category.borderColor}`}>
              {category.icon} {category.name}
            </span>
          )}
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`${basePath}?q=${tag}`}
              className="text-xs text-teal-600 hover:underline"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="p-5">
          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{post.title}</h1>

          <div className="flex items-center justify-between mb-5">
            <Link href={`${basePath}/user/${post.authorId}`} className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: author?.avatarColor ?? '#6b7280' }}
              >
                {author?.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{author?.name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={11} />
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Eye size={14} />
                {post.views}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={14} />
                {allReplies.length}
              </span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none mb-5">
            <ContentRenderer content={post.content} />
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={() => upvotePost(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                hasUpvoted
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              <ArrowUp size={15} className={hasUpvoted ? 'fill-teal-600' : ''} />
              {hasUpvoted ? 'Upvoted' : 'Upvote'} ({post.upvotes})
            </button>

            <button
              onClick={() => replyBoxRef.current?.focus()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 border border-gray-200 text-gray-600 hover:border-teal-300 hover:text-teal-700 transition-colors"
            >
              <MessageSquare size={15} />
              Reply
            </button>

            <button
              onClick={() => toggleBookmark(post.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'text-teal-600 bg-teal-50 border-teal-200'
                  : 'text-gray-400 bg-gray-50 border-gray-200 hover:text-teal-600 hover:border-teal-200'
              }`}
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-teal-600' : ''} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 hover:text-teal-600 hover:border-teal-200 transition-colors"
              title="Copy link"
            >
              <Share2 size={15} />
            </button>
            {copied && <span className="text-xs text-teal-600">Link copied!</span>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
          <MessageSquare size={16} className="text-teal-600" />
          {allReplies.length} {allReplies.length === 1 ? 'Reply' : 'Replies'}
          {post.status === 'resolved' && (
            <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 font-medium">
              <CheckCircle2 size={12} />
              Resolved
            </span>
          )}
        </h2>

        <div className="space-y-3">
          {topLevelReplies
            .filter(r => r.isAccepted)
            .map(reply => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                postAuthorId={post.authorId}
                isPostAuthor={isPostAuthor}
                allReplies={allReplies}
              />
            ))}

          {topLevelReplies
            .filter(r => !r.isAccepted)
            .sort((a, b) => b.upvotes - a.upvotes)
            .map(reply => (
              <ReplyCard
                key={reply.id}
                reply={reply}
                postAuthorId={post.authorId}
                isPostAuthor={isPostAuthor}
                allReplies={allReplies}
              />
            ))}

          {topLevelReplies.length === 0 && (
            <div className="text-center py-10 bg-white border border-gray-200 rounded-xl">
              <MessageSquare size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No replies yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Your Reply</h3>
        <textarea
          ref={replyBoxRef}
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder="Write your reply… Markdown and code blocks are supported."
          rows={5}
          className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 leading-relaxed"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">Supports Markdown and ``` code blocks</p>
          <button
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
            className="px-5 py-2 bg-teal-700 text-white text-sm font-semibold rounded-lg hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Post Reply
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Related Discussions</h3>
          <div className="space-y-2">
            {related.map(p => (
              <Link
                key={p.id}
                href={`${basePath}/post/${p.id}`}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <MessageSquare size={14} className="text-gray-300 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 group-hover:text-teal-700 leading-snug">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
