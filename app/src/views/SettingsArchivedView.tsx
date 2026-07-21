/**
 * SettingsArchivedView — Archived opportunities (Batch 1B)
 *
 * - Breadcrumb: Settings / Archived Opportunities
 * - Table of archived opportunities
 * - EmptyState when none (demo data has no archived records)
 */

import { Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function SettingsArchivedView() {
  const { opportunities } = useDemoStore();

  const archived = opportunities.filter((o) => o.archived);

  return (
    <PageContainer title="Archived Opportunities">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-text-muted">
          <li><Link to="/settings" className="hover:text-teal transition-colors">Settings</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-navy font-medium">Archived Opportunities</li>
        </ol>
      </nav>

      <div className="mb-6">
        <p className="text-text-muted text-sm mt-1">{archived.length} record{archived.length !== 1 ? 's' : ''}</p>
      </div>

      {archived.length === 0 ? (
        <EmptyState
          title="No archived opportunities"
          description="Archived opportunities will appear here. The demo dataset contains no archived records."
        />
      ) : (
        <div className="bg-white rounded-xl border border-border-subtle shadow-card overflow-hidden">
          <table className="w-full text-sm" aria-label="Archived opportunities">
            <thead className="bg-canvas border-b border-border-subtle">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Client</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Service</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Archived</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wide">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {archived.map((opp) => (
                <tr key={opp.id} className="hover:bg-canvas transition-colors opacity-75">
                  <td className="px-4 py-3 font-medium text-navy">{opp.client_name}</td>
                  <td className="px-4 py-3 text-text-muted">{opp.service}</td>
                  <td className="px-4 py-3">
                    <time dateTime={opp.archived_at}>{formatDate(opp.archived_at)}</time>
                  </td>
                  <td className="px-4 py-3 text-right text-navy">£{opp.project_value.toLocaleString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
