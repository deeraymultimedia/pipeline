/**
 * MockDataService
 *
 * Provides read-only fixture data for development when VITE_USE_MOCK_DATA=true.
 *
 * Rules:
 *   - Never enabled in production (guarded by import.meta.env.VITE_USE_MOCK_DATA)
 *   - Read-only: write operations are intercepted and rejected with a console warning
 *   - Uses confirmed opportunity names and values where appropriate
 *   - Does not include real personal contact details (email/phone are placeholders)
 *   - UI must display a "MOCK DATA" banner when active
 */

import type { Opportunity } from '../types/Opportunity';
import type { Activity } from '../types/Activity';

// ─── Confirmed real values (safe for fixtures) ────────────────────────────────
// Do NOT include real email addresses or phone numbers.
// project_value and monthly_value are confirmed and authorised for local testing.

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'mock-001',
    client_name: 'Senig Consulting',
    contact_name: 'Contact Name',
    email: 'contact@example.com',
    phone: '07000 000000',
    service: 'Website & SEO',
    stage: 'live',
    project_value: 1500,
    monthly_value: 100,
    follow_up_date: '',
    expected_close_date: '',
    next_action: 'Monthly check-in',
    notes: '',
    status: 'active',
    archived: false,
    archived_at: '',
    won_date: '2025-01-01',
    lost_date: '',
    created_at: '2024-06-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    sales_stage: 'Payment Received',
    delivery_status: 'Live',
    ghl_contact_id: null,
    ghl_opportunity_id: null,
    ghl_pipeline_id: null,
    ghl_stage_id: null,
    sync_status: 'never',
    last_synced_at: null,
    sync_error: null,
    source: 'tracker',
  },
  {
    id: 'mock-002',
    client_name: 'Senig Law & Probate',
    contact_name: 'Contact Name',
    email: 'contact2@example.com',
    phone: '07000 000001',
    service: 'Website & SEO',
    stage: 'live',
    project_value: 1500,
    monthly_value: 100,
    follow_up_date: '',
    expected_close_date: '',
    next_action: 'Monthly check-in',
    notes: '',
    status: 'active',
    archived: false,
    archived_at: '',
    won_date: '2025-01-01',
    lost_date: '',
    created_at: '2024-07-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    sales_stage: 'Payment Received',
    delivery_status: 'Live',
    ghl_contact_id: null,
    ghl_opportunity_id: null,
    ghl_pipeline_id: null,
    ghl_stage_id: null,
    sync_status: 'never',
    last_synced_at: null,
    sync_error: null,
    source: 'tracker',
  },
  {
    id: 'mock-003',
    client_name: 'Aniis Care',
    contact_name: 'Contact Name',
    email: 'contact3@example.com',
    phone: '07000 000002',
    service: 'Care Plan Website',
    stage: 'live',
    project_value: 600,
    monthly_value: 150,
    follow_up_date: '',
    expected_close_date: '',
    next_action: 'Care plan review',
    notes: '',
    status: 'active',
    archived: false,
    archived_at: '',
    won_date: '2025-02-01',
    lost_date: '',
    created_at: '2024-08-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
    sales_stage: 'Payment Received',
    delivery_status: 'On Care Plan',
    ghl_contact_id: null,
    ghl_opportunity_id: null,
    ghl_pipeline_id: null,
    ghl_stage_id: null,
    sync_status: 'never',
    last_synced_at: null,
    sync_error: null,
    source: 'tracker',
  },
  {
    id: 'mock-004',
    client_name: 'Miles Ahead Care',
    contact_name: 'Contact Name',
    email: 'contact4@example.com',
    phone: '07000 000003',
    service: 'Care Plan Website',
    stage: 'live',
    project_value: 600,
    monthly_value: 150,
    follow_up_date: '',
    expected_close_date: '',
    next_action: 'Care plan review',
    notes: '',
    status: 'active',
    archived: false,
    archived_at: '',
    won_date: '2025-02-15',
    lost_date: '',
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2025-02-15T10:00:00Z',
    sales_stage: 'Payment Received',
    delivery_status: 'On Care Plan',
    ghl_contact_id: null,
    ghl_opportunity_id: null,
    ghl_pipeline_id: null,
    ghl_stage_id: null,
    sync_status: 'never',
    last_synced_at: null,
    sync_error: null,
    source: 'tracker',
  },
  {
    id: 'mock-005',
    client_name: 'Demo Prospect Ltd',
    contact_name: 'Demo Contact',
    email: 'demo@example.com',
    phone: '07000 000004',
    service: 'AI Automation',
    stage: 'proposal',
    project_value: 2500,
    monthly_value: 200,
    follow_up_date: '2026-07-25',
    expected_close_date: '2026-08-01',
    next_action: 'Send revised proposal',
    notes: 'Interested in chatbot integration',
    status: 'active',
    archived: false,
    archived_at: '',
    won_date: '',
    lost_date: '',
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-15T10:00:00Z',
    sales_stage: 'Proposal Sent',
    delivery_status: 'Not Started',
    ghl_contact_id: null,
    ghl_opportunity_id: null,
    ghl_pipeline_id: null,
    ghl_stage_id: null,
    sync_status: 'never',
    last_synced_at: null,
    sync_error: null,
    source: 'tracker',
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-001',
    opportunity_id: 'mock-001',
    type: 'note',
    note: 'Initial discovery call completed.',
    created_at: '2024-06-01T11:00:00Z',
  },
  {
    id: 'act-002',
    opportunity_id: 'mock-005',
    type: 'proposal_sent',
    note: 'Proposal sent via email.',
    created_at: '2026-07-10T14:00:00Z',
  },
];

// ─── Guard: never enable in production ───────────────────────────────────────

export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true';
}

export function assertMockModeForWrites(): void {
  if (isMockMode()) {
    console.warn(
      '[MockDataService] Write operation intercepted in mock mode. No data was written.',
    );
    throw new Error(
      'Write operations are not permitted in mock-data mode (VITE_USE_MOCK_DATA=true). ' +
      'Disable mock mode before writing.',
    );
  }
}

// ─── Mock service ─────────────────────────────────────────────────────────────

export const MockDataService = {
  getOpportunities: (): Opportunity[] => [...MOCK_OPPORTUNITIES],
  getArchivedOpportunities: (): Opportunity[] => [],
  getActivities: (): Activity[] => [...MOCK_ACTIVITIES],

  // All write operations are intercepted
  writeOpportunity: (): never => {
    assertMockModeForWrites();
    // assertMockModeForWrites always throws — this is unreachable but satisfies TypeScript
    throw new Error('unreachable');
  },
};
