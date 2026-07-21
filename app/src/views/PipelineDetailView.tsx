/**
 * PipelineDetailView — Opportunity detail (Batch 1B)
 *
 * Sections (2/3 + 1/3 grid at lg):
 *   Left: Financial, Activity Timeline, Documents
 *   Right: Contact, Next Action, Notes, Record
 * - Breadcrumb navigation
 * - Edit dialog: next_action, follow_up_date, notes
 * - ErrorState for unknown IDs
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { getActivitiesForOpportunity, getDocumentsForOpportunity } from '../data/demoData';
import { Dialog } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { SalesStageBadge, DeliveryBadge, OpportunityStatusBadge, DocumentStatusBadge } from '../components/ui/Badge';
import { PageContainer } from '../components/PageContainer';

const TODAY = '2026-07-20';

function isOverdue(date: string): boolean {
  return !!date && date < TODAY;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const ACTIVITY_INITIALS: Record<string, string> = {
  call:             'C',
  email:            'E',
  meeting:          'M',
  note:             'N',
  proposal_sent:    'P',
  contract_sent:    'CT',
  payment_received: '£',
  stage_change:     'S',
  system:           'SY',
};

interface EditValues {
  next_action: string;
  follow_up_date: string;
  notes: string;
}

export function PipelineDetailView() {
  const { id } = useParams<{ id: string }>();
  const { opportunities, updateOpportunity } = useDemoStore();
  const [editOpen, setEditOpen] = useState(false);
  const [editValues, setEditValues] = useState<EditValues>({ next_action: '', follow_up_date: '', notes: '' });

  const opp = opportunities.find((o) => o.id === id);

  if (!opp) {
    return (
      <PageContainer title="Opportunity Detail">
        <div role="alert" className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <p className="text-2xl" aria-hidden="true">⚠</p>
          <h2 className="text-navy font-semibold text-lg">Opportunity not found</h2>
          <p className="text-text-muted text-sm">The record ID "{id}" does not exist in this demo.</p>
          <Link to="/pipeline" className="text-teal text-sm font-medium hover:underline">
            ← Back to Pipeline
          </Link>
        </div>
      </PageContainer>
    );
  }

  const activities = [...getActivitiesForOpportunity(opp.id)].sort(
    (a, b) => b.created_at.localeCompare(a.created_at),
  );
  const documents = getDocumentsForOpportunity(opp.id);

  function openEdit() {
    if (!opp) return;
    setEditValues({
      next_action: opp.next_action,
      follow_up_date: opp.follow_up_date,
      notes: opp.notes,
    });
    setEditOpen(true);
  }

  function handleSave() {
    if (!opp) return;
    updateOpportunity(opp.id, editValues);
    setEditOpen(false);
  }

  return (
    <PageContainer title="Opportunity Detail">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-text-muted">
          <li><Link to="/pipeline" className="hover:text-teal transition-colors">Pipeline</Link></li>
          <li aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-text-muted">
              <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </li>
          <li className="text-navy font-medium truncate max-w-[200px]">{opp.client_name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-navy truncate">{opp.client_name}</h2>
          <p className="text-text-muted text-sm mt-1">{opp.service}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <OpportunityStatusBadge status={opp.status} />
            <SalesStageBadge stage={opp.sales_stage ?? opp.stage} />
            {opp.delivery_status && <DeliveryBadge status={opp.delivery_status} />}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={openEdit}>
          Edit
        </Button>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col — financial + activity + documents */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Financial */}
          <section aria-labelledby="financial-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
            <h2 id="financial-heading" className="font-semibold text-navy mb-4">Financial</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-text-muted uppercase tracking-wide">Project value</dt>
                <dd className="text-xl font-bold text-navy mt-1">£{opp.project_value.toLocaleString('en-GB')}</dd>
              </div>
              {opp.monthly_value > 0 && (
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Monthly value</dt>
                  <dd className="text-xl font-bold text-navy mt-1">£{opp.monthly_value.toLocaleString('en-GB')}/mo</dd>
                </div>
              )}
              {opp.expected_close_date && (
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Expected close</dt>
                  <dd className="text-sm font-medium text-navy mt-1">
                    <time dateTime={opp.expected_close_date}>{formatDate(opp.expected_close_date)}</time>
                  </dd>
                </div>
              )}
              {opp.won_date && (
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Won date</dt>
                  <dd className="text-sm font-medium text-navy mt-1">
                    <time dateTime={opp.won_date}>{formatDate(opp.won_date)}</time>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Activity timeline */}
          <section aria-labelledby="activity-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
            <h2 id="activity-heading" className="font-semibold text-navy mb-4">Activity timeline</h2>
            {activities.length === 0 ? (
              <p className="text-text-muted text-sm">No activity recorded yet.</p>
            ) : (
              <ul role="list" className="relative flex flex-col gap-0">
                {activities.map((act, idx) => (
                  <li key={act.id} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Connector line */}
                    {idx < activities.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-border-subtle" aria-hidden="true" />
                    )}
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-light border border-teal/20 flex items-center justify-center text-xs font-semibold text-teal"
                      aria-hidden="true"
                    >
                      {ACTIVITY_INITIALS[act.type] ?? '?'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy capitalize">
                        {act.type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-text-muted mt-0.5">{act.note}</p>
                      <time dateTime={act.created_at} className="text-xs text-text-muted">
                        {formatDateTime(act.created_at)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Documents */}
          <section aria-labelledby="docs-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
            <h2 id="docs-heading" className="font-semibold text-navy mb-3">Documents</h2>
            <div className="mb-4 flex items-start gap-2 p-3 bg-teal-light border border-teal/20 rounded-lg text-sm text-navy">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5 text-teal">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7.5v3M8 5.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p>Document integration coming in a later batch. Files listed below are demo placeholders — Drive access is not yet connected.</p>
            </div>
            {documents.length === 0 ? (
              <p className="text-text-muted text-sm">No documents linked to this opportunity.</p>
            ) : (
              <ul role="list" className="flex flex-col gap-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between p-3 bg-canvas rounded-lg border border-border-subtle">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">{doc.document_type}</span>
                        <DocumentStatusBadge status={doc.status} />
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled
                      title="Coming in a later integration batch"
                      aria-label={`View ${doc.name} — not yet available`}
                      className="text-xs text-text-muted border border-border-subtle px-3 py-1.5 rounded-lg opacity-50 cursor-not-allowed min-h-[36px]"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right col — contact + next action + notes + record */}
        <div className="flex flex-col gap-6">
          {/* Contact */}
          <section aria-labelledby="contact-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
            <h2 id="contact-heading" className="font-semibold text-navy mb-3">Contact</h2>
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

          {/* Next action */}
          <section aria-labelledby="action-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
            <h2 id="action-heading" className="font-semibold text-navy mb-3">Next action</h2>
            <p className="text-sm text-navy">{opp.next_action || '—'}</p>
            {opp.follow_up_date && (
              <p className={`text-sm mt-2 font-medium ${isOverdue(opp.follow_up_date) ? 'text-red-600' : 'text-text-muted'}`}>
                <time dateTime={opp.follow_up_date}>{formatDate(opp.follow_up_date)}</time>
                {isOverdue(opp.follow_up_date) && ' (overdue)'}
              </p>
            )}
          </section>

          {/* Notes */}
          <section aria-labelledby="notes-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
            <h2 id="notes-heading" className="font-semibold text-navy mb-3">Notes</h2>
            <p className="text-sm text-navy whitespace-pre-wrap">{opp.notes || '—'}</p>
          </section>

          {/* Record */}
          <section aria-labelledby="record-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
            <h2 id="record-heading" className="font-semibold text-navy mb-3">Record</h2>
            <dl className="flex flex-col gap-2 text-xs">
              <div>
                <dt className="text-text-muted">ID</dt>
                <dd className="font-mono text-navy">{opp.id}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Created</dt>
                <dd className="text-navy"><time dateTime={opp.created_at}>{formatDateTime(opp.created_at)}</time></dd>
              </div>
              <div>
                <dt className="text-text-muted">Updated</dt>
                <dd className="text-navy"><time dateTime={opp.updated_at}>{formatDateTime(opp.updated_at)}</time></dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit opportunity"
        description="Update next action, follow-up date, or notes."
      >
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="edit-next-action" className="block text-sm font-medium text-navy mb-1">
              Next action
            </label>
            <textarea
              id="edit-next-action"
              rows={3}
              value={editValues.next_action}
              onChange={(e) => setEditValues((v) => ({ ...v, next_action: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-border-subtle rounded-lg text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal resize-none"
            />
          </div>
          <div>
            <label htmlFor="edit-follow-up" className="block text-sm font-medium text-navy mb-1">
              Follow-up date
            </label>
            <input
              id="edit-follow-up"
              type="date"
              value={editValues.follow_up_date}
              onChange={(e) => setEditValues((v) => ({ ...v, follow_up_date: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-border-subtle rounded-lg text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="edit-notes" className="block text-sm font-medium text-navy mb-1">
              Edit notes
            </label>
            <textarea
              id="edit-notes"
              rows={4}
              value={editValues.notes}
              onChange={(e) => setEditValues((v) => ({ ...v, notes: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-border-subtle rounded-lg text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </div>
      </Dialog>
    </PageContainer>
  );
}
