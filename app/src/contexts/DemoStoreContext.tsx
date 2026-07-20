/**
 * DemoStoreContext — local in-memory state for the Batch 1B prototype.
 *
 * Provides:
 *   - opportunities: mutable list, initialised from DEMO_OPPORTUNITIES
 *   - tasks: mutable list, initialised from DEMO_TASKS
 *   - updateOpportunity(id, patch) — patches a single opportunity and sets updated_at
 *   - toggleTaskComplete(id) — flips completed on a task
 *
 * No network calls are made. No MockDataService methods are modified.
 *
 * The hook (useDemoStore) and context object live in ./useDemoStore so that
 * this file exports only a component, satisfying react-refresh/only-export-components.
 */

import { useState, type ReactNode } from 'react';
import { DemoStoreContext } from './useDemoStore';
import { DEMO_OPPORTUNITIES, DEMO_TASKS } from '../data/demoData';
import type { Opportunity } from '../types/Opportunity';
import type { DemoTask } from '../data/demoData';

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(DEMO_OPPORTUNITIES);
  const [tasks, setTasks] = useState<DemoTask[]>(DEMO_TASKS);

  function updateOpportunity(id: string, patch: Partial<Opportunity>) {
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === id
          ? { ...opp, ...patch, updated_at: new Date().toISOString() }
          : opp,
      ),
    );
  }

  function toggleTaskComplete(id: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    <DemoStoreContext.Provider value={{ opportunities, tasks, updateOpportunity, toggleTaskComplete }}>
      {children}
    </DemoStoreContext.Provider>
  );
}
