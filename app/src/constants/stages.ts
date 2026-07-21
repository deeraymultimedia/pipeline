/**
 * Visual representation for stages and statuses.
 * Stage colours align with the current application's palette.
 */

import type { LegacyStage, SalesStage, DeliveryStatus } from '../types/enums';

export interface StageConfig {
  id: LegacyStage;
  label: string;
  color: string;
}

/** Legacy stage config — preserves the current live application's stage definitions. */
export const LEGACY_STAGE_CONFIGS: StageConfig[] = [
  { id: 'lead',     label: 'Lead / Enquiry',    color: '#888780' },
  { id: 'proposal', label: 'Proposal sent',     color: '#378ADD' },
  { id: 'approval', label: 'Awaiting approval', color: '#EF9F27' },
  { id: 'build',    label: 'In build',          color: '#7F77DD' },
  { id: 'qa',       label: 'Review & QA',       color: '#D85A30' },
  { id: 'live',     label: 'Live / Completed',  color: '#1D9E75' },
];

export interface SalesStageConfig {
  id: SalesStage;
  label: string;
  color: string;
  pipelineOrder: number;
}

export const SALES_STAGE_CONFIGS: SalesStageConfig[] = [
  { id: 'New Lead',                  label: 'New Lead',                  color: '#888780', pipelineOrder: 0 },
  { id: 'Discovery',                 label: 'Discovery',                 color: '#5B9BD5', pipelineOrder: 1 },
  { id: 'Proposal Sent',             label: 'Proposal Sent',             color: '#378ADD', pipelineOrder: 2 },
  { id: 'Follow-up / Negotiation',   label: 'Follow-up / Negotiation',  color: '#EF9F27', pipelineOrder: 3 },
  { id: 'Contract Agreed',           label: 'Contract Agreed',           color: '#A67DC5', pipelineOrder: 4 },
  { id: 'Payment Received',          label: 'Payment Received',          color: '#1D9E75', pipelineOrder: 5 },
  { id: 'Lost',                      label: 'Lost',                      color: '#D85A30', pipelineOrder: 6 },
];

export interface DeliveryStatusConfig {
  id: DeliveryStatus;
  label: string;
  color: string;
}

export const DELIVERY_STATUS_CONFIGS: DeliveryStatusConfig[] = [
  { id: 'Not Started',      label: 'Not Started',      color: '#888780' },
  { id: 'Awaiting Content', label: 'Awaiting Content', color: '#EF9F27' },
  { id: 'In Build',         label: 'In Build',         color: '#7F77DD' },
  { id: 'Review & QA',      label: 'Review & QA',      color: '#D85A30' },
  { id: 'Live',             label: 'Live',             color: '#1D9E75' },
  { id: 'On Care Plan',     label: 'On Care Plan',     color: '#378ADD' },
];

/** Relationship health colours for dashboard indicators. */
export const HEALTH_COLORS = {
  healthy:    '#1D9E75',
  attention:  '#EF9F27',
  at_risk:    '#D85A30',
  inactive:   '#888780',
} as const;
