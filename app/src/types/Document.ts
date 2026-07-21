/**
 * Document — target schema A:AG (33 fields)
 *
 * This is a FUTURE TARGET SCHEMA only.
 * The live Documents worksheet does not exist in Batch 1A.
 * No Drive calls, no Sheets writes, no OAuth scope changes in Batch 1A.
 *
 * CRITICAL DISTINCTIONS (must never be conflated):
 * - DocumentStatus describes operational position (where the doc sits in workflow).
 * - LegalReviewStatus describes legal review position (completely separate).
 * - 'Final' status does NOT mean legally reviewed.
 * - 'Signed' status does NOT mean legally reviewed.
 *
 * All three template snapshot fields are stored as separate structured columns:
 *   AE  template_legal_review_status_at_generation
 *   AF  template_legal_reviewed_at_generation   ← ISO 8601 timestamp, NOT in notes
 *   AG  template_version_at_generation
 */

import type {
  DocumentStatus,
  LegalReviewStatus,
  LegalReviewerType,
  DocumentSource,
} from './enums';

import type {
  ClientId,
  GeneratedDocumentFileId,
  DriveFileId,
} from './branded';

// ─── Column header order A:AG ─────────────────────────────────────────────────
export const DOCUMENT_HEADERS = [
  'document_id',                                  // A
  'client_id',                                    // B — blocked until client entity resolved
  'opportunity_id',                               // C
  'template_id',                                  // D — null if not template-generated
  'drive_file_id',                                // E
  'drive_folder_id',                              // F
  'ghl_document_id',                              // G — null until Phase 3
  'ghl_media_id',                                 // H — null until Phase 3
  'name',                                         // I
  'document_type',                                // J
  'mime_type',                                    // K
  'status',                                       // L — DocumentStatus (operational only)
  'version_label',                                // M
  'drive_url',                                    // N
  'external_url',                                 // O
  'is_shared',                                    // P
  'shared_with',                                  // Q
  'created_at',                                   // R
  'updated_at',                                   // S
  'sent_at',                                      // T
  'viewed_at',                                    // U — confirmed external signal only
  'signed_at',                                    // V
  'superseded_by_document_id',                    // W
  'source',                                       // X
  'archived',                                     // Y
  'notes',                                        // Z
  'legal_review_status',                          // AA — separate from DocumentStatus
  'legal_reviewer_name',                          // AB
  'legal_reviewer_type',                          // AC
  'legal_review_notes',                           // AD
  'template_legal_review_status_at_generation',   // AE — snapshot, read-only after creation
  'template_legal_reviewed_at_generation',        // AF — ISO 8601, read-only after creation
  'template_version_at_generation',               // AG — read-only after creation
] as const;

export type DocumentHeader = (typeof DOCUMENT_HEADERS)[number];

// ─── Document interface ───────────────────────────────────────────────────────

export interface Document {
  document_id: string;
  client_id: ClientId;                            // B — requires stable client entity
  opportunity_id: string;
  template_id: string | null;
  drive_file_id: DriveFileId | GeneratedDocumentFileId | null;
  drive_folder_id: DriveFileId | null;
  ghl_document_id: string | null;
  ghl_media_id: string | null;
  name: string;
  document_type: string;
  mime_type: string;
  status: DocumentStatus;                         // Operational lifecycle only
  version_label: string;
  drive_url: string | null;
  external_url: string | null;
  is_shared: boolean;
  shared_with: string[];
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  viewed_at: string | null;                       // Confirmed external signal only
  signed_at: string | null;
  superseded_by_document_id: string | null;
  source: DocumentSource;
  archived: boolean;
  notes: string;

  // Legal review — entirely separate from DocumentStatus
  legal_review_status: LegalReviewStatus | null;
  legal_reviewer_name: string | null;
  legal_reviewer_type: LegalReviewerType | null;
  legal_review_notes: string | null;

  // Historical snapshot fields — read-only after document creation
  // A later template review must NOT change these on previously generated documents.
  template_legal_review_status_at_generation: LegalReviewStatus | null;
  template_legal_reviewed_at_generation: string | null;  // ISO 8601 — separate column AF
  template_version_at_generation: string | null;
}

/**
 * Type guard: ensures a file ID is for a generated document (not a template).
 * Template file IDs must never be passed to document-write methods.
 */
export function isGeneratedDocumentFileId(
  id: unknown,
): id is GeneratedDocumentFileId {
  // At runtime this is a string check — the brand is a compile-time construct.
  return typeof id === 'string' && id.length > 0;
}
