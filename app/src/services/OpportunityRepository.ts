/**
 * OpportunityRepository
 *
 * Header-based parser and serialiser for the Opportunities sheet.
 * Supports all three row widths:
 *   1. A:T legacy (20 columns)
 *   2. Partially extended (21–29 columns)
 *   3. Full A:AD (30 columns)
 *
 * No positional shifting. Header row is parsed first and used to map values.
 * Safe null defaults for all extension fields when absent.
 *
 * Schema detection and migration preview are non-destructive.
 * No live migration in Batch 1A.
 */

import type { Opportunity } from '../types/Opportunity';
import type { SalesStage, DeliveryStatus, SyncStatus } from '../types/enums';
import {
  OPPORTUNITY_HEADERS_V3,
  OPPORTUNITY_HEADERS_FULL,
  EXTENSION_FIELD_DEFAULTS,
} from '../types/Opportunity';
import type { GoogleSheetsService } from './GoogleSheetsService';
import { SHEET_NAMES } from '../constants/company';

const OPP_RANGE = `${SHEET_NAMES.opportunities}!A:AD`;
const OPP_HEADER_RANGE = `${SHEET_NAMES.opportunities}!A1:AD1`;

// ─── Schema detection ─────────────────────────────────────────────────────────

export type SchemaVersion = 'v3_legacy' | 'v3_partial' | 'v3_full';

export function detectSchemaVersion(headers: string[]): SchemaVersion {
  if (headers.length >= 30) return 'v3_full';
  if (headers.length > 20) return 'v3_partial';
  return 'v3_legacy';
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function parseBoolean(val: string | undefined): boolean {
  return val === 'true' || val === 'TRUE' || val === '1';
}

function parseNumber(val: string | undefined): number {
  if (!val || val.trim() === '') return 0;
  const n = Number(val.replace(/[£,\s]/g, ''));
  return isNaN(n) ? 0 : n;
}

function parseNullableString(val: string | undefined): string | null {
  if (!val || val.trim() === '') return null;
  return val.trim();
}

function parseSyncStatus(val: string | undefined): SyncStatus {
  const valid: SyncStatus[] = ['never', 'pending', 'syncing', 'synced', 'failed', 'conflict'];
  if (val && valid.includes(val as SyncStatus)) return val as SyncStatus;
  return 'never';
}

function parseSource(val: string | undefined): 'tracker' | 'ghl' {
  if (val === 'ghl') return 'ghl';
  return 'tracker';
}

function parseSalesStage(val: string | undefined): SalesStage | null {
  if (!val || val.trim() === '') return null;
  // Accept valid values; return null for unknown/empty
  const valid: SalesStage[] = [
    'New Lead', 'Discovery', 'Proposal Sent', 'Follow-up / Negotiation',
    'Contract Agreed', 'Payment Received', 'Lost',
  ];
  const trimmed = val.trim() as SalesStage;
  return valid.includes(trimmed) ? trimmed : null;
}

function parseDeliveryStatus(val: string | undefined): DeliveryStatus | null {
  if (!val || val.trim() === '') return null;
  const valid: DeliveryStatus[] = [
    'Not Started', 'Awaiting Content', 'In Build', 'Review & QA', 'Live', 'On Care Plan',
  ];
  const trimmed = val.trim() as DeliveryStatus;
  return valid.includes(trimmed) ? trimmed : null;
}

// ─── Row parser ───────────────────────────────────────────────────────────────

/**
 * Parse a single data row into an Opportunity, using the header map for field lookup.
 * Handles all three schema widths. Extra trailing columns are ignored.
 * @param headerMap   Map of column name → column index (built from header row)
 * @param row         Raw string values from the Sheets API
 */
export function parseOpportunityRow(
  headerMap: Map<string, number>,
  row: string[],
): Opportunity {
  const get = (field: string): string | undefined => {
    const idx = headerMap.get(field);
    return idx !== undefined ? row[idx] : undefined;
  };

  return {
    // A:T — existing schema
    id:                   get('id')                    ?? '',
    client_name:          get('client_name')            ?? '',
    contact_name:         get('contact_name')           ?? '',
    email:                get('email')                  ?? '',
    phone:                get('phone')                  ?? '',
    service:              get('service')                ?? '',
    stage:                get('stage')                  ?? '',
    project_value:        parseNumber(get('project_value')),
    monthly_value:        parseNumber(get('monthly_value')),
    follow_up_date:       get('follow_up_date')         ?? '',
    expected_close_date:  get('expected_close_date')    ?? '',
    next_action:          get('next_action')            ?? '',
    notes:                get('notes')                  ?? '',
    status:               get('status')                 ?? '',
    archived:             parseBoolean(get('archived')),
    archived_at:          get('archived_at')            ?? '',
    won_date:             get('won_date')               ?? '',
    lost_date:            get('lost_date')              ?? '',
    created_at:           get('created_at')             ?? '',
    updated_at:           get('updated_at')             ?? '',

    // U:AD — extension fields (null when absent)
    sales_stage:          parseSalesStage(get('sales_stage')),
    delivery_status:      parseDeliveryStatus(get('delivery_status')),
    ghl_contact_id:       parseNullableString(get('ghl_contact_id')),
    ghl_opportunity_id:   parseNullableString(get('ghl_opportunity_id')),
    ghl_pipeline_id:      parseNullableString(get('ghl_pipeline_id')),
    ghl_stage_id:         parseNullableString(get('ghl_stage_id')),
    sync_status:          parseSyncStatus(get('sync_status')),
    last_synced_at:       parseNullableString(get('last_synced_at')),
    sync_error:           parseNullableString(get('sync_error')),
    source:               parseSource(get('source')),
  };
}

// ─── Row serialiser ───────────────────────────────────────────────────────────

/**
 * Serialise an Opportunity to a full A:AD row (30 values).
 * Always produces values in canonical OPPORTUNITY_HEADERS_FULL order.
 */
export function serialiseOpportunityRow(opp: Opportunity): string[] {
  return [
    opp.id,
    opp.client_name,
    opp.contact_name,
    opp.email,
    opp.phone,
    opp.service,
    opp.stage,
    String(opp.project_value),
    String(opp.monthly_value),
    opp.follow_up_date,
    opp.expected_close_date,
    opp.next_action,
    opp.notes,
    opp.status,
    String(opp.archived),
    opp.archived_at,
    opp.won_date,
    opp.lost_date,
    opp.created_at,
    opp.updated_at,
    // Extension fields
    opp.sales_stage ?? '',
    opp.delivery_status ?? '',
    opp.ghl_contact_id ?? '',
    opp.ghl_opportunity_id ?? '',
    opp.ghl_pipeline_id ?? '',
    opp.ghl_stage_id ?? '',
    opp.sync_status,
    opp.last_synced_at ?? '',
    opp.sync_error ?? '',
    opp.source,
  ];
}

// ─── Migration preview (dry-run only — no live writes in Batch 1A) ───────────

export interface MigrationPreviewRow {
  id: string;
  client_name: string;
  current_stage: string;
  proposed_sales_stage: SalesStage | null;
  proposed_delivery_status: DeliveryStatus | null;
}

export function buildMigrationPreview(
  opportunities: Opportunity[],
  legacyToSales: Record<string, SalesStage>,
  legacyToDelivery: Record<string, DeliveryStatus>,
): MigrationPreviewRow[] {
  return opportunities.map((opp) => ({
    id: opp.id,
    client_name: opp.client_name,
    current_stage: opp.stage,
    proposed_sales_stage: legacyToSales[opp.stage] ?? null,
    proposed_delivery_status: legacyToDelivery[opp.stage] ?? null,
  }));
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class OpportunityRepository {
  constructor(private readonly sheets: GoogleSheetsService) {}

  /** Build a header→index map from the first row. */
  private buildHeaderMap(headerRow: string[]): Map<string, number> {
    const map = new Map<string, number>();
    headerRow.forEach((h, i) => {
      if (h) map.set(h.trim(), i);
    });
    return map;
  }

  /** Fetch all non-archived opportunities. */
  async getAll(): Promise<Opportunity[]> {
    const rows = await this.sheets.getRange(OPP_RANGE);
    if (rows.length < 2) return [];

    const headerRow = rows[0];
    if (!headerRow) return [];
    const dataRows = rows.slice(1);
    const headerMap = this.buildHeaderMap(headerRow);

    return dataRows
      .filter((row) => row.length > 0 && row[0]?.trim() !== '')
      .map((row) => parseOpportunityRow(headerMap, row))
      .filter((opp) => !opp.archived);
  }

  /** Fetch all archived opportunities. */
  async getArchived(): Promise<Opportunity[]> {
    const rows = await this.sheets.getRange(OPP_RANGE);
    if (rows.length < 2) return [];

    const headerRow = rows[0];
    if (!headerRow) return [];
    const dataRows = rows.slice(1);
    const headerMap = this.buildHeaderMap(headerRow);

    return dataRows
      .filter((row) => row.length > 0 && row[0]?.trim() !== '')
      .map((row) => parseOpportunityRow(headerMap, row))
      .filter((opp) => opp.archived);
  }

  /** Detect schema version from the live header row. */
  async detectSchema(): Promise<SchemaVersion> {
    const rows = await this.sheets.getRange(OPP_HEADER_RANGE);
    const headerRow = rows[0] ?? [];
    return detectSchemaVersion(headerRow);
  }

  /** Build a dry-run migration preview (no Sheets writes). */
  async getMigrationPreview(
    legacyToSales: Record<string, SalesStage>,
    legacyToDelivery: Record<string, DeliveryStatus>,
  ): Promise<MigrationPreviewRow[]> {
    const all = await this.getAll();
    return buildMigrationPreview(all, legacyToSales, legacyToDelivery);
  }
}

// ─── Header validation ────────────────────────────────────────────────────────

/** Check that a given header array matches the expected canonical order exactly. */
export function validateHeaderOrder(
  actual: string[],
  expected: readonly string[],
): { valid: boolean; mismatches: Array<{ index: number; expected: string; actual: string }> } {
  const mismatches: Array<{ index: number; expected: string; actual: string }> = [];

  for (let i = 0; i < expected.length; i++) {
    if (actual[i] !== expected[i]) {
      mismatches.push({ index: i, expected: expected[i] ?? '(missing)', actual: actual[i] ?? '(missing)' });
    }
  }

  return { valid: mismatches.length === 0, mismatches };
}

export { OPPORTUNITY_HEADERS_V3, OPPORTUNITY_HEADERS_FULL, EXTENSION_FIELD_DEFAULTS };
