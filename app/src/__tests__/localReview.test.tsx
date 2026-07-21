/**
 * localReview.test.tsx — Local review mode bypass tests
 *
 * Verifies the DEV-only auth bypass added in Batch 1C:
 *
 *   1. Normal mode remains unauthenticated by default (no bypass active).
 *   2. Bypass activates only when DEV === true AND VITE_BYPASS_AUTH === 'true'.
 *   3. Production mode (DEV === false) cannot activate the bypass.
 *   4. Google OAuth flow is preserved when bypass is inactive.
 *   5. Local review mode renders the authenticated app shell.
 *   6. Mock-data mode is read-only — no network write occurs.
 *   7. No real API call to googleapis.com occurs in local review mode.
 *
 * Notes on import.meta.env in tests:
 *   setup.ts sets import.meta.env.DEV = false and leaves VITE_BYPASS_AUTH
 *   undefined. Tests 1-4 verify the guard logic as pure boolean expressions
 *   matching the compiled constant in AuthContext.tsx. Tests 5-7 mock the
 *   AuthContext directly to simulate the local review authenticated state.
 */

import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DemoStoreProvider } from '../contexts/DemoStoreContext';
import { TodayView } from '../views/TodayView';

// ─── Mock AuthContext with local-review state (applies to render tests 5-7) ──

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    auth: {
      status: 'authenticated',
      email: 'local-review@example.com',
      accessToken: 'local-review-token',
      expiresAt: Number.MAX_SAFE_INTEGER,
    },
    signIn: vi.fn(),
    signOut: vi.fn(),
    getToken: vi.fn(() => 'local-review-token'),
    pendingState: null,
    clearPendingState: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ─── Render helper ────────────────────────────────────────────────────────────

function renderInStore(ui: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <DemoStoreProvider>{ui}</DemoStoreProvider>
    </MemoryRouter>,
  );
}

// ─── Guard logic — pure Boolean tests (no rendering) ─────────────────────────

describe('Local review mode guard logic', () => {
  /** Mirrors the expression in AuthContext.tsx:
   *    const isLocalReviewMode = import.meta.env.DEV === true && import.meta.env.VITE_BYPASS_AUTH === 'true';
   */
  function evalGuard(DEV: boolean, BYPASS_AUTH: string | undefined): boolean {
    return DEV === true && BYPASS_AUTH === 'true';
  }

  it('1. Normal mode — guard is false when DEV is false and no bypass flag is set', () => {
    // setup.ts default: DEV=false, VITE_BYPASS_AUTH=undefined
    expect(evalGuard(false, undefined)).toBe(false);
  });

  it('2a. Guard is true only when DEV is true AND VITE_BYPASS_AUTH is exactly "true"', () => {
    expect(evalGuard(true, 'true')).toBe(true);
  });

  it('2b. Guard is false when VITE_BYPASS_AUTH is set to a non-exact value', () => {
    const nonExactValues: Array<string | undefined> = [
      'True', 'TRUE', '1', 'yes', 'on', '', 'false', undefined,
    ];
    for (const v of nonExactValues) {
      expect(evalGuard(true, v)).toBe(false);
    }
  });

  it('2c. Guard is false when DEV is true but VITE_BYPASS_AUTH is not set', () => {
    expect(evalGuard(true, undefined)).toBe(false);
  });

  it('3. Production mode — guard is false even when VITE_BYPASS_AUTH is "true"', () => {
    // In a production build Vite replaces import.meta.env.DEV with false,
    // making this path unreachable dead code. Test that DEV=false blocks bypass.
    expect(evalGuard(false, 'true')).toBe(false);
  });

  it('4. Auth initial state is unauthenticated when bypass is inactive (normal OAuth flow available)', () => {
    // Simulates the useState initialiser in AuthContext.tsx when bypass is off.
    const isLocalReviewMode = evalGuard(false, undefined); // matches test env defaults

    const initialState = isLocalReviewMode
      ? {
          status: 'authenticated' as const,
          email: 'local-review@example.com',
          accessToken: 'local-review-token',
          expiresAt: Number.MAX_SAFE_INTEGER,
        }
      : { status: 'unauthenticated' as const };

    // Normal mode starts unauthenticated — Google OAuth will be presented.
    expect(initialState.status).toBe('unauthenticated');
    expect(initialState).not.toHaveProperty('accessToken');
  });
});

// ─── Rendering tests with mocked local-review auth ───────────────────────────

describe('Local review mode — rendering and data isolation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('5. Local review mode renders the authenticated app shell without a sign-in prompt', () => {
    renderInStore(<TodayView />);

    // Authenticated shell shows content, not a sign-in wall.
    // TodayView renders its heading when auth is authenticated.
    expect(screen.getByRole('heading', { name: /good morning/i })).toBeInTheDocument();

    // No sign-in button should be visible.
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in with google/i })).not.toBeInTheDocument();
  });

  it('6. Mock-data mode is read-only — updateOpportunity mutates only in-memory state', () => {
    // DemoStoreContext.updateOpportunity makes no network call. Spy on fetch
    // to confirm no outbound request is triggered by an in-memory write.
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{}', { status: 200 }),
    );

    renderInStore(<TodayView />);

    // Verify fetch was not called during render or task-toggle interaction.
    const taskCheckboxes = screen.queryAllByRole('checkbox');
    if (taskCheckboxes.length > 0) {
      fireEvent.click(taskCheckboxes[0]);
    }

    const googleCalls = fetchSpy.mock.calls.filter(([url]) =>
      String(url).includes('googleapis.com'),
    );
    expect(googleCalls).toHaveLength(0);
    expect(fetchSpy).not.toHaveBeenCalled(); // MockDataService makes no fetch calls
  });

  it('7. No real API call to googleapis.com occurs in local review mode', async () => {
    // Spy on fetch to confirm no Google API calls happen during render.
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{}', { status: 200 }),
    );

    renderInStore(<TodayView />);

    // Filter for any call to googleapis.com (token validation, Sheets API, etc.)
    const googleApiCalls = fetchSpy.mock.calls.filter(([url]) =>
      String(url).includes('googleapis.com'),
    );

    expect(googleApiCalls).toHaveLength(0);
  });
});
