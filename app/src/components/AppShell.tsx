/**
 * AppShell — root layout component (Batch 1B update)
 *
 * Changes from Batch 1A:
 *   - Wrapped authenticated shell in <DemoStoreProvider>
 *   - Added <MobileDrawer> with controlled drawerOpen state and menuButtonRef
 *   - Skip link rendered first (#main-content)
 *   - pb-20 lg:pb-0 on main for mobile bottom nav clearance
 * Remediation (PR #1):
 *   - role="application" removed from root div (WCAG)
 *   - MobileDrawer conditionally mounted only when open (WCAG 2.1 SC 2.1.1)
 */

import { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DemoStoreProvider } from '../contexts/DemoStoreContext';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppHeader } from './AppHeader';
import { MobileDrawer } from './MobileDrawer';
import { LoadingState } from './LoadingState';
import { AuthScreen } from './AuthScreen';
import { isMockMode } from '../services/MockDataService';

export function AppShell() {
  const { auth } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  if (auth.status === 'loading') {
    return <LoadingState message="Signing in…" />;
  }

  if (auth.status === 'unauthenticated' || auth.status === 'error' || auth.status === 'unauthorised') {
    return <AuthScreen />;
  }

  return (
    <DemoStoreProvider>
      <div className="app-shell">
        {/* Skip link — rendered first in DOM for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:rounded focus:text-sm focus:font-medium"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('main-content')?.focus();
          }}
        >
          Skip to main content
        </a>

        {/* Mock data warning banner */}
        {isMockMode() && (
          <div
            role="status"
            aria-live="polite"
            className="mock-banner fixed top-0 inset-x-0 z-50 bg-amber-400 text-amber-900 text-xs font-semibold text-center py-1 px-4"
          >
            MOCK DATA MODE — no live data is shown or saved
          </div>
        )}

        {/* Mobile drawer — only mounted when open (WCAG 2.1 SC 2.1.1) */}
        {drawerOpen && (
          <MobileDrawer
            onClose={() => setDrawerOpen(false)}
            triggerRef={menuButtonRef}
          />
        )}

        {/* Desktop sidebar (hidden below lg breakpoint) */}
        <DesktopSidebar />

        {/* Main content area */}
        <div
          className={`main-layout flex flex-col min-h-screen lg:pl-64 ${isMockMode() ? 'pt-6' : ''}`}
        >
          <AppHeader
            onMenuOpen={() => setDrawerOpen(true)}
            menuButtonRef={menuButtonRef}
          />

          <main
            id="main-content"
            className="flex-1 overflow-auto pb-20 lg:pb-0"
            tabIndex={-1}
          >
            <Outlet />
          </main>
        </div>

        {/* Mobile bottom nav (hidden at lg and above) */}
        <MobileBottomNav />
      </div>
    </DemoStoreProvider>
  );
}
