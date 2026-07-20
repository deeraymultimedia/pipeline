import type { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function PageContainer({ title, children, actions }: PageContainerProps) {
  return (
    <div className="page-container px-4 lg:px-6 py-6 pb-20 lg:pb-6 max-w-7xl mx-auto">
      <div className="page-header flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {actions && <div className="page-actions flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
