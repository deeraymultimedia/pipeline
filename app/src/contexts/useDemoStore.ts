/**
 * useDemoStore — context object, type, and hook for DemoStoreContext.
 *
 * Kept in a separate .ts file so DemoStoreContext.tsx can export only the
 * DemoStoreProvider component, satisfying the react-refresh/only-export-components
 * ESLint rule (which requires each file to export only one kind of thing).
 */

import { createContext, useContext } from 'react';
import type { Opportunity } from '../types/Opportunity';
import type { DemoTask } from '../data/demoData';

export interface DemoStoreContextValue {
  opportunities: Opportunity[];
  tasks: DemoTask[];
  updateOpportunity: (id: string, patch: Partial<Opportunity>) => void;
  toggleTaskComplete: (id: string) => void;
}

export const DemoStoreContext = createContext<DemoStoreContextValue | null>(null);

export function useDemoStore(): DemoStoreContextValue {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) {
    throw new Error('useDemoStore must be used within a DemoStoreProvider');
  }
  return ctx;
}
