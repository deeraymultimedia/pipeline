/**
 * Branded types prevent accidental substitution of structurally-identical IDs.
 * For example, a TemplateFileId cannot be passed where a GeneratedDocumentFileId
 * is expected, even though both are strings at runtime.
 */

declare const __brand: unique symbol;
type Brand<T, B> = T & { readonly [__brand]: B };

/** A stable client identifier. Must not be an opportunity ID, email, or display name. */
export type ClientId = Brand<string, 'ClientId'>;

/**
 * The Drive file ID of a master template.
 * Must NEVER be passed to a document-write method — only copies are written.
 */
export type TemplateFileId = Brand<string, 'TemplateFileId'>;

/**
 * The Drive file ID of a generated document (copy of a template after merge).
 * Distinct from TemplateFileId to prevent accidental template mutation.
 */
export type GeneratedDocumentFileId = Brand<string, 'GeneratedDocumentFileId'>;

/** A Drive file ID for a user-uploaded or externally linked file. */
export type DriveFileId = Brand<string, 'DriveFileId'>;

/** Unsafe constructors — use only in data-layer parsing where ID provenance is known. */
export const asClientId = (s: string): ClientId => s as ClientId;
export const asTemplateFileId = (s: string): TemplateFileId => s as TemplateFileId;
export const asGeneratedDocumentFileId = (s: string): GeneratedDocumentFileId =>
  s as GeneratedDocumentFileId;
export const asDriveFileId = (s: string): DriveFileId => s as DriveFileId;
