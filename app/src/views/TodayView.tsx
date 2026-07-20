/**
 * TodayView — Command Centre / Today dashboard (Batch 1B)
 *
 * Sections:
 *   - 4 KPI MetricCards (2×2 → 4×1 responsive grid)
 *   - Tasks this week: overdue (2 max) + upcoming (4 max)
 *   - Opportunities needing attention
 *   - Recent activity (6 entries)
 */

import { Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { DEMO_ACTIVITIES } from '../data/demoData';
import { MetricCard } from '../components/ui/MetricCard';
import { SalesStageBadge } from '../components/ui/Badge';
import { PageContainer } from '../components/PageContainer';

const TODAY = '2026-07-20';

function isOverdue(dateStr: string): boolean {
  return !!dateStr && dateStr < TODAY;
}

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

function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function TodayView() {
  const { opportunities, tasks } = useDemoStore();

  // KPI computations
  const activeOpps = opportunities.filter((o) => o.status === 'active');
  const totalActiveValue = activeOpps.reduce((s, o) => s + o.project_value, 0);
  const wonThisYear = opportunities.filter((o) => o.status === 'won');
  const wonValue = wonThisYear.reduce((s, o) => s + o.project_value, 0);
  const monthlyRecurring = opportunities
    .filter((o) => o.status === 'won')
    .reduce((s, o) => s + o.monthly_value, 0);

  // Tasks
  const pendingTasks = tasks.filter((t) => !t.completed);
  const overdueTasks = pendingTasks.filter((t) => isOverdue(t.due_date)).slice(0, 2);
  const upcomingTasks = pendingTasks.filter((t) => !isOverdue(t.due_date)).slice(0, 4);

  // Opportunities needing attention
  const needsAttention = activeOpps.filter(
    (o) =>
      isOverdue(o.follow_up_date) ||
      o.sales_stage === 'Proposal Sent' ||
      o.sales_stage === 'Follow-up / Negotiation',
  );

  // Recent activities
  const recentActivities = [...DEMO_ACTIVITIES]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 6);

  function getClientForActivity(opportunityId: string): string {
    return opportunities.find((o) => o.id === opportunityId)?.client_name ?? 'Unknown';
  }

  return (
    <PageContainer title="Today">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy">Good morning</h2>
        <p className="text-text-muted text-sm mt-1">
          {new Date(TODAY).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}Demo data
        </p>
      </div>

      {/* KPI grid */}
      <section aria-labelledby="kpi-heading" className="mb-8">
        <h2 id="kpi-heading" className="sr-only">Key metrics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Active pipeline"
            value={`£${totalActiveValue.toLocaleString('en-GB')}`}
            subLabel={`${activeOpps.length} opportunities`}
            href="/pipeline"
          />
          <MetricCard
            label="Won revenue"
            value={`£${wonValue.toLocaleString('en-GB')}`}
            subLabel={`${wonThisYear.length} clients`}
            accentColor="#1D9E75"
            href="/revenue"
          />
          <MetricCard
            label="Monthly recurring"
            value={`£${monthlyRecurring.toLocaleString('en-GB')}`}
            subLabel="MRR from care plans"
            accentColor="#A67DC5"
          />
          <MetricCard
            label="Open tasks"
            value={pendingTasks.length}
            subLabel={`${overdueTasks.length} overdue`}
            accentColor={overdueTasks.length > 0 ? '#D85A30' : '#0EA5A0'}
            href="/tasks"
          />
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Tasks this week */}
        <section aria-labelledby="tasks-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 id="tasks-heading" className="font-semibold text-navy">Tasks this week</h2>
            <Link to="/tasks" className="text-teal text-xs font-medium hover:underline">
              View all
            </Link>
          </div>

          {overdueTasks.length === 0 && upcomingTasks.length === 0 && (
            <p className="text-text-muted text-sm">No pending tasks.</p>
          )}

          {overdueTasks.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-2">Overdue</p>
              <ul role="list" className="flex flex-col gap-2">
                {overdueTasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{task.title}</p>
                      <p className="text-xs text-red-600">
                        Due <time dateTime={task.due_date}>{formatDate(task.due_date)}</time> ·{' '}
                        <Link to="/clients" className="underline">{task.client_name}</Link>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {upcomingTasks.length > 0 && (
            <ul role="list" className="flex flex-col gap-2">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-canvas transition-colors">
                  <span className="w-2 h-2 rounded-full bg-teal mt-1.5 shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{task.title}</p>
                    <p className="text-xs text-text-muted">
                      Due <time dateTime={task.due_date}>{formatDate(task.due_date)}</time> · {task.client_name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Opportunities needing attention */}
        <section aria-labelledby="attention-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 id="attention-heading" className="font-semibold text-navy">Needs attention</h2>
            <Link to="/pipeline" className="text-teal text-xs font-medium hover:underline">
              View pipeline
            </Link>
          </div>

          {needsAttention.length === 0 && (
            <p className="text-text-muted text-sm">All opportunities on track.</p>
          )}

          <ul role="list" className="flex flex-col gap-2">
            {needsAttention.slice(0, 5).map((opp) => (
              <li key={opp.id}>
                <Link
                  to={`/pipeline/${opp.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-canvas transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy group-hover:text-teal transition-colors truncate">
                      {opp.client_name}
                    </p>
                    <p className="text-xs text-text-muted truncate">{opp.service}</p>
                    {isOverdue(opp.follow_up_date) && (
                      <p className="text-xs text-red-600">
                        Follow-up overdue ·{' '}
                        <time dateTime={opp.follow_up_date}>{formatDate(opp.follow_up_date)}</time>
                      </p>
                    )}
                  </div>
                  <SalesStageBadge stage={opp.sales_stage} className="shrink-0 ml-2" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Recent activity */}
      <section aria-labelledby="activity-heading" className="bg-white rounded-xl border border-border-subtle shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 id="activity-heading" className="font-semibold text-navy">Recent activity</h2>
          <Link to="/engagements" className="text-teal text-xs font-medium hover:underline">
            View all
          </Link>
        </div>

        <ul role="list" className="flex flex-col gap-3">
          {recentActivities.map((act) => {
            const clientName = getClientForActivity(act.opportunity_id);
            const oppId = act.opportunity_id;
            return (
              <li key={act.id} className="flex items-start gap-3">
                <span
                  className="text-lg shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {ACTIVITY_ICONS[act.type] ?? '📌'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-navy">
                    <span className="font-medium capitalize">{act.type.replace(/_/g, ' ')}</span>
                    {' · '}
                    <Link to={`/pipeline/${oppId}`} className="text-teal hover:underline">
                      {clientName}
                    </Link>
                  </p>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{act.note}</p>
                  <time dateTime={act.created_at} className="text-2xs text-text-muted">
                    {formatDate(act.created_at)}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </PageContainer>
  );
}
