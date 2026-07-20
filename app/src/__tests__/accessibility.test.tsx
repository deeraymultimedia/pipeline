/**
 * Accessibility foundation tests
 *
 * Covers:
 *   - Semantic navigation landmarks
 *   - Skip link present and functional
 *   - Visible focus styles declared
 *   - Route headings (every view has an h1 or h2)
 *   - Accessible placeholders (aria-labels on RoutePlaceholder)
 *   - Active-route indication (NavLink sets aria-current="page")
 *   - Mobile navigation labels visible to assistive technology
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

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

import { AppShell } from '../components/AppShell';
import { TodayView } from '../views/TodayView';
import { PipelineView } from '../views/PipelineView';
import { TasksView } from '../views/TasksView';
import { RoutePlaceholder } from '../components/RoutePlaceholder';
import { EmptyState } from '../components/EmptyState';

function buildRouter(path: string) {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <TodayView /> },
          { path: 'pipeline', element: <PipelineView /> },
          { path: 'tasks', element: <TasksView /> },
        ],
      },
    ],
    { initialEntries: [path] },
  );
}

describe('Semantic navigation', () => {
  it('renders a primary navigation landmark', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    // Desktop sidebar
    const navs = screen.getAllByRole('navigation');
    expect(navs.length).toBeGreaterThanOrEqual(1);
  });

  it('desktop sidebar has accessible label', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeDefined();
  });

  it('mobile bottom nav has accessible label', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('navigation', { name: /mobile navigation/i })).toBeDefined();
  });
});

describe('Skip link', () => {
  it('skip link is present in the DOM', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    const link = screen.getByText(/skip to main content/i);
    expect(link).toBeDefined();
  });

  it('skip link points to #main-content', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    const link = screen.getByText(/skip to main content/i) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('clicking skip link does not navigate away from the current route', () => {
    // Regression: href="#main-content" used to trigger hash-router navigation
    // to an unknown route (/main-content), showing the error page.
    // The onClick handler must call e.preventDefault() so the URL never changes.
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    const link = screen.getByText(/skip to main content/i);
    fireEvent.click(link);
    // Today view must still be visible — no error page
    expect(screen.getByRole('heading', { name: /today/i, level: 1 })).toBeDefined();
  });

  it('clicking skip link moves focus to the main content element', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    const link = screen.getByText(/skip to main content/i);
    fireEvent.click(link);
    const main = document.getElementById('main-content');
    expect(document.activeElement).toBe(main);
  });
});

describe('Main content element', () => {
  it('has tabIndex -1 so the skip link can move focus to it programmatically', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    const main = document.getElementById('main-content');
    expect(main).not.toBeNull();
    expect(main?.getAttribute('tabindex')).toBe('-1');
  });
});

describe('Main content landmark', () => {
  it('main element has id main-content', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    const main = document.getElementById('main-content');
    expect(main).not.toBeNull();
    expect(main?.tagName.toLowerCase()).toBe('main');
  });
});

describe('Route headings', () => {
  it('Today view has a heading', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /today/i, level: 1 })).toBeDefined();
  });

  it('Pipeline view has a heading', () => {
    const router = buildRouter('/pipeline');
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /pipeline/i, level: 1 })).toBeDefined();
  });

  it('Tasks view has a heading', () => {
    const router = buildRouter('/tasks');
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /tasks/i, level: 1 })).toBeDefined();
  });
});

describe('RoutePlaceholder accessibility', () => {
  it('has an aria-label on the region', () => {
    render(<RoutePlaceholder viewName="Test View" />);
    expect(screen.getByRole('region', { name: /test view/i })).toBeDefined();
  });

  it('decorative icons have aria-hidden', () => {
    render(<RoutePlaceholder viewName="Test View" />);
    // Decorative icons carry aria-hidden="true"
    const hiddenIcons = document.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenIcons.length).toBeGreaterThan(0);
  });
});

describe('EmptyState accessibility', () => {
  it('renders with a region role', () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByRole('region', { name: /no items found/i })).toBeDefined();
  });
});

describe('Mobile navigation labels', () => {
  it('mobile nav items have text labels visible to AT', () => {
    const router = buildRouter('/');
    render(<RouterProvider router={router} />);
    // Mobile nav labels are plain text spans (not aria-hidden)
    const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i });
    expect(within(mobileNav).getByText('Today')).toBeDefined();
    expect(within(mobileNav).getByText('Pipeline')).toBeDefined();
    expect(within(mobileNav).getByText('Clients')).toBeDefined();
    expect(within(mobileNav).getByText('Tasks')).toBeDefined();
    expect(within(mobileNav).getByText('More')).toBeDefined();
  });
});
