/**
 * Deeray Pipeline Tracker — Enums and Controlled Vocabularies
 * All values are defined here as single authoritative source of truth.
 */

// ─── Sales stage (GHL-aligned) ───────────────────────────────────────────────
export type SalesStage =
  | 'New Lead'
  | 'Discovery'
  | 'Proposal Sent'
  | 'Follow-up / Negotiation'
  | 'Contract Agreed'
  | 'Payment Received'
  | 'Lost';

export const SALES_STAGES: SalesStage[] = [
  'New Lead',
  'Discovery',
  'Proposal Sent',
  'Follow-up / Negotiation',
  'Contract Agreed',
  'Payment Received',
  'Lost',
];

// ─── Delivery status (tracker-owned) ─────────────────────────────────────────
export type DeliveryStatus =
  | 'Not Started'
  | 'Awaiting Content'
  | 'In Build'
  | 'Review & QA'
  | 'Live'
  | 'On Care Plan';

export const DELIVERY_STATUSES: DeliveryStatus[] = [
  'Not Started',
  'Awaiting Content',
  'In Build',
  'Review & QA',
  'Live',
  'On Care Plan',
];

// ─── GHL sync status ──────────────────────────────────────────────────────────
export type SyncStatus = 'never' | 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict';

export const SYNC_STATUSES: SyncStatus[] = [
  'never',
  'pending',
  'syncing',
  'synced',
  'failed',
  'conflict',
];

// ─── Document lifecycle status ────────────────────────────────────────────────
// NOTE: 'Final' does NOT mean legally reviewed.
// NOTE: 'Signed' does NOT mean legally reviewed.
// Legal review is tracked separately via LegalReviewStatus.
export type DocumentStatus =
  | 'Draft'
  | 'In Review'
  | 'Final'
  | 'Sent'
  | 'Viewed'
  | 'Signed'
  | 'Superseded'
  | 'Archived';

export const DOCUMENT_STATUSES: DocumentStatus[] = [
  'Draft',
  'In Review',
  'Final',
  'Sent',
  'Viewed',
  'Signed',
  'Superseded',
  'Archived',
];

// ─── Legal review status (separate from document lifecycle) ──────────────────
export type LegalReviewStatus =
  | 'not_applicable'
  | 'not_reviewed'
  | 'internal_review'
  | 'professional_review_pending'
  | 'professionally_reviewed'
  | 'review_expired'
  | 'superseded';

export const LEGAL_REVIEW_STATUSES: LegalReviewStatus[] = [
  'not_applicable',
  'not_reviewed',
  'internal_review',
  'professional_review_pending',
  'professionally_reviewed',
  'review_expired',
  'superseded',
];

// Allowed legal-review status transitions
export const LEGAL_REVIEW_TRANSITIONS: Readonly<Record<LegalReviewStatus, LegalReviewStatus[]>> = {
  not_applicable: [],
  not_reviewed: ['internal_review', 'professional_review_pending', 'professionally_reviewed'],
  internal_review: ['professional_review_pending', 'professionally_reviewed', 'not_reviewed'],
  professional_review_pending: ['professionally_reviewed', 'not_reviewed'],
  professionally_reviewed: ['review_expired', 'superseded'],
  review_expired: ['professional_review_pending', 'professionally_reviewed'],
  superseded: [],
};

// ─── Legal reviewer type ──────────────────────────────────────────────────────
export type LegalReviewerType =
  | 'internal'
  | 'external_solicitor'
  | 'client_legal_team'
  | 'other_professional';

export const LEGAL_REVIEWER_TYPES: LegalReviewerType[] = [
  'internal',
  'external_solicitor',
  'client_legal_team',
  'other_professional',
];

// ─── Document source ──────────────────────────────────────────────────────────
export type DocumentSource =
  | 'tracker_generated'   // Created by tracker from a template (copy + merge)
  | 'drive_linked'        // Existing Drive file selected via Picker
  | 'drive_uploaded'      // File uploaded directly through tracker upload UI
  | 'external_link'       // URL to a file outside Drive
  | 'ghl_document'        // Document pulled from GHL document API
  | 'ghl_media';          // Media asset from GHL media library

export const DOCUMENT_SOURCES: DocumentSource[] = [
  'tracker_generated',
  'drive_linked',
  'drive_uploaded',
  'external_link',
  'ghl_document',
  'ghl_media',
];

// ─── Template branding variant ────────────────────────────────────────────────
export type BrandingVariant = 'formal' | 'correspondence' | 'invoice' | 'internal';

export const BRANDING_VARIANTS: BrandingVariant[] = [
  'formal',
  'correspondence',
  'invoice',
  'internal',
];

// ─── OAuth authentication failure states ─────────────────────────────────────
export type AuthFailureState =
  | 'session_expired'
  | 'access_token_expired'
  | 'access_revoked'
  | 'sheets_permission_not_granted'
  | 'drive_permission_not_granted'
  | 'picker_unavailable'
  | 'reauthorisation_cancelled';

// ─── Legacy stage values (current Sheets column G) ───────────────────────────
// These remain in the live sheet during Batch 1A. Do not replace.
export type LegacyStage =
  | 'lead'
  | 'proposal'
  | 'approval'
  | 'build'
  | 'qa'
  | 'live';

// Migration mapping (for dry-run preview only — not applied in Batch 1A)
export const LEGACY_STAGE_TO_SALES: Record<LegacyStage, SalesStage> = {
  lead:     'New Lead',
  proposal: 'Proposal Sent',
  approval: 'Follow-up / Negotiation',
  build:    'Payment Received',
  qa:       'Payment Received',
  live:     'Payment Received',
};

export const LEGACY_STAGE_TO_DELIVERY: Record<LegacyStage, DeliveryStatus> = {
  lead:     'Not Started',
  proposal: 'Not Started',
  approval: 'Not Started',
  build:    'In Build',
  qa:       'Review & QA',
  live:     'Live',
};
