/**
 * EngagementsView — Chronological activity timeline (Batch 1B)
 *
 * - All 22 demo activities, newest first
 * - ?type= URL filter with FilterSelect
 * - Emoji icon bubble + connector line per entry
 * - <time dateTime> on each date
 * - Client name links to /pipeline/{opportunity_id}
 * - EmptyState for no-results
 */

import { useSearchParams, Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { DEMO_ACTIVITIES } from '../data/demoData';
import { FilterSelect } from '../components/ui/FilterSelect';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import type { ActivityType } from '../types/Activity';

const ACTIVITY_ICONS: Record<string, string> = {
  call:             '📞',
  email:            '📧',
  meeting:          '🤝',
  note:             '📝',
  proposal_sent:    '📄',
  contract_sent:    '📑',
  payment_received: '💷',
  stage_change:     '🔄',
  system:           '⚙️',
};

const ACTIVITY_TYPES: Array<{ value: string; label: string }> = [
  { value: 'call',             label: 'Call' },
  { value: 'email',            label: 'Email' },
  { value: 'meeting',          label: 'Meeting' },
  { value: 'note',             label: 'Note' },
  { value: 'proposal_sent',    label: 'Proposal sent' },
  { value: 'contract_sent',    label: 'Contract sent' },
  { value: 'payment_received', label: 'Payment received' },
  { value: 'stage_change',     label: 'Stage change' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function humaniseType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function EngagementsView() {
  const { opportunities } = useDemoStore();
  const [params, setParams] = useSearchParams();

  const typeFilter = params.get('type') ?? '';

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  function getClient(opportunityId: string) {
    return opportunities.find((o) => o.id === opportunityId);
  }

  const sorted = [...DEMO_ACTIVITIES].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );

  const filtered = typeFilter
    ? sorted.filter((a) => a.type === typeFilter)
    : sorted;

  return (
    <PageContainer title="Engagements">
      <div className="mb-6">
        <p className="text-text-muted text-sm mt-1">
          {filtered.length} entr{filtered.length !== 1 ? 'ies' : 'y'} · all clients
        </p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <FilterSelect
          label="Activity type"
          value={typeFilter}
          onChange={(v) => setParam('type', v)}
          options={ACTIVITY_TYPES}
          allLabel="All types"
          className="max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No activities found"
          description="Try selecting a different activity type."
        />
      ) : (
        <div className="relative">
          <ul role="list" className="flex flex-col gap-0">
            {filtered.map((act, idx) => {
              const client = getClient(act.opportunity_id);
              return (
                <li key={act.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Connector line */}
                  {idx < filtered.length - 1 && (
                    <div
                      className="absolute left-5 top-10 bottom-0 w-px bg-border-subtle"
                      aria-hidden="true"
                    />
                  )}

                  {/* Icon bubble */}
                  <span
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-light border border-teal/20 flex items-center justify-center text-lg shadow-sm"
                    aria-hidden="true"
                  >
                    {ACTIVITY_ICONS[act.type as ActivityType] ?? '📌'}
                  </span>

                  {/* Content */}
                  <div className="min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-navy">
                        {humaniseType(act.type)}
                      </span>
                      {client && (
                        <Link
                          to={`/pipeline/${act.opportunity_id}`}
                          className="text-teal text-xs font-medium hover:underline"
                        >
                          {client.client_name}
                        </Link>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">{act.note}</p>
                    <time
                      dateTime={act.created_at}
                      className="text-xs text-text-muted mt-1 block"
                    >
                      {formatDate(act.created_at)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </PageContainer>
  );
}
