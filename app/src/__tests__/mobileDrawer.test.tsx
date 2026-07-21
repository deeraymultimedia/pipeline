/**
 * mobileDrawer.test.tsx -- MobileDrawer accessibility regression tests
 *
 * Verifies WCAG 2.1 SC 2.1.1 compliance after PR #1 remediation:
 *   - Drawer absent from DOM when closed (parent conditional mount)
 *   - Focus trap (Tab / Shift+Tab wraps within dialog)
 *   - Four close routes each restore focus to trigger button
 *   - Body overflow restored on close and on unmount
 *   - Initial focus lands inside dialog on open
 *
 * Uses MemoryRouter (declarative) rather than createMemoryRouter (data-router)
 * to avoid the Node/JSDOM AbortSignal incompatibility triggered by the
 * data-router's fetch machinery during route transitions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { TodayView } from '../views/TodayView';

// ---- Mocks ------------------------------------------------------------------

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    auth: {
      status: 'authenticated',
      email: 'adegisanrin@gmail.com',
      accessToken: 'mock-token',
      expiresAt: Date.now() + 3600000,
    },
    signIn: vi.fn(),
    signOut: vi.fn(),
    getToken: () => 'mock-token',
    pendingState: null,
    clearPendingState: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../services/MockDataService', () => ({
  isMockMode: () => false,
  assertMockModeForWrites: vi.fn(),
  MockDataService: {},
}));

// ---- Helper -----------------------------------------------------------------

/**
 * Renders AppShell inside declarative MemoryRouter.
 * The /pipeline child route is defined so clicking the drawer's Pipeline link
 * navigates to a valid route rather than a 404 error boundary.
 * MemoryRouter avoids the data-router fetch/AbortSignal machinery that causes
 * a TypeError in Node/JSDOM environments.
 */
function renderShell(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<TodayView />} />
          <Route path="pipeline" element={<h1>Pipeline test route</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

// ---- Tests ------------------------------------------------------------------

describe('MobileDrawer -- closed state', () => {
  it('dialog is absent from the DOM when the drawer has never been opened', () => {
    renderShell('/');
    expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument();
  });
});

describe('MobileDrawer -- open state', () => {
  it('dialog appears in the DOM after hamburger click', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
  });

  it('dialog carries role="dialog", aria-modal, and accessible name', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() => {
      const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });

  it('initial focus lands inside the dialog', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() => {
      const dialog = document.querySelector('[role="dialog"]');
      expect(dialog).not.toBeNull();
      expect(dialog!.contains(document.activeElement)).toBe(true);
    });
  });

  it('navigation links are accessible inside the dialog', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    expect(within(dialog).getByRole('link', { name: /pipeline/i })).toBeInTheDocument();
  });
});

describe('MobileDrawer -- close routes + focus restoration', () => {
  it('Escape key closes the drawer and returns focus to trigger', async () => {
    renderShell('/');
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument(),
    );
    expect(document.activeElement).toBe(hamburger);
  });

  it('close button dismisses the drawer and returns focus to trigger', async () => {
    renderShell('/');
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument(),
    );
    expect(document.activeElement).toBe(hamburger);
  });

  it('backdrop click closes the drawer and returns focus to trigger', async () => {
    renderShell('/');
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
    // The backdrop is the only aria-hidden DIV that lives outside the dialog panel.
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    const backdrop = Array.from(
      document.querySelectorAll<HTMLElement>('[aria-hidden="true"]'),
    ).find((el) => el.tagName === 'DIV' && !dialog.contains(el));
    expect(backdrop).toBeDefined();
    fireEvent.click(backdrop!);
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument(),
    );
    expect(document.activeElement).toBe(hamburger);
  });

  it('nav link click closes the drawer, navigates to the linked route, and returns focus to trigger', async () => {
    renderShell('/');
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    const pipelineLink = within(dialog).getByRole('link', { name: /pipeline/i });
    fireEvent.click(pipelineLink);
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: /navigation menu/i })).not.toBeInTheDocument(),
    );
    // Confirm the pipeline child route rendered (AppShell remains mounted via MemoryRouter)
    expect(screen.getByRole('heading', { name: /pipeline test route/i })).toBeInTheDocument();
    // Body overflow must be restored after navigation closes the drawer
    expect(document.body.style.overflow).toBe('');
    // Hamburger remains mounted in AppHeader; focus must return to it via cleanup
    expect(document.activeElement).toBe(hamburger);
  });
});

describe('MobileDrawer -- focus trap', () => {
  it('Tab from last focusable element wraps to first', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    const FOCUSABLE_SEL =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SEL));
    const first = focusable[0];
    const last = focusable.at(-1);
    expect(first).toBeDefined();
    expect(last).toBeDefined();
    if (!first || !last) throw new Error('Expected drawer focusable controls');
    last.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(first);
  });

  it('Shift+Tab from first focusable element wraps to last', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /navigation menu/i })).toBeInTheDocument(),
    );
    const dialog = screen.getByRole('dialog', { name: /navigation menu/i });
    const FOCUSABLE_SEL =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SEL));
    const first = focusable[0];
    const last = focusable.at(-1);
    expect(first).toBeDefined();
    expect(last).toBeDefined();
    if (!first || !last) throw new Error('Expected drawer focusable controls');
    first.focus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});

describe('MobileDrawer -- body overflow', () => {
  it('body overflow is hidden when drawer is open', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
  });

  it('body overflow is restored when drawer closes normally', async () => {
    renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    await waitFor(() => expect(document.body.style.overflow).toBe(''));
  });

  it('body overflow is restored when drawer unmounts', async () => {
    const { unmount } = renderShell('/');
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
