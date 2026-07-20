/**
 * DriveService — interface stubs only (Batch 1A)
 *
 * No Drive API calls are made in Batch 1A.
 * No drive.file OAuth scope is requested in Batch 1A.
 * This interface defines the shape for Phase 2 implementation.
 *
 * drive.file capability summary:
 *   App-authorised file set: files created by the app + files explicitly selected
 *   via Picker or equivalent user gesture.
 *   NOT blanket Drive-wide access to arbitrary content.
 *
 * Template copy flow (Phase 2):
 *   1. Picker selects master → grants per-file access under drive.file
 *   2. App calls POST /drive/v3/files/{templateId}/copy
 *   3. App writes merge content into the copy (never the master)
 */

import type { TemplateFileId, GeneratedDocumentFileId, DriveFileId } from './branded';

export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string | null;
  createdTime: string;
  modifiedTime: string;
}

/**
 * DriveService — Phase 2 implementation contract.
 * All methods are not implemented in Batch 1A.
 */
export interface DriveService {
  /** Open Google Picker for template selection. Returns file ID within app-authorised set. */
  openTemplatePicker(): Promise<TemplateFileId>;

  /**
   * Copy a template master to a new generated document.
   * Template file ID is the source; it is never written to.
   */
  copyTemplate(
    templateId: TemplateFileId,
    destinationName: string,
    folderId?: DriveFileId,
  ): Promise<GeneratedDocumentFileId>;

  /** Upload a file and return its Drive file ID within the app-authorised set. */
  uploadFile(file: File, folderId?: DriveFileId): Promise<DriveFileId>;

  /** Get metadata for a file in the app-authorised set. */
  getFileMetadata(fileId: DriveFileId | GeneratedDocumentFileId): Promise<DriveFileMetadata>;

  /**
   * List files within an app-created folder.
   * Permitted under drive.file because the folder is within the app-authorised set.
   * Not permitted for folders outside the app-authorised set.
   */
  listAppFolder(folderId: DriveFileId): Promise<DriveFileMetadata[]>;
}
