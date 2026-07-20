/**
 * PipelineView — Pipeline list with filtering, sorting, and search (Batch 1B)
 *
 * URL params: ?q=, ?stage=, ?status=, ?sort=, ?dir=
 * - Full-text search across client_name, contact_name, service, next_action, notes
 * - Sort headers with aria-sort
 * - Active filter chips with individual remove
 * - Overdue follow-up dates highlighted red
 * - Desktop table + mobile card list
 */

import { useSearchParams, Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterSelect } from '../components/ui/FilterSelect';
import { SalesStageBadge, DeliveryBadge, OpportunityStatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import { SALES_STAGES } from '../types/enums';
import type { Opportunity } from '../types/Opportunity';

const TODAY = '2026-07-20';

type SortField = 'client_name' | 'project_value' | 'follow_up_date' | 'updated_at' | 'stage';
type SortDir = 'asc' | 'desc';

function isOverdue(date: string): boolean {
  return !!date && date < TODAY;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function matchesSearch(opp: Opportunity, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    opp.client_name.toLowerCase().includes(lower) ||
    opp.contact_name.toLowerCase().includes(lower) ||
    opp.service.toLowerCase().includes(lower) ||
    opp.next_action.toLowerCase().includes(lower) ||
    opp.notes.toLowerCase().includes(lower)
  );
}

function sortOpps(opps: Opportunity[], field: SortField, dir: SortDir): Opportunity[] {
  return [...opps].sort((a, b) => {
    let av: string | number = '';
    let bv: string | number = '';
    if (field === 'client_name')   { av = a.client_name;   bv = b.client_name; }
    if (field === 'project_value') { av = a.project_value; bv = b.project_value; }
    if (field === 'follow_up_date') { av = a.follow_up_date; bv = b.follow_up_date; }
    if (field === 'updated_at')    { av = a.updated_at;    bv = b.updated_at; }
    if (field === 'stage')         { av = a.sales_stage ?? a.stage; bv = b.sales_stage ?? b.stage; }

    if (typeof av === 'number' && typeof bv === 'number') {
      return dir === 'asc' ? av - bv : bv - av;
    }
    const cmp = String(av).localeCompare(String(bv));
    return dir === 'asc' ? cmp : -cmp;
  });
}

interface SortHeaderProps {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
}

function SortHeader({ label, field, currentSort, currentDir, onSort }: SortHeaderProps) {
  const isActive = currentSort === field;
  const ariaSortValue = isActive ? (currentDir === 'asc' ? 'ascending' : 'descending') : 'none';
  return (
    <th
      scope="col"
      aria-sort={ariaSortValue}
      className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide"
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-navy transition-colors min-h-[36px]"
      >
        {label}
        {isActive && (
          <span aria-hidden="true" className="text-teal">
            {currentDir === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </button>
    </th>
  );
}

export function PipelineView() {
  const { opportunities } = useDemoStore();
  const [params, setParams] = useSearchParams();

  const q      = params.get('q')      ?? '';
  const stage  = params.get('stage')  ?? '';
  const status = params.get('status') ?? '';
  const sort   = (params.get('sort')  ?? 'updated_at') as SortField;
  const dir    = (params.get('dir')   ?? 'desc')        as SortDir;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  function handleSort(field: SortField) {
    const next = new URLSearchParams(params);
    if (sort === field) {
      next.set('dir', dir === 'asc' ? 'desc' : 'asc');
    } else {
      next.set('sort', field);
      next.set('dir', 'asc');
    }
    setParams(next);
  }

  // Filter
  let filtered = opportunities;
  if (q) filtered = filtered.filter((o) => matchesSearch(o, q));
  if (stage) filtered = filtered.filter((o) => o.sales_stage === stage || o.stage === stage);
  if (status) filtered = filtered.filter((o) => o.status === status);
  filtered = sortOpps(filtered, sort, dir);

  const totalActiveValue = filtered
    .filter((o) => o.status === 'active')
    .reduce((s, o) => s + o.project_value, 0);

  const activeFilters = [
    q     && { key: 'q',     label: `"${q}"` },
    stage  && { key: 'stage',  label: stage },
    status && { key: 'status', label: status },
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  return (
    <PageContainer title="Pipeline">
      {/* Subtitle */}
      <div className="mb-6">
        <p className="text-text-muted text-sm">
          {filtered.filter((o) => o.status === 'active').length} active opportunities ·{' '}
          £{totalActiveValue.toLocaleString('en-GB')} total value
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-4">
        <SearchInput
          value={q}
          onChange={(v) => setParam('q', v)}
          placeholder="Search client, service, action…"
          label="Search pipeline"
          className="flex-1 min-w-[200px]"
        />
        <FilterSelect
          label="Sales stage"
          value={stage}
          onChange={(v) => setParam('stage', v)}
          options={SALES_STAGES.map((s) => ({ value: s, label: s }))}
          allLabel="All stages"
        />
        <FilterSelect
          label="Status"
          value={status}
          onChange={(v) => setParam('status', v)}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'won', label: 'Won' },
            { value: 'lost', label: 'Lost' },
          ]}
          allLabel="All statuses"
        />
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4" aria-label="Active filters">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setParam(f.key, '')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-light text-teal text-xs font-medium rounded-full border border-teal/20 hover:bg-teal/10 transition-colors min-h-[32px]"
              aria-label={`Remove filter: ${f.label}`}
            >
              {f.label}
              <span aria-hidden="true">✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Desktop table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No opportunities found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-border-subtle shadow-card overflow-hidden">
            <table className="w-full text-sm" aria-label="Pipeline opportunities">
              <thead className="bg-canvas border-b border-border-subtle">
                <tr>
                  <SortHeader label="Client" field="client_name" currentSort={sort} currentDir={dir} onSort={handleSort} />
                  <SortHeader label="Value" field="project_value" currentSort={sort} currentDir={dir} onSort={handleSort} />
                  <SortHeader label="Stage" field="stage" currentSort={sort} currentDir={dir} onSort={handleSort} />
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Delivery</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                  <SortHeader label="Follow-up" field="follow_up_date" currentSort={sort} currentDir={dir} onSort={handleSort} />
                  <SortHeader label="Updated" field="updated_at" currentSort={sort} currentDir={dir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((opp) => (
                  <tr key={opp.id} className="hover:bg-canvas transition-colors group">
                    <td className="px-4 py-3">
                      <Link to={`/pipeline/${opp.id}`} className="font-medium text-navy group-hover:text-teal transition-colors">
                        {opp.client_name}
                      </Link>
                      <p className="text-xs text-text-muted">{opp.service}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">
                      £{opp.project_value.toLocaleString('en-GB')}
                    </td>
                    <td className="px-4 py-3">
                      <SalesStageBadge stage={opp.sales_stage ?? opp.stage} />
                    </td>
                    <td className="px-4 py-3">
                      {opp.delivery_status && <DeliveryBadge status={opp.delivery_status} />}
                    </td>
                    <td className="px-4 py-3">
                      <OpportunityStatusBadge status={opp.status} />
                    </td>
                    <td className="px-4 py-3">
                      {opp.follow_up_date ? (
                        <time
                          dateTime={opp.follow_up_date}
                          className={isOverdue(opp.follow_up_date) ? 'text-red-600 font-medium' : 'text-text-muted'}
                        >
                          {formatDate(opp.follow_up_date)}
                          {isOverdue(opp.follow_up_date) && ' (overdue)'}
                        </time>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <time dateTime={opp.updated_at} className="text-text-muted text-xs">
                        {formatDate(opp.updated_at)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <ul role="list" className="md:hidden flex flex-col gap-3">
            {filtered.map((opp) => (
              <li key={opp.id}>
                <Link
                  to={`/pipeline/${opp.id}`}
                  className="block bg-white rounded-xl border border-border-subtle shadow-card p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-navy truncate">{opp.client_name}</p>
                      <p className="text-xs text-text-muted">{opp.service}</p>
                    </div>
                    <OpportunityStatusBadge status={opp.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <SalesStageBadge stage={opp.sales_stage ?? opp.stage} />
                    {opp.delivery_status && <DeliveryBadge status={opp.delivery_status} />}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-navy">£{opp.project_value.toLocaleString('en-GB')}</span>
                    {opp.follow_up_date && (
                      <time
                        dateTime={opp.follow_up_date}
                        className={isOverdue(opp.follow_up_date) ? 'text-red-600 font-medium' : 'text-text-muted'}
                      >
                        {isOverdue(opp.follow_up_date) ? 'Overdue: ' : 'Follow-up: '}
                        {formatDate(opp.follow_up_date)}
                      </time>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageContainer>
  );
}
