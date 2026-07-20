/**
 * DocumentTemplate — target schema A:Q (17 fields)
 *
 * FUTURE TARGET SCHEMA only. Document Templates worksheet does not exist in Batch 1A.
 * TypeScript registry is acceptable scaffolding here; it must transition to a live
 * Document Templates worksheet before the first working template release.
 *
 * Template editing workflow:
 *   1. User opens master in Google Docs ("Open in Google Docs" button)
 *   2. User edits merge-field placeholders ({{field_name}} syntax)
 *   3. User returns to tracker and selects "Register as new version"
 *   4. System prompts: does previous legal-review status still apply?
 *   5. Owner confirms or resets legal review status
 *
 * Template copy workflow (Picker → drive.file → copy):
 *   1. Picker selects master template file → grants per-file access via drive.file
 *   2. App calls POST /drive/v3/files/{templateId}/copy
 *   3. App writes merge fields into the copy (never into the master)
 */

import type { BrandingVariant, LegalReviewStatus, LegalReviewerType } from './enums';
import type { TemplateFileId } from './branded';

export const DOCUMENT_TEMPLATE_HEADERS = [
  'template_id',                    // A
  'name',                           // B
  'document_type',                  // C
  'branding_variant',               // D
  'drive_file_id',                  // E — master file in Drive (TemplateFileId)
  'version_label',                  // F
  'version_registered_at',          // G — when "Register as new version" was last triggered
  'active',                         // H
  'created_at',                     // I
  'updated_at',                     // J
  'legal_review_status',            // K
  'legal_reviewed_at',              // L — ISO 8601
  'legal_reviewer_name',            // M
  'legal_reviewer_type',            // N
  'legal_review_notes',             // O
  'previous_version_review_confirmed', // P — did owner confirm review carries forward?
  'notes',                          // Q
] as const;

export type DocumentTemplateHeader = (typeof DOCUMENT_TEMPLATE_HEADERS)[number];

export interface DocumentTemplate {
  template_id: string;
  name: string;
  document_type: string;
  branding_variant: BrandingVariant;
  drive_file_id: TemplateFileId;   // Master — never written to by document-generation code
  version_label: string;
  version_registered_at: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  legal_review_status: LegalReviewStatus;
  legal_reviewed_at: string | null;
  legal_reviewer_name: string | null;
  legal_reviewer_type: LegalReviewerType | null;
  legal_review_notes: string | null;
  previous_version_review_confirmed: boolean;
  notes: string;
}

/** Merge field placeholder format: {{field_name}} */
export interface MergeField {
  key: string;              // e.g. 'client_name', 'project_value'
  label: string;            // Human-readable label for the merge UI
  source: 'opportunity' | 'client' | 'company' | 'manual';
  required: boolean;
  defaultValue?: string;
}

/**
 * Document types considered to have potential legal significance.
 * When status is not_reviewed or internal_review, user must acknowledge before generation.
 */
export const LEGALLY_SIGNIFICANT_DOCUMENT_TYPES: readonly string[] = [
  'services_agreement',
  'care_plan_agreement',
  'confidentiality_agreement',
  'data_processing_schedule',
  'payment_terms',
  'contract_amendment',
  'liability_clause',
  'intellectual_property_provision',
  'termination_terms',
] as const;

/**
 * Messages to display before generating a legally significant document,
 * keyed by legal_review_status.
 */
export const LEGAL_REVIEW_GENERATION_MESSAGES: Partial<Record<LegalReviewStatus, string>> = {
  not_reviewed: 'Business template — professional legal review not confirmed.',
  internal_review: 'Internally reviewed only — professional legal review not confirmed.',
  professional_review_pending: 'Professional review commissioned but not yet complete.',
  review_expired: 'Previous professional review has expired or been marked outdated.',
};
