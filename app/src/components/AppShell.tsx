/**
 * AppShell — root layout component
 *
 * Responsible for:
 *   - Authentication gate (redirects unauthenticated users to sign-in)
 *   - Responsive layout: persistent sidebar at ≥1024px, bottom nav below
 *   - Outlet for child routes
 *   - Mock data banner when VITE_USE_MOCK_DATA=true
 */

import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppHeader } from './AppHeader';
import { LoadingState } from './LoadingState';
import { AuthScreen } from './AuthScreen';
import { isMockMode } from '../services/MockDataService';

export function AppShell() {
  const { auth } = useAuth();

  if (auth.status === 'loading') {
    return <LoadingState message="Signing in…" />;
  }

  if (auth.status === 'unauthenticated' || auth.status === 'error' || auth.status === 'unauthorised') {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell" role="application">
      {/* Skip link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:rounded focus:text-sm focus:font-medium"
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

      {/* Desktop sidebar (hidden below lg breakpoint) */}
      <DesktopSidebar />

      {/* Main content area */}
      <div
        className={`main-layout flex flex-col min-h-screen lg:pl-64 ${isMockMode() ? 'pt-6' : ''}`}
      >
        <AppHeader />

        <main
          id="main-content"
          className="flex-1 overflow-auto"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav (hidden at lg and above) */}
      <MobileBottomNav />
    </div>
  );
}
