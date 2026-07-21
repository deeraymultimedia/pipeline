/**
 * Opportunity schema tests
 *
 * Covers:
 *   - A:T legacy row (20 columns)
 *   - Partially extended row (21–29 columns)
 *   - Full A:AD row (30 columns)
 *   - Exact header order
 *   - Defaults for all ten extension fields
 *   - Parser
 *   - Serialiser
 *   - Round-trip
 *   - Unknown / invalid values
 *   - Malformed timestamps
 *   - Additional trailing columns (ignored)
 *   - Schema version detection
 *   - Header order validation
 *   - Migration preview (dry-run only)
 */

import { describe, it, expect } from 'vitest';
import {
  parseOpportunityRow,
  serialiseOpportunityRow,
  detectSchemaVersion,
  validateHeaderOrder,
  buildMigrationPreview,
  OPPORTUNITY_HEADERS_V3,
  OPPORTUNITY_HEADERS_FULL,
  EXTENSION_FIELD_DEFAULTS,
} from '../services/OpportunityRepository';
import type { Opportunity } from '../types/Opportunity';
import {
  LEGACY_STAGE_TO_SALES,
  LEGACY_STAGE_TO_DELIVERY,
} from '../types/enums';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildHeaderMap(headers: readonly string[]): Map<string, number> {
  const map = new Map<string, number>();
  headers.forEach((h, i) => map.set(h, i));
  return map;
}

/** Build a full A:AD row as a string array. */
function buildFullRow(overrides: Partial<Record<string, string>> = {}): string[] {
  const defaults: Record<string, string> = {
    id: 'test-001',
    client_name: 'Test Client',
    contact_name: 'Test Contact',
    email: 'test@example.com',
    phone: '07000000000',
    service: 'Website',
    stage: 'proposal',
    project_value: '1500',
    monthly_value: '100',
    follow_up_date: '2026-08-01',
    expected_close_date: '2026-09-01',
    next_action: 'Send proposal',
    notes: 'Test notes',
    status: 'active',
    archived: 'false',
    archived_at: '',
    won_date: '',
    lost_date: '',
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-15T10:00:00Z',
    // Extension fields
    sales_stage: 'Proposal Sent',
    delivery_status: 'Not Started',
    ghl_contact_id: 'ghl-c-001',
    ghl_opportunity_id: 'ghl-o-001',
    ghl_pipeline_id: 'ghl-p-001',
    ghl_stage_id: 'ghl-s-001',
    sync_status: 'synced',
    last_synced_at: '2026-07-15T10:00:00Z',
    sync_error: '',
    source: 'tracker',
  };

  const merged = { ...defaults, ...overrides };
  return OPPORTUNITY_HEADERS_FULL.map((h) => merged[h] ?? '');
}

// ─── Schema version detection ─────────────────────────────────────────────────

describe('detectSchemaVersion', () => {
  it('detects v3_legacy for exactly 20 columns', () => {
    expect(detectSchemaVersion(new Array(20).fill('x'))).toBe('v3_legacy');
  });

  it('detects v3_partial for 21–29 columns', () => {
    expect(detectSchemaVersion(new Array(21).fill('x'))).toBe('v3_partial');
    expect(detectSchemaVersion(new Array(29).fill('x'))).toBe('v3_partial');
  });

  it('detects v3_full for 30 columns', () => {
    expect(detectSchemaVersion(new Array(30).fill('x'))).toBe('v3_full');
  });

  it('detects v3_full for more than 30 columns', () => {
    expect(detectSchemaVersion(new Array(35).fill('x'))).toBe('v3_full');
  });
});

// ─── Header order ─────────────────────────────────────────────────────────────

describe('OPPORTUNITY_HEADERS_V3', () => {
  it('has exactly 20 headers', () => {
    expect(OPPORTUNITY_HEADERS_V3.length).toBe(20);
  });

  it('starts with id and ends with updated_at', () => {
    expect(OPPORTUNITY_HEADERS_V3[0]).toBe('id');
    expect(OPPORTUNITY_HEADERS_V3[19]).toBe('updated_at');
  });
});

describe('OPPORTUNITY_HEADERS_FULL', () => {
  it('has exactly 30 headers (A:AD)', () => {
    expect(OPPORTUNITY_HEADERS_FULL.length).toBe(30);
  });

  it('extension fields start at index 20 (column U)', () => {
    expect(OPPORTUNITY_HEADERS_FULL[20]).toBe('sales_stage');
  });

  it('last extension field is source at index 29 (column AD)', () => {
    expect(OPPORTUNITY_HEADERS_FULL[29]).toBe('source');
  });

  it('contains all ten extension field names in correct order', () => {
    const ext = OPPORTUNITY_HEADERS_FULL.slice(20);
    expect(ext).toEqual([
      'sales_stage',
      'delivery_status',
      'ghl_contact_id',
      'ghl_opportunity_id',
      'ghl_pipeline_id',
      'ghl_stage_id',
      'sync_status',
      'last_synced_at',
      'sync_error',
      'source',
    ]);
  });
});

describe('validateHeaderOrder', () => {
  it('passes for exact match', () => {
    const result = validateHeaderOrder(
      [...OPPORTUNITY_HEADERS_FULL],
      OPPORTUNITY_HEADERS_FULL,
    );
    expect(result.valid).toBe(true);
    expect(result.mismatches).toHaveLength(0);
  });

  it('reports mismatches for wrong header', () => {
    const actual = [...OPPORTUNITY_HEADERS_FULL] as string[];
    actual[0] = 'ID'; // wrong case
    const result = validateHeaderOrder(actual, OPPORTUNITY_HEADERS_FULL);
    expect(result.valid).toBe(false);
    expect(result.mismatches[0]).toMatchObject({ index: 0, expected: 'id', actual: 'ID' });
  });

  it('reports missing headers', () => {
    const actual = [...OPPORTUNITY_HEADERS_FULL].slice(0, 18);
    const result = validateHeaderOrder(actual, OPPORTUNITY_HEADERS_FULL);
    expect(result.valid).toBe(false);
    expect(result.mismatches.length).toBeGreaterThan(0);
  });
});

// ─── Extension field defaults ─────────────────────────────────────────────────

describe('EXTENSION_FIELD_DEFAULTS', () => {
  it('has null for all four GHL identifier fields', () => {
    expect(EXTENSION_FIELD_DEFAULTS.ghl_contact_id).toBeNull();
    expect(EXTENSION_FIELD_DEFAULTS.ghl_opportunity_id).toBeNull();
    expect(EXTENSION_FIELD_DEFAULTS.ghl_pipeline_id).toBeNull();
    expect(EXTENSION_FIELD_DEFAULTS.ghl_stage_id).toBeNull();
  });

  it('has null for sales_stage and delivery_status', () => {
    expect(EXTENSION_FIELD_DEFAULTS.sales_stage).toBeNull();
    expect(EXTENSION_FIELD_DEFAULTS.delivery_status).toBeNull();
  });

  it('has sync_status default of never', () => {
    expect(EXTENSION_FIELD_DEFAULTS.sync_status).toBe('never');
  });

  it('has null for last_synced_at and sync_error', () => {
    expect(EXTENSION_FIELD_DEFAULTS.last_synced_at).toBeNull();
    expect(EXTENSION_FIELD_DEFAULTS.sync_error).toBeNull();
  });

  it('has source default of tracker', () => {
    expect(EXTENSION_FIELD_DEFAULTS.source).toBe('tracker');
  });
});

// ─── Parser: A:T legacy row ───────────────────────────────────────────────────

describe('parseOpportunityRow — A:T legacy row', () => {
  const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_V3);
  const row = buildFullRow().slice(0, 20);

  it('parses id correctly', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.id).toBe('test-001');
  });

  it('parses project_value as a number', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.project_value).toBe(1500);
  });

  it('parses archived false correctly', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.archived).toBe(false);
  });

  it('applies extension defaults for all ten extension fields', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.sales_stage).toBeNull();
    expect(opp.delivery_status).toBeNull();
    expect(opp.ghl_contact_id).toBeNull();
    expect(opp.ghl_opportunity_id).toBeNull();
    expect(opp.ghl_pipeline_id).toBeNull();
    expect(opp.ghl_stage_id).toBeNull();
    expect(opp.sync_status).toBe('never');
    expect(opp.last_synced_at).toBeNull();
    expect(opp.sync_error).toBeNull();
    expect(opp.source).toBe('tracker');
  });
});

// ─── Parser: partially extended row ──────────────────────────────────────────

describe('parseOpportunityRow — partial row (22 columns)', () => {
  const headers = [...OPPORTUNITY_HEADERS_FULL].slice(0, 22) as string[];
  const headerMap = buildHeaderMap(headers);
  const row = buildFullRow().slice(0, 22);

  it('parses sales_stage from column U', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.sales_stage).toBe('Proposal Sent');
  });

  it('parses delivery_status from column V', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.delivery_status).toBe('Not Started');
  });

  it('defaults remaining extension fields to null/never/tracker', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.ghl_contact_id).toBeNull();
    expect(opp.sync_status).toBe('never');
    expect(opp.source).toBe('tracker');
  });
});

// ─── Parser: full A:AD row ────────────────────────────────────────────────────

describe('parseOpportunityRow — full A:AD row', () => {
  const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_FULL);
  const row = buildFullRow();

  it('parses all base fields', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.id).toBe('test-001');
    expect(opp.client_name).toBe('Test Client');
    expect(opp.stage).toBe('proposal');
  });

  it('parses all ten extension fields', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.sales_stage).toBe('Proposal Sent');
    expect(opp.delivery_status).toBe('Not Started');
    expect(opp.ghl_contact_id).toBe('ghl-c-001');
    expect(opp.ghl_opportunity_id).toBe('ghl-o-001');
    expect(opp.ghl_pipeline_id).toBe('ghl-p-001');
    expect(opp.ghl_stage_id).toBe('ghl-s-001');
    expect(opp.sync_status).toBe('synced');
    expect(opp.last_synced_at).toBe('2026-07-15T10:00:00Z');
    expect(opp.sync_error).toBeNull(); // empty string → null
    expect(opp.source).toBe('tracker');
  });

  it('parses numeric values', () => {
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.project_value).toBe(1500);
    expect(opp.monthly_value).toBe(100);
  });

  it('handles £ prefix in numeric values', () => {
    const modRow = buildFullRow({ project_value: '£2,500.00' });
    const opp = parseOpportunityRow(headerMap, modRow);
    expect(opp.project_value).toBe(2500);
  });
});

// ─── Parser: unknown and malformed values ─────────────────────────────────────

describe('parseOpportunityRow — unknown/malformed values', () => {
  const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_FULL);

  it('defaults unknown sync_status to never', () => {
    const row = buildFullRow({ sync_status: 'UNKNOWN_STATUS' });
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.sync_status).toBe('never');
  });

  it('defaults unknown source to tracker', () => {
    const row = buildFullRow({ source: 'unknown_source' });
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.source).toBe('tracker');
  });

  it('returns null for unknown sales_stage', () => {
    const row = buildFullRow({ sales_stage: 'Not A Real Stage' });
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.sales_stage).toBeNull();
  });

  it('returns null for unknown delivery_status', () => {
    const row = buildFullRow({ delivery_status: 'Not A Real Status' });
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.delivery_status).toBeNull();
  });

  it('returns 0 for malformed numeric values', () => {
    const row = buildFullRow({ project_value: 'not-a-number' });
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.project_value).toBe(0);
  });

  it('parses archived=TRUE (uppercase)', () => {
    const row = buildFullRow({ archived: 'TRUE' });
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.archived).toBe(true);
  });
});

// ─── Parser: additional trailing columns ─────────────────────────────────────

describe('parseOpportunityRow — extra trailing columns', () => {
  it('ignores extra columns beyond A:AD', () => {
    const headers = [...OPPORTUNITY_HEADERS_FULL, 'extra_col_1', 'extra_col_2'];
    const headerMap = buildHeaderMap(headers);
    const row = [...buildFullRow(), 'extra1', 'extra2'];
    const opp = parseOpportunityRow(headerMap, row);
    expect(opp.id).toBe('test-001');
    // No error thrown; extra columns silently ignored
  });
});

// ─── Serialiser ───────────────────────────────────────────────────────────────

describe('serialiseOpportunityRow', () => {
  it('produces exactly 30 values', () => {
    const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_FULL);
    const row = buildFullRow();
    const opp = parseOpportunityRow(headerMap, row);
    const serialised = serialiseOpportunityRow(opp);
    expect(serialised.length).toBe(30);
  });

  it('serialises null extension fields as empty strings', () => {
    const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_V3);
    const row = buildFullRow().slice(0, 20);
    const opp = parseOpportunityRow(headerMap, row);
    const serialised = serialiseOpportunityRow(opp);
    expect(serialised[20]).toBe(''); // sales_stage
    expect(serialised[26]).toBe('never'); // sync_status
    expect(serialised[29]).toBe('tracker'); // source
  });

  it('serialises project_value as a string', () => {
    const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_FULL);
    const row = buildFullRow();
    const opp = parseOpportunityRow(headerMap, row);
    const serialised = serialiseOpportunityRow(opp);
    expect(typeof serialised[7]).toBe('string');
    expect(serialised[7]).toBe('1500');
  });
});

// ─── Round-trip ───────────────────────────────────────────────────────────────

describe('round-trip: parse → serialise → parse', () => {
  it('is lossless for a full A:AD row', () => {
    const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_FULL);
    const row = buildFullRow();

    const opp1 = parseOpportunityRow(headerMap, row);
    const serialised = serialiseOpportunityRow(opp1);
    const opp2 = parseOpportunityRow(headerMap, serialised);

    expect(opp2.id).toBe(opp1.id);
    expect(opp2.client_name).toBe(opp1.client_name);
    expect(opp2.project_value).toBe(opp1.project_value);
    expect(opp2.sales_stage).toBe(opp1.sales_stage);
    expect(opp2.delivery_status).toBe(opp1.delivery_status);
    expect(opp2.ghl_contact_id).toBe(opp1.ghl_contact_id);
    expect(opp2.ghl_opportunity_id).toBe(opp1.ghl_opportunity_id);
    expect(opp2.ghl_pipeline_id).toBe(opp1.ghl_pipeline_id);
    expect(opp2.ghl_stage_id).toBe(opp1.ghl_stage_id);
    expect(opp2.sync_status).toBe(opp1.sync_status);
    expect(opp2.last_synced_at).toBe(opp1.last_synced_at);
    expect(opp2.sync_error).toBe(opp1.sync_error);
    expect(opp2.source).toBe(opp1.source);
    expect(opp2.archived).toBe(opp1.archived);
  });

  it('preserves confirmed real data values through round-trip', () => {
    const headerMap = buildHeaderMap(OPPORTUNITY_HEADERS_FULL);
    // Senig Consulting: £1,500 project, £100/mo
    const row = buildFullRow({
      client_name: 'Senig Consulting',
      project_value: '1500',
      monthly_value: '100',
    });

    const opp = parseOpportunityRow(headerMap, row);
    const serialised = serialiseOpportunityRow(opp);
    const opp2 = parseOpportunityRow(headerMap, serialised);

    expect(opp2.client_name).toBe('Senig Consulting');
    expect(opp2.project_value).toBe(1500);
    expect(opp2.monthly_value).toBe(100);
  });
});

// ─── Migration preview (dry-run only) ────────────────────────────────────────

describe('buildMigrationPreview', () => {
  const mockOpportunities: Opportunity[] = [
    {
      ...({} as Opportunity),
      id: 'mock-001',
      client_name: 'Senig Consulting',
      stage: 'live',
      sales_stage: null,
      delivery_status: null,
      archived: false,
      project_value: 1500,
      monthly_value: 100,
      sync_status: 'never',
      source: 'tracker',
      ghl_contact_id: null,
      ghl_opportunity_id: null,
      ghl_pipeline_id: null,
      ghl_stage_id: null,
      last_synced_at: null,
      sync_error: null,
      contact_name: '',
      email: '',
      phone: '',
      service: '',
      follow_up_date: '',
      expected_close_date: '',
      next_action: '',
      notes: '',
      status: 'active',
      archived_at: '',
      won_date: '',
      lost_date: '',
      created_at: '',
      updated_at: '',
    },
  ];

  it('maps live stage to Payment Received / Live', () => {
    const preview = buildMigrationPreview(
      mockOpportunities,
      LEGACY_STAGE_TO_SALES,
      LEGACY_STAGE_TO_DELIVERY,
    );

    expect(preview[0]?.proposed_sales_stage).toBe('Payment Received');
    expect(preview[0]?.proposed_delivery_status).toBe('Live');
  });

  it('preserves client name and id', () => {
    const preview = buildMigrationPreview(
      mockOpportunities,
      LEGACY_STAGE_TO_SALES,
      LEGACY_STAGE_TO_DELIVERY,
    );

    expect(preview[0]?.client_name).toBe('Senig Consulting');
    expect(preview[0]?.id).toBe('mock-001');
  });

  it('handles all six legacy stages', () => {
    const stages = ['lead', 'proposal', 'approval', 'build', 'qa', 'live'] as const;
    const opps = stages.map((stage, i) => ({
      ...mockOpportunities[0]!,
      id: `mock-${i}`,
      client_name: `Client ${i}`,
      stage,
    }));

    const preview = buildMigrationPreview(
      opps,
      LEGACY_STAGE_TO_SALES,
      LEGACY_STAGE_TO_DELIVERY,
    );

    expect(preview).toHaveLength(6);
    expect(preview[0]?.proposed_sales_stage).toBe('New Lead');
    expect(preview[1]?.proposed_sales_stage).toBe('Proposal Sent');
    expect(preview[2]?.proposed_sales_stage).toBe('Follow-up / Negotiation');
    expect(preview[3]?.proposed_sales_stage).toBe('Payment Received');
    expect(preview[4]?.proposed_sales_stage).toBe('Payment Received');
    expect(preview[5]?.proposed_sales_stage).toBe('Payment Received');
  });
});
