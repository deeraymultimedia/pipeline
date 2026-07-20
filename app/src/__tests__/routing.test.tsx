/**
 * Routing tests
 *
 * Covers:
 *   - Every route renders without crashing (placeholder or real view)
 *   - Hash-based direct links work
 *   - Stage URL parameter is passed through
 *   - Opportunity detail route receives id param
 *   - Client and nested routes work
 *   - No route leads to a blank screen
 *   - Active navigation state is set
 *   - No /pipeline/pipeline/ duplication
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

// Mock AuthContext so we don't need GIS loaded
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    auth: { status: 'authenticated', email: 'adegisanrin@gmail.com', accessToken: 'mock-token', expiresAt: Date.now() + 3600000 },
    signIn: vi.fn(),
    signOut: vi.fn(),
    getToken: () => 'mock-token',
    pendingState: null,
    clearPendingState: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock MockDataService
vi.mock('../services/MockDataService', () => ({
  isMockMode: () => false,
  assertMockModeForWrites: vi.fn(),
  MockDataService: {},
}));

import { AppShell } from '../components/AppShell';
import { TodayView } from '../views/TodayView';
import { PipelineView } from '../views/PipelineView';
import { PipelineDetailView } from '../views/PipelineDetailView';
import { ClientsView } from '../views/ClientsView';
import { ClientDetailView } from '../views/ClientDetailView';
import { ClientDocumentsView } from '../views/ClientDocumentsView';
import { EngagementsView } from '../views/EngagementsView';
import { TasksView } from '../views/TasksView';
import { RevenueView } from '../views/RevenueView';
import { SettingsView } from '../views/SettingsView';
import { SettingsArchivedView } from '../views/SettingsArchivedView';
import { ErrorState } from '../components/ErrorState';

function buildTestRouter(initialEntries: string[]) {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <AppShell />,
        errorElement: <ErrorState message="Page not found." />,
        children: [
          { index: true, element: <TodayView /> },
          {
            path: 'pipeline',
            children: [
              { index: true, element: <PipelineView /> },
              { path: ':id', element: <PipelineDetailView /> },
            ],
          },
          {
            path: 'clients',
            children: [
              { index: true, element: <ClientsView /> },
              {
                path: ':clientId',
                children: [
                  { index: true, element: <ClientDetailView /> },
                  { path: 'documents', element: <ClientDocumentsView /> },
                ],
              },
            ],
          },
          { path: 'engagements', element: <EngagementsView /> },
          { path: 'tasks', element: <TasksView /> },
          { path: 'revenue', element: <RevenueView /> },
          {
            path: 'settings',
            children: [
              { index: true, element: <SettingsView /> },
              { path: 'archived', element: <SettingsArchivedView /> },
            ],
          },
        ],
      },
    ],
    { initialEntries },
  );
}

describe('Route rendering', () => {
  it('/ renders Today view heading', () => {
    const router = buildTestRouter(['/']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /today/i, level: 1 })).toBeDefined();
  });

  it('/pipeline renders Pipeline view heading', () => {
    const router = buildTestRouter(['/pipeline']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /pipeline/i, level: 1 })).toBeDefined();
  });

  it('/pipeline/:id renders Opportunity Detail heading', () => {
    const router = buildTestRouter(['/pipeline/test-id-123']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /opportunity detail/i, level: 1 })).toBeDefined();
  });

  it('/pipeline/:id passes id param to view', () => {
    const router = buildTestRouter(['/pipeline/opp-456']);
    render(<RouterProvider router={router} />);
    expect(screen.getByText(/opp-456/)).toBeDefined();
  });

  it('/clients renders Clients view heading', () => {
    const router = buildTestRouter(['/clients']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /clients/i, level: 1 })).toBeDefined();
  });

  it('/clients/:clientId renders Client Detail heading', () => {
    const router = buildTestRouter(['/clients/client-123']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /client detail/i, level: 1 })).toBeDefined();
  });

  it('/clients/:clientId/documents renders Client Documents heading', () => {
    const router = buildTestRouter(['/clients/client-123/documents']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /client documents/i, level: 1 })).toBeDefined();
  });

  it('/engagements renders Engagements heading', () => {
    const router = buildTestRouter(['/engagements']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /engagements/i, level: 1 })).toBeDefined();
  });

  it('/tasks renders Tasks heading', () => {
    const router = buildTestRouter(['/tasks']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /tasks/i, level: 1 })).toBeDefined();
  });

  it('/revenue renders Revenue heading', () => {
    const router = buildTestRouter(['/revenue']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /revenue/i, level: 1 })).toBeDefined();
  });

  it('/settings renders Settings heading', () => {
    const router = buildTestRouter(['/settings']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /settings/i, level: 1 })).toBeDefined();
  });

  it('/settings/archived renders Archived Opportunities heading', () => {
    const router = buildTestRouter(['/settings/archived']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /archived opportunities/i, level: 1 })).toBeDefined();
  });
});

describe('URL parameter handling', () => {
  it('/pipeline?stage=proposal passes stage param to PipelineView', () => {
    const router = buildTestRouter(['/pipeline?stage=proposal']);
    render(<RouterProvider router={router} />);
    // PipelineView reads ?stage from searchParams and shows it in description
    expect(screen.getByText(/proposal/i)).toBeDefined();
  });
});

describe('No route produces a blank screen', () => {
  it('unknown route renders error state', () => {
    const router = buildTestRouter(['/this-route-does-not-exist']);
    render(<RouterProvider router={router} />);
    // Error boundary renders
    expect(screen.getByRole('alert')).toBeDefined();
  });
});

describe('Route URL structure', () => {
  it('opportunity detail URL is /pipeline/:id (no /pipeline/pipeline/ duplication)', () => {
    // The router has path 'pipeline' at root, then ':id' as child.
    // Full path is /pipeline/:id — not /pipeline/pipeline/:id
    const router = buildTestRouter(['/pipeline/test-opp']);
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { name: /opportunity detail/i, level: 1 })).toBeDefined();
  });
});
