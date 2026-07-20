/**
 * ClientsView — Client list derived from active opportunities (Batch 1B)
 */

import { useSearchParams, Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { SearchInput } from '../components/ui/SearchInput';
import { DeliveryBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';

export function ClientsView() {
  const { opportunities } = useDemoStore();
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  // Clients are active opportunities
  const clients = opportunities.filter((o) => o.status === 'active');

  const filtered = q
    ? clients.filter(
        (o) =>
          o.client_name.toLowerCase().includes(q.toLowerCase()) ||
          o.service.toLowerCase().includes(q.toLowerCase()) ||
          o.contact_name.toLowerCase().includes(q.toLowerCase()),
      )
    : clients;

  return (
    <PageContainer title="Clients">
      <div className="mb-6">
        <p className="text-text-muted text-sm mt-1">{filtered.length} active client{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="mb-4">
        <SearchInput
          value={q}
          onChange={(v) => setParam('q', v)}
          placeholder="Search by client, service, contact…"
          label="Search clients"
          className="max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No clients found"
          description="Try adjusting your search."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-border-subtle shadow-card overflow-hidden">
            <table className="w-full text-sm" aria-label="Active clients">
              <thead className="bg-canvas border-b border-border-subtle">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Client</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Service</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Contact</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Delivery</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((opp) => (
                  <tr key={opp.id} className="hover:bg-canvas transition-colors group">
                    <td className="px-4 py-3">
                      <Link
                        to={`/clients/${opp.id}`}
                        className="font-medium text-navy group-hover:text-teal transition-colors"
                      >
                        {opp.client_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{opp.service}</td>
                    <td className="px-4 py-3 text-text-muted">{opp.contact_name}</td>
                    <td className="px-4 py-3">
                      {opp.delivery_status && <DeliveryBadge status={opp.delivery_status} />}
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">£{opp.project_value.toLocaleString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul role="list" className="md:hidden flex flex-col gap-3">
            {filtered.map((opp) => (
              <li key={opp.id}>
                <Link
                  to={`/clients/${opp.id}`}
                  className="block bg-white rounded-xl border border-border-subtle shadow-card p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-semibold text-navy truncate">{opp.client_name}</p>
                    {opp.delivery_status && <DeliveryBadge status={opp.delivery_status} />}
                  </div>
                  <p className="text-xs text-text-muted mb-1">{opp.service} · {opp.contact_name}</p>
                  <p className="text-sm font-semibold text-navy">£{opp.project_value.toLocaleString('en-GB')}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageContainer>
  );
}
