/**
 * AppHeader — top bar shown within the main content area
 * Displays page title, sync status indicator, and account controls.
 */

import { useAuth } from '../contexts/AuthContext';
import { COMPANY } from '../constants/company';

export function AppHeader() {
  const { auth, signOut } = useAuth();

  return (
    <header
      className="app-header flex items-center justify-between px-4 lg:px-6 h-14 bg-white border-b border-border-subtle sticky top-0 z-30"
      role="banner"
    >
      {/* Mobile brand (hidden on desktop where sidebar shows branding) */}
      <div className="lg:hidden flex items-center gap-2">
        <div
          className="w-7 h-7 rounded bg-navy flex items-center justify-center text-white text-xs font-bold"
          aria-hidden="true"
        >
          DM
        </div>
        <span className="text-navy text-sm font-semibold">{COMPANY.name}</span>
      </div>

      {/* Desktop: empty left side (sidebar carries the brand) */}
      <div className="hidden lg:block" aria-hidden="true" />

      {/* Account area */}
      <div className="flex items-center gap-3">
        {auth.status === 'authenticated' && (
          <>
            <span className="hidden sm:block text-text-muted text-xs">{auth.email}</span>
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
