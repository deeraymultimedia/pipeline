/**
 * RevenueView — Revenue dashboard (Batch 1B)
 *
 * - 4 metric cards: total project value, MRR, won count/value, avg project value
 * - Won Clients table sorted by won date descending
 * - tfoot totals row
 * - Mobile card layout
 * - Demo data indicator
 */

import { useDemoStore } from '../contexts/useDemoStore';
import { MetricCard } from '../components/ui/MetricCard';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function RevenueView() {
  const { opportunities } = useDemoStore();

  const wonOpps = opportunities
    .filter((o) => o.status === 'won')
    .sort((a, b) => b.won_date.localeCompare(a.won_date));

  const totalWonValue = wonOpps.reduce((s, o) => s + o.project_value, 0);
  const mrr = wonOpps.reduce((s, o) => s + o.monthly_value, 0);
  const avgProjectValue = wonOpps.length > 0 ? Math.round(totalWonValue / wonOpps.length) : 0;

  const allActiveValue = opportunities
    .filter((o) => o.status === 'active')
    .reduce((s, o) => s + o.project_value, 0);

  return (
    <PageContainer title="Revenue">
      <div className="mb-6">
        <p className="text-text-muted text-sm mt-1">
          Demo data · {wonOpps.length} won client{wonOpps.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* KPI cards */}
      <section aria-labelledby="revenue-kpi-heading" className="mb-8">
        <h2 id="revenue-kpi-heading" className="sr-only">Revenue metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Won revenue"
            value={`£${totalWonValue.toLocaleString('en-GB')}`}
            subLabel={`${wonOpps.length} clients`}
            accentColor="#1D9E75"
          />
          <MetricCard
            label="Monthly recurring"
            value={`£${mrr.toLocaleString('en-GB')}`}
            subLabel="MRR from care plans"
            accentColor="#A67DC5"
          />
          <MetricCard
            label="Active pipeline"
            value={`£${allActiveValue.toLocaleString('en-GB')}`}
            subLabel="potential value"
            accentColor="#0EA5A0"
            href="/pipeline"
          />
          <MetricCard
            label="Avg project value"
            value={`£${avgProjectValue.toLocaleString('en-GB')}`}
            subLabel="across won clients"
            accentColor="#378ADD"
          />
        </div>
      </section>

      {/* Won clients table */}
      <section aria-labelledby="won-clients-heading">
        <h2 id="won-clients-heading" className="font-semibold text-navy mb-4">Won clients</h2>

        {wonOpps.length === 0 ? (
          <EmptyState title="No won clients" description="Won clients will appear here." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-xl border border-border-subtle shadow-card overflow-hidden">
              <table className="w-full text-sm" aria-label="Won clients">
                <thead className="bg-canvas border-b border-border-subtle">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Client</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Service</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wide">Project value</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wide">Monthly</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Won date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {wonOpps.map((opp) => (
                    <tr key={opp.id} className="hover:bg-canvas transition-colors">
                      <td className="px-4 py-3 font-medium text-navy">{opp.client_name}</td>
                      <td className="px-4 py-3 text-text-muted">{opp.service}</td>
                      <td className="px-4 py-3 text-right font-medium text-navy">
                        £{opp.project_value.toLocaleString('en-GB')}
                      </td>
                      <td className="px-4 py-3 text-right text-text-muted">
                        {opp.monthly_value > 0 ? `£${opp.monthly_value.toLocaleString('en-GB')}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <time dateTime={opp.won_date}>{formatDate(opp.won_date)}</time>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-border-subtle bg-navy-light">
                  <tr>
                    <th scope="row" colSpan={2} className="px-4 py-3 text-left text-sm font-semibold text-navy">
                      Total ({wonOpps.length})
                    </th>
                    <td className="px-4 py-3 text-right font-bold text-navy">
                      £{totalWonValue.toLocaleString('en-GB')}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-navy">
                      £{mrr.toLocaleString('en-GB')}/mo
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile cards */}
            <ul role="list" className="md:hidden flex flex-col gap-3">
              {wonOpps.map((opp) => (
                <li key={opp.id} className="bg-white rounded-xl border border-border-subtle shadow-card p-4">
                  <p className="font-semibold text-navy">{opp.client_name}</p>
                  <p className="text-xs text-text-muted mb-2">{opp.service}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-navy">£{opp.project_value.toLocaleString('en-GB')}</span>
                    {opp.monthly_value > 0 && (
                      <span className="text-text-muted text-xs">£{opp.monthly_value}/mo</span>
                    )}
                    <time dateTime={opp.won_date} className="text-xs text-text-muted">
                      {formatDate(opp.won_date)}
                    </time>
                  </div>
                </li>
              ))}
              {/* Mobile totals */}
              <li className="bg-navy-light rounded-xl border border-border-subtle p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy">Total ({wonOpps.length} clients)</span>
                  <div className="text-right">
                    <p className="font-bold text-navy">£{totalWonValue.toLocaleString('en-GB')}</p>
                    <p className="text-xs text-text-muted">£{mrr.toLocaleString('en-GB')}/mo MRR</p>
                  </div>
                </div>
              </li>
            </ul>
          </>
        )}
      </section>
    </PageContainer>
  );
}
