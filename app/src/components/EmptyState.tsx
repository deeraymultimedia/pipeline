
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className="empty-state flex flex-col items-center justify-center min-h-[30vh] gap-3 px-4 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center border border-border-subtle">
        <span className="text-text-muted text-lg" aria-hidden="true">○</span>
      </div>
      <div>
        <h3 className="text-navy font-semibold">{title}</h3>
        {description && (
          <p className="text-text-muted text-sm mt-1 max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
