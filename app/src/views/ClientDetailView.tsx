/**
 * ClientDetailView — Client detail loaded via clientId URL param (Batch 1B)
 */

import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { SalesStageBadge, DeliveryBadge } from '../components/ui/Badge';
import { PageContainer } from '../components/PageContainer';

const TODAY = '2026-07-20';

function isOverdue(date: string): boolean {
  return !!date && date < TODAY;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ClientDetailView() {
  const { clientId } = useParams<{ clientId: string }>();
  const { opportunities } = useDemoStore();

  const opp = opportunities.find((o) => o.id === clientId);

  if (!opp) {
    return (
      <PageContainer title="Client Detail">
        <div role="alert" className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <p className="text-2xl" aria-hidden="true">⚠</p>
          <h2 className="text-navy font-semibold text-lg">Client not found</h2>
          <p className="text-text-muted text-sm">The ID "{clientId}" does not match any client in this demo.</p>
          <Link to="/clients" className="text-teal text-sm font-medium hover:underline">
            ← Back to Clients
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Client Detail">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-text-muted">
          <li><Link to="/clients" className="hover:text-teal transition-colors">Clients</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-navy font-medium truncate max-w-[200px]">{opp.client_name}</li>
        </ol>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-navy">{opp.client_name}</h2>
          <p className="text-text-muted text-sm mt-1">{opp.service}</p>
        </div>
        <Link
          to={`/clients/${opp.id}/documents`}
          className="text-teal text-sm font-medium hover:underline shrink-0"
        >
          View documents →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Contact */}
        <section aria-labelledby="contact-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="contact-heading" className="font-semibold text-navy mb-3 text-sm uppercase tracking-wide">Contact</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div>
              <dt className="text-xs text-text-muted">Name</dt>
              <dd className="font-medium text-navy">{opp.contact_name}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Email</dt>
              <dd className="text-teal">{opp.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Phone</dt>
              <dd className="text-navy">{opp.phone}</dd>
            </div>
          </dl>
        </section>

        {/* Engagement value */}
        <section aria-labelledby="value-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="value-heading" className="font-semibold text-navy mb-3 text-sm uppercase tracking-wide">Engagement value</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div>
              <dt className="text-xs text-text-muted">Project value</dt>
              <dd className="text-xl font-bold text-navy">£{opp.project_value.toLocaleString('en-GB')}</dd>
            </div>
            {opp.monthly_value > 0 && (
              <div>
                <dt className="text-xs text-text-muted">Monthly value</dt>
                <dd className="font-semibold text-navy">£{opp.monthly_value.toLocaleString('en-GB')}/mo</dd>
              </div>
            )}
          </dl>
        </section>

        {/* Current stage */}
        <section aria-labelledby="stage-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="stage-heading" className="font-semibold text-navy mb-3 text-sm uppercase tracking-wide">Current stage</h2>
          <div className="flex flex-col gap-2">
            <SalesStageBadge stage={opp.sales_stage ?? opp.stage} />
            {opp.delivery_status && <DeliveryBadge status={opp.delivery_status} />}
          </div>
        </section>

        {/* Next action */}
        <section aria-labelledby="nextaction-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="nextaction-heading" className="font-semibold text-navy mb-2 text-sm uppercase tracking-wide">Next action</h2>
          <p className="text-sm text-navy">{opp.next_action || '—'}</p>
          {opp.follow_up_date && (
            <p className={`text-sm mt-2 font-medium ${isOverdue(opp.follow_up_date) ? 'text-red-600' : 'text-text-muted'}`}>
              <time dateTime={opp.follow_up_date}>{formatDate(opp.follow_up_date)}</time>
              {isOverdue(opp.follow_up_date) && ' (overdue)'}
            </p>
          )}
        </section>

        {/* Notes */}
        <section aria-labelledby="clientnotes-heading" className="md:col-span-2 bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <h2 id="clientnotes-heading" className="font-semibold text-navy mb-2 text-sm uppercase tracking-wide">Notes</h2>
          <p className="text-sm text-navy whitespace-pre-wrap">{opp.notes || '—'}</p>
        </section>
      </div>
    </PageContainer>
  );
}
