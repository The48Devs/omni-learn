"use client";

import { CommunityProvider } from '../../components/community/CommunityContext';
import { CommunityBasePathContext } from '../../components/community/CommunityBasePathContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '../../components/AccessibilityContext';

const NAV_LINKS = [
  { href: '/StudentPortal/community', label: 'Discussions' },
  { href: '/StudentPortal/community/categories', label: 'Categories' },
  { href: '/StudentPortal/community/leaderboards', label: 'Leaderboards' },
];

export default function StudentCommunityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { announce } = useAccessibility();

  return (
    <CommunityBasePathContext.Provider value="/StudentPortal/community">
      <CommunityProvider>
        <div className="flex flex-col h-full">
        {/* Skip to main content */}
        <a
          href="#community-main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-teal-700 focus:border focus:border-teal-500 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        {/* Community sub-nav */}
        <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] shrink-0">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-12" role="navigation" aria-label="Community sections">
              <div className="flex items-center gap-1">
                {NAV_LINKS.map(link => {
                  const active =
                    pathname === link.href ||
                    (link.href !== '/StudentPortal/community' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => announce(`Navigating to ${link.label}`)}
                      aria-current={active ? 'page' : undefined}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color,#2563eb)] ${
                        active
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-[var(--text-muted)] hover:text-teal-700 hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/StudentPortal/community/post/new"
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
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
