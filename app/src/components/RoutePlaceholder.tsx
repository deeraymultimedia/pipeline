/**
 * RoutePlaceholder — accessible placeholder for routes not yet implemented.
 * All unimplemented routes must render this, not a blank screen.
 */

import { PageContainer } from './PageContainer';

interface RoutePlaceholderProps {
  viewName: string;
  description?: string;
}

export function RoutePlaceholder({ viewName, description }: RoutePlaceholderProps) {
  return (
    <PageContainer title={viewName}>
      <div
        role="region"
        aria-label={`${viewName} — coming soon`}
        className="route-placeholder flex flex-col items-center justify-center min-h-[40vh] text-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-canvas flex items-center justify-center border-2 border-border-subtle">
          <span className="text-2xl text-text-muted" aria-hidden="true">⊙</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-navy">{viewName}</h2>
          <p className="text-text-muted text-sm mt-1">
            {description ?? 'This view is being built. It will be available in a future update.'}
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
