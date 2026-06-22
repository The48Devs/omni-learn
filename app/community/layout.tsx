"use client";

import { CommunityProvider } from '../components/community/CommunityContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/community', label: 'Discussions' },
  { href: '/community/categories', label: 'Categories' },
  { href: '/community/leaderboards', label: 'Leaderboards' },
];

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <CommunityProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Skip to main content */}
        <a
          href="#community-main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-teal-700 focus:border focus:border-teal-500 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        {/* Top navigation bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-1">
                {NAV_LINKS.map(link => {
                  const active = pathname === link.href || (link.href !== '/community' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-600 hover:text-teal-700 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/community/post/new"
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                + New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div id="community-main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </div>
    </CommunityProvider>
  );
}
