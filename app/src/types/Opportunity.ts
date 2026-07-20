/**
 * Opportunity — full 30-field model (A:AD)
 *
 * Columns A:T — existing live schema (20 fields, never positionally shifted)
 * Columns U:AD — planned extension fields (10 fields, appended, not yet in live sheet)
 *
 * The parser must handle all three row widths:
 *   1. A:T legacy row (20 values)
 *   2. Partially extended row (21–29 values)
 *   3. Full A:AD row (30 values)
 *
 * All extension fields default to safe null/empty values when absent.
 */

import type { SalesStage, DeliveryStatus, SyncStatus, LegacyStage } from './enums';

// ─── Column header order ──────────────────────────────────────────────────────
// This is the canonical order. Parser and serialiser both use this list.
// Never use positional index; always use header-based mapping.

export const OPPORTUNITY_HEADERS_V3 = [
  // A:T — existing schema
  'id',
  'client_name',
  'contact_name',
  'email',
  'phone',
  'service',
  'stage',
  'project_value',
  'monthly_value',
  'follow_up_date',
  'expected_close_date',
  'next_action',
  'notes',
  'status',
  'archived',
  'archived_at',
  'won_date',
  'lost_date',
  'created_at',
  'updated_at',
] as const;

export const OPPORTUNITY_EXTENSION_HEADERS = [
  // U:AD — planned extension (not yet in live sheet)
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
] as const;

export const OPPORTUNITY_HEADERS_FULL = [
  ...OPPORTUNITY_HEADERS_V3,
  ...OPPORTUNITY_EXTENSION_HEADERS,
] as const;

export type OpportunityHeaderV3 = (typeof OPPORTUNITY_HEADERS_V3)[number];
export type OpportunityHeaderFull = (typeof OPPORTUNITY_HEADERS_FULL)[number];

// ─── Opportunity interface ────────────────────────────────────────────────────

export interface Opportunity {
  // A — id
  id: string;
  // B — client_name
  client_name: string;
  // C — contact_name
  contact_name: string;
  // D — email
  email: string;
  // E — phone
  phone: string;
  // F — service
  service: string;
  // G — stage (legacy value — preserved in live sheet, not replaced in Batch 1A)
  stage: LegacyStage | string;
  // H — project_value (serialised as string in Sheets; parsed to number)
  project_value: number;
  // I — monthly_value
  monthly_value: number;
  // J — follow_up_date (ISO 8601 date or empty string)
  follow_up_date: string;
  // K — expected_close_date
  expected_close_date: string;
  // L — next_action
  next_action: string;
  // M — notes
  notes: string;
  // N — status ('active' | 'won' | 'lost' | empty)
  status: string;
  // O — archived ('true' | 'false' | '' — serialised as string in Sheets)
  archived: boolean;
  // P — archived_at (ISO 8601 or empty)
  archived_at: string;
  // Q — won_date
  won_date: string;
  // R — lost_date
  lost_date: string;
  // S — created_at
  created_at: string;
  // T — updated_at
  updated_at: string;

  // ── Extension fields (U:AD) — null when row is A:T width only ───────────────

  // U — sales_stage
  sales_stage: SalesStage | null;
  // V — delivery_status
  delivery_status: DeliveryStatus | null;
  // W — ghl_contact_id
  ghl_contact_id: string | null;
  // X — ghl_opportunity_id
  ghl_opportunity_id: string | null;
  // Y — ghl_pipeline_id
  ghl_pipeline_id: string | null;
  // Z — ghl_stage_id
  ghl_stage_id: string | null;
  // AA — sync_status
  sync_status: SyncStatus;
  // AB — last_synced_at
  last_synced_at: string | null;
  // AC — sync_error
  sync_error: string | null;
  // AD — source ('tracker' | 'ghl')
  source: 'tracker' | 'ghl';
}

/** Default values for extension fields when a row is A:T width (legacy). */
export const EXTENSION_FIELD_DEFAULTS: Pick<
  Opportunity,
  | 'sales_stage'
  | 'delivery_status'
  | 'ghl_contact_id'
  | 'ghl_opportunity_id'
  | 'ghl_pipeline_id'
  | 'ghl_stage_id'
  | 'sync_status'
  | 'last_synced_at'
  | 'sync_error'
  | 'source'
> = {
  sales_stage: null,
  delivery_status: null,
  ghl_contact_id: null,
  ghl_opportunity_id: null,
  ghl_pipeline_id: null,
  ghl_stage_id: null,
  sync_status: 'never',
  last_synced_at: null,
  sync_error: null,
  source: 'tracker',
};

/** Minimum fields required to create a new Opportunity. */
export type NewOpportunity = Pick<
  Opportunity,
  'client_name' | 'contact_name' | 'email' | 'phone' | 'service' | 'stage' | 'project_value' | 'monthly_value'
> & Partial<Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>>;
