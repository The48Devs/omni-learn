"use client";

import Link from "next/link";
import { Trophy, Medal, Star, Flame, ChevronLeft, TrendingUp } from "lucide-react";

const topThree = [
  {
    rank: 1,
    name: "Aiko Tanaka",
    country: "🇯🇵",
    score: 98450,
    level: "Grandmaster",
    badge: "🏆",
    avatar: "AT",
    avatarBg: "bg-yellow-500",
    change: "+2",
  },
  {
    rank: 2,
    name: "Marcus Rivera",
    country: "🇧🇷",
    score: 95120,
    level: "Grandmaster",
    badge: "🥈",
    avatar: "MR",
    avatarBg: "bg-gray-400",
    change: "+1",
  },
  {
    rank: 3,
    name: "Priya Sharma",
    country: "🇮🇳",
    score: 91800,
    level: "Diamond",
    badge: "🥉",
    avatar: "PS",
    avatarBg: "bg-orange-400",
    change: "-1",
  },
];

const leaderboardData = [
  { rank: 4,  name: "Chen Wei",        country: "🇨🇳", score: 88300, level: "Diamond",   streak: 42, avatar: "CW", avatarBg: "bg-blue-500",   change: "+3" },
  { rank: 5,  name: "Sofia Eriksson",  country: "🇸🇪", score: 85700, level: "Platinum",  streak: 38, avatar: "SE", avatarBg: "bg-purple-500", change: "+1" },
  { rank: 6,  name: "James O'Brien",   country: "🇮🇪", score: 83200, level: "Platinum",  streak: 27, avatar: "JO", avatarBg: "bg-green-500",  change: "-2" },
  { rank: 7,  name: "Fatima Al-Hassan",country: "🇸🇦", score: 80500, level: "Platinum",  streak: 31, avatar: "FA", avatarBg: "bg-pink-500",   change: "+4" },
  { rank: 8,  name: "Lucas Mendes",    country: "🇧🇷", score: 77900, level: "Gold",      streak: 19, avatar: "LM", avatarBg: "bg-amber-500",  change: "0"  },
  { rank: 9,  name: "Yuki Nakamura",   country: "🇯🇵", score: 75400, level: "Gold",      streak: 22, avatar: "YN", avatarBg: "bg-teal-500",   change: "+2" },
  { rank: 10, name: "Ana Popescu",     country: "🇷🇴", score: 72100, level: "Gold",      streak: 15, avatar: "AP", avatarBg: "bg-indigo-500", change: "-1" },
  { rank: 11, name: "Kwame Asante",    country: "🇬🇭", score: 69800, level: "Silver",    streak: 11, avatar: "KA", avatarBg: "bg-red-500",    change: "+5" },
  { rank: 12, name: "Isabella Rossi",  country: "🇮🇹", score: 67200, level: "Silver",    streak: 9,  avatar: "IR", avatarBg: "bg-cyan-500",   change: "-3" },
  { rank: 13, name: "Omar Benali",     country: "🇩🇿", score: 64500, level: "Silver",    streak: 7,  avatar: "OB", avatarBg: "bg-lime-500",   change: "+2" },
];

const levelColors: Record<string, string> = {
  Grandmaster: "bg-yellow-100 text-yellow-700",
  Diamond: "bg-sky-100 text-sky-700",
  Platinum: "bg-purple-100 text-purple-700",
  Gold: "bg-amber-100 text-amber-700",
  Silver: "bg-gray-100 text-gray-600",
};

function ChangeIndicator({ change }: { change: string }) {
  if (change === "0") return <span className="text-gray-400 text-xs">—</span>;
  const positive = change.startsWith("+");
  return (
    <span className={`text-xs flex items-center gap-0.5 ${positive ? "text-green-500" : "text-red-400"}`}>
      <TrendingUp size={11} className={positive ? "" : "rotate-180"} />
      {change}
    </span>
  );
}

export default function Leaderboard() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white pt-12 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
          >
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white" style={{ fontWeight: 700, fontSize: "2rem" }}>
                Arena Leaderboard
              </h1>
              <p className="text-gray-400 text-sm">Updated daily · Season 4</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-lg mt-4">
            See where you stand against the top 1% of learners worldwide. Earn
            points by completing courses, winning tournaments, and helping peers.
          </p>

          {/* Season stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { label: "Total Participants", value: "48,291" },
              { label: "Active This Week", value: "12,430" },
              { label: "Tournaments Held", value: "127" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-white text-xl" style={{ fontWeight: 700 }}>{stat.value}</div>
                <div className="text-gray-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="max-w-4xl mx-auto px-6 -mt-10 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {[topThree[1], topThree[0], topThree[2]].map((player, idx) => {
            const heights = ["pt-6", "pt-0", "pt-10"];
            return (
              <div key={player.rank} className={`${heights[idx]} flex flex-col items-center`}>
                <div className={`w-14 h-14 rounded-full ${player.avatarBg} flex items-center justify-center text-white text-lg shadow-lg mb-2`} style={{ fontWeight: 700 }}>
                  {player.avatar}
                </div>
                <div className="text-xl mb-1">{player.badge}</div>
                <div className="bg-white rounded-xl p-4 w-full text-center shadow-sm border border-gray-100">
                  <div className="text-gray-900 text-sm mb-0.5" style={{ fontWeight: 600 }}>{player.name}</div>
                  <div className="text-gray-500 text-xs">{player.country}</div>
                  <div className="text-orange-500 text-sm mt-2" style={{ fontWeight: 700 }}>
                    {player.score.toLocaleString()}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full mt-1.5 inline-block ${levelColors[player.level]}`}>
                    {player.level}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-2 text-center">Level</div>
            <div className="col-span-2 text-center">Streak</div>
            <div className="col-span-1 text-right">Change</div>
          </div>

          {leaderboardData.map((player, i) => (
            <div
              key={player.rank}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-orange-50/40 transition-colors ${
                i === leaderboardData.length - 1 ? "border-b-0" : ""
              }`}
            >
              <div className="col-span-1 text-gray-500 text-sm" style={{ fontWeight: 600 }}>
                {player.rank}
              </div>

              <div className="col-span-4 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${player.avatarBg} flex items-center justify-center text-white text-xs flex-shrink-0`}
                  style={{ fontWeight: 700 }}
                >
                  {player.avatar}
                </div>
                <div>
                  <div className="text-gray-900 text-sm" style={{ fontWeight: 500 }}>
                    {player.name}
                  </div>
                  <div className="text-gray-400 text-xs">{player.country}</div>
                </div>
              </div>

              <div className="col-span-2 text-right text-gray-900 text-sm" style={{ fontWeight: 600 }}>
                {player.score.toLocaleString()}
              </div>

              <div className="col-span-2 flex justify-center">
                <span className={`text-xs px-2.5 py-1 rounded-full ${levelColors[player.level]}`}>
                  {player.level}
                </span>
              </div>

              <div className="col-span-2 flex justify-center items-center gap-1 text-orange-500 text-sm">
                <Flame size={14} />
                <span style={{ fontWeight: 500 }}>{player.streak}d</span>
              </div>

              <div className="col-span-1 flex justify-end">
                <ChangeIndicator change={player.change} />
              </div>
            </div>
          ))}
        </div>

        {/* Your rank (placeholder) */}
        <div className="mt-6 bg-indigo-600 rounded-2xl px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm" style={{ fontWeight: 700 }}>
              You
            </div>
            <div>
              <div className="text-sm" style={{ fontWeight: 600 }}>Your Current Rank</div>
              <div className="text-indigo-200 text-xs">Sign in to see your position</div>
            </div>
          </div>
          <button className="bg-white text-indigo-600 text-sm px-5 py-2 rounded-full hover:bg-indigo-50 transition-colors" style={{ fontWeight: 600 }}>
            Sign In
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Rankings update every 24 hours. Scores are based on completed modules, tournament wins, and peer contributions.
        </p>
      </div>
    </div>
  );
}
