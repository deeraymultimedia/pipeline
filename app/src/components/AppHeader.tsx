/**
 * AppHeader — top bar (Batch 1B update)
 *
 * Changes from Batch 1A:
 *   - Hamburger button (lg:hidden) with aria-haspopup="dialog", aria-label
 *   - usePageTitle() hook derives title from useLocation() against route map
 *   - "Demo data" pill in header right area
 *   - User avatar (first letter of email) shown at lg breakpoint
 *   - Sign-out button with aria-label
 * Remediation (PR #1):
 *   - Removed unused _ref (useRef was imported and declared but unused)
 */

import { type RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { COMPANY } from '../constants/company';

// ─── Page title map ──────────────────────────────────────────────────────────

const ROUTE_TITLES: Record<string, string> = {
  '/':                    'Today',
  '/pipeline':            'Pipeline',
  '/clients':             'Clients',
  '/engagements':         'Engagements',
  '/tasks':               'Tasks',
  '/revenue':             'Revenue',
  '/settings':            'Settings',
  '/settings/archived':   'Archived Opportunities',
};

function usePageTitle(): string {
  const { pathname } = useLocation();
  // Strip trailing slash
  const clean = pathname.replace(/\/$/, '') || '/';
  // Check exact match first, then prefix match for detail views
  if (ROUTE_TITLES[clean]) return ROUTE_TITLES[clean];
  if (clean.startsWith('/pipeline/')) return 'Opportunity';
  if (clean.startsWith('/clients/') && clean.endsWith('/documents')) return 'Documents';
  if (clean.startsWith('/clients/')) return 'Client';
  return 'Pipeline';
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AppHeaderProps {
  onMenuOpen: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}

export function AppHeader({ onMenuOpen, menuButtonRef }: AppHeaderProps) {
  const { auth, signOut } = useAuth();
  const pageTitle = usePageTitle();

  return (
    <header
      className="app-header flex items-center justify-between px-4 lg:px-6 h-14 bg-white border-b border-border-subtle sticky top-0 z-30"
      role="banner"
    >
      {/* Left: hamburger (mobile) + brand / page title */}
      <div className="flex items-center gap-3">
        {/* Hamburger — visible below lg */}
        <button
          ref={menuButtonRef as RefObject<HTMLButtonElement>}
          type="button"
          onClick={onMenuOpen}
          aria-haspopup="dialog"
          aria-label="Open navigation menu"
          className="lg:hidden text-navy min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-canvas transition-colors"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        {/* Mobile brand (hidden on desktop where sidebar shows branding) */}
        <div className="lg:hidden flex items-center gap-2">
          <div
            className="w-7 h-7 rounded bg-teal flex items-center justify-center text-white text-xs font-bold"
            aria-hidden="true"
          >
            DM
          </div>
          <span className="text-navy text-sm font-semibold">{COMPANY.name}</span>
        </div>

        {/* Desktop: page title */}
        <span className="hidden lg:block text-base font-semibold text-navy">{pageTitle}</span>
      </div>

      {/* Right: demo pill + avatar + sign out */}
      <div className="flex items-center gap-3">
        {/* Demo data pill */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-xs font-medium">
          <span aria-hidden="true">⚠</span> Demo data
        </span>

        {auth.status === 'authenticated' && (
          <>
            {/* Avatar + email at lg */}
            <div className="hidden lg:flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-xs font-bold"
                aria-hidden="true"
              >
                {auth.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-text-muted text-xs max-w-[180px] truncate">{auth.email}</span>
            </div>

            <button
              onClick={signOut}
              className="text-text-muted hover:text-navy text-xs px-3 py-1.5 rounded border border-border-subtle hover:border-navy transition-colors min-h-[36px]"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
