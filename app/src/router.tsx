/**
 * Router configuration — createHashRouter
 *
 * Hash routing is required for GitHub Pages (static host, no SPA fallback).
 * All routes are prefixed with # in the browser URL.
 *
 * Production URL patterns:
 *   https://deeraymultimedia.github.io/pipeline/#/
 *   https://deeraymultimedia.github.io/pipeline/#/pipeline
 *   https://deeraymultimedia.github.io/pipeline/#/pipeline/{record-id}
 *   https://deeraymultimedia.github.io/pipeline/#/clients
 *   https://deeraymultimedia.github.io/pipeline/#/clients/{client-id}
 *   https://deeraymultimedia.github.io/pipeline/#/clients/{client-id}/documents
 *   https://deeraymultimedia.github.io/pipeline/#/engagements
 *   https://deeraymultimedia.github.io/pipeline/#/tasks
 *   https://deeraymultimedia.github.io/pipeline/#/revenue
 *   https://deeraymultimedia.github.io/pipeline/#/settings
 *   https://deeraymultimedia.github.io/pipeline/#/settings/archived
 *
 * Note: the Vite base path '/pipeline/' is NOT part of the React Router route tree.
 * React Router sees only what comes after '#/'. There is no /pipeline/pipeline/ duplication.
 *
 * URL persistence:
 *   - Selected pipeline stage: ?stage={stageId}
 *   - Opportunity detail: /pipeline/{id}
 *   - Client detail: /clients/{client-id}
 *   - Client documents: /clients/{client-id}/documents
 *
 * All routes not yet implemented render an accessible RoutePlaceholder.
 * No route leads to a blank or broken screen.
 */

import { createHashRouter } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { TodayView } from './views/TodayView';
import { PipelineView } from './views/PipelineView';
import { PipelineDetailView } from './views/PipelineDetailView';
import { ClientsView } from './views/ClientsView';
import { ClientDetailView } from './views/ClientDetailView';
import { ClientDocumentsView } from './views/ClientDocumentsView';
import { EngagementsView } from './views/EngagementsView';
import { TasksView } from './views/TasksView';
import { RevenueView } from './views/RevenueView';
import { SettingsView } from './views/SettingsView';
import { SettingsArchivedView } from './views/SettingsArchivedView';
import { ErrorState } from './components/ErrorState';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorState message="Page not found." />,
    children: [
      {
        index: true,
        element: <TodayView />,
      },
      {
        path: 'pipeline',
        children: [
          {
            index: true,
            element: <PipelineView />,
          },
          {
            path: ':id',
            element: <PipelineDetailView />,
          },
        ],
      },
      {
        path: 'clients',
        children: [
          {
            index: true,
            element: <ClientsView />,
          },
          {
            path: ':clientId',
            children: [
              {
                index: true,
                element: <ClientDetailView />,
              },
              {
                path: 'documents',
                element: <ClientDocumentsView />,
              },
            ],
          },
        ],
      },
      {
        path: 'engagements',
        element: <EngagementsView />,
      },
      {
        path: 'tasks',
        element: <TasksView />,
      },
      {
        path: 'revenue',
        element: <RevenueView />,
      },
      {
        path: 'settings',
        children: [
          {
            index: true,
            element: <SettingsView />,
          },
          {
            path: 'archived',
            element: <SettingsArchivedView />,
          },
        ],
      },
    ],
  },
]);
