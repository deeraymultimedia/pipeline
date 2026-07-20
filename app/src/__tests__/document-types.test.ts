/**
 * Document types and schema tests
 *
 * Covers:
 *   - Correct enums (DocumentStatus, LegalReviewStatus, DocumentSource)
 *   - 33-field A:AG target schema
 *   - Three structured generation snapshot fields (separate columns)
 *   - Source validation
 *   - Lifecycle separate from legal review
 *   - Template file IDs cannot be used where generated-document IDs are expected (type-level)
 *   - No live Drive API call (all tests are pure type/unit tests)
 *   - Legal review transitions
 */

import { describe, it, expect } from 'vitest';
import {
  DOCUMENT_STATUSES,
  LEGAL_REVIEW_STATUSES,
  LEGAL_REVIEW_TRANSITIONS,
  DOCUMENT_SOURCES,
  LEGAL_REVIEWER_TYPES,
  BRANDING_VARIANTS,
  SYNC_STATUSES,
} from '../types/enums';
import { DOCUMENT_HEADERS } from '../types/Document';
import { DOCUMENT_TEMPLATE_HEADERS, LEGALLY_SIGNIFICANT_DOCUMENT_TYPES } from '../types/DocumentTemplate';
import { isGeneratedDocumentFileId } from '../types/Document';

// ─── Document lifecycle status ────────────────────────────────────────────────

describe('DocumentStatus enum', () => {
  it('contains exactly 8 lifecycle statuses', () => {
    expect(DOCUMENT_STATUSES.length).toBe(8);
  });

  it('includes all required statuses', () => {
    expect(DOCUMENT_STATUSES).toContain('Draft');
    expect(DOCUMENT_STATUSES).toContain('In Review');
    expect(DOCUMENT_STATUSES).toContain('Final');
    expect(DOCUMENT_STATUSES).toContain('Sent');
    expect(DOCUMENT_STATUSES).toContain('Viewed');
    expect(DOCUMENT_STATUSES).toContain('Signed');
    expect(DOCUMENT_STATUSES).toContain('Superseded');
    expect(DOCUMENT_STATUSES).toContain('Archived');
  });

  /**
   * CRITICAL: Final does NOT mean legally reviewed.
   * CRITICAL: Signed does NOT mean legally reviewed.
   * These are confirmed in the architecture and must be tested.
   */
  it('confirms Final is an operational status only (not a legal-review indicator)', () => {
    // Final is present in DocumentStatus — that is correct
    expect(DOCUMENT_STATUSES).toContain('Final');
    // Final must NOT appear in LegalReviewStatus — confirmed separate
    expect(LEGAL_REVIEW_STATUSES).not.toContain('Final');
  });

  it('confirms Signed is an operational status only (not a legal-review indicator)', () => {
    expect(DOCUMENT_STATUSES).toContain('Signed');
    expect(LEGAL_REVIEW_STATUSES).not.toContain('Signed');
  });
});

// ─── Legal review status ──────────────────────────────────────────────────────

describe('LegalReviewStatus enum', () => {
  it('contains exactly 7 values', () => {
    expect(LEGAL_REVIEW_STATUSES.length).toBe(7);
  });

  it('includes all required statuses', () => {
    expect(LEGAL_REVIEW_STATUSES).toContain('not_applicable');
    expect(LEGAL_REVIEW_STATUSES).toContain('not_reviewed');
    expect(LEGAL_REVIEW_STATUSES).toContain('internal_review');
    expect(LEGAL_REVIEW_STATUSES).toContain('professional_review_pending');
    expect(LEGAL_REVIEW_STATUSES).toContain('professionally_reviewed');
    expect(LEGAL_REVIEW_STATUSES).toContain('review_expired');
    expect(LEGAL_REVIEW_STATUSES).toContain('superseded');
  });

  it('does not share any values with DocumentStatus', () => {
    const docSet = new Set(DOCUMENT_STATUSES);
    const legalSet = new Set(LEGAL_REVIEW_STATUSES);
    const intersection = [...docSet].filter((s) => legalSet.has(s as never));
    expect(intersection).toHaveLength(0);
  });
});

describe('LEGAL_REVIEW_TRANSITIONS', () => {
  it('not_applicable has no allowed transitions', () => {
    expect(LEGAL_REVIEW_TRANSITIONS.not_applicable).toHaveLength(0);
  });

  it('superseded has no allowed transitions (terminal)', () => {
    expect(LEGAL_REVIEW_TRANSITIONS.superseded).toHaveLength(0);
  });

  it('professionally_reviewed can transition to review_expired or superseded', () => {
    expect(LEGAL_REVIEW_TRANSITIONS.professionally_reviewed).toContain('review_expired');
    expect(LEGAL_REVIEW_TRANSITIONS.professionally_reviewed).toContain('superseded');
  });

  it('not_reviewed can transition to three states', () => {
    expect(LEGAL_REVIEW_TRANSITIONS.not_reviewed).toContain('internal_review');
    expect(LEGAL_REVIEW_TRANSITIONS.not_reviewed).toContain('professional_review_pending');
    expect(LEGAL_REVIEW_TRANSITIONS.not_reviewed).toContain('professionally_reviewed');
  });

  it('covers all LegalReviewStatus values as keys', () => {
    LEGAL_REVIEW_STATUSES.forEach((status) => {
      expect(LEGAL_REVIEW_TRANSITIONS).toHaveProperty(status);
    });
  });
});

// ─── Document source ──────────────────────────────────────────────────────────

describe('DocumentSource enum', () => {
  it('contains exactly 6 values', () => {
    expect(DOCUMENT_SOURCES.length).toBe(6);
  });

  it('includes all required sources', () => {
    expect(DOCUMENT_SOURCES).toContain('tracker_generated');
    expect(DOCUMENT_SOURCES).toContain('drive_linked');
    expect(DOCUMENT_SOURCES).toContain('drive_uploaded');
    expect(DOCUMENT_SOURCES).toContain('external_link');
    expect(DOCUMENT_SOURCES).toContain('ghl_document');
    expect(DOCUMENT_SOURCES).toContain('ghl_media');
  });

  it('does not contain the deprecated manual_link value', () => {
    expect(DOCUMENT_SOURCES).not.toContain('manual_link');
  });
});

// ─── Legal reviewer type ──────────────────────────────────────────────────────

describe('LegalReviewerType enum', () => {
  it('contains exactly 4 controlled values', () => {
    expect(LEGAL_REVIEWER_TYPES.length).toBe(4);
  });

  it('does not contain free-text reviewer_label', () => {
    // reviewer_label was the deprecated approach; only controlled types are valid
    expect(LEGAL_REVIEWER_TYPES).not.toContain('reviewer_label');
  });
});

// ─── Documents worksheet schema A:AG ─────────────────────────────────────────

describe('DOCUMENT_HEADERS (A:AG target schema)', () => {
  it('has exactly 33 fields', () => {
    expect(DOCUMENT_HEADERS.length).toBe(33);
  });

  it('starts with document_id at position 0 (column A)', () => {
    expect(DOCUMENT_HEADERS[0]).toBe('document_id');
  });

  it('has legal_review_status at position 26 (column AA)', () => {
    expect(DOCUMENT_HEADERS[26]).toBe('legal_review_status');
  });

  it('has legal_reviewer_name at position 27 (column AB)', () => {
    expect(DOCUMENT_HEADERS[27]).toBe('legal_reviewer_name');
  });

  it('has legal_reviewer_type at position 28 (column AC)', () => {
    expect(DOCUMENT_HEADERS[28]).toBe('legal_reviewer_type');
  });

  it('has legal_review_notes at position 29 (column AD)', () => {
    expect(DOCUMENT_HEADERS[29]).toBe('legal_review_notes');
  });

  /**
   * Critical: All three template snapshot fields must be separate structured columns.
   * template_legal_reviewed_at_generation must NOT be inside notes.
   */
  it('has template_legal_review_status_at_generation at position 30 (column AE)', () => {
    expect(DOCUMENT_HEADERS[30]).toBe('template_legal_review_status_at_generation');
  });

  it('has template_legal_reviewed_at_generation at position 31 (column AF)', () => {
    expect(DOCUMENT_HEADERS[31]).toBe('template_legal_reviewed_at_generation');
  });

  it('has template_version_at_generation at position 32 (column AG)', () => {
    expect(DOCUMENT_HEADERS[32]).toBe('template_version_at_generation');
  });

  it('three snapshot fields are distinct columns (not embedded in notes)', () => {
    const notesIndex = DOCUMENT_HEADERS.indexOf('notes');
    const snapshotFields = [
      'template_legal_review_status_at_generation',
      'template_legal_reviewed_at_generation',
      'template_version_at_generation',
    ];
    snapshotFields.forEach((field) => {
      const idx = DOCUMENT_HEADERS.indexOf(field as never);
      expect(idx).toBeGreaterThan(notesIndex);
      expect(idx).not.toBe(notesIndex); // Each is its own column
    });
  });

  it('source field is at position 23 (column X)', () => {
    expect(DOCUMENT_HEADERS[23]).toBe('source');
  });

  it('viewed_at is at position 20 (column U)', () => {
    expect(DOCUMENT_HEADERS[20]).toBe('viewed_at');
  });

  it('contains client_id at position 1 (column B)', () => {
    expect(DOCUMENT_HEADERS[1]).toBe('client_id');
  });
});

// ─── Document Template schema A:Q ────────────────────────────────────────────

describe('DOCUMENT_TEMPLATE_HEADERS (A:Q target schema)', () => {
  it('has exactly 17 fields', () => {
    expect(DOCUMENT_TEMPLATE_HEADERS.length).toBe(17);
  });

  it('has legal_review_status at position 10 (column K)', () => {
    expect(DOCUMENT_TEMPLATE_HEADERS[10]).toBe('legal_review_status');
  });

  it('has legal_reviewed_at at position 11 (column L)', () => {
    expect(DOCUMENT_TEMPLATE_HEADERS[11]).toBe('legal_reviewed_at');
  });

  it('has previous_version_review_confirmed at position 15 (column P)', () => {
    expect(DOCUMENT_TEMPLATE_HEADERS[15]).toBe('previous_version_review_confirmed');
  });
});

// ─── Branding variants ────────────────────────────────────────────────────────

describe('BrandingVariant enum', () => {
  it('has exactly 4 variants', () => {
    expect(BRANDING_VARIANTS.length).toBe(4);
  });

  it('includes formal, correspondence, invoice, internal', () => {
    expect(BRANDING_VARIANTS).toContain('formal');
    expect(BRANDING_VARIANTS).toContain('correspondence');
    expect(BRANDING_VARIANTS).toContain('invoice');
    expect(BRANDING_VARIANTS).toContain('internal');
  });
});

// ─── Legally significant document types ──────────────────────────────────────

describe('LEGALLY_SIGNIFICANT_DOCUMENT_TYPES', () => {
  it('includes services_agreement', () => {
    expect(LEGALLY_SIGNIFICANT_DOCUMENT_TYPES).toContain('services_agreement');
  });

  it('includes care_plan_agreement', () => {
    expect(LEGALLY_SIGNIFICANT_DOCUMENT_TYPES).toContain('care_plan_agreement');
  });

  it('includes confidentiality_agreement', () => {
    expect(LEGALLY_SIGNIFICANT_DOCUMENT_TYPES).toContain('confidentiality_agreement');
  });

  it('has at least 9 entries', () => {
    expect(LEGALLY_SIGNIFICANT_DOCUMENT_TYPES.length).toBeGreaterThanOrEqual(9);
  });
});

// ─── Type safety: template IDs vs generated document IDs ─────────────────────

describe('isGeneratedDocumentFileId type guard', () => {
  it('returns true for a non-empty string', () => {
    expect(isGeneratedDocumentFileId('some-drive-file-id')).toBe(true);
  });

  it('returns false for null', () => {
    expect(isGeneratedDocumentFileId(null)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isGeneratedDocumentFileId('')).toBe(false);
  });
});

// ─── Sync status ──────────────────────────────────────────────────────────────

describe('SyncStatus enum', () => {
  it('contains all 6 allowed values', () => {
    expect(SYNC_STATUSES.length).toBe(6);
    expect(SYNC_STATUSES).toContain('never');
    expect(SYNC_STATUSES).toContain('pending');
    expect(SYNC_STATUSES).toContain('syncing');
    expect(SYNC_STATUSES).toContain('synced');
    expect(SYNC_STATUSES).toContain('failed');
    expect(SYNC_STATUSES).toContain('conflict');
  });
});
