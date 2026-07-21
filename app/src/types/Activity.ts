/**
 * Activity — engagement log entry (Sheets: Activity sheet, A:E)
 */

export const ACTIVITY_HEADERS = [
  'id',
  'opportunity_id',
  'type',
  'note',
  'created_at',
] as const;

export type ActivityHeader = (typeof ACTIVITY_HEADERS)[number];

export type ActivityType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'note'
  | 'proposal_sent'
  | 'contract_sent'
  | 'payment_received'
  | 'stage_change'
  | 'system';

export interface Activity {
  id: string;
  opportunity_id: string;
  type: ActivityType | string;
  note: string;
  created_at: string;
}
