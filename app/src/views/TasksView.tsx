/**
 * TasksView — Task list with priority/category filters (Batch 1B)
 *
 * - ?priority= and ?category= URL filter params
 * - Checkbox aria-label on each row
 * - toggleTaskComplete via DemoStoreContext
 * - Completed: line-through + muted; Overdue: red highlight
 * - Desktop table + mobile card layout
 * - PriorityBadge on each row
 */

import { useSearchParams, Link } from 'react-router-dom';
import { useDemoStore } from '../contexts/useDemoStore';
import { FilterSelect } from '../components/ui/FilterSelect';
import { PriorityBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/EmptyState';
import { PageContainer } from '../components/PageContainer';
import type { TaskPriority, TaskCategory } from '../data/demoData';

const TODAY = '2026-07-20';

function isOverdue(date: string, completed: boolean): boolean {
  return !completed && !!date && date < TODAY;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PRIORITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'high',   label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low' },
];

const CATEGORY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'proposal',  label: 'Proposal' },
  { value: 'admin',     label: 'Admin' },
  { value: 'meeting',   label: 'Meeting' },
];

export function TasksView() {
  const { tasks, toggleTaskComplete } = useDemoStore();
  const [params, setParams] = useSearchParams();

  const priorityFilter  = params.get('priority')  ?? '';
  const categoryFilter  = params.get('category')  ?? '';

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  }

  let filtered = tasks;
  if (priorityFilter) filtered = filtered.filter((t) => t.priority === (priorityFilter as TaskPriority));
  if (categoryFilter) filtered = filtered.filter((t) => t.category === (categoryFilter as TaskCategory));

  // Sort: incomplete first (overdue → upcoming), then completed
  filtered = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.due_date.localeCompare(b.due_date);
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => isOverdue(t.due_date, t.completed)).length;

  return (
    <PageContainer title="Tasks">
      <div className="mb-6">
        <p className="text-text-muted text-sm mt-1">
          {pendingCount} pending · {overdueCount > 0 ? `${overdueCount} overdue` : 'none overdue'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterSelect
          label="Priority"
          value={priorityFilter}
          onChange={(v) => setParam('priority', v)}
          options={PRIORITY_OPTIONS}
          allLabel="All priorities"
        />
        <FilterSelect
          label="Category"
          value={categoryFilter}
          onChange={(v) => setParam('category', v)}
          options={CATEGORY_OPTIONS}
          allLabel="All categories"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tasks found" description="Try adjusting your filters." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-border-subtle shadow-card overflow-hidden">
            <table className="w-full text-sm" aria-label="Tasks">
              <thead className="bg-canvas border-b border-border-subtle">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide w-12">Done</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Task</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Client</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Priority</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filtered.map((task) => {
                  const overdue = isOverdue(task.due_date, task.completed);
                  return (
                    <tr
                      key={task.id}
                      className={`transition-colors ${overdue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-canvas'} ${task.completed ? 'opacity-60' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskComplete(task.id)}
                          aria-label={`Mark '${task.title}' as ${task.completed ? 'incomplete' : 'complete'}`}
                          className="w-4 h-4 rounded border-border-subtle text-teal focus:ring-teal cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <p className={`font-medium text-navy ${task.completed ? 'line-through text-text-muted' : ''}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-text-muted capitalize">{task.category.replace(/_/g, ' ')}</p>
                      </td>
                      <td className="px-4 py-3">
                        {task.opportunity_id ? (
                          <Link
                            to={`/pipeline/${task.opportunity_id}`}
                            className="text-teal text-xs hover:underline"
                          >
                            {task.client_name}
                          </Link>
                        ) : (
                          <span className="text-xs text-text-muted">{task.client_name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <time
                          dateTime={task.due_date}
                          className={overdue ? 'text-red-600 font-medium text-xs' : 'text-text-muted text-xs'}
                        >
                          {formatDate(task.due_date)}
                          {overdue && ' (overdue)'}
                        </time>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul role="list" className="md:hidden flex flex-col gap-3">
            {filtered.map((task) => {
              const overdue = isOverdue(task.due_date, task.completed);
              return (
                <li
                  key={task.id}
                  className={`bg-white rounded-xl border shadow-card p-4 ${
                    overdue ? 'border-red-200 bg-red-50' : 'border-border-subtle'
                  } ${task.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      aria-label={`Mark '${task.title}' as ${task.completed ? 'incomplete' : 'complete'}`}
                      className="mt-0.5 w-4 h-4 rounded border-border-subtle text-teal focus:ring-teal cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold text-navy text-sm ${task.completed ? 'line-through text-text-muted' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <PriorityBadge priority={task.priority} />
                        <span className="text-xs text-text-muted capitalize">{task.category.replace(/_/g, ' ')}</span>
                      </div>
                      <p className={`text-xs mt-1.5 ${overdue ? 'text-red-600 font-medium' : 'text-text-muted'}`}>
                        Due <time dateTime={task.due_date}>{formatDate(task.due_date)}</time>
                        {overdue && ' (overdue)'}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </PageContainer>
  );
}
