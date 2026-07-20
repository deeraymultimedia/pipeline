/**
 * Badge — design system badge components
 *
 * Exports:
 *   SalesStageBadge    — colour-coded sales stage
 *   DeliveryBadge      — colour-coded delivery status
 *   OpportunityStatusBadge — active / won / lost
 *   DocumentStatusBadge — document lifecycle status
 *   PriorityBadge      — high / medium / low
 */

import type { SalesStage, DeliveryStatus, DocumentStatus } from '../../types/enums';
import type { TaskPriority } from '../../data/demoData';

interface BadgeProps {
  className?: string | undefined;
}

// ─── Base badge ───────────────────────────────────────────────────────────────

function Badge({
  label,
  color,
  className = '',
}: { label: string; color: string; className?: string | undefined }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${className}`}
      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}18` }}
    >
      {label}
    </span>
  );
}

// ─── Sales stage ──────────────────────────────────────────────────────────────

const SALES_STAGE_COLORS: Record<SalesStage, string> = {
  'New Lead':               '#888780',
  'Discovery':              '#5B9BD5',
  'Proposal Sent':          '#378ADD',
  'Follow-up / Negotiation': '#EF9F27',
  'Contract Agreed':        '#A67DC5',
  'Payment Received':       '#1D9E75',
  'Lost':                   '#D85A30',
};

interface SalesStageBadgeProps extends BadgeProps {
  stage: SalesStage | string | null;
}

export function SalesStageBadge({ stage, className }: SalesStageBadgeProps) {
  if (!stage) return null;
  const color = SALES_STAGE_COLORS[stage as SalesStage] ?? '#888780';
  return <Badge label={stage} color={color} className={className} />;
}

// ─── Delivery status ──────────────────────────────────────────────────────────

const DELIVERY_COLORS: Record<DeliveryStatus, string> = {
  'Not Started':     '#888780',
  'Awaiting Content': '#EF9F27',
  'In Build':        '#7F77DD',
  'Review & QA':     '#D85A30',
  'Live':            '#1D9E75',
  'On Care Plan':    '#378ADD',
};

interface DeliveryBadgeProps extends BadgeProps {
  status: DeliveryStatus | string | null;
}

export function DeliveryBadge({ status, className }: DeliveryBadgeProps) {
  if (!status) return null;
  const color = DELIVERY_COLORS[status as DeliveryStatus] ?? '#888780';
  return <Badge label={status} color={color} className={className} />;
}

// ─── Opportunity status ───────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  active: '#1D9E75',
  won:    '#1B2A4A',
  lost:   '#D85A30',
};

interface OpportunityStatusBadgeProps extends BadgeProps {
  status: string;
}

export function OpportunityStatusBadge({ status, className }: OpportunityStatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? '#888780';
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge label={label} color={color} className={className} />;
}

// ─── Document status ──────────────────────────────────────────────────────────

const DOC_STATUS_COLORS: Record<DocumentStatus, string> = {
  Draft:      '#888780',
  'In Review': '#EF9F27',
  Final:      '#1B2A4A',
  Sent:       '#378ADD',
  Viewed:     '#5B9BD5',
  Signed:     '#1D9E75',
  Superseded: '#D85A30',
  Archived:   '#888780',
};

interface DocumentStatusBadgeProps extends BadgeProps {
  status: DocumentStatus | string;
}

export function DocumentStatusBadge({ status, className }: DocumentStatusBadgeProps) {
  const color = DOC_STATUS_COLORS[status as DocumentStatus] ?? '#888780';
  return <Badge label={status} color={color} className={className} />;
}

// ─── Priority ─────────────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high:   '#D85A30',
  medium: '#EF9F27',
  low:    '#888780',
};

interface PriorityBadgeProps extends BadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const color = PRIORITY_COLORS[priority];
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  return <Badge label={label} color={color} className={className} />;
}
