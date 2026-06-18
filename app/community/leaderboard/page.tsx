"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Crown, Medal, Award, ArrowUp, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useCommunity } from '../../components/community/CommunityContext';

type Period = 'all-time' | 'this-month' | 'this-week';

const PERIOD_LABELS: { key: Period; label: string }[] = [
  { key: 'all-time', label: 'All Time' },
  { key: 'this-month', label: 'This Month' },
  { key: 'this-week', label: 'This Week' },
];

export default function Leaderboard() {
  const { users, getPostsByUser, getRepliesByUser, currentUserId } = useCommunity();
  const [period, setPeriod] = useState<Period>('all-time');

  const ranked = users
    .map(user => {
      const posts = getPostsByUser(user.id);
      const replies = getRepliesByUser(user.id);
      const accepted = replies.filter(r => r.isAccepted).length;
      const totalUpvotes = posts.reduce((s, p) => s + p.upvotes, 0) + replies.reduce((s, r) => s + r.upvotes, 0);
      const mult = period === 'all-time' ? 1 : (period === 'this-month' ? 0.3 : 0.08);
      const seed = user.id.charCodeAt(user.id.length - 1) / 48;
      const pts = Math.round(user.points * mult * (0.7 + seed * 0.6));
      return { user, pts, posts: posts.length, replies: replies.length, accepted, totalUpvotes };
    })
    .sort((a, b) => b.pts - a.pts);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ['h-20', 'h-28', 'h-16'];
  const podiumColors = ['bg-gray-200', 'bg-amber-400', 'bg-amber-600'];
  const podiumIcons = [
    <Medal size={20} className="text-gray-500" />,
    <Crown size={24} className="text-amber-700" />,
    <Medal size={18} className="text-amber-700" />,
  ];
  const podiumRanks = [2, 1, 3];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy size={22} className="text-amber-500" />
            Leaderboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Top community contributors</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {PERIOD_LABELS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-6 text-white">
        <p className="text-center text-sm text-teal-200 mb-6 font-medium">
          {period === 'all-time' ? 'All Time Champions' : period === 'this-month' ? 'This Month\'s Leaders' : 'This Week\'s MVPs'}
        </p>
        <div className="flex items-end justify-center gap-4">
          {podiumOrder.map((entry, i) => (
            <div key={entry.user.id} className="flex flex-col items-center gap-2">
              <Link href={`/community/user/${entry.user.id}`} className="group flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30 shadow-lg"
                    style={{ backgroundColor: entry.user.avatarColor }}
                  >
                    {entry.user.initials}
                  </div>
                  {podiumRanks[i] === 1 && (
                    <div className="absolute -top-2 -right-1 text-xl">👑</div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white group-hover:text-teal-200 transition-colors">
                    {entry.user.name}
                  </p>
                  <p className="text-xs text-teal-200 font-bold">{entry.pts.toLocaleString()} pts</p>
                </div>
              </Link>
              <div className={`${podiumHeights[i]} ${podiumColors[i]} w-20 rounded-t-xl flex items-start justify-center pt-2`}>
                {podiumIcons[i]}
                <span className="text-xs font-bold text-gray-700 ml-0.5">#{podiumRanks[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800">Full Rankings</p>
        </div>
        <div className="divide-y divide-gray-100">
          {ranked.map((entry, i) => {
            const rank = i + 1;
            const isCurrentUser = entry.user.id === currentUserId;
            const rankIcon =
              rank === 1 ? '🥇' :
              rank === 2 ? '🥈' :
              rank === 3 ? '🥉' :
              <span className="text-gray-400 font-bold text-sm">{rank}</span>;

            return (
              <div
                key={entry.user.id}
                className={`flex items-center gap-4 px-5 py-3 ${isCurrentUser ? 'bg-teal-50 border-l-2 border-l-teal-500' : 'hover:bg-gray-50'} transition-colors`}
              >
                <div className="w-8 text-center shrink-0">
                  {typeof rankIcon === 'string' ? <span className="text-lg">{rankIcon}</span> : rankIcon}
                </div>

                <Link href={`/community/user/${entry.user.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: entry.user.avatarColor }}
                  >
                    {entry.user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700 flex items-center gap-2">
                      {entry.user.name}
                      {isCurrentUser && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full font-medium">You</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {entry.user.badges.slice(0, 3).map(b => (
                        <span key={b.id} title={b.name} className="text-xs">{b.emoji}</span>
                      ))}
                    </div>
                  </div>
                </Link>

                <div className="hidden sm:flex items-center gap-5 text-xs text-gray-400">
                  <span className="flex items-center gap-1" title="Total upvotes">
                    <ArrowUp size={12} className="text-teal-500" />
                    {entry.totalUpvotes}
                  </span>
                  <span className="flex items-center gap-1" title="Posts">
                    <MessageSquare size={12} className="text-blue-500" />
                    {entry.posts}
                  </span>
                  <span className="flex items-center gap-1" title="Accepted answers">
                    <CheckCircle2 size={12} className="text-green-500" />
                    {entry.accepted}
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-teal-700">{entry.pts.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
          <Award size={15} className="text-teal-600" />
          How Points Work
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { action: 'Post a discussion', pts: '+5 pts', color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { action: 'Receive an upvote', pts: '+10 pts', color: 'bg-teal-50 text-teal-700 border-teal-100' },
            { action: 'Reply accepted as answer', pts: '+25 pts', color: 'bg-green-50 text-green-700 border-green-100' },
            { action: 'Post goes viral (50+ views)', pts: '+15 pts', color: 'bg-purple-50 text-purple-700 border-purple-100' },
            { action: 'Reply upvoted', pts: '+5 pts', color: 'bg-amber-50 text-amber-700 border-amber-100' },
            { action: 'Daily login streak', pts: '+2 pts', color: 'bg-pink-50 text-pink-700 border-pink-100' },
          ].map(item => (
            <div key={item.action} className={`flex items-center justify-between p-3 rounded-xl border ${item.color}`}>
              <p className="text-xs font-medium leading-tight">{item.action}</p>
              <span className="text-xs font-bold shrink-0 ml-2">{item.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
