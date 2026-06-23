"use client";

import { CommunityProvider } from '../../components/community/CommunityContext';
import { CommunityBasePathContext } from '../../components/community/CommunityBasePathContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '../../components/AccessibilityContext';

const NAV_LINKS = [
  { href: '/TutorStudio/community', label: 'Discussions' },
  { href: '/TutorStudio/community/categories', label: 'Categories' },
  { href: '/TutorStudio/community/leaderboards', label: 'Leaderboards' },
];

export default function TutorCommunityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { announce } = useAccessibility();

  return (
    <CommunityBasePathContext.Provider value="/TutorStudio/community">
      <CommunityProvider>
        <div className="flex flex-col h-full bg-slate-50">
        {/* Skip to main content */}
        <a
          href="#community-main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-700 focus:border focus:border-blue-500 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        {/* Community sub-nav */}
        <div className="bg-white border-b border-slate-200 shrink-0">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-14" role="navigation" aria-label="Community sections">
              <div className="flex items-center gap-1">
                {NAV_LINKS.map(link => {
                  const active =
                    pathname === link.href ||
                    (link.href !== '/TutorStudio/community' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => announce(`Navigating to ${link.label}`)}
                      aria-current={active ? 'page' : undefined}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 ${
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-500 hover:text-blue-700 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/TutorStudio/community/post/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 shadow-sm"
              >
                + New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div
          id="community-main-content"
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
        >
          {children}
        </div>
      </div>
    </CommunityProvider>
    </CommunityBasePathContext.Provider>
  );
}
