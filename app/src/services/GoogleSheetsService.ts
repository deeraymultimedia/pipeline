/**
 * GoogleSheetsService
 *
 * Typed wrapper around the Google Sheets API v4 browser client.
 * Preserves all capabilities from the current live index.html implementation.
 *
 * IMPORTANT: No live Sheets calls are made during Batch 1A testing.
 * All tests use mocks or fixtures. The service is instantiated with a
 * real access token only in the authenticated runtime application.
 *
 * Mock mode: set VITE_USE_MOCK_DATA=true to route through MockDataService instead.
 */

import { SHEETS_WORKBOOK_ID } from '../constants/company';

const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_WORKBOOK_ID}`;

export type SheetRow = string[];
export type SheetValues = SheetRow[];

export interface RangeResponse {
  range: string;
  majorDimension: string;
  values?: SheetValues;
}

export interface BatchUpdateRequest {
  requests: unknown[];
}

export class GoogleSheetsError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = 'GoogleSheetsError';
  }
}

export class GoogleSheetsService {
  private token: string;

  constructor(accessToken: string) {
    this.token = accessToken;
  }

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, { ...options, headers: this.headers() });

    if (!res.ok) {
      throw new GoogleSheetsError(
        `Sheets API error: ${res.status} ${res.statusText}`,
        res.status,
        endpoint,
      );
    }

    return res.json() as Promise<T>;
  }

  /** GET a range of values. Returns empty array if range is empty. */
  async getRange(range: string): Promise<SheetValues> {
    const encoded = encodeURIComponent(range);
    const data = await this.request<RangeResponse>(
      `/values/${encoded}?majorDimension=ROWS`,
    );
    return data.values ?? [];
  }

  /** PUT (overwrite) a range of values. */
  async putRange(range: string, values: SheetValues): Promise<void> {
    const encoded = encodeURIComponent(range);
    await this.request(`/values/${encoded}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
    });
  }

  /** Append rows to a sheet. */
  async appendRows(sheetName: string, values: SheetValues): Promise<void> {
    const range = encodeURIComponent(`${sheetName}!A1`);
    await this.request(`/values/${range}:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      body: JSON.stringify({ majorDimension: 'ROWS', values }),
    });
  }

  /** Clear all values from a range. */
  async clearRange(range: string): Promise<void> {
    const encoded = encodeURIComponent(range);
    await this.request(`/values/${encoded}:clear`, { method: 'POST' });
  }

  /** Get workbook metadata (sheet names, IDs, etc.). */
  async getWorkbookMetadata(): Promise<unknown> {
    return this.request<unknown>('?fields=sheets.properties');
  }

  /** Add a new sheet tab to the workbook. */
  async addSheetTab(title: string): Promise<void> {
    const body: BatchUpdateRequest = {
      requests: [
        { addSheet: { properties: { title } } },
      ],
    };
    await this.request('/batchUpdate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /** Update a single cell value. */
  async updateCell(range: string, value: string): Promise<void> {
    return this.putRange(range, [[value]]);
  }
}
