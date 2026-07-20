/**
 * ClientDocumentsView — Documents for a client (Batch 1B)
 *
 * - Breadcrumb: Clients / Client Name / Documents
 * - Amber "placeholder" callout — integration batch label
 * - Lists demo documents from getDocumentsForOpportunity()
 * - View / Download buttons disabled with tooltip
 */

import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { getDocumentsForOpportunity } from '../data/demoData';
import { DocumentStatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ClientDocumentsView() {
  const { clientId } = useParams<{ clientId: string }>();
  const { opportunities } = useDemoStore();

  const opp = opportunities.find((o) => o.id === clientId);
  const documents = opp ? getDocumentsForOpportunity(opp.id) : [];

  const clientName = opp?.client_name ?? 'Client';

  return (
    <PageContainer title="Client Documents">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
          <li><Link to="/clients" className="hover:text-teal transition-colors">Clients</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={`/clients/${clientId}`} className="hover:text-teal transition-colors truncate max-w-[160px] inline-block">
              {clientName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-navy font-medium">Documents</li>
        </ol>
      </nav>

      <div className="mb-6">
        <p className="text-text-muted text-sm mt-1">{clientName}</p>
      </div>

      {/* Placeholder callout */}
      <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <span className="text-lg shrink-0" aria-hidden="true">⚠</span>
        <div>
          <p className="font-semibold">Document integration — coming in a later batch</p>
          <p className="mt-1 text-amber-700">
            Google Drive access, document generation, and the Documents worksheet will be connected in the integration phase.
            Files listed below are demo placeholders only.
          </p>
        </div>
      </div>

      {!opp ? (
        <EmptyState title="Client not found" description="This client ID does not exist in this demo." />
      ) : documents.length === 0 ? (
        <EmptyState
          title="No documents"
          description="No demo documents are linked to this client."
        />
      ) : (
        <div className="bg-white rounded-xl border border-border-subtle shadow-card overflow-hidden">
          <table className="w-full text-sm" aria-label={`Documents for ${clientName}`}>
            <thead className="bg-canvas border-b border-border-subtle">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Type</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Version</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Created</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-canvas transition-colors">
                  <td className="px-4 py-3 font-medium text-navy max-w-xs truncate">{doc.name}</td>
                  <td className="px-4 py-3 text-text-muted">{doc.document_type}</td>
                  <td className="px-4 py-3">
                    <DocumentStatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 text-text-muted font-mono text-xs">{doc.version_label}</td>
                  <td className="px-4 py-3 text-text-muted">
                    <time dateTime={doc.created_at}>{formatDate(doc.created_at)}</time>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled
                        title="Coming in a later integration batch"
                        aria-label={`View ${doc.name} — not yet available`}
                        className="text-xs text-text-muted border border-border-subtle px-2.5 py-1 rounded opacity-50 cursor-not-allowed min-h-[32px]"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        disabled
                        title="Coming in a later integration batch"
                        aria-label={`Download ${doc.name} — not yet available`}
                        className="text-xs text-text-muted border border-border-subtle px-2.5 py-1 rounded opacity-50 cursor-not-allowed min-h-[32px]"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
