/**
 * ActivityRepository
 *
 * Typed wrapper for the Activity sheet (A:E).
 * Correspondence with no document artefact is stored here only —
 * not in the Documents system.
 */

import type { Activity } from '../types/Activity';
import { ACTIVITY_HEADERS } from '../types/Activity';
import type { GoogleSheetsService } from './GoogleSheetsService';
import { SHEET_NAMES } from '../constants/company';

const ACT_RANGE = `${SHEET_NAMES.activity}!A:E`;

function parseActivityRow(
  headerMap: Map<string, number>,
  row: string[],
): Activity {
  const get = (field: string): string => {
    const idx = headerMap.get(field);
    return idx !== undefined ? (row[idx] ?? '') : '';
  };

  return {
    id:             get('id'),
    opportunity_id: get('opportunity_id'),
    type:           get('type'),
    note:           get('note'),
    created_at:     get('created_at'),
  };
}

export function serialiseActivityRow(act: Activity): string[] {
  return [
    act.id,
    act.opportunity_id,
    act.type,
    act.note,
    act.created_at,
  ];
}

export class ActivityRepository {
  constructor(private readonly sheets: GoogleSheetsService) {}

  private buildHeaderMap(headerRow: string[]): Map<string, number> {
    const map = new Map<string, number>();
    headerRow.forEach((h, i) => {
      if (h) map.set(h.trim(), i);
    });
    return map;
  }

  async getAll(): Promise<Activity[]> {
    const rows = await this.sheets.getRange(ACT_RANGE);
    if (rows.length < 2) return [];

    const headerRow = rows[0];
    if (!headerRow) return [];
    const dataRows = rows.slice(1);
    const headerMap = this.buildHeaderMap(headerRow);

    return dataRows
      .filter((row) => row.length > 0 && row[0]?.trim() !== '')
      .map((row) => parseActivityRow(headerMap, row));
  }

  async getForOpportunity(opportunityId: string): Promise<Activity[]> {
    const all = await this.getAll();
    return all.filter((act) => act.opportunity_id === opportunityId);
  }

  async append(activity: Activity): Promise<void> {
    await this.sheets.appendRows(SHEET_NAMES.activity, [serialiseActivityRow(activity)]);
  }
}

export { ACTIVITY_HEADERS };
